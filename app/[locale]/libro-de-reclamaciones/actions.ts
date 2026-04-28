"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/email/mail";

const ReclamacionSchema = z.object({
  tipo: z.enum(["reclamo", "queja"]),
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  tipo_documento: z.string().default("DNI"),
  numero_documento: z.string().min(8),
  direccion: z.string().optional().or(z.literal("")),
  email: z.string().email(),
  telefono: z.string().optional().or(z.literal("")),
  es_menor_edad: z.union([z.literal("on"), z.literal(undefined), z.literal("")]).optional(),
  representante_nombre: z.string().optional().or(z.literal("")),
  representante_documento: z.string().optional().or(z.literal("")),
  bien_servicio: z.string().min(3),
  monto_reclamado: z.string().optional().or(z.literal("")),
  detalle: z.string().min(20),
  pedido_consumidor: z.string().min(10),
  consent: z.literal("on", { error: () => "Debes aceptar la veracidad de los datos." }),
});

export type ReclamacionState =
  | { ok: true; numero: number }
  | { ok: false; errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function submitReclamacion(
  _prev: ReclamacionState,
  formData: FormData,
): Promise<ReclamacionState> {
  const parsed = ReclamacionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const d = parsed.data;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("reclamaciones")
    .insert({
      tipo: d.tipo,
      nombres: d.nombres,
      apellidos: d.apellidos,
      tipo_documento: d.tipo_documento || "DNI",
      numero_documento: d.numero_documento,
      direccion: d.direccion || null,
      email: d.email,
      telefono: d.telefono || null,
      es_menor_edad: d.es_menor_edad === "on",
      representante_nombre: d.representante_nombre || null,
      representante_documento: d.representante_documento || null,
      bien_servicio: d.bien_servicio,
      monto_reclamado: d.monto_reclamado ? Number(d.monto_reclamado) : null,
      detalle: d.detalle,
      pedido_consumidor: d.pedido_consumidor,
      ip_address: ip,
    })
    .select("numero_correlativo")
    .single();

  if (error || !data) {
    return { ok: false, message: "No pudimos registrar la reclamación. Intenta nuevamente." };
  }

  // Best-effort notifications
  try {
    const summary = `Reclamación N° ${data.numero_correlativo}\nTipo: ${d.tipo}\nNombre: ${d.nombres} ${d.apellidos}\nDocumento: ${d.tipo_documento} ${d.numero_documento}\nEmail: ${d.email}\nServicio: ${d.bien_servicio}\n\nDetalle:\n${d.detalle}\n\nPedido:\n${d.pedido_consumidor}`;
    await Promise.all([
      sendMail({
        to: process.env.RECLAMOS_NOTIFY_TO || "ventas@ipedelperu.com",
        subject: `[LDR] Nueva reclamación N° ${data.numero_correlativo}`,
        text: summary,
      }),
      sendMail({
        to: d.email,
        subject: `IPE del Perú — Confirmación de reclamación N° ${data.numero_correlativo}`,
        text: `Estimado(a) ${d.nombres},\n\nHemos recibido tu reclamación con número correlativo ${data.numero_correlativo}. Te responderemos en un plazo no mayor de 30 días calendario, conforme a la Ley 29571.\n\n${summary}\n\nIPE del Perú SAC`,
      }),
    ]);
  } catch (e) {
    console.warn("Reclamación email notify failed (non-fatal):", e);
  }

  return { ok: true, numero: data.numero_correlativo };
}
