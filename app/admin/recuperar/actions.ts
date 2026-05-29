"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const Schema = z.object({
  email: z.string().email("Correo inválido."),
});

export type RequestResetState =
  | { ok: true; emailSent: string }
  | { ok: false; message: string }
  | undefined;

// Pide a Supabase enviar un correo de recuperación. Por seguridad,
// NO revelamos si el correo existe o no — siempre devolvemos ok=true
// con un mensaje neutral. Esto evita enumeración de cuentas.
//
// El link del correo llega al usuario apuntando a /admin/restablecer
// (debe estar en la allow-list de Supabase Auth -> URL Configuration).
//
// El correo se manda con el SMTP que el usuario tenga configurado en
// Supabase Auth -> Email Templates. Recomendamos apuntarlo a Resend
// (host: smtp.resend.com, user: resend, pass: RESEND_API_KEY).
export async function requestPasswordReset(
  _prev: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const parsed = Schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Correo inválido." };
  }

  const admin = createAdminClient();
  // Importante: aunque pasemos redirectTo aqui, Supabase Auth lo IGNORA
  // si la URL no esta dentro de "URI Allow List" o del "Site URL" del
  // proyecto (Authentication -> URL Configuration). Cuando se rechaza
  // cae al Site URL configurado y el enlace del correo termina yendo
  // a localhost. Por eso la migracion de auth-config (ver migration
  // 0011_auth_redirect_urls) deja Site URL = https://ipeperu.com y la
  // allow-list cubriendo ipeperu.com/** y *.vercel.app/**.
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://ipeperu.com";

  // generateLink emite un magic link de tipo "recovery" sin enviar
  // correo, asi controlamos el envio nosotros via Resend (mismo
  // canal que usamos para libro de reclamaciones y contacto).
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email: parsed.data.email,
    options: { redirectTo: `${siteUrl}/admin/restablecer` },
  });

  if (error) {
    // Errores reales (mail no existe, rate-limit) los ocultamos al
    // usuario para no exponer info. Solo se ven en logs de servidor.
    console.warn("requestPasswordReset (oculto al usuario):", error.message);
    return { ok: true, emailSent: parsed.data.email };
  }

  // Si tenemos el link y Resend configurado, lo enviamos nosotros.
  const actionLink = data?.properties?.action_link;
  if (actionLink && process.env.RESEND_API_KEY) {
    try {
      const { sendMail } = await import("@/lib/email/mail");
      await sendMail({
        to: parsed.data.email,
        subject: "Recuperación de contraseña — Panel IPE del Perú",
        text:
          `Hola,\n\n` +
          `Recibimos una solicitud para restablecer la contraseña de tu cuenta ` +
          `en el panel administrativo de IPE del Perú.\n\n` +
          `Hacé click en el siguiente enlace para definir una nueva contraseña ` +
          `(válido por 1 hora):\n\n${actionLink}\n\n` +
          `Si vos no solicitaste esto, podés ignorar este correo — tu ` +
          `contraseña permanece sin cambios.\n\n` +
          `IPE del Perú SAC`,
      });
    } catch (e) {
      console.warn("Recovery email send failed:", e);
      // Aun asi devolvemos ok para no filtrar info.
    }
  }

  return { ok: true, emailSent: parsed.data.email };
}
