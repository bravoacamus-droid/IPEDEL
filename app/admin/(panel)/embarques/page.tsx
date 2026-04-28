import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SHIPMENT_STATUS_LABELS, type Shipment } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";

export default async function EmbarquesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("shipments").select("*").order("created_at", { ascending: false }).limit(100);
  if (status) query = query.eq("status", status);
  const { data } = await query;
  const shipments = (data as Shipment[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Embarques</h1>
          <p className="text-sm text-ink-600">{shipments.length} resultados</p>
        </div>
        <Link href="/admin/embarques/nuevo" className="btn-primary opacity-50 cursor-not-allowed pointer-events-none">
          Nuevo embarque (Sprint 2)
        </Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">HBL</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Origen → Destino</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">ETA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {shipments.map((s) => (
              <tr key={s.id} className="hover:bg-ink-50">
                <td className="px-4 py-3 font-mono text-ink-900">{s.hbl_number}</td>
                <td className="px-4 py-3 text-ink-700">{s.client_name || "—"}</td>
                <td className="px-4 py-3 text-ink-700">{s.origin || "?"} → {s.destination || "?"}</td>
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
                <td colSpan={5} className="px-4 py-8 text-center text-ink-500">
                  No hay embarques registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
