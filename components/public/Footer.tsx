import Link from "next/link";
import Image from "next/image";
import { BookText, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const explore = [
    { href: `/${locale}/nosotros`, label: dict.nav.about },
    { href: `/${locale}/servicios`, label: dict.nav.services },
    { href: `/${locale}/tracking`, label: dict.nav.tracking },
    { href: `/${locale}/agentes`, label: dict.nav.agents },
    { href: `/${locale}/tarifario`, label: dict.nav.tarifario },
    { href: `/${locale}/contacto`, label: dict.nav.contact },
  ];
  const legal = [
    { href: `/${locale}/libro-de-reclamaciones`, label: dict.footer.ldr },
    { href: `/${locale}/politica-de-privacidad`, label: dict.footer.privacy },
    { href: `/${locale}/terminos-condiciones`, label: dict.footer.terms },
    { href: `/${locale}/politica-cookies`, label: dict.footer.cookies },
  ];

  return (
    <footer className="border-t border-ink-100 bg-ink-900 text-ink-100">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Image
              src="/logo-vertical.png"
              alt="IPE del Perú SAC"
              width={120}
              height={120}
              className="h-20 w-auto bg-white rounded-md p-2"
            />
            <p className="mt-4 text-sm text-ink-300 max-w-sm">
              {dict.footer.company} — {dict.footer.ruc}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-ink-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <span>{dict.footer.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-brand-500" />
                <a href={`tel:${dict.footer.phone}`} className="hover:text-white">
                  {dict.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-brand-500" />
                <a href={`mailto:${dict.footer.email}`} className="hover:text-white">
                  {dict.footer.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              {dict.footer.explore}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link className="text-ink-200 hover:text-white" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-300">
              {dict.footer.legal}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link className="text-ink-200 hover:text-white" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${locale}/libro-de-reclamaciones`}
              className="mt-4 inline-flex items-center gap-2 rounded-md border border-brand-500 px-4 py-2 text-sm font-medium text-brand-300 hover:bg-brand-500 hover:text-black transition-colors"
            >
              <BookText className="h-4 w-4" strokeWidth={1.6} />
              {dict.footer.ldr}
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-ink-800 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {dict.footer.company}. {dict.common.all_rights_reserved}.
          </p>
          <p>RUC 20197900378</p>
        </div>
      </div>
    </footer>
  );
}
