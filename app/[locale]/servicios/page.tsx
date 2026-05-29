import Image from "next/image";
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
  image: string;
  imageAlt_es: string;
  imageAlt_en: string;
};

const SERVICES: Service[] = [
  {
    slug: "agenciamiento-de-carga",
    icon: Container,
    title_es: "Agenciamiento de carga",
    title_en: "Freight forwarding",
    short_es:
      "Soluciones adaptadas al negocio de nuestros clientes, atendiendo sus necesidades de carga internacional según sus términos de compra-venta.",
    short_en:
      "Tailored solutions for our clients' businesses, supporting their international freight needs based on their trade terms.",
    features_es: [],
    features_en: [],
    image: "/serviciocomprende2.webp",
    imageAlt_es: "Agenciamiento de carga — operación IPE del Perú",
    imageAlt_en: "Freight forwarding — IPE del Perú operation",
  },
  {
    slug: "almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    short_es:
      "Capacidad para ejecutar el servicio de almacenamiento con áreas exclusivas y compartidas, manteniendo el orden y control de su carga.",
    short_en:
      "Capacity to execute warehousing services with exclusive and shared areas, maintaining order and control of your cargo.",
    features_es: [],
    features_en: [],
    image: "/almacenamiento2.webp",
    imageAlt_es: "Almacén IPE del Perú — áreas exclusivas y compartidas",
    imageAlt_en: "IPE del Perú warehouse — exclusive and shared areas",
  },
  {
    slug: "especializados",
    icon: Layers,
    title_es: "Especializados",
    title_en: "Specialized",
    short_es:
      "Capacidad operativa para ejecutar las acciones necesarias de un servicio de calidad, con el respaldo de un equipo calificado y socios estratégicos.",
    short_en:
      "Operational capability to execute the necessary actions for quality service, backed by a qualified team and strategic partners.",
    features_es: [],
    features_en: [],
    image: "/especializados2.webp",
    imageAlt_es: "Operadores logísticos — IPE del Perú",
    imageAlt_en: "Logistics operators — IPE del Perú",
  },
  {
    slug: "internacional",
    icon: Globe2,
    title_es: "Internacional",
    title_en: "International",
    short_es:
      "Capacidad para ejecutar el servicio de mudanza internacional, respaldado por experiencia logística, una red de agentes y un equipo capacitado.",
    short_en:
      "Capacity to execute the international moving service, backed by logistics experience, an agent network and a trained team.",
    features_es: [],
    features_en: [],
    image: "/mudanzas2.webp",
    imageAlt_es: "Mudanza internacional — embalaje y traslado IPE del Perú",
    imageAlt_en: "International moving — IPE del Perú packing and transport",
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
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                    <Image
                      src={s.image}
                      alt={isEs ? s.imageAlt_es : s.imageAlt_en}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
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
