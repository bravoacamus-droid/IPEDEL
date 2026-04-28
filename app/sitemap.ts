import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";

const STATIC_ROUTES = [
  "",
  "/nosotros",
  "/servicios",
  "/servicios/agenciamiento-de-carga",
  "/servicios/almacenamiento",
  "/servicios/especializados",
  "/servicios/internacional",
  "/exportaciones",
  "/tracking",
  "/agentes",
  "/tarifario",
  "/contacto",
  "/libro-de-reclamaciones",
  "/politica-de-privacidad",
  "/terminos-condiciones",
  "/politica-cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ipedelperu.com";
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "daily" : "monthly",
        priority: route === "" ? 1 : 0.7,
      });
    }
  }

  return entries;
}
