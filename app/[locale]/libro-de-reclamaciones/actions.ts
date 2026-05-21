"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/email/mail";
import { resolveUbigeo } from "@/lib/peru/ubigeo";
import { signReclamacionToken } from "@/lib/utils/sign";
import { renderReclamacionPdf } from "@/lib/pdf/render-reclamacion";
import type { Reclamacion } from "@/lib/types/database";

const ReclamacionSchema = z.object({
  tipo: z.enum(["reclamo", "queja"]),
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  tipo_documento: z.string().default("DNI"),
  numero_documento: z.string().min(8),
  direccion: z.string().optional().or(z.literal("")),
  // Ubigeo: required (Indecopi). Distrito implies provincia y departamento.
  ubigeo_departamento_id: z.string().regex(/^\d{2}$/, "Selecciona un departamento."),
  ubigeo_provincia_id: z.string().regex(/^\d{4}$/, "Selecciona una provincia."),
  ubigeo_distrito_id: z.string().regex(/^\d{6}$/, "Selecciona un distrito."),
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
  | { ok: true; numero: number; pdfUrl: string }
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

  // Resolve canonical names from the INEI dataset — never trust client-provided names.
  const ubigeo = resolveUbigeo(d.ubigeo_distrito_id);
  if (
    !ubigeo ||
    ubigeo.provincia_id !== d.ubigeo_provincia_id ||
    ubigeo.departamento_id !== d.ubigeo_departamento_id
  ) {
    return {
      ok: false,
      errors: { ubigeo_distrito_id: ["Ubigeo inválido. Vuelve a seleccionar."] },
    };
  }

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
      ubigeo_departamento_id: ubigeo.departamento_id,
      ubigeo_departamento_nombre: ubigeo.departamento_nombre,
      ubigeo_provincia_id: ubigeo.provincia_id,
      ubigeo_provincia_nombre: ubigeo.provincia_nombre,
      ubigeo_distrito_id: ubigeo.distrito_id,
      ubigeo_distrito_nombre: ubigeo.distrito_nombre,
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
    .select("*")
    .single();

  if (error || !data) {
    return { ok: false, message: "No pudimos registrar la reclamación. Intenta nuevamente." };
  }

  const reclamacion = data as Reclamacion;

  // Token HMAC firmado para que el consumidor pueda descargar su copia
  // (DS 011-2011-PCM Art. 4 — derecho de imprimir copia gratuita).
  const token = signReclamacionToken(reclamacion.id);
  const pdfUrl = `/api/reclamaciones/${reclamacion.id}/pdf?token=${token}`;

  // Genera el PDF una sola vez y se reusa: en la respuesta del action
  // para descarga inmediata y como adjunto del correo al consumidor.
  // Si falla la generación o el envío, no aborta el flujo (la
  // reclamación ya quedó registrada en DB y el consumidor puede
  // descargar la copia con el link firmado).
  try {
    const pdfBuffer = await renderReclamacionPdf(reclamacion);
    const ubicacion = `${ubigeo.distrito_nombre}, ${ubigeo.provincia_nombre}, ${ubigeo.departamento_nombre}`;
    const summary = `Reclamación N° ${reclamacion.numero_correlativo}\nTipo: ${d.tipo}\nNombre: ${d.nombres} ${d.apellidos}\nDocumento: ${d.tipo_documento} ${d.numero_documento}\nUbicación: ${ubicacion}\nEmail: ${d.email}\nServicio: ${d.bien_servicio}\n\nDetalle:\n${d.detalle}\n\nPedido:\n${d.pedido_consumidor}`;
    const filename = `reclamacion-${reclamacion.numero_correlativo}.pdf`;

    await Promise.all([
      // Notificación interna a consultas@
      sendMail({
        to: process.env.EMAIL_TO_CONSULTAS || "consultas@ipeperu.com",
        subject: `[LDR] Nueva reclamación N° ${reclamacion.numero_correlativo}`,
        text: summary,
        replyTo: d.email,
        attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
      }),
      // Copia oficial al consumidor con el PDF adjunto
      // (DS 011-2011-PCM Art. 4 — copia gratuita en soporte duradero).
      sendMail({
        to: d.email,
        subject: `IPE del Perú — Confirmación de reclamación N° ${reclamacion.numero_correlativo}`,
        text:
          `Estimado(a) ${d.nombres},\n\n` +
          `Hemos recibido tu reclamación con número correlativo ${reclamacion.numero_correlativo}. ` +
          `Te responderemos en un plazo no mayor de 30 días calendario, conforme a la Ley 29571.\n\n` +
          `Adjuntamos tu copia oficial en formato PDF para tu constancia.\n\n` +
          `${summary}\n\nIPE del Perú SAC`,
        attachments: [{ filename, content: pdfBuffer, contentType: "application/pdf" }],
      }),
    ]);
  } catch (e) {
    console.warn("Reclamación email notify failed (non-fatal):", e);
  }

  return { ok: true, numero: reclamacion.numero_correlativo, pdfUrl };
}
