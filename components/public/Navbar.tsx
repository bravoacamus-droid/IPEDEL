import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Navbar({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/nosotros`, label: dict.nav.about },
    { href: `/${locale}/servicios`, label: dict.nav.services },
    { href: `/${locale}/tracking`, label: dict.nav.tracking },
    { href: `/${locale}/agentes`, label: dict.nav.agents },
    { href: `/${locale}/tarifario`, label: dict.nav.tarifario },
    { href: `/${locale}/contacto`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-page flex items-center justify-between py-3">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image
            src="/logo-horizontal.png"
            alt="IPE del Perú SAC"
            width={170}
            height={40}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-brand-50 hover:text-ink-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher current={locale} />
          <Link href={`/${locale}/tracking`} className="btn-primary hidden sm:inline-flex">
            {dict.common.track}
          </Link>
        </div>
      </div>
    </header>
  );
}
