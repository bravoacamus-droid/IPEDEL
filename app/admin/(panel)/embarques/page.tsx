import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SHIPMENT_STATUS_LABELS, type Shipment, type ShipmentStatus } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

const STATUSES = Object.keys(SHIPMENT_STATUS_LABELS) as ShipmentStatus[];

export default async function EmbarquesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("hbl_number", `%${q}%`);
  const { data } = await query;
  const shipments = (data as Shipment[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Embarques</h1>
          <p className="text-sm text-ink-600">{shipments.length} resultados</p>
        </div>
        <Link href="/admin/embarques/nuevo" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo embarque
        </Link>
      </div>

      <form className="card p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="label" htmlFor="q">Buscar por HBL</label>
          <input id="q" name="q" defaultValue={q || ""} className="input" placeholder="IPE-AIR-2026-..." />
        </div>
        <div>
          <label className="label" htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={status || ""} className="input">
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {SHIPMENT_STATUS_LABELS[s].es}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">Filtrar</button>
        {(status || q) && (
          <Link href="/admin/embarques" className="text-sm text-ink-500 hover:text-ink-900">
            Limpiar
          </Link>
        )}
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">HBL</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Origen → Destino</th>
              <th className="px-4 py-3 text-left">Modo</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-ink-50 cursor-pointer">
                <td className="px-4 py-3">
                  <Link href={`/admin/embarques/${s.id}`} className="font-mono text-ink-900 hover:underline">
                    {s.hbl_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{s.client_name || "—"}</td>
                <td className="px-4 py-3 text-ink-700">
                  {s.origin || "?"} → {s.destination || "?"}
                </td>
                <td className="px-4 py-3 capitalize text-ink-700">{s.mode}</td>
                <td className="px-4 py-3">
                  <span className="badge bg-brand-100 text-brand-800">
                    {SHIPMENT_STATUS_LABELS[s.status].es}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-700">{s.eta ? formatDate(s.eta) : "—"}</td>
              </tr>
            ))}
            {shipments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink-500">
                  No hay embarques que coincidan con los filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
