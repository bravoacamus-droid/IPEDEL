"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  Globe2,
  Package,
  Plane,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

type Item = {
  href: string;
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
  icon: LucideIcon;
};

const ITEMS: Item[] = [
  {
    href: "/servicios/agenciamiento-de-carga",
    icon: Plane,
    title_es: "Carga aérea",
    title_en: "Air freight",
    desc_es: "Express y consolidado con cobertura global 24–72h.",
    desc_en: "Express and consolidated air with 24–72h global coverage.",
  },
  {
    href: "/servicios/agenciamiento-de-carga",
    icon: Ship,
    title_es: "Carga marítima",
    title_en: "Sea freight",
    desc_es: "FCL/LCL desde Asia, Europa y América.",
    desc_en: "FCL/LCL from Asia, Europe and the Americas.",
  },
  {
    href: "/servicios/agenciamiento-de-carga",
    icon: Truck,
    title_es: "Transporte terrestre",
    title_en: "Land transport",
    desc_es: "Distribución nacional y rutas CAN.",
    desc_en: "Domestic distribution and CAN routes.",
  },
  {
    href: "/servicios/almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    desc_es: "Bodegaje, custodia y manejo en Lima/Callao.",
    desc_en: "Storage, custody and handling in Lima/Callao.",
  },
  {
    href: "/servicios/especializados",
    icon: Package,
    title_es: "Cargas especializadas",
    title_en: "Specialized cargo",
    desc_es: "Pesada, sobredimensionada, perecederos y peligrosa.",
    desc_en: "Heavy, oversized, perishables and dangerous goods.",
  },
  {
    href: "/servicios/internacional",
    icon: Globe2,
    title_es: "Mudanzas internacionales",
    title_en: "International moving",
    desc_es: "Door to Port · Door to Door · Room to Room.",
    desc_en: "Door to Port · Door to Door · Room to Room.",
  },
];

export function MegaMenu({
  locale,
  scrolled,
  label,
}: {
  locale: Locale;
  scrolled: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  function scheduleClose() {
    closeTimer.current && clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }
  function cancelClose() {
    closeTimer.current && clearTimeout(closeTimer.current);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          scrolled
            ? "text-ink-700 hover:bg-brand-50 hover:text-ink-900"
            : "text-white/90 hover:bg-white/10 hover:text-white",
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-40 mt-3 w-[min(94vw,920px)] -translate-x-1/2"
          >
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-black/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {ITEMS.map((it) => {
                  const Icon = it.icon;
                  const title = locale === "es" ? it.title_es : it.title_en;
                  const desc = locale === "es" ? it.desc_es : it.desc_en;
                  return (
                    <Link
                      key={`${it.href}-${title}`}
                      href={`/${locale}${it.href}`}
                      onClick={() => setOpen(false)}
                      className="group flex items-start gap-4 border-b border-r border-ink-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-brand-50/60"
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-500 group-hover:text-black">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink-900">
                          {title}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-500 line-clamp-2">
                          {desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-5 py-3">
                <p className="text-xs text-ink-600">
                  {locale === "es"
                    ? "Más de 30 años conectando al Perú con el mundo."
                    : "Over 30 years connecting Peru with the world."}
                </p>
                <Link
                  href={`/${locale}/servicios`}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-brand-800"
                >
                  {locale === "es" ? "Ver todos los servicios" : "View all services"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
