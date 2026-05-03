import { notFound } from "next/navigation";
import Link from "next/link";
import { Plane, Ship, Truck, Package, MapPin, Calendar, Clock, ArrowRight } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import { SHIPMENT_STATUS_LABELS, type Shipment, type ShipmentEvent } from "@/lib/types/database";
import { HBLTracker } from "@/components/public/HBLTracker";
import { formatDate, formatDateTime } from "@/lib/utils";

export default async function TrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ hbl?: string }>;
}) {
  const { locale } = await params;
  const { hbl } = await searchParams;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const supabase = await createClient();
  let shipment: Shipment | null = null;
  let events: ShipmentEvent[] = [];
  let searched = false;

  if (hbl) {
    searched = true;
    const { data } = await supabase
      .from("shipments")
      .select("*")
      .eq("hbl_number", hbl)
      .maybeSingle();
    shipment = (data as Shipment) || null;
    if (shipment) {
      const { data: ev } = await supabase
        .from("shipment_events")
        .select("*")
        .eq("shipment_id", shipment.id)
        .order("event_date", { ascending: false });
      events = (ev as ShipmentEvent[]) || [];
    }
  }

  const ModeIcon = shipment?.mode === "maritimo" ? Ship : shipment?.mode === "terrestre" ? Truck : Plane;

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-16">
          <h1 className="text-4xl font-semibold tracking-tight">{dict.tracking.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-300">{dict.tracking.subtitle}</p>
          <div className="mt-8 max-w-2xl">
            <HBLTracker locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        {!searched && (
          <div className="card p-8 text-center text-ink-600">
            <Package className="mx-auto h-10 w-10 text-brand-500" />
            <p className="mt-3 text-sm">
              {locale === "es"
                ? "Ingresa tu número HBL en el campo superior para ver el estado del embarque."
                : "Enter your HBL number above to see your shipment status."}
            </p>
          </div>
        )}

        {searched && !shipment && (
          <div className="card border-l-4 border-l-rose-500 p-6 text-rose-700">
            <p className="font-medium">HBL: {hbl}</p>
            <p className="mt-1 text-sm text-ink-600">{dict.tracking.not_found}</p>
          </div>
        )}

        {shipment && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500 text-black">
                    <ModeIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
                      HBL
                    </p>
                    <p className="text-lg font-semibold text-ink-900">{shipment.hbl_number}</p>
                  </div>
                  <span className="ml-auto badge bg-brand-100 text-brand-800">
                    {SHIPMENT_STATUS_LABELS[shipment.status][locale]}
                  </span>
                </div>
                {shipment.description && (
                  <p className="mt-4 text-sm text-ink-700">{shipment.description}</p>
                )}
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <Field label={dict.tracking.origin} value={shipment.origin} />
                  <Field label={dict.tracking.destination} value={shipment.destination} />
                  <Field label={dict.tracking.carrier} value={shipment.carrier} />
                  <Field label={dict.tracking.mode} value={modeLabel(shipment.mode, locale)} />
                  <Field
                    label={dict.tracking.eta}
                    value={shipment.eta ? formatDate(shipment.eta, locale) : null}
                  />
                  <Field
                    label={dict.tracking.weight}
                    value={shipment.weight_kg ? `${shipment.weight_kg} kg` : null}
                  />
                </dl>
              </div>

              <div className="card p-6">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-500">
                  <Clock className="h-4 w-4" />
                  {dict.tracking.timeline}
                </h2>
                <ol className="mt-6 space-y-6">
                  {events.map((e, i) => (
                    <li key={e.id} className="relative pl-8">
                      <span
                        className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 ${
                          e.is_current
                            ? "border-brand-500 bg-brand-500"
                            : "border-ink-300 bg-white"
                        }`}
                      />
                      {i < events.length - 1 && (
                        <span className="absolute left-[5px] top-4 h-full w-px bg-ink-200" />
                      )}
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <p className="text-sm font-semibold text-ink-900">{e.status_label}</p>
                        {e.is_current && (
                          <span className="badge bg-brand-100 text-brand-800">
                            {locale === "es" ? "Actual" : "Current"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ink-500">
                        {formatDateTime(e.event_date, locale)}
                        {e.location && ` · ${e.location}`}
                      </p>
                      {e.description && (
                        <p className="mt-1 text-sm text-ink-700">{e.description}</p>
                      )}
                    </li>
                  ))}
                  {events.length === 0 && (
                    <li className="text-sm text-ink-500">
                      {locale === "es"
                        ? "Aún no hay eventos registrados para este embarque."
                        : "No events registered for this shipment yet."}
                    </li>
                  )}
                </ol>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-ink-900">
                  {locale === "es" ? "¿Necesitas más información?" : "Need more information?"}
                </h3>
                <p className="mt-2 text-sm text-ink-600">
                  {locale === "es"
                    ? "Nuestro equipo puede darte detalles adicionales sobre tu embarque."
                    : "Our team can provide additional details about your shipment."}
                </p>
                <Link
                  href={`/${locale}/contacto`}
                  className="btn-primary mt-4 w-full justify-center"
                >
                  {dict.home.hero_cta_contact} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="card p-6 text-sm text-ink-700">
                <p className="font-semibold">+511 304-5520</p>
                <p className="text-ink-500">ventas@ipedelperu.com</p>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</dt>
      <dd className="mt-1 text-ink-900">{value || "—"}</dd>
    </div>
  );
}

function modeLabel(mode: string, locale: string) {
  const map: Record<string, { es: string; en: string }> = {
    aereo: { es: "Aéreo", en: "Air" },
    maritimo: { es: "Marítimo", en: "Sea" },
    terrestre: { es: "Terrestre", en: "Land" },
  };
  return map[mode]?.[locale as "es" | "en"] || mode;
}
