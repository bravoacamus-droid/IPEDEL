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
            ? "Más de 30 años conectando al Perú con el mundo."
            : "Over 30 years connecting Peru and the world."
        }
        backgroundImage="/heronosotros2.webp"
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
                es un agente de carga con más de 30 años de experiencia en
                logística internacional, representante de transnacionales
                japonesas, con una red de agentes en{" "}
                <strong>más de 40 países</strong>.
              </p>
            ) : (
              <p className="text-lg leading-relaxed">
                <span className="font-semibold text-ink-900">
                  IPE del Perú SAC
                </span>{" "}
                is a freight forwarder with over 30 years of experience in
                international logistics, representative of Japanese
                multinationals, with a network of agents in more than{" "}
                <strong>40 countries</strong>.
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-ink-100 pt-8 sm:grid-cols-3">
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
              src="/team2.webp"
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

      {/* Misión / Visión / Valores — sección corporativa premium */}
      <section className="relative overflow-hidden bg-gradient-to-b from-ink-50 to-white py-20 lg:py-28">
        {/* Patrón sutil de fondo para textura corporativa */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0a0a0a 1px, transparent 1px), linear-gradient(to bottom, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container-page relative">
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            <Pillar
              icon={<Target className="h-5 w-5" strokeWidth={1.6} />}
              label={locale === "es" ? "Misión" : "Mission"}
              title={
                locale === "es"
                  ? "Logística a medida"
                  : "Tailored Logistics"
              }
              body={
                locale === "es"
                  ? "Brindar soluciones logísticas internacionales a la medida de cada operación."
                  : "To provide international logistics solutions tailored to each operation."
              }
              bullets={
                locale === "es"
                  ? [
                      "Calidad operativa",
                      "Coordinación logística",
                      "Conexión internacional",
                    ]
                  : [
                      "Operational quality",
                      "Logistics coordination",
                      "International connection",
                    ]
              }
              delay={0}
            />
            <Pillar
              icon={<Compass className="h-5 w-5" strokeWidth={1.6} />}
              label={locale === "es" ? "Visión" : "Vision"}
              title={
                locale === "es"
                  ? "Trayectoria global"
                  : "Global Trajectory"
              }
              body={
                locale === "es"
                  ? "Ser el agente de carga referente por trayectoria y red global."
                  : "Be the reference freight forwarder by track record and global network."
              }
              bullets={
                locale === "es"
                  ? [
                      "Red de agentes",
                      "Cobertura global",
                      "Experiencia internacional",
                    ]
                  : [
                      "Agent Network",
                      "Global coverage",
                      "International Experience",
                    ]
              }
              delay={0.1}
            />
            <Pillar
              icon={<Sparkles className="h-5 w-5" strokeWidth={1.6} />}
              label={locale === "es" ? "Valores" : "Values"}
              title={
                locale === "es"
                  ? "Principios operativos"
                  : "Operational Principles"
              }
              body={
                locale === "es"
                  ? "Principios que guían las decisiones y acciones de nuestro equipo."
                  : "Principles that guide the decisions and actions of our team."
              }
              tags={
                locale === "es"
                  ? [
                      "Eficiencia",
                      "Calidad operativa",
                      "Adaptabilidad",
                      "Compromiso",
                    ]
                  : [
                      "Efficiency",
                      "Operational quality",
                      "Adaptability",
                      "Commitment",
                    ]
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
              src="/capacidad.webp"
              alt={
                locale === "es"
                  ? "Capacidad operativa IPE del Perú"
                  : "IPE del Perú operational capacity"
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
                    ? "Ejecutivo asignado"
                    : "Assigned executive"
                }
                desc={
                  locale === "es"
                    ? "Cada cliente cuenta con un ejecutivo asignado para atender sus embarques."
                    : "Each client has an assigned executive to support their shipments."
                }
              />
              <Diff
                icon={<Globe2 className="h-5 w-5" strokeWidth={1.6} />}
                delay={0.08}
                title={
                  locale === "es"
                    ? "Red global de agentes"
                    : "Global agent network"
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
                    ? "Equipo calificado"
                    : "Qualified team"
                }
                desc={
                  locale === "es"
                    ? "Profesionales con conocimiento en legislación aduanera y operaciones internacionales."
                    : "Professionals with knowledge in customs legislation and international operations."
                }
              />
              <Diff
                icon={<Anchor className="h-5 w-5" strokeWidth={1.6} />}
                delay={0.24}
                title={
                  locale === "es"
                    ? "Seguimiento del embarque"
                    : "Shipment tracking"
                }
                desc={
                  locale === "es"
                    ? "Seguimiento desde la coordinación hasta la entrega del embarque."
                    : "Tracking from coordination to shipment delivery."
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

