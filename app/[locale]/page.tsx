import Link from "next/link";
import {
  Plane,
  Ship,
  Truck,
  Globe2,
  Boxes,
  PackageSearch,
  ArrowRight,
} from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { HBLTracker } from "@/components/public/HBLTracker";
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

  const services = [
    { icon: Boxes, key: "freight" as const },
    { icon: Globe2, key: "storage" as const },
    { icon: PackageSearch, key: "special" as const },
    { icon: Plane, key: "intl" as const },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #96c600 0%, transparent 40%), radial-gradient(circle at 80% 60%, #c2d971 0%, transparent 50%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="container-page relative grid items-center gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <span className="inline-block rounded-full border border-brand-500 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-300">
              {dict.home.hero_eyebrow}
            </span>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink-200 sm:text-lg">{heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${locale}/tracking`} className="btn-primary">
                {heroCta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/contacto`}
                className="btn border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black px-5 py-2.5"
              >
                {dict.home.hero_cta_contact}
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white p-5 text-ink-900 shadow-2xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
                {dict.home.tracking_title}
              </h2>
              <p className="mt-1 text-sm text-ink-600">{dict.home.tracking_subtitle}</p>
              <div className="mt-4">
                <HBLTracker locale={locale} dict={dict} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-12 md:grid-cols-4">
          <Stat label={dict.home.stats_countries} value="40+" />
          <Stat label={dict.home.stats_years} value="30+" />
          <Stat label={dict.home.stats_agents} value="6" />
          <Stat label={dict.home.stats_modes} value="3" iconRow />
        </div>
      </section>

      {/* Services */}
      <section className="bg-ink-50 py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink-900">
              {dict.home.services_title}
            </h2>
            <p className="mt-3 text-ink-600">{dict.home.services_subtitle}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, key }) => {
              const titleKey = `service_${key}_title` as const;
              const descKey = `service_${key}_desc` as const;
              return (
                <Link
                  key={key}
                  href={`/${locale}/servicios`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-black">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink-900">
                    {dict.home[titleKey]}
                  </h3>
                  <p className="mt-2 text-sm text-ink-600">{dict.home[descKey]}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
                    {locale === "es" ? "Ver más" : "Learn more"}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-brand-500 py-16">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
              {locale === "es"
                ? "¿Necesitas una cotización?"
                : "Need a quote?"}
            </h2>
            <p className="mt-2 max-w-xl text-black/80">
              {locale === "es"
                ? "Conversemos sobre tu carga. Respondemos en menos de 24 horas hábiles."
                : "Tell us about your shipment. We reply within 24 business hours."}
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/${locale}/contacto`} className="btn bg-black text-white hover:bg-ink-800 px-5 py-2.5">
              {dict.home.hero_cta_contact}
            </Link>
            <a href="tel:+5112566135" className="btn bg-white text-black hover:bg-ink-100 px-5 py-2.5">
              +511 256-6135
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ label, value, iconRow }: { label: string; value: string; iconRow?: boolean }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5">
      {iconRow ? (
        <div className="flex items-center gap-2 text-brand-600">
          <Plane className="h-6 w-6" />
          <Ship className="h-6 w-6" />
          <Truck className="h-6 w-6" />
        </div>
      ) : (
        <div className="text-3xl font-semibold text-ink-900">{value}</div>
      )}
      <div className="mt-2 text-xs font-medium uppercase tracking-wider text-ink-500">
        {label}
      </div>
    </div>
  );
}
