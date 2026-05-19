import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Briefcase,
  Compass,
  Headset,
  Layers,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { PageBanner } from "@/components/public/PageBanner";
import { CTAFooter } from "@/components/public/CTAFooter";

export default async function ImportacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const isEs = locale === "es";

  return (
    <div className="bg-white">
      <PageBanner
        title={isEs ? "Importaciones" : "Imports"}
        subtitle={
          isEs
            ? "Acompañamos al importador y al consolidador internacional con servicios de carga aérea y marítima durante la operación."
            : "We support importers and international consolidators with air and sea freight services throughout the operation."
        }
        backgroundImage="/importacioneshero2.webp"
        backgroundAlt={isEs ? "Importaciones IPEDEL" : "IPEDEL imports"}
      />

      {/* Sección 1 — Consolidaciones aéreas desde Asia */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {isEs ? "Servicio principal" : "Flagship service"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {isEs
                ? "Consolidaciones aéreas desde Asia"
                : "Air consolidations from Asia"}
              <span className="block h-1 w-20 bg-brand-500 mt-3" />
            </h2>
            <div className="mt-6 space-y-4 text-ink-700 leading-relaxed">
              <p>
                {isEs ? (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> es
                    Consolidador Aéreo y Marítimo, está en la capacidad de
                    desarrollar y ejecutar el conjunto de acciones necesarias
                    para prestar un servicio de calidad.
                  </>
                ) : (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> is
                    an Air and Maritime Consolidator, fully capable of
                    developing and executing every action needed to deliver a
                    quality service.
                  </>
                )}
              </p>
              <p>
                {isEs
                  ? "Siendo representantes de grandes transnacionales japonesas en Perú, contamos con gran experiencia en consolidaciones aéreas provenientes de Japón en su mayoría y de los distintos lugares del mundo."
                  : "As representatives of major Japanese multinationals in Peru, we have extensive experience consolidating air cargo, primarily from Japan and from various worldwide origins."}
              </p>
              <p>
                {isEs
                  ? "Empleamos un sistema de seguimiento donde usted estará informado desde la coordinación hasta la entrega del embarque."
                  : "We use a tracking system that keeps you informed from the coordination to the shipment delivery."}
              </p>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Plane,
                  es: "Origen Japón y resto del mundo",
                  en: "Origins from Japan and worldwide",
                },
                {
                  icon: Layers,
                  es: "Consolidación experta",
                  en: "Expert consolidation",
                },
                {
                  icon: Route,
                  es: "Trazabilidad del embarque",
                  en: "Shipment traceability",
                },
                {
                  icon: ShieldCheck,
                  es: "Custodia de documentos",
                  en: "Document custody",
                },
              ].map((b, i) => {
                const Icon = b.icon;
                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-ink-100 bg-white p-3"
                  >
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="pt-1 text-sm text-ink-800">
                      {isEs ? b.es : b.en}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
              <Image
                src="/importacionesconsolidacion2.webp"
                alt={
                  isEs
                    ? "Consolidación aérea — IPEDEL"
                    : "Air consolidation — IPEDEL"
                }
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-black">
                <Briefcase className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-semibold text-brand-900">
                  {isEs
                    ? "Especialistas Japón → Perú"
                    : "Specialists Japan → Peru"}
                </p>
                <p className="text-brand-800">
                  {isEs
                    ? "Décadas operando con representantes japoneses."
                    : "Decades operating with Japanese representatives."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2 — Agente logístico */}
      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:order-last">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
              <Image
                src="/importacionesagente2.webp"
                alt={
                  isEs
                    ? "Agente logístico — IPEDEL"
                    : "Logistics agent — IPEDEL"
                }
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {isEs ? "Quiénes somos en importaciones" : "Who we are in imports"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {isEs ? "Agente logístico" : "Logistics agent"}
              <span className="block h-1 w-20 bg-brand-500 mt-3" />
            </h2>
            <div className="mt-6 space-y-4 text-ink-700 leading-relaxed">
              <p>
                {isEs ? (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> es
                    Consolidador Aéreo y Marítimo, dedicada a la logística
                    nacional e internacional para importación, exportación y
                    tratamientos especiales.
                  </>
                ) : (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> is
                    an Air and Maritime Consolidator dedicated to national and
                    international logistics for imports, exports and specialized
                    treatments.
                  </>
                )}
              </p>
              <p>
                {isEs
                  ? "Siendo representantes de transnacionales japonesas, contamos con una red de agentes en más de 40 países."
                  : "As representatives of Japanese multinationals, we count on a network of agents in 40+ countries."}
              </p>
              <p>
                {isEs
                  ? "IPE del Perú SAC cuenta con la capacidad de adaptarse a las necesidades particulares de cada cliente para cubrir de forma individual los requerimientos de cada uno de ellos."
                  : "IPE del Perú SAC adapts to the particular needs of every client, covering each requirement individually."}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ink-200 pt-8 sm:grid-cols-4">
              <Stat value="30+" label={isEs ? "Años" : "Years"} />
              <Stat value="40+" label={isEs ? "Países" : "Countries"} />
              <Stat value="3" label={isEs ? "Aéreo · Marítimo · Terrestre" : "Air · Sea · Land"} />
              <Stat value="JP" label={isEs ? "Especialidad" : "Expertise"} />
            </div>
          </div>
        </div>
      </section>

      {/* Cómo trabajamos — proceso visual con timeline conectado.
          4 nodos sobre una línea horizontal con accent brand. Cada
          nodo es una card elaborada con icono, título, body y bullets. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-ink-50 py-20 lg:py-28">
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
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700 shadow-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {isEs ? "Nuestro proceso" : "Our process"}
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {isEs ? "Cómo trabajamos contigo" : "How we work with you"}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink-600 sm:text-lg">
              {isEs
                ? "Cuatro etapas con responsable claro en cada una — sin sorpresas."
                : "Four stages with a clear lead in each — no surprises."}
            </p>
          </div>

          {/* Timeline horizontal con línea de conexión sobre los iconos */}
          <div className="relative mt-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[8%] right-[8%] top-[36px] hidden h-px bg-gradient-to-r from-brand-300/40 via-brand-500/60 to-brand-300/40 lg:block"
            />
            <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {[
                {
                  icon: Headset,
                  title_es: "Contacto",
                  title_en: "Contact",
                  desc_es: "Conversamos sobre tu carga, ruta y plazos.",
                  desc_en: "We discuss your cargo, route and timing.",
                  bullets_es: [
                    "Análisis del requerimiento",
                    "Definición de plazos",
                    "Propuesta inicial",
                  ],
                  bullets_en: [
                    "Requirement analysis",
                    "Timeline definition",
                    "Initial proposal",
                  ],
                },
                {
                  icon: Compass,
                  title_es: "Diseño",
                  title_en: "Design",
                  desc_es: "Diseñamos la mejor combinación de modalidad y tarifa.",
                  desc_en: "We design the best combination of mode and rate.",
                  bullets_es: [
                    "Modalidad óptima",
                    "Negociación de tarifas",
                    "Cronograma detallado",
                  ],
                  bullets_en: [
                    "Optimal mode",
                    "Rate negotiation",
                    "Detailed schedule",
                  ],
                },
                {
                  icon: Layers,
                  title_es: "Operación",
                  title_en: "Operation",
                  desc_es: "Coordinamos origen, tránsito, aduana y entrega.",
                  desc_en: "We coordinate origin, transit, customs and delivery.",
                  bullets_es: [
                    "Booking con transportistas",
                    "Trámite documentario",
                    "Coordinación con aduana",
                  ],
                  bullets_en: [
                    "Booking with carriers",
                    "Documentary processing",
                    "Customs coordination",
                  ],
                },
                {
                  icon: Sparkles,
                  title_es: "Trazabilidad",
                  title_en: "Tracking",
                  desc_es: "Te mantenemos informado paso a paso hasta la entrega.",
                  desc_en: "We keep you informed every step of the way.",
                  bullets_es: [
                    "Seguimiento por HBL",
                    "Reportes durante el tránsito",
                    "Confirmación de entrega",
                  ],
                  bullets_en: [
                    "HBL tracking",
                    "Reports during transit",
                    "Delivery confirmation",
                  ],
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title_es}
                    className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10"
                  >
                    {/* Accent stripe top */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-70 transition-opacity group-hover:opacity-100"
                    />
                    {/* Icon — alineado con la línea horizontal del timeline */}
                    <span className="mt-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-lg shadow-brand-500/25 ring-4 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink-900">
                      {isEs ? step.title_es : step.title_en}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {isEs ? step.desc_es : step.desc_en}
                    </p>
                    <span
                      aria-hidden="true"
                      className="my-4 block h-px w-10 bg-gradient-to-r from-brand-500 to-transparent"
                    />
                    <ul className="space-y-1.5">
                      {(isEs ? step.bullets_es : step.bullets_en).map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-xs text-ink-700"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-0.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-2 w-2"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      <CTAFooter locale={locale as Locale} />
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-semibold tracking-tight text-ink-900">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-500">
        {label}
      </p>
    </div>
  );
}

