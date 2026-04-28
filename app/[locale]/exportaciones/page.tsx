import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";

export default async function ExportacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-16">
          <h1 className="text-4xl font-semibold tracking-tight">
            {locale === "es" ? "Exportaciones" : "Exports"}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-300">
            {locale === "es"
              ? "Acompañamos a exportadores peruanos en cada etapa del proceso, desde el packing list hasta la entrega en el puerto destino."
              : "We support Peruvian exporters at every stage, from packing list to delivery at the destination port."}
          </p>
        </div>
      </section>
      <section className="container-page py-12 max-w-3xl">
        <div className="card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {locale === "es" ? "Servicios incluidos" : "Included services"}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {(locale === "es"
              ? [
                  "Booking con líneas navieras y aerolíneas",
                  "Coordinación con depósitos temporales",
                  "Trámite documentario (DAM, BL, AWB)",
                  "Coordinación con SUNAT y SENASA",
                  "Tracking en tiempo real",
                ]
              : [
                  "Booking with carriers and airlines",
                  "Coordination with temporary depots",
                  "Documentary processing (DAM, BL, AWB)",
                  "Coordination with SUNAT and SENASA",
                  "Real-time tracking",
                ]
            ).map((b) => (
              <li key={b} className="flex items-start gap-3 text-ink-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}/contacto`} className="btn-primary mt-6 inline-flex">
            {locale === "es" ? "Solicitar cotización" : "Request a quote"}
          </Link>
        </div>
      </section>
    </div>
  );
}
