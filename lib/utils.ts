import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Forzamos zona Lima para que la fecha mostrada coincida con la hora
// peruana, sin depender de la zona del servidor (Vercel: UTC) ni del
// navegador del usuario.
const LIMA_TZ = "America/Lima";

// Las columnas DATE de Postgres llegan como "YYYY-MM-DD" sin hora.
// JavaScript las interpreta como UTC medianoche (00:00 UTC). Si las
// formateamos con timeZone "America/Lima" (UTC-5), el día retrocede
// 5 horas y cae al día anterior. Detectamos ese formato y, en vez
// de aplicar Lima, formateamos en UTC — así la fecha mostrada queda
// EXACTAMENTE igual a la que el admin ingresó en el form.
function isDateOnly(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function formatDate(date: string | Date, locale: "es" | "en" = "es") {
  const dateOnly = isDateOnly(date);
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "es" ? "es-PE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: dateOnly ? "UTC" : LIMA_TZ,
  });
}

export function formatDateTime(date: string | Date, locale: "es" | "en" = "es") {
  const dateOnly = isDateOnly(date);
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale === "es" ? "es-PE" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: dateOnly ? "UTC" : LIMA_TZ,
  });
}
