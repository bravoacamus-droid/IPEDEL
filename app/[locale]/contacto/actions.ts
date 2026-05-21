"use server";

import { z } from "zod";
import { headers } from "next/headers";
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

// Observación del cliente (audio 21 may 2026): los mensajes del
// formulario de contacto deben llegar al correo consultas@ipeperu.com
// directamente, no guardarse en el panel admin. Resend hace el envío;
// la tabla contacts en DB queda como histórico pero ya no se inserta.
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
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
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { nombre, empresa, email, telefono, asunto, mensaje } = parsed.data;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || null;

  const body =
    `Nombre: ${nombre}\n` +
    `Empresa: ${empresa || "—"}\n` +
    `Email: ${email}\n` +
    `Teléfono: ${telefono || "—"}\n` +
    `IP: ${ip || "—"}\n\n` +
    `Asunto: ${asunto}\n\n` +
    `${mensaje}`;

  try {
    await sendMail({
      to: process.env.EMAIL_TO_CONSULTAS || "consultas@ipeperu.com",
      subject: `[Web] Contacto: ${asunto}`,
      text: body,
      // Reply-to apunta al consumidor para que el equipo pueda
      // responder directamente desde Zoho con un solo click.
      replyTo: email,
    });
  } catch (e) {
    console.error("Contact email failed:", e);
    return {
      ok: false,
      message: "No pudimos enviar tu mensaje. Intenta nuevamente más tarde.",
    };
  }

  return { ok: true };
}
