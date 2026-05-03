import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Compass,
  Headset,
  Layers,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageBanner } from "@/components/public/PageBanner";
import { ImageSlot } from "@/components/public/ImageSlot";

export default async function ImportacionesPage({
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
        eyebrow={isEs ? "IPE del Perú" : "IPE del Perú"}
        title={isEs ? "Importaciones" : "Imports"}
        subtitle={
          isEs
            ? "Acompañamos al importador y al consolidador internacional con servicios de carga aérea y marítima durante la operación."
            : "We support importers and international consolidators with air and sea freight services throughout the operation."
        }
        breadcrumb={[
          { href: `/${locale}`, label: isEs ? "Inicio" : "Home" },
          { href: `/${locale}/importaciones`, label: isEs ? "Importaciones" : "Imports" },
        ]}
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
            <ImageSlot
              hint={
                isEs
                  ? "Avión carguero · contenedores · acreditación IATA"
                  : "Cargo plane · containers · IATA accreditation"
              }
              suggested="/imports/consolidaciones-asia.jpg"
              ratio="aspect-[4/5]"
              priority
            />
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
            <ImageSlot
              hint={
                isEs
                  ? "Operación logística — agentes / vehículos / IPEDEL"
                  : "Logistics operation — agents / vehicles / IPEDEL"
              }
              suggested="/imports/agente-logistico.jpg"
              ratio="aspect-[4/5]"
            />
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

      {/* Cómo trabajamos */}
      <section className="container-page py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            {isEs ? "Nuestro proceso" : "Our process"}
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {isEs ? "Cómo trabajamos contigo" : "How we work with you"}
          </h2>
          <p className="mt-3 text-ink-600">
            {isEs
              ? "Cuatro pasos simples — un solo equipo cuidando cada detalle de tu carga."
              : "Four simple steps — one team taking care of every detail of your shipment."}
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Step
            icon={Headset}
            title={isEs ? "Contacto" : "Contact"}
            desc={
              isEs
                ? "Conversamos sobre tu carga, ruta y plazos."
                : "We discuss your cargo, route and timing."
            }
          />
          <Step
            icon={Compass}
            title={isEs ? "Diseño" : "Design"}
            desc={
              isEs
                ? "Diseñamos la mejor combinación de modalidad y tarifa."
                : "We design the best combination of mode and rate."
            }
          />
          <Step
            icon={Layers}
            title={isEs ? "Operación" : "Operation"}
            desc={
              isEs
                ? "Coordinamos origen, tránsito, aduana y entrega."
                : "We coordinate origin, transit, customs and delivery."
            }
          />
          <Step
            icon={Sparkles}
            title={isEs ? "Trazabilidad" : "Tracking"}
            desc={
              isEs
                ? "Te mantenemos informado paso a paso hasta la entrega."
                : "We keep you informed every step of the way."
            }
          />
        </ol>
      </section>

      {/* CTA */}
      <section className="bg-brand-500 py-16">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-2xl font-semibold tracking-tight text-black sm:text-3xl">
            {isEs ? "Importa con IPE del Perú" : "Import with IPE del Perú"}
          </h2>
          <div className="flex gap-3">
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-ink-800"
            >
              {dict.home.hero_cta_contact}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+5113045520"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-ink-100"
            >
              +511 304-5520
            </a>
          </div>
        </div>
      </section>
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

function Step({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Compass;
  title: string;
  desc: string;
}) {
  return (
    <li className="card relative p-6">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-black">
        <Icon className="h-5 w-5" strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-600">{desc}</p>
    </li>
  );
}
