import Link from "next/link";
import {
  Anchor,
  Award,
  Compass,
  Globe2,
  HeartHandshake,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { PageBanner } from "@/components/public/PageBanner";
import {
  AnimatedStat,
  Diff,
  HoverImage,
  Pillar,
} from "@/components/public/AboutSections";

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  // Permite al admin editar Misión/Visión desde site_content (CMS), con fallback a textos oficiales.
  const supabase = await createClient();
  const [{ data: cmsTitle }, { data: cmsBody }] = await Promise.all([
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "nosotros_title")
      .eq("locale", locale)
      .maybeSingle(),
    supabase
      .from("site_content")
      .select("value")
      .eq("key", "nosotros_body")
      .eq("locale", locale)
      .maybeSingle(),
  ]);

  // Título único (sin eyebrow ni breadcrumb redundantes — antes había
  // "Quiénes somos" en breadcrumb + chip + "Sobre nosotros" en título).
  const title =
    cmsTitle?.value || (locale === "es" ? "Quiénes somos" : "About us");

  return (
    <div className="bg-white">
      <PageBanner
        title={title}
        subtitle={
          locale === "es"
            ? "Más de tres décadas siendo el puente logístico entre el Perú y el mundo."
            : "Over three decades bridging Peru and the world."
        }
        backgroundImage="/heronosotros.webp"
        backgroundAlt={
          locale === "es"
            ? "Operación logística IPE del Perú"
            : "IPE del Perú logistics operation"
        }
      />

      {/* Bienvenidos — texto oficial */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7 space-y-5 text-ink-700">
            {cmsBody?.value ? (
              <p className="text-lg leading-relaxed">{cmsBody.value}</p>
            ) : locale === "es" ? (
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-ink-900">
                  IPE del Perú SAC
                </span>{" "}
                es Consolidador Aéreo y Marítimo, dedicada a la logística
                nacional e internacional para importación, exportación y
                tratamientos especiales. Siendo representantes de
                transnacionales japonesas, contamos con una red de agentes en{" "}
                <strong>más de 40 países</strong>.
              </p>
            ) : (
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-ink-900">
                  IPE del Perú SAC
                </span>{" "}
                is an Air and Maritime Consolidator dedicated to national and
                international logistics for imports, exports and specialized
                treatments. As representatives of Japanese multinationals, we
                count on a network of agents in{" "}
                <strong>40+ countries</strong>.
              </p>
            )}

            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-ink-100 pt-8">
              <AnimatedStat
                value={30}
                suffix="+"
                label={locale === "es" ? "Años de experiencia" : "Years of experience"}
                delay={0}
              />
              <AnimatedStat
                value={40}
                suffix="+"
                label={locale === "es" ? "Países en la red" : "Countries in network"}
                delay={0.1}
              />
              <AnimatedStat
                value={3}
                label={locale === "es" ? "Aéreo · Marítimo · Terrestre" : "Air · Sea · Land"}
                delay={0.2}
              />
            </div>
          </div>

          <div className="lg:col-span-5">
            <HoverImage
              src="/team.webp"
              alt={
                locale === "es"
                  ? "Equipo IPE del Perú"
                  : "IPE del Perú team"
              }
              ratio="aspect-[4/5]"
              priority
            />
            <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
              <p className="font-semibold flex items-center gap-2">
                <Award className="h-4 w-4" strokeWidth={1.6} />
                {locale === "es"
                  ? "Representantes de transnacionales japonesas"
                  : "Representatives of Japanese multinationals"}
              </p>
              <p className="mt-1 text-brand-800">
                {locale === "es"
                  ? "Décadas de operaciones que respaldan nuestra confianza."
                  : "Decades of operations that back our trust."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {locale === "es" ? "Nuestro propósito" : "Our purpose"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {locale === "es"
                ? "Conectar al Perú con el mundo, una operación a la vez"
                : "Connecting Peru with the world, one shipment at a time"}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Pillar
              icon={<Target className="h-5 w-5" strokeWidth={1.6} />}
              title={locale === "es" ? "Misión" : "Mission"}
              body={
                locale === "es"
                  ? "Brindar soluciones logísticas internacionales confiables, eficientes y a la medida del cliente."
                  : "Deliver reliable, efficient and tailored international logistics solutions."
              }
              delay={0}
            />
            <Pillar
              icon={<Compass className="h-5 w-5" strokeWidth={1.6} />}
              title={locale === "es" ? "Visión" : "Vision"}
              body={
                locale === "es"
                  ? "Ser el agente de carga referente en el Perú por nuestra trayectoria, compromiso y red internacional de socios estratégicos."
                  : "Be Peru's reference freight forwarder, recognized for our track record, commitment and global partner network."
              }
              delay={0.1}
            />
            <Pillar
              icon={<Sparkles className="h-5 w-5" strokeWidth={1.6} />}
              title={locale === "es" ? "Valores" : "Values"}
              body={
                locale === "es"
                  ? "Confianza, calidad operativa, transparencia, adaptabilidad y compromiso con cada embarque."
                  : "Trust, operational quality, transparency, adaptability and commitment to every shipment."
              }
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Diferenciadores */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <HoverImage
              src="/almacen.webp"
              alt={
                locale === "es"
                  ? "Almacén IPE del Perú"
                  : "IPE del Perú warehouse"
              }
              ratio="aspect-[4/5]"
            />
          </div>
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {locale === "es" ? "Por qué elegirnos" : "Why choose us"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900">
              {locale === "es"
                ? "Capacidad de adaptarnos a tu operación"
                : "We adapt to your operation"}
            </h2>
            <ul className="mt-8 space-y-3">
              <Diff
                icon={<HeartHandshake className="h-5 w-5" strokeWidth={1.6} />}
                delay={0}
                title={
                  locale === "es"
                    ? "Trato directo y personalizado"
                    : "Direct and personalized service"
                }
                desc={
                  locale === "es"
                    ? "Cada cliente cuenta con un ejecutivo asignado que conoce su negocio y le acompaña en cada embarque."
                    : "Every client has a dedicated executive who knows their business and supports each shipment."
                }
              />
              <Diff
                icon={<Globe2 className="h-5 w-5" strokeWidth={1.6} />}
                delay={0.08}
                title={
                  locale === "es"
                    ? "Red mundial de socios estratégicos"
                    : "Global strategic partner network"
                }
                desc={
                  locale === "es"
                    ? "Más de 40 países con agentes acreditados que respaldan cada operación."
                    : "Over 40 countries with accredited agents backing every operation."
                }
              />
              <Diff
                icon={<Users className="h-5 w-5" strokeWidth={1.6} />}
                delay={0.16}
                title={
                  locale === "es"
                    ? "Equipo altamente calificado"
                    : "Highly qualified team"
                }
                desc={
                  locale === "es"
                    ? "Profesionales con conocimiento profundo en legislación aduanera y operación internacional."
                    : "Professionals with deep expertise in customs legislation and international operations."
                }
              />
              <Diff
                icon={<Anchor className="h-5 w-5" strokeWidth={1.6} />}
                delay={0.24}
                title={
                  locale === "es"
                    ? "Trazabilidad del embarque"
                    : "Shipment traceability"
                }
                desc={
                  locale === "es"
                    ? "Sistema de seguimiento desde la coordinación hasta la entrega del embarque."
                    : "Tracking system from coordination through shipment delivery."
                }
              />
            </ul>
            <Link
              href={`/${locale}/contacto`}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-black hover:bg-brand-400"
            >
              {locale === "es" ? "Conversemos sobre tu carga" : "Let's talk about your cargo"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

