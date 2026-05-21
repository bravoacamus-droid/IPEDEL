import "server-only";
import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export type SendMailInput = {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: { filename: string; content: Buffer | string; contentType?: string }[];
  replyTo?: string;
};

// Envío de correo via Resend (API HTTP). EMAIL_FROM se configura en
// Vercel env vars y debe ser un correo de un dominio verificado en
// Resend (ipeperu.com). El reply-to por defecto apunta al mismo from
// para que las respuestas lleguen al buzón de Zoho.
export async function sendMail(input: SendMailInput) {
  const r = getResend();
  if (!r) throw new Error("Resend no configurado (falta RESEND_API_KEY).");

  const from = process.env.EMAIL_FROM || "IPE del Perú <consultas@ipeperu.com>";
  const to = Array.isArray(input.to) ? input.to : [input.to];

  // Resend exige UNO de: text | html | react | template. Construimos
  // el payload base con el contenido apropiado y agregamos opciones
  // condicionalmente para satisfacer los discriminated unions del SDK.
  const base = input.html
    ? { from, to, subject: input.subject, html: input.html }
    : { from, to, subject: input.subject, text: input.text ?? "" };

  const { data, error } = await r.emails.send({
    ...base,
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
    ...(input.attachments ? { attachments: input.attachments } : {}),
  });

  if (error) {
    throw new Error(`Resend send error: ${error.message ?? String(error)}`);
  }
  return data;
}

export function isMailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
