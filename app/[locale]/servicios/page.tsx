import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Container,
  Globe2,
  Layers,
  Plane,
  Ship,
  Truck,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageBanner } from "@/components/public/PageBanner";
import { ImageSlot } from "@/components/public/ImageSlot";
import { CTAFooter } from "@/components/public/CTAFooter";

type Service = {
  slug: string;
  icon: LucideIcon;
  title_es: string;
  title_en: string;
  short_es: string;
  short_en: string;
  features_es: string[];
  features_en: string[];
  imageSuggested: string;
  imageHint_es: string;
  imageHint_en: string;
};

const SERVICES: Service[] = [
  {
    slug: "agenciamiento-de-carga",
    icon: Container,
    title_es: "Agenciamiento de carga",
    title_en: "Freight forwarding",
    short_es: "Aéreo · Marítimo (FCL/LCL) · Terrestre.",
    short_en: "Air · Sea (FCL/LCL) · Land.",
    features_es: [],
    features_en: [],
    imageSuggested: "/services/agenciamiento-card.jpg",
    imageHint_es: "Avión cargo + contenedor — operación premium",
    imageHint_en: "Cargo plane + container — premium operation",
  },
  {
    slug: "almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    short_es: "Áreas exclusivas y compartidas.",
    short_en: "Exclusive and shared areas.",
    features_es: [],
    features_en: [],
    imageSuggested: "/services/almacenamiento-card.jpg",
    imageHint_es: "Almacén / racks — vista institucional",
    imageHint_en: "Warehouse / racks — institutional view",
  },
  {
    slug: "especializados",
    icon: Layers,
    title_es: "Especializados",
    title_en: "Specialized",
    short_es: "Operadores logísticos.",
    short_en: "Logistics operators.",
    features_es: [],
    features_en: [],
    imageSuggested: "/services/especializados-card.jpg",
    imageHint_es: "Desaduanaje / agentes / SUNAT",
    imageHint_en: "Customs clearance / agents / SUNAT",
  },
  {
    slug: "internacional",
    icon: Globe2,
    title_es: "Internacional",
    title_en: "International",
    short_es: "Mudanza internacional.",
    short_en: "International moving.",
    features_es: [],
    features_en: [],
    imageSuggested: "/services/internacional-card.jpg",
    imageHint_es: "Mudanza internacional — embalaje y traslado",
    imageHint_en: "International moving — packing and transport",
  },
];

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const isEs = locale === "es";

  return (
    <div className="bg-white">
      <PageBanner
        eyebrow={isEs ? "Nuestros servicios" : "Our services"}
        title={dict.home.services_title}
        subtitle={
          isEs
            ? "Soluciones logísticas aéreas, marítimas y terrestres, respaldadas por experiencia internacional y más de 30 años en el rubro."
            : "Air, sea and land logistics solutions, backed by international experience and over 30 years in the industry."
        }
        breadcrumb={[
          { href: `/${locale}`, label: isEs ? "Inicio" : "Home" },
          { href: `/${locale}/servicios`, label: isEs ? "Servicios" : "Services" },
        ]}
      />

      {/* Mode strip */}
      <section className="border-b border-ink-100 bg-ink-50 py-8">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-[0.18em] text-ink-600 sm:gap-x-16">
          <span className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-brand-600" strokeWidth={1.6} />
            {isEs ? "Aéreo" : "Air"}
          </span>
          <span className="flex items-center gap-2">
            <Ship className="h-4 w-4 text-brand-600" strokeWidth={1.6} />
            {isEs ? "Marítimo" : "Sea"}
          </span>
          <span className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-brand-600" strokeWidth={1.6} />
            {isEs ? "Terrestre" : "Land"}
          </span>
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-brand-600" strokeWidth={1.6} />
            {isEs ? "Multimodal" : "Multimodal"}
          </span>
        </div>
      </section>

      {/* Grid de servicios */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            const reverse = idx % 2 === 1;
            return (
              <article
                key={s.slug}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
              >
                <div className={`lg:col-span-5 ${reverse ? "lg:order-last" : ""}`}>
                  <ImageSlot
                    hint={isEs ? s.imageHint_es : s.imageHint_en}
                    suggested={s.imageSuggested}
                    ratio="aspect-[4/3]"
                  />
                </div>
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-black">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      {isEs ? "Servicio" : "Service"}
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
                    {isEs ? s.title_es : s.title_en}
                  </h2>
                  <p className="mt-3 text-ink-600">
                    {isEs ? s.short_es : s.short_en}
                  </p>
                  {(isEs ? s.features_es : s.features_en).length > 0 && (
                    <ul className="mt-6 space-y-2">
                      {(isEs ? s.features_es : s.features_en).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-ink-700"
                        >
                          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link
                    href={`/${locale}/servicios/${s.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {isEs ? "Ver detalle" : "View details"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CTAFooter locale={locale as Locale} />
    </div>
  );
}
