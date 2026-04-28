"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search, Plane, Ship, Truck } from "lucide-react";
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
  const router = useRouter();
  const [hbl, setHbl] = useState("");

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const v = hbl.trim();
    if (!v) return;
    router.push(`/${locale}/tracking?hbl=${encodeURIComponent(v)}`);
  }

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Video — Vercel CDN edge */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/logo-vertical.png"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlays — gradiente sutil para legibilidad */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_40%,rgba(150,198,0,0.18),transparent_55%)]"
      />

      {/* Contenido */}
      <div className="container-page relative z-10 pt-32 pb-32 sm:pt-40 sm:pb-40 text-white">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {dict.home.hero_eyebrow}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
              {heroSubtitle}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/tracking`}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-brand-500/25 transition-transform hover:-translate-y-0.5 hover:bg-brand-400"
              >
                {heroCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`/${locale}/contacto`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
              >
                {dict.home.hero_cta_contact}
              </Link>
            </div>

            {/* Modos */}
            <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-[0.18em] text-white/70">
              <span className="flex items-center gap-2">
                <Plane className="h-4 w-4 text-brand-400" />
                {locale === "es" ? "Aéreo" : "Air"}
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Ship className="h-4 w-4 text-brand-400" />
                {locale === "es" ? "Marítimo" : "Sea"}
              </span>
              <span className="h-3 w-px bg-white/20" />
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-brand-400" />
                {locale === "es" ? "Terrestre" : "Land"}
              </span>
            </div>
          </div>

          {/* Tracker glass card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-300">
                {dict.home.tracking_title}
              </p>
              <p className="mt-2 text-sm text-white/80">
                {dict.home.tracking_subtitle}
              </p>
              <form onSubmit={handleTrack} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <input
                    type="text"
                    value={hbl}
                    onChange={(e) => setHbl(e.target.value)}
                    placeholder={dict.home.tracking_placeholder}
                    aria-label={dict.tracking.input_label}
                    className="h-12 w-full rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-black transition-colors hover:bg-brand-400"
                >
                  {dict.home.tracking_button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Logo bottom-right */}
      <div className="absolute bottom-6 right-6 z-10 sm:bottom-8 sm:right-10">
        <div className="rounded-md bg-white/85 px-3 py-1.5 backdrop-blur-md shadow-lg">
          <Image
            src="/logo-horizontal.png"
            alt="IPE del Perú SAC"
            width={170}
            height={40}
            className="h-8 w-auto sm:h-10"
            priority
          />
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8" aria-hidden="true">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/40 p-1.5">
          <span className="h-1.5 w-1 animate-[scroll_2s_ease-in-out_infinite] rounded-full bg-white/80" />
        </div>
      </div>
    </section>
  );
}
