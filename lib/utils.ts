import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: "es" | "en" = "es") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "es" ? "es-PE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date, locale: "es" | "en" = "es") {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale === "es" ? "es-PE" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
