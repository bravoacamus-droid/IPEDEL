import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (cached) return cached;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  cached = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
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

// Sends an email via the configured SMTP server (Stellar/Namecheap cPanel).
// Throws if SMTP is not configured — callers should catch when notifications are
// best-effort, or check `isMailConfigured()` first.
export async function sendMail(input: SendMailInput) {
  const t = getTransporter();
  if (!t) throw new Error("SMTP no configurado (faltan SMTP_HOST/USER/PASS).");
  const from = process.env.SMTP_FROM || "IPE del Perú <noreply@ipeperu.com>";
  return t.sendMail({ from, ...input });
}

export function isMailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}
