import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

const SLUGS = [
  "agenciamiento-de-carga",
  "almacenamiento",
  "especializados",
  "internacional",
] as const;
type Slug = (typeof SLUGS)[number];

const CONTENT: Record<Slug, { es: { title: string; intro: string; bullets: string[] }; en: { title: string; intro: string; bullets: string[] } }> = {
  "agenciamiento-de-carga": {
    es: {
      title: "Agenciamiento de carga internacional",
      intro: "Servicio integral de gestión y movimiento de carga internacional con cobertura aérea, marítima, terrestre y multimodal.",
      bullets: [
        "Carga aérea consolidada y express",
        "FCL y LCL desde Asia, Europa y América",
        "Transporte terrestre nacional y CAN",
        "Multimodal y Door to Door",
        "Coordinación con líneas navieras y aerolíneas",
      ],
    },
    en: {
      title: "International freight forwarding",
      intro: "End-to-end management and movement of international cargo with air, sea, land and multimodal coverage.",
      bullets: [
        "Air consolidated and express",
        "FCL and LCL from Asia, Europe and Americas",
        "Land transport in Peru and CAN",
        "Multimodal and Door to Door",
        "Coordination with carriers and airlines",
      ],
    },
  },
  almacenamiento: {
    es: {
      title: "Almacenamiento y bodegaje",
      intro: "Servicios de almacenamiento, custodia y manejo de mercadería en almacenes propios y aliados en Lima y Callao.",
      bullets: [
        "Almacén general y aduanero",
        "Picking & packing",
        "Inventario digital y reportería",
        "Cargas peligrosas (con habilitación)",
      ],
    },
    en: {
      title: "Warehousing and storage",
      intro: "Storage, custody and handling services in our own and partner warehouses in Lima and Callao.",
      bullets: [
        "General and bonded warehouse",
        "Picking & packing",
        "Digital inventory and reporting",
        "Dangerous goods (with permit)",
      ],
    },
  },
  especializados: {
    es: {
      title: "Servicios especializados",
      intro: "Operación logística para cargas que requieren manejo especial, autorizaciones y experiencia.",
      bullets: [
        "Maquinaria pesada y sobredimensionada",
        "Perecederos con cadena de frío",
        "Cargas peligrosas (IMDG / IATA-DGR)",
        "Desaduanaje y trámites SUNAT",
      ],
    },
    en: {
      title: "Specialized services",
      intro: "Logistics operation for cargo that needs special handling, permits and expertise.",
      bullets: [
        "Heavy and oversized machinery",
        "Perishables with cold chain",
        "Dangerous goods (IMDG / IATA-DGR)",
        "Customs clearance and SUNAT filings",
      ],
    },
  },
  internacional: {
    es: {
      title: "Mudanzas internacionales",
      intro: "Modalidades flexibles para reubicación de hogares y oficinas con embalaje profesional, seguros y asesoría aduanera.",
      bullets: [
        "Door to Port — entrega en puerto destino",
        "Door to Door — entrega en domicilio",
        "Room to Room — embalaje, traslado y desembalaje",
        "Embalaje profesional certificado",
      ],
    },
    en: {
      title: "International moving",
      intro: "Flexible options for home and office relocation with professional packing, insurance and customs advisory.",
      bullets: [
        "Door to Port — delivery at destination port",
        "Door to Door — delivery at address",
        "Room to Room — packing, transport, unpacking",
        "Certified professional packing",
      ],
    },
  },
};

export function generateStaticParams() {
  return SLUGS.flatMap((slug) =>
    ["es", "en"].map((locale) => ({ locale, slug })),
  );
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (!(SLUGS as readonly string[]).includes(slug)) notFound();
  const dict = await getDictionary(locale);
  const content = CONTENT[slug as Slug][locale];

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page py-16">
          <Link
            href={`/${locale}/servicios`}
            className="inline-flex items-center gap-1 text-sm text-ink-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {locale === "es" ? "Servicios" : "Services"}
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{content.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-300">{content.intro}</p>
        </div>
      </section>
      <section className="container-page py-12 max-w-3xl">
        <div className="card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {locale === "es" ? "¿Qué incluye?" : "What's included?"}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {content.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/contacto`}
            className="btn-primary mt-6 inline-flex"
          >
            {dict.home.hero_cta_contact}
          </Link>
        </div>
      </section>
    </div>
  );
}
