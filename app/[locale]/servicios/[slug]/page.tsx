import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  type LucideIcon,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Container,
  Factory,
  FileCheck,
  Gauge,
  Globe2,
  Headset,
  HomeIcon,
  Layers,
  MapPin,
  Package,
  PackageCheck,
  PackageOpen,
  Plane,
  Plug,
  Route,
  Scale,
  Ship,
  ShieldCheck,
  Sparkles,
  Truck,
  Warehouse,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PageBanner } from "@/components/public/PageBanner";
import { ImageSlot } from "@/components/public/ImageSlot";
import { CTAFooter } from "@/components/public/CTAFooter";

const SLUGS = [
  "agenciamiento-de-carga",
  "almacenamiento",
  "especializados",
  "internacional",
] as const;
type Slug = (typeof SLUGS)[number];

type Bullet = { icon: LucideIcon; es: string; en: string };

type ServiceContent = {
  eyebrow_es: string;
  eyebrow_en: string;
  title_es: string;
  title_en: string;
  subtitle_es: string;
  subtitle_en: string;
  hero_image_hint_es: string;
  hero_image_hint_en: string;
  hero_image_path: string;
  /** Si está presente, el hero usa esta imagen como fondo full-bleed
   *  con tarjeta de vidrio (sin rightSlot ImageSlot). Para servicios
   *  cuyo cliente ya entregó foto institucional. */
  hero_background?: string;
  intro_es: string[];
  intro_en: string[];
  bullets_title_es: string;
  bullets_title_en: string;
  bullets: Bullet[];
  side_image_hint_es: string;
  side_image_hint_en: string;
  side_image_path: string;
  /** Si es una ruta a un archivo real (no un placeholder /services/...),
   *  la sección "El servicio comprende" usa esta imagen en lugar del
   *  ImageSlot. */
  side_image_real?: string;
  highlights_title_es: string;
  highlights_title_en: string;
  highlights: {
    icon: LucideIcon;
    title_es: string;
    title_en: string;
    desc_es: string;
    desc_en: string;
    bullets_es: string[];
    bullets_en: string[];
  }[];
};

