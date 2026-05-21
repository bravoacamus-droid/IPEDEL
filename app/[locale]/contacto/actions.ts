"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendMail } from "@/lib/email/mail";

const ContactSchema = z.object({
  nombre: z.string().min(2),
  empresa: z.string().optional().or(z.literal("")),
  email: z.string().email(),
  telefono: z.string().optional().or(z.literal("")),
  asunto: z.string().min(2),
  mensaje: z.string().min(10),
  consent: z.literal("on", { error: () => "Debes aceptar la política de datos." }),
});

export type ContactState =
  | { ok: true }
  | { ok: false; errors?: Record<string, string[]>; message?: string }
  | undefined;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = ContactSchema.safeParse({
    nombre: formData.get("nombre"),
    empresa: formData.get("empresa") ?? "",
    email: formData.get("email"),
    telefono: formData.get("telefono") ?? "",
    asunto: formData.get("asunto"),
    mensaje: formData.get("mensaje"),
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { nombre, empresa, email, telefono, asunto, mensaje } = parsed.data;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || null;

  const supabase = createAdminClient();
  const { error } = await supabase.from("contacts").insert({
    nombre,
    empresa: empresa || null,
    email,
    telefono: telefono || null,
    asunto,
    mensaje,
    ip_address: ip,
  });

  if (error) {
    return { ok: false, message: "No pudimos guardar tu mensaje. Intenta nuevamente." };
  }

  // Best-effort email notification — don't fail the form if SMTP isn't configured.
  try {
    await sendMail({
      to: process.env.EMAIL_TO_CONSULTAS || "consultas@ipeperu.com",
      subject: `[Web] Contacto: ${asunto}`,
      text: `Nombre: ${nombre}\nEmpresa: ${empresa}\nEmail: ${email}\nTeléfono: ${telefono}\n\n${mensaje}`,
    });
  } catch (e) {
    console.warn("Email notify failed (non-fatal):", e);
  }

  return { ok: true };
}
