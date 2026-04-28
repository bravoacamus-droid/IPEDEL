import { createClient } from "@/lib/supabase/server";
import type { Reclamacion } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export default async function ReclamacionesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reclamaciones")
    .select("*")
    .order("fecha", { ascending: false })
    .limit(100);
  const list = (data as Reclamacion[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Libro de reclamaciones</h1>
        <p className="text-sm text-ink-600">
          {list.length} registros · plazo de respuesta legal: 30 días calendario.
        </p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">N°</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Consumidor</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {list.map((r) => (
              <tr key={r.id} className="hover:bg-ink-50">
                <td className="px-4 py-3 font-mono text-ink-900">#{r.numero_correlativo}</td>
                <td className="px-4 py-3 text-ink-700">{formatDateTime(r.fecha)}</td>
                <td className="px-4 py-3 capitalize text-ink-700">{r.tipo}</td>
                <td className="px-4 py-3 text-ink-700">
                  {r.nombres} {r.apellidos}
                  <p className="text-xs text-ink-500">{r.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-700">{r.bien_servicio}</td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${
                      r.estado === "pendiente"
                        ? "bg-rose-100 text-rose-700"
                        : r.estado === "atendido"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-brand-100 text-brand-800"
                    }`}
                  >
                    {r.estado}
                  </span>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-500">
                  Sin reclamaciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