const CONTENT: Record<Slug, ServiceContent> = {
  "agenciamiento-de-carga": {
    eyebrow_es: "Servicios IPEDEL",
    eyebrow_en: "IPEDEL Services",
    title_es: "Agenciamiento de carga",
    title_en: "Freight forwarding",
    subtitle_es:
      "Soluciones a la medida en transporte aéreo, marítimo, terrestre y multimodal — para cualquier término de compra-venta internacional.",
    subtitle_en:
      "Tailored solutions in air, sea, land and multimodal transport — for any international purchase or sale term.",
    hero_image_hint_es: "Carga aérea / contenedores marítimos — vista institucional",
    hero_image_hint_en: "Air cargo / maritime containers — institutional view",
    hero_image_path: "/services/agenciamiento-hero.jpg",
    hero_background: "/Herocarga.webp",
    intro_es: [
      "Brindamos la mejor asesoría del mercado para reducir sus costos y elegir el medio adecuado de transporte para su mercadería.",
      "Garantizamos un control efectivo y constante información de su carga, a través de nuestras alianzas y red de agentes especializados a nivel mundial.",
    ],
    intro_en: [
      "We offer the best advisory in the market to reduce your costs and choose the right transport mode for your cargo.",
      "We guarantee effective control and constant information about your shipment through our alliances and worldwide network of specialized agents.",
    ],
    bullets_title_es: "El servicio comprende",
    bullets_title_en: "The service includes",
    bullets: [
      {
        icon: Plane,
        es: "Transporte internacional aéreo, marítimo (FCL y LCL), terrestre y multimodal",
        en: "International air, sea (FCL and LCL), land and multimodal transport",
      },
      {
        icon: Layers,
        es: "Consolidación y desconsolidación de carga de exportación e importación",
        en: "Consolidation and deconsolidation of export and import cargo",
      },
      {
        icon: Globe2,
        es: "Importación y exportación desde y hacia todo el mundo",
        en: "Imports and exports from and to anywhere in the world",
      },
      {
        icon: Factory,
        es: "Carga de proyecto",
        en: "Project cargo",
      },
      {
        icon: HomeIcon,
        es: "Servicio internacional Door to Door",
        en: "International Door to Door service",
      },
      {
        icon: Headset,
        es: "Asesoramiento y servicio para exportación e importación",
        en: "Advisory and service for export and import",
      },
      {
        icon: FileCheck,
        es: "Asesoramiento y seguimiento de la documentación",
        en: "Advisory and tracking of documentation",
      },
    ],
    side_image_hint_es: "Operación logística (carga aérea o marítima)",
    side_image_hint_en: "Logistics operation (air or sea cargo)",
    side_image_path: "/services/agenciamiento-side.jpg",
    side_image_real: "/serviciocomprende.webp",
    highlights_title_es: "Por qué IPEDEL",
    highlights_title_en: "Why IPEDEL",
    highlights: [
      {
        icon: ShieldCheck,
        title_es: "Cobertura global",
        title_en: "Global coverage",
        desc_es: "Red de agentes especializados en más de 40 países.",
        desc_en: "Specialized agent network across 40+ countries.",
        bullets_es: [
          "+40 países con agentes acreditados",
          "Alianzas con líneas aéreas y navieras",
          "Operación coordinada por nuestro equipo",
        ],
        bullets_en: [
          "40+ countries with accredited agents",
          "Partnerships with airlines and shipping lines",
          "Operation coordinated by our team",
        ],
      },
      {
        icon: Gauge,
        title_es: "Mejor relación costo-tiempo",
        title_en: "Best cost-time ratio",
        desc_es: "Asesoría experta para optimizar la modalidad de transporte.",
        desc_en: "Expert advisory to optimize transport modality.",
        bullets_es: [
          "Multimodal según destino y plazo",
          "Negociación directa de tarifas",
          "Optimización de rutas y conexiones",
        ],
        bullets_en: [
          "Multimodal per destination and timeline",
          "Direct rate negotiation",
          "Route and connection optimization",
        ],
      },
      {
        icon: Route,
        title_es: "Trazabilidad punto a punto",
        title_en: "End-to-end traceability",
        desc_es: "Información permanente desde origen hasta destino.",
        desc_en: "Continuous information from origin to destination.",
        bullets_es: [
          "Sistema de seguimiento por HBL",
          "Reportes periódicos durante el tránsito",
          "Comunicación 24/7 con tu ejecutivo",
        ],
        bullets_en: [
          "HBL-based tracking system",
          "Periodic reports during transit",
          "24/7 communication with your account manager",
        ],
      },
    ],
  },

  almacenamiento: {
    eyebrow_es: "Servicios IPEDEL",
    eyebrow_en: "IPEDEL Services",
    title_es: "Servicio de almacenamiento",
    title_en: "Warehousing service",
    subtitle_es:
      "Capacidad para desarrollar y ejecutar el servicio de almacenamiento prestando un servicio impecable, con áreas exclusivas y compartidas adaptadas a cada cliente.",
    subtitle_en:
      "Capability to develop and execute warehousing service flawlessly, with exclusive and shared areas adapted to each client.",
    hero_image_hint_es: "Almacén / racks / contenedores en bodega",
    hero_image_hint_en: "Warehouse / racks / containers indoors",
    hero_image_path: "/services/almacenamiento-hero.jpg",
    intro_es: [
      "IPE del Perú SAC está en la capacidad de desarrollar y ejecutar el servicio de almacenamiento prestando un servicio impecable.",
      "Empleamos un sistema de seguimiento donde usted estará informado de manera permanente desde el primer contacto con el proveedor en origen hasta la llegada de la mercancía y los almacenamientos en general.",
    ],
    intro_en: [
      "IPE del Perú SAC is fully capable of developing and executing flawless warehousing operations.",
      "We use a tracking system that keeps you continuously informed from the first contact with the supplier at origin through cargo arrival and storage.",
    ],
    bullets_title_es: "Lo que incluye",
    bullets_title_en: "What's included",
    bullets: [
      {
        icon: Warehouse,
        es: "Áreas exclusivas y compartidas",
        en: "Exclusive and shared areas",
      },
      {
        icon: Boxes,
        es: "Áreas que se ajustan a los requerimientos de los clientes",
        en: "Areas tailored to client requirements",
      },
      {
        icon: PackageCheck,
        es: "Adecuado manejo de productos controlados",
        en: "Proper handling of controlled products",
      },
      {
        icon: ClipboardCheck,
        es: "Trazabilidad e informes permanentes de inventario",
        en: "Traceability and continuous inventory reports",
      },
      {
        icon: ShieldCheck,
        es: "Custodia y seguridad de la mercadería en bodega",
        en: "Custody and safekeeping in warehouse",
      },
    ],
    side_image_hint_es: "Vista interna del almacén — IPEDEL",
    side_image_hint_en: "Interior warehouse view — IPEDEL",
    side_image_path: "/services/almacenamiento-side.jpg",
    highlights_title_es: "Beneficios",
    highlights_title_en: "Benefits",
    highlights: [
      {
        icon: Sparkles,
        title_es: "Áreas a medida",
        title_en: "Custom areas",
        desc_es: "Espacios diseñados según el volumen y la rotación de su carga.",
        desc_en: "Spaces designed according to your cargo volume and turnover.",
        bullets_es: [
          "Espacios escalables según necesidad",
          "Diseño según volumen y rotación",
          "Layout optimizado por tipo de producto",
        ],
        bullets_en: [
          "Scalable spaces per need",
          "Layout designed by volume and turnover",
          "Optimized layout per product type",
        ],
      },
      {
        icon: ShieldCheck,
        title_es: "Productos controlados",
        title_en: "Controlled products",
        desc_es: "Manejo apropiado para mercaderías que requieren autorizaciones.",
        desc_en: "Proper handling for goods that need permits.",
        bullets_es: [
          "Permisos vigentes con autoridades",
          "Personal capacitado para manipulación",
          "Custodia documentada con trazabilidad",
        ],
        bullets_en: [
          "Up-to-date permits with authorities",
          "Staff trained for handling",
          "Documented custody with traceability",
        ],
      },
      {
        icon: Plug,
        title_es: "Seguimiento permanente",
        title_en: "Continuous tracking",
        desc_es: "Información en tiempo real del estado de su mercadería.",
        desc_en: "Real-time information about your cargo status.",
        bullets_es: [
          "Inventario en tiempo real",
          "Reportes mensuales detallados",
          "Tu ejecutivo de cuenta a un click",
        ],
        bullets_en: [
          "Real-time inventory",
          "Detailed monthly reports",
          "Your account executive one click away",
        ],
      },
    ],
  },

  especializados: {
    eyebrow_es: "Servicios IPEDEL",
    eyebrow_en: "IPEDEL Services",
    title_es: "Operadores logísticos especializados",
    title_en: "Specialized logistics operators",
    subtitle_es:
      "Capacidad para desarrollar y ejecutar el conjunto de acciones necesarias para prestar un servicio impecable, con desaduanaje y manejo de cargas especiales.",
    subtitle_en:
      "We develop and execute every action needed to deliver impeccable service — including customs clearance and special cargo handling.",
    hero_image_hint_es: "Desaduanaje / SUNAT / cargas especializadas",
    hero_image_hint_en: "Customs clearance / specialized cargo",
    hero_image_path: "/services/especializados-hero.jpg",
    intro_es: [
      "IPE del Perú SAC está en la capacidad de desarrollar y ejecutar el conjunto de acciones necesarias para prestar un servicio impecable.",
      "Siendo representantes de grandes transnacionales japonesas en Perú, contamos con gran experiencia en consolidaciones aéreas de los distintos lugares del mundo.",
      "Empleamos un sistema de seguimiento donde usted estará informado de manera permanente desde el primer contacto con el proveedor en origen hasta la llegada de la mercancía y la entrega de documentos.",
    ],
    intro_en: [
      "IPE del Perú SAC is fully capable of developing and executing the actions needed to deliver impeccable service.",
      "As representatives of major Japanese multinationals in Peru, we have extensive experience consolidating air cargo from around the world.",
      "We use a tracking system that keeps you informed continuously — from the first supplier contact at origin through document delivery.",
    ],
    bullets_title_es: "El servicio incluye",
    bullets_title_en: "The service includes",
    bullets: [
      {
        icon: FileCheck,
        es: "Desaduanaje para cargas en general, orientándolo en la presentación de los requisitos según embarque",
        en: "Customs clearance for general cargo, guidance on the requirements per shipment",
      },
      {
        icon: Scale,
        es: "Personal con profundo conocimiento en legislación aduanera y altamente calificado",
        en: "Staff with deep expertise in customs legislation",
      },
      {
        icon: Globe2,
        es: "Socios estratégicos en los países de origen para atender encomiendas con seguridad",
        en: "Strategic partners at origin countries to handle assignments securely",
      },
      {
        icon: Gauge,
        es: "Eficiencia y eficacia para agilizar la salida de su mercadería",
        en: "Efficiency and effectiveness to speed up cargo release",
      },
      {
        icon: Plane,
        es: "Consolidaciones aéreas desde Japón y otros mercados estratégicos",
        en: "Air consolidations from Japan and other strategic markets",
      },
    ],
    side_image_hint_es: "Operador logístico — desaduanaje en SUNAT",
    side_image_hint_en: "Logistics operator — SUNAT customs clearance",
    side_image_path: "/services/especializados-side.jpg",
    highlights_title_es: "Diferenciadores",
    highlights_title_en: "Differentiators",
    highlights: [
      {
        icon: ShieldCheck,
        title_es: "Seguridad y eficiencia",
        title_en: "Security and efficiency",
        desc_es: "Procesos auditados que aseguran cada paso de la operación.",
        desc_en: "Audited processes that secure every step of the operation.",
        bullets_es: [
          "Procesos auditados internamente",
          "Personal certificado y capacitado",
          "Estándares internacionales aplicados",
        ],
        bullets_en: [
          "Internally audited processes",
          "Certified and trained staff",
          "International standards applied",
        ],
      },
      {
        icon: Headset,
        title_es: "Asesoría especializada",
        title_en: "Specialized advisory",
        desc_es: "Equipo experto en regulación aduanera peruana.",
        desc_en: "Team expert in Peruvian customs regulation.",
        bullets_es: [
          "Conocimiento profundo de aduanas",
          "Documentación al día",
          "Resolución rápida de incidencias",
        ],
        bullets_en: [
          "Deep customs knowledge",
          "Up-to-date documentation",
          "Quick incident resolution",
        ],
      },
      {
        icon: Globe2,
        title_es: "Red Japón–Perú",
        title_en: "Japan–Peru network",
        desc_es: "Experiencia comprobada en operaciones con representantes japoneses.",
        desc_en: "Proven experience operating with Japanese representatives.",
        bullets_es: [
          "Representantes oficiales de transnacionales",
          "Décadas de experiencia operando",
          "Coordinación bilingüe",
        ],
        bullets_en: [
          "Official representatives of multinationals",
          "Decades of operating experience",
          "Bilingual coordination",
        ],
      },
    ],
  },

  internacional: {
    eyebrow_es: "Servicios IPEDEL",
    eyebrow_en: "IPEDEL Services",
    title_es: "Mudanzas internacionales",
    title_en: "International moving",
    subtitle_es:
      "Una gran experiencia a nivel internacional, de la mano con los más acreditados agentes en el extranjero, para un servicio de mudanzas internacionales con niveles de competitividad y excelencia globales.",
    subtitle_en:
      "Extensive international experience hand-in-hand with the most accredited overseas agents — international moving with worldwide competitiveness and excellence.",
    hero_image_hint_es: "Embalaje y mudanza internacional — caja, camión, vivienda",
    hero_image_hint_en: "International moving — packing, truck, home",
    hero_image_path: "/services/internacional-hero.jpg",
    intro_es: [
      "Todo se inicia con la visita personal de un ejecutivo de nuestra empresa, que realizará un estimado del volumen y peso del embarque, los materiales de embalaje necesarios y los requerimientos específicos de los muebles y objetos más delicados que precisen un trato especial.",
      "La visita no culminará hasta que el cliente absuelva todas sus inquietudes y solicitudes.",
      "Una vez reunida toda la información pertinente, le presentaremos un presupuesto detallado que contemplará todos los requerimientos para el traslado marítimo, aéreo o terrestre de sus pertenencias. Asimismo, recibirá un informe detallado de los procedimientos necesarios para asegurar el mejor servicio.",
    ],
    intro_en: [
      "Everything begins with a personal visit from one of our executives, who will estimate the volume and weight of the shipment, the required packing materials and the specific requirements of the most delicate furniture and items.",
      "The visit will not end until the client has had every concern and request resolved.",
      "Once all relevant information is gathered, we present a detailed quote covering every requirement for sea, air or land relocation. You will also receive a detailed report of the procedures needed to ensure the best service.",
    ],
    bullets_title_es: "Tipos de servicios",
    bullets_title_en: "Service types",
    bullets: [
      {
        icon: Container,
        es: "Door to Port — desde su domicilio en el país de origen hasta el puerto de destino",
        en: "Door to Port — from your home in the origin country to the destination port",
      },
      {
        icon: HomeIcon,
        es: "Door to Door — desde su domicilio en el país de origen hasta su nueva dirección",
        en: "Door to Door — from your home in the origin country to your new address",
      },
      {
        icon: PackageOpen,
        es: "Room to Room — embalaje y envío en origen, desembalaje y acomodo de sus pertenencias en destino",
        en: "Room to Room — packing at origin, unpacking and arrangement at destination",
      },
    ],
    side_image_hint_es: "Mudanza — embalaje profesional / contenedor",
    side_image_hint_en: "Moving — professional packing / container",
    side_image_path: "/services/internacional-side.jpg",
    highlights_title_es: "Lo que aseguramos",
    highlights_title_en: "What we guarantee",
    highlights: [
      {
        icon: Package,
        title_es: "Embalaje profesional",
        title_en: "Professional packing",
        desc_es: "Materiales y procedimientos certificados para piezas delicadas.",
        desc_en: "Certified materials and procedures for delicate pieces.",
        bullets_es: [
          "Materiales certificados",
          "Empaque por categoría de pieza",
          "Custodia de objetos delicados",
        ],
        bullets_en: [
          "Certified materials",
          "Packing per item category",
          "Delicate items custody",
        ],
      },
      {
        icon: ShieldCheck,
        title_es: "Asesoría aduanera",
        title_en: "Customs advisory",
        desc_es: "Procedimientos claros para una llegada sin sorpresas.",
        desc_en: "Clear procedures for a hassle-free arrival.",
        bullets_es: [
          "Documentación origen-destino",
          "Permisos especiales si aplica",
          "Seguros de carga opcionales",
        ],
        bullets_en: [
          "Origin–destination documentation",
          "Special permits if needed",
          "Optional cargo insurance",
        ],
      },
      {
        icon: MapPin,
        title_es: "Acompañamiento en destino",
        title_en: "On-site support at destination",
        desc_es: "Coordinación con agentes acreditados en el extranjero.",
        desc_en: "Coordination with accredited agents overseas.",
        bullets_es: [
          "Agente local certificado",
          "Coordinación en idioma local",
          "Reporte fotográfico de entrega",
        ],
        bullets_en: [
          "Certified local agent",
          "Coordination in local language",
          "Photo delivery report",
        ],
      },
    ],
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
  const c = CONTENT[slug as Slug];
  const isEs = locale === "es";

  return (
    <div className="bg-white">
      {c.hero_background ? (
        // Hero con foto de fondo y tarjeta de vidrio — copy limpio sin
        // eyebrow ni breadcrumb redundante (igual que en /nosotros).
        // backgroundPosition='center top' encuadra arriba para mostrar
        // el avión cargo + logo IPEDEL en la parte alta de la foto.
        <PageBanner
          title={isEs ? c.title_es : c.title_en}
          subtitle={isEs ? c.subtitle_es : c.subtitle_en}
          backgroundImage={c.hero_background}
          backgroundAlt={isEs ? c.title_es : c.title_en}
          backgroundPosition="center top"
        />
      ) : (
        <PageBanner
          eyebrow={isEs ? c.eyebrow_es : c.eyebrow_en}
          title={isEs ? c.title_es : c.title_en}
          subtitle={isEs ? c.subtitle_es : c.subtitle_en}
          breadcrumb={[
            { href: `/${locale}`, label: isEs ? "Inicio" : "Home" },
            { href: `/${locale}/servicios`, label: isEs ? "Servicios" : "Services" },
            { href: `/${locale}/servicios/${slug}`, label: isEs ? c.title_es : c.title_en },
          ]}
          rightSlot={
            <ImageSlot
              hint={isEs ? c.hero_image_hint_es : c.hero_image_hint_en}
              suggested={c.hero_image_path}
              ratio="aspect-[4/3]"
              priority
            />
          }
        />
      )}

      {/* Intro */}
      <section className="container-page py-16 lg:py-24">
        <div className="mx-auto max-w-3xl space-y-5 text-lg leading-relaxed text-ink-700">
          {(isEs ? c.intro_es : c.intro_en).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Bullets + side image */}
      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:order-last">
            {c.side_image_real ? (
              <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5">
                <Image
                  src={c.side_image_real}
                  alt={isEs ? c.side_image_hint_es : c.side_image_hint_en}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </div>
            ) : (
              <ImageSlot
                hint={isEs ? c.side_image_hint_es : c.side_image_hint_en}
                suggested={c.side_image_path}
                ratio="aspect-[4/5]"
              />
            )}
          </div>
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {isEs ? "Alcance del servicio" : "Service scope"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {isEs ? c.bullets_title_es : c.bullets_title_en}
            </h2>
            <ul className="mt-8 space-y-4">
              {c.bullets.map((b, i) => {
                const Icon = b.icon;
                return (
                  <li key={i} className="group flex items-start gap-4 rounded-xl border border-transparent bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 group-hover:bg-brand-500 group-hover:text-black">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <p className="pt-1 text-ink-800">{isEs ? b.es : b.en}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Highlights — sección "diferenciadores" rediseñada estilo
          editorial: cards con accent stripe, header horizontal con
          icono+título, body destacado, divider y bullets con check
          icons brand. Sección con patrón sutil de fondo. */}
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
              {isEs ? "Diferenciadores" : "Differentiators"}
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              {isEs ? c.highlights_title_es : c.highlights_title_en}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-ink-600 sm:text-lg">
              {isEs
                ? "Tres pilares concretos que sostienen cada operación, no eslóganes."
                : "Three concrete pillars that hold every operation, not slogans."}
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-8">
            {c.highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <article
                  key={i}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 sm:p-8"
                >
                  {/* Accent stripe top */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  {/* Decorative blob */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-brand-100/60 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Header: icon + title side by side */}
                  <div className="relative flex items-start gap-4">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-black shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <h3 className="pt-1 text-xl font-semibold leading-tight text-ink-900">
                      {isEs ? h.title_es : h.title_en}
                    </h3>
                  </div>

                  {/* Body */}
                  <p className="relative mt-5 text-[15px] leading-relaxed text-ink-700">
                    {isEs ? h.desc_es : h.desc_en}
                  </p>

                  {/* Divider con accent gradient */}
                  <span
                    aria-hidden="true"
                    className="relative my-6 block h-px w-12 bg-gradient-to-r from-brand-500 to-transparent"
                  />

                  {/* Bullets con check brand */}
                  <ul className="relative space-y-2.5">
                    {(isEs ? h.bullets_es : h.bullets_en).map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm text-ink-700"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-2.5 w-2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CTAFooter locale={locale as Locale} />
    </div>
  );
}
