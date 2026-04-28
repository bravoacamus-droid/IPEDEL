import { notFound } from "next/navigation";
import Link from "next/link";
import { Plane, Ship, Truck, Boxes, Package, Globe2, ArrowRight } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function ServiciosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const services = [
    {
      icon: Plane,
      title: locale === "es" ? "Carga aérea" : "Air freight",
      desc:
        locale === "es"
          ? "Servicio aéreo express y consolidado con cobertura global en 24-72 horas."
          : "Express and consolidated air service with global coverage in 24–72 hours.",
      slug: "agenciamiento-de-carga",
    },
    {
      icon: Ship,
      title: locale === "es" ? "Carga marítima" : "Sea freight",
      desc:
        locale === "es"
          ? "FCL/LCL desde los principales puertos del mundo hacia Callao y Paita."
          : "FCL/LCL from major world ports to Callao and Paita.",
      slug: "agenciamiento-de-carga",
    },
    {
      icon: Truck,
      title: locale === "es" ? "Transporte terrestre" : "Land transport",
      desc:
        locale === "es"
          ? "Distribución nacional y conexiones con países vecinos vía CAN."
          : "Domestic distribution and CAN cross-border connections.",
      slug: "agenciamiento-de-carga",
    },
    {
      icon: Boxes,
      title: locale === "es" ? "Almacenamiento" : "Warehousing",
      desc:
        locale === "es"
          ? "Bodegaje, picking, packing y custodia en almacenes en Lima y Callao."
          : "Storage, picking, packing and custody in Lima and Callao warehouses.",
      slug: "almacenamiento",
    },
    {
      icon: Package,
      title: locale === "es" ? "Cargas especializadas" : "Specialized cargo",
      desc:
        locale === "es"
          ? "Maquinaria pesada, sobredimensionada, perecederos y carga peligrosa."
          : "Heavy machinery, oversized, perishables and dangerous goods.",
      slug: "especializados",
    },
    {
      icon: Globe2,
      title: locale === "es" ? "Mudanzas internacionales" : "International moving",
      desc:
        locale === "es"
          ? "Door to Port, Door to Door y Room to Room con embalaje profesional."
          : "Door to Port, Door to Door and Room to Room with professional packing.",
      slug: "internacional",
    },
  ];

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-16">
          <h1 className="text-4xl font-semibold tracking-tight">{dict.home.services_title}</h1>
          <p className="mt-3 max-w-2xl text-ink-300">{dict.home.services_subtitle}</p>
        </div>
      </section>
      <section className="container-page py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.title}
              href={`/${locale}/servicios/${s.slug}`}
              className="card p-6 hover:shadow-md transition-shadow group"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-black">
                <s.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold text-ink-900">{s.title}</h2>
              <p className="mt-2 text-sm text-ink-600">{s.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
                {locale === "es" ? "Ver más" : "Learn more"} <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
