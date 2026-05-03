import { notFound } from "next/navigation";
import { Plane, Ship } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import type { Tarifa } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

export default async function TarifarioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("tarifario")
    .select("*")
    .eq("is_active", true)
    .order("modalidad")
    .order("orden");
  const rows = (data as Tarifa[]) || [];
  const aereo = rows.filter((r) => r.modalidad === "aereo");
  const maritimo = rows.filter((r) => r.modalidad === "maritimo");
  const lastUpdate = rows.reduce(
    (acc, r) => (acc > r.updated_at ? acc : r.updated_at),
    rows[0]?.updated_at || "",
  );

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-16">
          <h1 className="text-4xl font-semibold tracking-tight">{dict.tarifario.title}</h1>
          <p className="mt-3 max-w-3xl text-ink-300">{dict.tarifario.subtitle}</p>
          {lastUpdate && (
            <p className="mt-2 text-xs text-ink-400">
              {dict.tarifario.last_update}: {formatDate(lastUpdate, locale)}
            </p>
          )}
        </div>
      </section>

      <section className="container-page py-12 space-y-10">
        <TarifaTable
          icon={<Plane className="h-5 w-5" />}
          title={dict.tarifario.air}
          rows={aereo}
          dict={dict}
        />
        <TarifaTable
          icon={<Ship className="h-5 w-5" />}
          title={dict.tarifario.sea}
          rows={maritimo}
          dict={dict}
        />
        <p className="rounded-md border border-ink-200 bg-white p-4 text-sm text-ink-700">
          {locale === "es"
            ? "Para mayor información contáctenos."
            : "For more information, please contact us."}
        </p>
      </section>
    </div>
  );
}

function TarifaTable({
  icon,
  title,
  rows,
  dict,
}: {
  icon: React.ReactNode;
  title: string;
  rows: Tarifa[];
  dict: Awaited<ReturnType<typeof getDictionary>>;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 bg-ink-900 px-6 py-4 text-white">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 text-black">
          {icon}
        </span>
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-6 py-3 text-left">{dict.tarifario.service}</th>
              <th className="px-6 py-3 text-left">{dict.tarifario.price}</th>
              <th className="px-6 py-3 text-left">{dict.tarifario.currency}</th>
              <th className="px-6 py-3 text-left">{dict.tarifario.unit}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-6 py-3 text-ink-900">{r.denominacion}</td>
                <td className="px-6 py-3 font-semibold text-ink-900">{r.precio}</td>
                <td className="px-6 py-3 text-ink-600">{r.moneda}</td>
                <td className="px-6 py-3 text-ink-600">{r.unidad_cobro || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
