import { createClient } from "@/lib/supabase/server";
import type { Tarifa } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export default async function AdminTarifarioPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tarifario")
    .select("*")
    .order("modalidad")
    .order("orden");
  const rows = (data as Tarifa[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Tarifario VUCE</h1>
          <p className="text-sm text-ink-600">Cumple DS 010-2011-MTC. Edición inline disponible en Sprint 2.</p>
        </div>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">Modalidad</th>
              <th className="px-4 py-3 text-left">Doc</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Moneda</th>
              <th className="px-4 py-3 text-left">Unidad</th>
              <th className="px-4 py-3 text-left">Activo</th>
              <th className="px-4 py-3 text-left">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 capitalize text-ink-700">{r.modalidad}</td>
                <td className="px-4 py-3 text-ink-700">{r.doc_transporte}</td>
                <td className="px-4 py-3 text-ink-900">{r.denominacion}</td>
                <td className="px-4 py-3 font-semibold text-ink-900">{r.precio}</td>
                <td className="px-4 py-3 text-ink-600">{r.moneda}</td>
                <td className="px-4 py-3 text-ink-600">{r.unidad_cobro || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${r.is_active ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"}`}>
                    {r.is_active ? "Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-500">{formatDateTime(r.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
