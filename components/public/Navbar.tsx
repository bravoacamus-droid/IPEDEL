"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MegaMenu } from "./MegaMenu";
import { cn } from "@/lib/utils";

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when locale changes (not strictly needed, but tidy)
  useEffect(() => {
    setMobileOpen(false);
  }, [locale]);

  const linkClass = (active = false) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      scrolled
        ? "text-ink-700 hover:bg-brand-50 hover:text-ink-900"
        : "text-white/90 hover:bg-white/10 hover:text-white",
      active && "text-brand-700",
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,backdrop-filter,box-shadow,border-color] duration-300",
        scrolled
          ? "border-b border-ink-100 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
          : "border-b border-transparent bg-gradient-to-b from-black/40 via-black/20 to-transparent backdrop-blur-[2px]",
      )}
    >
      <div className="container-page flex items-center justify-between py-3">
        {/* Logo izquierda — crece animadamente al hacer scroll */}
        <Link href={`/${locale}`} className="group flex items-center gap-3">
          <div
            className={cn(
              "flex items-center justify-center rounded-md transition-all duration-300 ease-out",
              scrolled
                ? "h-12 w-auto scale-100"
                : "h-9 w-auto scale-90 bg-white/85 px-2 py-1 backdrop-blur-md shadow-lg",
            )}
          >
            <Image
              src="/logo-horizontal.png"
              alt="IPE del Perú SAC"
              width={200}
              height={48}
              priority
              className={cn(
                "w-auto transition-all duration-300 ease-out",
                scrolled ? "h-11" : "h-7",
              )}
            />
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link href={`/${locale}`} className={linkClass()}>
            {dict.nav.home}
          </Link>
          <Link href={`/${locale}/nosotros`} className={linkClass()}>
            {dict.nav.about}
          </Link>
          <MegaMenu locale={locale} scrolled={scrolled} label={dict.nav.services} />
          <Link href={`/${locale}/tracking`} className={linkClass()}>
            {dict.nav.tracking}
          </Link>
          <Link href={`/${locale}/agentes`} className={linkClass()}>
            {dict.nav.agents}
          </Link>
          <Link href={`/${locale}/tarifario`} className={linkClass()}>
            {dict.nav.tarifario}
          </Link>
          <Link href={`/${locale}/contacto`} className={linkClass()}>
            {dict.nav.contact}
          </Link>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} scrolled={scrolled} />
          <Link
            href={`/${locale}/tracking`}
            className={cn(
              "hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:inline-flex",
              "bg-brand-500 text-black hover:bg-brand-400",
            )}
          >
            {dict.common.track}
          </Link>
          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors lg:hidden",
              scrolled ? "text-ink-700 hover:bg-ink-100" : "text-white hover:bg-white/15",
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col py-3">
            {[
              { href: `/${locale}`, label: dict.nav.home },
              { href: `/${locale}/nosotros`, label: dict.nav.about },
              { href: `/${locale}/servicios`, label: dict.nav.services },
              { href: `/${locale}/tracking`, label: dict.nav.tracking },
              { href: `/${locale}/agentes`, label: dict.nav.agents },
              { href: `/${locale}/tarifario`, label: dict.nav.tarifario },
              { href: `/${locale}/contacto`, label: dict.nav.contact },
            ].map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50"
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
