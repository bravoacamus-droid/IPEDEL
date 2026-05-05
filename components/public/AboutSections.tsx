"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";
import { cn } from "@/lib/utils";

// IMPORTANTE: este es un client component. Como se usa desde un server
// component (nosotros/page.tsx), los iconos NO pueden pasarse como
// referencia a componente (funciones no serializables a través del
// border RSC). Por eso `icon` se tipa como ReactNode — el caller pasa
// `<Target className="..." />` ya renderizado.

// Subcomponentes interactivos para la página /nosotros — entrance
// animations con framer-motion + hover states premium.

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

// =============================================================
// Stat con número animado, fade-in y hover con backdrop verde
// =============================================================
export function AnimatedStat({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative -mx-2 cursor-default rounded-xl px-3 py-2 transition-colors hover:bg-brand-50/60"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <p className="text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-500">
        {label}
      </p>
    </motion.div>
  );
}

// =============================================================
// Pillar (Misión / Visión / Valores) — card premium corporativa
// con accent stripe permanente, etiqueta categoría, body principal
// y lista de bullets/tags. Layout más elaborado y con jerarquía
// tipográfica clara para sentir corporativo y profesional.
// =============================================================
export function Pillar({
  icon,
  label,
  title,
  body,
  bullets,
  tags,
  delay = 0,
}: {
  icon: React.ReactNode;
  /** Etiqueta superior corta — "Misión" / "Visión" / "Valores" */
  label: string;
  /** Frase principal de la card (no es solo el label) */
  title: string;
  body: string;
  /** Bullets con icono check (para Misión/Visión) */
  bullets?: string[];
  /** Tags / chips (para Valores) */
  tags?: string[];
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 sm:p-8"
    >
      {/* Accent stripe top — siempre visible, gradient brand */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Decorative blob de hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-brand-100/60 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Header: icon + label */}
      <div className="relative flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700">
          {label}
        </span>
      </div>

      {/* Title */}
      <h3 className="relative mt-6 text-xl font-semibold leading-tight text-ink-900 sm:text-2xl">
        {title}
      </h3>

      {/* Body */}
      <p className="relative mt-3 text-[15px] leading-relaxed text-ink-700">
        {body}
      </p>

      {/* Divider con accent */}
      <span
        aria-hidden="true"
        className="relative my-6 block h-px w-12 bg-gradient-to-r from-brand-500 to-transparent"
      />

      {/* Footer: bullets o tags */}
      {bullets && bullets.length > 0 && (
        <ul className="relative space-y-2.5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2.5 text-sm text-ink-700"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-2.5 w-2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {tags && tags.length > 0 && (
        <div className="relative flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-200 transition-colors group-hover:bg-brand-100"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// =============================================================
// Diferenciador — fila con icono + título + desc, hover slide
// del icono y reveal lateral on scroll
// =============================================================
export function Diff({
  icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative flex gap-4 rounded-xl p-3 transition-colors hover:bg-brand-50/40"
    >
      <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-all duration-300 group-hover:bg-brand-500 group-hover:text-black group-hover:ring-brand-300 group-hover:scale-110">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-ink-900 transition-colors group-hover:text-brand-800">
          {title}
        </p>
        <p className="mt-1 text-sm text-ink-600">{desc}</p>
      </div>
    </motion.li>
  );
}

// =============================================================
// HoverImage — imagen real con zoom suave en hover y overlay sutil
// =============================================================
export function HoverImage({
  src,
  alt,
  ratio = "aspect-[4/5]",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5",
        ratio,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.07]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      {/* Brillo sutil al hacer hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"
      />
    </motion.div>
  );
}

// =============================================================
// Wrapper: anima una sección completa al entrar al viewport
// =============================================================
export function FadeInOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
