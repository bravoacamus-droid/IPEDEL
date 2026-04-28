import Link from "next/link";
import {
  ArrowRight,
  Award,
  CalendarRange,
  Container,
  Globe2,
  Layers,
  Plane,
  Ship,
  Truck,
  Users2,
  Warehouse,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { HeroVideo } from "@/components/public/HeroVideo";
import { AnimatedNumber } from "@/components/public/AnimatedNumber";
import { notFound } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const [{ data: hero }, { data: subtitle }, { data: cta }] = await Promise.all([
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "home_hero_title")
      .eq("locale", locale)
      .maybeSingle(),
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "home_hero_subtitle")
      .eq("locale", locale)
      .maybeSingle(),
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "home_hero_cta")
      .eq("locale", locale)
      .maybeSingle(),
  ]);

  const heroTitle = hero?.value || dict.home.hero_title_default;
  const heroSubtitle = subtitle?.value || dict.home.hero_subtitle_default;
  const heroCta = cta?.value || dict.home.hero_cta_track;

  return (
    <>
      <HeroVideo
        locale={locale as Locale}
        dict={dict}
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        heroCta={heroCta}
      />

      <StatsSection locale={locale as Locale} />

      <ServicesSection locale={locale as Locale} dict={dict} />

      {/* CTA strip */}
      <section className="relative overflow-hidden bg-brand-500 py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 50%, rgba(0,0,0,0.25), transparent 55%)",
          }}
        />
        <div className="container-page relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              {locale === "es" ? "¿Necesitas una cotización?" : "Need a quote?"}
            </h2>
            <p className="mt-2 max-w-xl text-black/80">
              {locale === "es"
                ? "Conversemos sobre tu carga. Respondemos en menos de 24 horas hábiles."
                : "Tell us about your shipment. We reply within 24 business hours."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
            >
              {dict.home.hero_cta_contact}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+5112566135"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-ink-100"
            >
              +511 256-6135
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// =============================================================
// STATS — premium con números animados al hacer scroll
// =============================================================
function StatsSection({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  return (
    <section className="relative -mt-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="relative grid gap-px overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)] sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={CalendarRange}
            value={30}
            suffix="+"
            label={isEs ? "Años de experiencia" : "Years of experience"}
          />
          <StatCard
            icon={Globe2}
            value={40}
            suffix="+"
            label={isEs ? "Países en la red" : "Countries in network"}
          />
          <StatCard
            icon={Users2}
            value={6}
            label={isEs ? "Agentes destacados" : "Featured agents"}
          />
          <StatCard
            icon={Award}
            value={3}
            label={isEs ? "Modos: aéreo · marítimo · terrestre" : "Modes: air · sea · land"}
            footerIcons
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  footerIcons,
}: {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  footerIcons?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden bg-white p-7 transition-colors hover:bg-brand-50/40">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-50 transition-opacity group-hover:opacity-100"
      />
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <p className="mt-6 flex items-baseline gap-1 text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
        {label}
      </p>
      {footerIcons && (
        <div className="mt-3 flex items-center gap-3 text-brand-600">
          <Plane className="h-4 w-4" strokeWidth={1.6} />
          <Ship className="h-4 w-4" strokeWidth={1.6} />
          <Truck className="h-4 w-4" strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}

// =============================================================
// SERVICES — premium cards con accent stripe + tags + identity
// =============================================================
type ServiceCard = {
  slug: string;
  icon: LucideIcon;
  title_es: string;
  title_en: string;
  desc_es: string;
  desc_en: string;
  tags_es: string[];
  tags_en: string[];
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "agenciamiento-de-carga",
    icon: Container,
    title_es: "Agenciamiento de carga",
    title_en: "Freight forwarding",
    desc_es:
      "Soluciones a la medida en transporte aéreo, marítimo y terrestre — incluida consolidación y carga de proyecto.",
    desc_en:
      "Tailored solutions across air, sea and land — including consolidation and project cargo.",
    tags_es: ["Aéreo", "FCL/LCL", "Multimodal", "Door to Door"],
    tags_en: ["Air", "FCL/LCL", "Multimodal", "Door to Door"],
  },
  {
    slug: "almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    desc_es:
      "Áreas exclusivas y compartidas a medida del requerimiento, con manejo seguro de productos controlados.",
    desc_en:
      "Exclusive and shared areas tailored to your needs, with safe handling of controlled products.",
    tags_es: ["Bodegaje", "Custodia", "Productos controlados"],
    tags_en: ["Storage", "Custody", "Controlled goods"],
  },
  {
    slug: "especializados",
    icon: Layers,
    title_es: "Especializados",
    title_en: "Specialized",
    desc_es:
      "Operadores logísticos: desaduanaje, consolidaciones aéreas y conocimiento profundo en legislación aduanera.",
    desc_en:
      "Logistics operators: customs clearance, air consolidations and deep customs-legislation expertise.",
    tags_es: ["Desaduanaje", "Consolidación aérea", "Asia ↔ Perú"],
    tags_en: ["Customs clearance", "Air consolidation", "Asia ↔ Peru"],
  },
  {
    slug: "internacional",
    icon: Globe2,
    title_es: "Internacional",
    title_en: "International",
    desc_es:
      "Mudanzas internacionales con agentes acreditados en el extranjero. Embalaje profesional y trazabilidad.",
    desc_en:
      "International moving with accredited agents abroad. Professional packing and full traceability.",
    tags_es: ["Door to Port", "Door to Door", "Room to Room"],
    tags_en: ["Door to Port", "Door to Door", "Room to Room"],
  },
];

function ServicesSection({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const isEs = locale === "es";
  return (
    <section className="relative bg-ink-50 py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="container-page relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
              {isEs ? "Lo que hacemos" : "What we do"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {dict.home.services_title}
            </h2>
            <p className="mt-4 text-ink-600">{dict.home.services_subtitle}</p>
          </div>
          <Link
            href={`/${locale}/servicios`}
            className="hidden items-center gap-1.5 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:bg-brand-500 hover:text-black sm:inline-flex"
          >
            {isEs ? "Ver todos los servicios" : "View all services"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_CARDS.map((s) => (
            <ServiceCardItem key={s.slug} card={s} locale={locale} />
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href={`/${locale}/servicios`}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-800 hover:border-brand-500 hover:bg-brand-500 hover:text-black"
          >
            {isEs ? "Ver todos los servicios" : "View all services"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ServiceCardItem({
  card,
  locale,
}: {
  card: ServiceCard;
  locale: Locale;
}) {
  const Icon = card.icon;
  const isEs = locale === "es";
  const title = isEs ? card.title_es : card.title_en;
  const desc = isEs ? card.desc_es : card.desc_en;
  const tags = isEs ? card.tags_es : card.tags_en;

  return (
    <Link
      href={`/${locale}/servicios/${card.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10"
    >
      {/* Top accent stripe */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-60 transition-opacity group-hover:opacity-100"
      />

      {/* Icon */}
      <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
        <Icon className="h-6 w-6" strokeWidth={1.6} />
      </span>

      <h3 className="relative mt-6 text-lg font-semibold leading-snug text-ink-900">
        {title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-ink-600">
        {desc}
      </p>

      <div className="relative mt-5 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="relative mt-auto pt-6 flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:text-brand-800">
        <span>{isEs ? "Ver detalle" : "View details"}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Decorative blob */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-brand-100/60 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
      />
    </Link>
  );
}
