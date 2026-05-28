import Image from "next/image";
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
import { ParallaxSection } from "@/components/public/ParallaxSection";
import { cn } from "@/lib/utils";
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

      {/* CTA strip — parallax sobre CTAIPEDEL2.webp con overlay verde tenue
          (intensidad 0.4 para que el desplazamiento se aprecie al scrollear). */}
      <ParallaxSection
        image="/CTAIPEDEL2.webp"
        alt=""
        intensity={0.4}
        className="flex min-h-[520px] items-center sm:min-h-[600px] lg:min-h-[640px]"
        overlayClassName="bg-gradient-to-r from-brand-500/70 via-brand-500/40 to-brand-500/15"
      >
        {/* Vignette superior e inferior + foco lateral para legibilidad */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/15 via-transparent to-black/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_55%,rgba(255,255,255,0.28),transparent_55%)]"
        />
        <div className="container-page relative flex w-full flex-col items-start justify-between gap-10 py-20 lg:flex-row lg:items-end lg:py-28">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/30 bg-white/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/85 backdrop-blur-md">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-black" />
              {locale === "es" ? "Trabajemos juntos" : "Let's work together"}
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-[1.05] tracking-tight text-black sm:text-4xl lg:text-5xl drop-shadow-sm">
              {locale === "es" ? "¿Necesitas una cotización?" : "Need a quote?"}
            </h2>
            <p className="mt-5 max-w-lg text-base text-black/85 sm:text-lg">
              {locale === "es"
                ? "Cuéntanos sobre tu embarque y te respondemos."
                : "Tell us about your shipment and we will get back to you."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contacto`}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-black/30 ring-1 ring-black/10 transition-all hover:-translate-y-0.5 hover:bg-ink-800 hover:shadow-2xl hover:shadow-black/40"
            >
              {dict.home.hero_cta_contact}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="tel:+5113045520"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-xl shadow-black/15 ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-ink-100 hover:shadow-2xl"
            >
              +511 304-5520
            </a>
          </div>
        </div>
      </ParallaxSection>
    </>
  );
}

// =============================================================
// STATS — premium con números animados al hacer scroll
// =============================================================
async function StatsSection({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  // Sincroniza el contador de "Agentes destacados" con el número real
  // de agentes activos en DB. Si el cliente agrega/quita agentes desde
  // el panel admin, el contador del home se actualiza automaticamente.
  const supabase = await createClient();
  const { count: agentsCount } = await supabase
    .from("agents")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  const totalAgents = agentsCount ?? 0;

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
            value={totalAgents}
            label={isEs ? "Agentes destacados" : "Featured agents"}
          />
          <StatCard
            icon={Award}
            value={3}
            label={isEs ? "Aéreo · Marítimo · Terrestre" : "Air · Sea · Land"}
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
// SERVICES — grid asimétrico tipo "showroom" con gradientes
// brand y placeholders de imagen transparente por servicio.
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
  /** Path del PNG transparente del servicio. Cliente lo subirá a /public/services/. */
  imagePath?: string;
  /** Clases Tailwind para el gradiente de fondo de la tarjeta. */
  gradient: string;
};

const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "agenciamiento-de-carga",
    icon: Container,
    title_es: "Agenciamiento de carga",
    title_en: "Freight forwarding",
    desc_es:
      "Atendemos sus necesidades de carga internacional con soluciones de transporte aéreo, marítimo y terrestre.",
    desc_en:
      "We handle your international cargo needs with air, sea and land transport solutions.",
    tags_es: ["Aéreo", "Marítimo", "Terrestre", "Multimodal"],
    tags_en: ["Air", "Sea", "Land", "Multimodal"],
    imagePath: "/agenciadecarga2.png",
    gradient:
      "bg-[linear-gradient(135deg,#ffffff_0%,#f4faea_30%,#d2e89f_75%,#aacd3e_100%)]",
  },
  {
    slug: "almacenamiento",
    icon: Warehouse,
    title_es: "Almacenamiento",
    title_en: "Warehousing",
    desc_es:
      "Almacén con espacios a medida y personal capacitado para el manejo de carga.",
    desc_en:
      "Warehouse with tailored spaces and trained staff for cargo handling.",
    tags_es: ["Almacenamiento", "Manejo adecuado", "Personal experimentado"],
    tags_en: ["Storage", "Proper Handling", "Experienced Staff"],
    imagePath: "/almacengrid.png",
    gradient:
      "bg-[linear-gradient(135deg,#f4faea_0%,#d2e89f_60%,#96c600_100%)]",
  },
  {
    slug: "especializados",
    icon: Layers,
    title_es: "Especializados",
    title_en: "Specialized",
    desc_es:
      "Operadores logísticos con experiencia internacional y red de agentes.",
    desc_en:
      "Logistics operators with international experience and agent network.",
    tags_es: ["Coordinación logística", "Alcance internacional", "Red de agentes"],
    tags_en: ["Logistics coordination", "International reach", "Agent network"],
    imagePath: "/especializados.png",
    gradient:
      "bg-[linear-gradient(135deg,#ffffff_0%,#e6f3cf_50%,#c2d971_100%)]",
  },
  {
    slug: "internacional",
    icon: Globe2,
    title_es: "Internacional",
    title_en: "International",
    desc_es:
      "Mudanzas internacionales con un equipo capacitado y alcance global.",
    desc_en:
      "International moving with a trained team and global reach.",
    tags_es: ["Door to Port", "Door to Door", "Room to Room"],
    tags_en: ["Door to Port", "Door to Door", "Room to Room"],
    imagePath: "/internacional.png",
    gradient:
      "bg-[linear-gradient(135deg,#aacd3e_0%,#96c600_55%,#7ba300_100%)]",
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

        {/* Grid asimétrico estilo "showroom" (referencia VAPE Distro):
              col 1 → tall (Agenciamiento)
              col 2 → 2 cards stacked (Almacenamiento arriba, Especializados abajo)
              col 3 → tall (Internacional)
              Posicionamiento explícito con col-start/row-start para
              evitar que CSS Grid auto-flow desordene las cards. */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:auto-rows-[290px]">
          <ServiceCardItem
            card={SERVICE_CARDS[0]}
            locale={locale}
            className="lg:col-start-1 lg:row-start-1 lg:row-span-2"
            tall
          />
          <ServiceCardItem
            card={SERVICE_CARDS[1]}
            locale={locale}
            className="lg:col-start-2 lg:row-start-1"
          />
          <ServiceCardItem
            card={SERVICE_CARDS[2]}
            locale={locale}
            className="lg:col-start-2 lg:row-start-2"
          />
          <ServiceCardItem
            card={SERVICE_CARDS[3]}
            locale={locale}
            className="lg:col-start-3 lg:row-start-1 lg:row-span-2"
            tall
          />
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
  className,
  tall = false,
}: {
  card: ServiceCard;
  locale: Locale;
  className?: string;
  tall?: boolean;
}) {
  const Icon = card.icon;
  const isEs = locale === "es";
  const title = isEs ? card.title_es : card.title_en;
  const desc = isEs ? card.desc_es : card.desc_en;
  const tags = isEs ? card.tags_es : card.tags_en;

  return (
    <Link
      href={`/${locale}/servicios/${card.slug}`}
      className={cn(
        "group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-3xl p-7 shadow-sm transition-all duration-500",
        "hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-500/20",
        card.gradient,
        className,
      )}
    >
      {/* Vignette superior para que el título resalte sobre el gradiente */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/30 to-transparent"
      />

      {/* Patrón sutil / textura para "premium feel" */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0a0a0a 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Imagen del servicio (PNG transparente del cliente).
          Posicionamiento por tipo:
            · tall  → centrada horizontal + más arriba + más grande
                     (bottom-[18%], h-68%, w-78%, object-bottom).
            · short → más pequeña y desplazada a la derecha para
                     dejar espacio al texto. */}
      <div
        className={cn(
          "pointer-events-none absolute z-0 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-rotate-1",
          tall
            ? "bottom-[18%] left-1/2 h-[68%] w-[78%] -translate-x-1/2"
            : "right-[-6%] top-1/2 h-[80%] w-[48%] -translate-y-1/2",
        )}
      >
        {card.imagePath ? (
          <Image
            src={card.imagePath}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className={cn(
              "drop-shadow-xl transition-[filter] duration-500 group-hover:drop-shadow-2xl",
              tall ? "object-contain object-bottom" : "object-contain object-right",
            )}
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full items-center",
              tall ? "justify-center" : "justify-end pr-4",
            )}
          >
            <Icon
              className={cn(
                "text-black/15",
                tall ? "h-48 w-48 lg:h-56 lg:w-56" : "h-32 w-32",
              )}
              strokeWidth={1}
            />
          </div>
        )}
      </div>

      {/* Gradiente blanco MUY fuerte sobre los 2/3 izquierdos para
          legibilidad absoluta del texto en cards short. */}
      {!tall && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(to_right,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.85)_40%,rgba(255,255,255,0.5)_60%,transparent_85%)]"
        />
      )}

      {/* Top — eyebrow + title.
          En cards short el contenido se limita a la mitad izquierda
          para no toparse con la imagen del lado derecho. */}
      <div
        className={cn(
          "relative z-10",
          tall ? "max-w-[85%]" : "max-w-[58%]",
        )}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/85 text-white shadow-lg ring-1 ring-black/10 backdrop-blur-sm">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <h3
          className={cn(
            "mt-5 text-balance font-semibold leading-tight tracking-tight text-ink-900",
            tall ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed text-ink-800/85",
            tall ? "max-w-[26rem]" : "max-w-[20rem]",
          )}
        >
          {desc}
        </p>
      </div>

      {/* Bottom — tags + CTA. Mismo max-width que el contenido superior
          en cards short para mantener la columna de texto limpia. */}
      <div
        className={cn(
          "relative z-10 mt-auto pt-6",
          !tall && "max-w-[62%]",
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/70 px-2.5 py-0.5 text-[11px] font-medium text-ink-800 ring-1 ring-black/5 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
          <span className="border-b border-ink-900/40 transition-colors group-hover:border-ink-900">
            {isEs ? "Ver detalle" : "View details"}
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Decorative ring on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 transition-all duration-500 group-hover:ring-white/40"
      />
    </Link>
  );
}
