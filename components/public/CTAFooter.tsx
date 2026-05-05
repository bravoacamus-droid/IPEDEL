import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxSection } from "./ParallaxSection";
import type { Locale } from "@/lib/i18n/config";

// Sección CTA reutilizable que cierra páginas de servicios/importaciones.
// Foto del buque IPEDEL como fondo con efecto parallax + tarjeta de
// vidrio para el copy. Texto neutro en geografía (no menciona Perú)
// porque el sitio recibe consultas de clientes internacionales.

export function CTAFooter({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  return (
    <ParallaxSection
      image="/CTAnosotros.webp"
      alt=""
      intensity={0.35}
      className="flex min-h-[460px] items-center sm:min-h-[540px]"
      overlayClassName="bg-gradient-to-r from-black/75 via-black/55 to-black/35"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_60%,rgba(150,198,0,0.22),transparent_55%)]"
      />
      <div className="container-page relative flex w-full flex-col items-start justify-between gap-10 py-20 lg:flex-row lg:items-end">
        <div className="max-w-xl text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300 backdrop-blur-md">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            {isEs ? "Tu carga, en buenas manos" : "Your cargo in safe hands"}
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            {isEs
              ? "Conectamos tu carga con cualquier destino del mundo."
              : "We connect your cargo to any destination in the world."}
          </h2>
          <p className="mt-5 max-w-lg text-base text-white/85 sm:text-lg">
            {isEs
              ? "Tres décadas de operaciones impecables, una red global de socios estratégicos y un equipo que entiende tu negocio."
              : "Three decades of impeccable operations, a global partner network and a team that understands your business."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/contacto`}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-black shadow-xl shadow-brand-500/30 ring-1 ring-black/10 transition-all hover:-translate-y-0.5 hover:bg-brand-400"
          >
            {isEs ? "Cotiza tu carga" : "Request a quote"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="tel:+5113045520"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white hover:text-black"
          >
            +511 304-5520
          </a>
        </div>
      </div>
    </ParallaxSection>
  );
}
