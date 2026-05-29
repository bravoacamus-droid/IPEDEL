import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Compass,
  Headset,
  Layers,
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
            ? "Atendemos sus operaciones de importación en modalidades aérea y marítima, apoyados por un equipo capacitado y una red global de agentes."
            : "We handle your import operations in air and sea modalities, supported by a qualified team and a global network of agents."
        }
        backgroundImage="/importacioneshero2.webp"
        backgroundAlt={isEs ? "Importaciones IPEDEL" : "IPEDEL imports"}
      />

      {/* Sección 1 — Agente de carga internacional */}
      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {isEs ? "Agente de carga internacional" : "International freight forwarder"}
              <span className="block h-1 w-20 bg-brand-500 mt-3" />
            </h2>
            <div className="mt-6 space-y-4 text-ink-700 leading-relaxed">
              <p>
                {isEs ? (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> es
                    un agente de carga con amplia experiencia en logística
                    internacional, incluyendo operaciones de importación y
                    exportación.
                  </>
                ) : (
                  <>
                    <strong className="text-ink-900">IPE del Perú SAC</strong> is
                    a freight forwarder with extensive experience in
                    international logistics, including import and export
                    operations.
                  </>
                )}
              </p>
              <p>
                {isEs
                  ? "Contamos con una red global de agentes y un equipo capacitado que nos permite brindar soluciones logísticas de calidad a nuestros clientes."
                  : "We have a global network of agents and a qualified team that allows us to provide quality logistics solutions to our clients."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-200">
                {isEs ? "Trayectoria logística" : "Logistics track record"}
              </span>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-200">
                {isEs ? "Calidad operativa" : "Operational quality"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
              <Image
                src="/importacionesconsolidacion2.webp"
                alt={
                  isEs
                    ? "Agente de carga internacional — IPE del Perú"
                    : "International freight forwarder — IPE del Perú"
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
          </div>
        </div>
      </section>

      {/* Sección 2 — Servicios logísticos */}
      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:order-last">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
              <Image
                src="/importacionesagente2.webp"
                alt={
                  isEs
                    ? "Servicios logísticos — IPE del Perú"
                    : "Logistics services — IPE del Perú"
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
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              {isEs ? "Servicios logísticos" : "Logistics services"}
              <span className="block h-1 w-20 bg-brand-500 mt-3" />
            </h2>
            <div className="mt-6 space-y-4 text-ink-700 leading-relaxed">
              <p>
                {isEs
                  ? "Con más de 30 años en el rubro, nuestra trayectoria se refleja en operaciones internacionales, incluyendo consolidaciones aéreas y marítimas."
                  : "With over 30 years in the industry, our track record is reflected in international operations, including air and sea consolidations."}
              </p>
              <p>
                {isEs
                  ? "Nuestro equipo atiende cada embarque con eficiencia y eficacia, brindando soluciones orientadas a las necesidades del cliente."
                  : "Our team handles each shipment with efficiency and efficacy, providing solutions oriented to the client's needs."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline limpio — solo titulo + bullets per PDF */}
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
          <div className="relative">
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
                  bullets_es: ["Análisis del requerimiento", "Propuesta inicial"],
                  bullets_en: ["Requirement Analysis", "Initial Proposal"],
                },
                {
                  icon: Compass,
                  title_es: "Diseño",
                  title_en: "Design",
                  bullets_es: ["Modalidad óptima", "Planificación logística"],
                  bullets_en: ["Optimal Mode", "Logistics Planning"],
                },
                {
                  icon: Layers,
                  title_es: "Operación",
                  title_en: "Operation",
                  bullets_es: ["Coordinación logística", "Trámite documentario"],
                  bullets_en: ["Logistics Coordination", "Documentation Handling"],
                },
                {
                  icon: Sparkles,
                  title_es: "Trazabilidad",
                  title_en: "Tracking",
                  bullets_es: ["Seguimiento por HBL", "Actualización de estado"],
                  bullets_en: ["HBL Tracking", "Status Updates"],
                },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.title_es}
                    className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-70 transition-opacity group-hover:opacity-100"
                    />
                    <span className="mt-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-lg shadow-brand-500/25 ring-4 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-ink-900">
                      {isEs ? step.title_es : step.title_en}
                    </h3>
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
