"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Plane, Ship, Truck } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function HeroVideo({
  locale,
  dict,
  heroTitle,
  heroSubtitle,
  heroCta,
}: {
  locale: Locale;
  dict: Dictionary;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
}) {
  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Video — Vercel Edge CDN sirve el mp4. Sin poster para evitar el flash
          del logo durante la carga; el fondo ink-900 es la pantalla mientras llega. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink-900" />
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay: el primer 30% es TOTALMENTE transparente (sin banda
          oscura sobre el area del header). A partir de ahi recien
          arranca a oscurecer para legibilidad del texto centrado. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_30%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.6)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_40%,rgba(150,198,0,0.16),transparent_55%)]"
      />

      {/* Contenido */}
      <div className="container-page relative z-10 pt-32 pb-32 sm:pt-40 sm:pb-40 text-white">
        <div className="max-w-3xl">
          <h1 className="text-balance text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {heroTitle}
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {heroSubtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={`/${locale}/tracking`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-black shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5 hover:bg-brand-400"
            >
              {heroCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              {dict.home.hero_cta_contact}
            </Link>
          </div>

          {/* Modos */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-xs uppercase tracking-[0.22em] text-white/75">
            <span className="flex items-center gap-2">
              <Plane className="h-4 w-4 text-brand-400" strokeWidth={1.6} />
              {locale === "es" ? "Aéreo" : "Air"}
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="flex items-center gap-2">
              <Ship className="h-4 w-4 text-brand-400" strokeWidth={1.6} />
              {locale === "es" ? "Marítimo" : "Sea"}
            </span>
            <span className="hidden h-3 w-px bg-white/20 sm:block" />
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-brand-400" strokeWidth={1.6} />
              {locale === "es" ? "Terrestre" : "Land"}
            </span>
          </div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <button
        type="button"
        aria-label="Scroll"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        className="group absolute bottom-6 left-1/2 z-10 -translate-x-1/2 hidden flex-col items-center gap-1 text-white/60 transition-colors hover:text-white sm:flex"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.22em]">
          {locale === "es" ? "Descubre" : "Scroll"}
        </span>
        <ChevronDown className="h-4 w-4 animate-[scroll_2s_ease-in-out_infinite]" />
      </button>
    </section>
  );
}
