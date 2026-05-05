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
    short_es:
      "Soluciones adaptadas al negocio del cliente, con asesoría experta para reducir costos y elegir la modalidad correcta.",
    short_en:
      "Solutions tailored to the client's business, with expert advisory to reduce costs and choose the right transport mode.",
    features_es: [
      "Aéreo · marítimo (FCL/LCL) · terrestre · multimodal",
      "Consolidación / desconsolidación",
      "Carga de proyecto",
      "Door to Door",
      "Asesoría documentaria",
    ],
    features_en: [
      "Air · sea (FCL/LCL) · land · multimodal",
      "Consolidation / deconsolidation",
      "Project cargo",
      "Door to Door",
      "Documentary advisory",
    ],
    imageSuggested: "/services/agenciamiento-card.jpg",
    imageHint_es: "Avión cargo + contenedor — operación premium",
    imageHint_en: "Cargo plane + container — premium operation",
  },
  {
    slug: "almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    short_es:
      "Servicio de almacenamiento impecable, con áreas exclusivas y compartidas adaptadas a cada cliente.",
    short_en:
      "Flawless warehousing, with exclusive and shared areas adapted to each client.",
    features_es: [
      "Áreas exclusivas y compartidas",
      "Áreas a medida del requerimiento",
      "Manejo de productos controlados",
      "Seguimiento permanente",
    ],
    features_en: [
      "Exclusive and shared areas",
      "Custom-sized areas",
      "Controlled-product handling",
      "Continuous tracking",
    ],
    imageSuggested: "/services/almacenamiento-card.jpg",
    imageHint_es: "Almacén / racks — vista institucional",
    imageHint_en: "Warehouse / racks — institutional view",
  },
  {
    slug: "especializados",
    icon: Layers,
    title_es: "Especializados",
    title_en: "Specialized",
    short_es:
      "Operadores logísticos: desaduanaje, consolidaciones aéreas y conocimiento profundo en legislación aduanera.",
    short_en:
      "Logistics operators: customs clearance, air consolidations and deep customs-legislation expertise.",
    features_es: [
      "Desaduanaje para cargas en general",
      "Consolidaciones aéreas (Japón y mundo)",
      "Personal experto en legislación aduanera",
      "Socios estratégicos en países de origen",
    ],
    features_en: [
      "Customs clearance for general cargo",
      "Air consolidations (Japan and worldwide)",
      "Customs-legislation experts",
      "Strategic partners at origin",
    ],
    imageSuggested: "/services/especializados-card.jpg",
    imageHint_es: "Desaduanaje / agentes / SUNAT",
    imageHint_en: "Customs clearance / agents / SUNAT",
  },
  {
    slug: "internacional",
    icon: Globe2,
    title_es: "Internacional",
    title_en: "International",
    short_es:
      "Mudanzas internacionales con agentes acreditados en el extranjero. Visita personal, presupuesto detallado y embalaje profesional.",
    short_en:
      "International moving with accredited overseas agents. Personal visit, detailed quote and professional packing.",
    features_es: [
      "Door to Port",
      "Door to Door",
      "Room to Room",
      "Embalaje profesional certificado",
    ],
    features_en: [
      "Door to Port",
      "Door to Door",
      "Room to Room",
      "Certified professional packing",
    ],
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
            ? "Soluciones logísticas integrales aéreas, marítimas y terrestres, con la confianza forjada en más de tres décadas de operación."
            : "End-to-end air, sea and land logistics solutions, backed by trust forged through three decades of operation."
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
