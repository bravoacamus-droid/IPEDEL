import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Reclamacion } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export default async function ReclamacionesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    estado?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const { q, estado, from, to } = await searchParams;
  const supabase = await createClient();

  // El filtro `q` busca por nombre, apellido, email o número
  // correlativo (si es numérico). Las reclamaciones NO se pueden
  // eliminar desde el panel — quedan registradas permanentemente
  // por imposicion legal (Indecopi 2 anos minimo).
  let query = supabase
    .from("reclamaciones")
    .select("*")
    .order("fecha", { ascending: false })
    .limit(200);
  if (estado) query = query.eq("estado", estado);
  if (from) query = query.gte("fecha", `${from}T00:00:00`);
  if (to) query = query.lte("fecha", `${to}T23:59:59`);
  if (q) {
    const num = Number(q.replace(/\D/g, ""));
    if (!Number.isNaN(num) && num > 0) {
      query = query.or(
        `numero_correlativo.eq.${num},nombres.ilike.%${q}%,apellidos.ilike.%${q}%,email.ilike.%${q}%`,
      );
    } else {
      query = query.or(
        `nombres.ilike.%${q}%,apellidos.ilike.%${q}%,email.ilike.%${q}%`,
      );
    }
  }
  const { data } = await query;
  const list = (data as Reclamacion[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Libro de reclamaciones</h1>
          <p className="text-sm text-ink-600">
            {list.length} resultados · plazo legal de respuesta: 30 días calendario.
          </p>
        </div>
        <a
          href={`/admin/reclamaciones/export${
            q || estado || from || to
              ? `?${new URLSearchParams({
                  ...(q ? { q } : {}),
                  ...(estado ? { estado } : {}),
                  ...(from ? { from } : {}),
                  ...(to ? { to } : {}),
                }).toString()}`
              : ""
          }`}
          className="inline-flex items-center gap-2 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
        >
          <Download className="h-4 w-4" /> Exportar CSV
        </a>
      </div>

      <form className="card flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[200px] flex-1">
          <label className="label" htmlFor="q">
            Buscar
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q || ""}
            placeholder="N°, nombre o correo"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            defaultValue={estado || ""}
            className="input"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="atendido">Atendido</option>
            <option value="cerrado">Cerrado</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="from">
            Desde
          </label>
          <input
            id="from"
            name="from"
            type="date"
            defaultValue={from || ""}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="to">
            Hasta
          </label>
          <input
            id="to"
            name="to"
            type="date"
            defaultValue={to || ""}
            className="input"
          />
        </div>
        <button type="submit" className="btn-primary">
          Filtrar
        </button>
        {(q || estado || from || to) && (
          <Link
            href="/admin/reclamaciones"
            className="text-sm text-ink-500 hover:text-ink-900"
          >
            Limpiar
          </Link>
        )}
      </form>
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
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/reclamaciones/${r.id}`}
                    className="font-mono text-ink-900 hover:underline"
                  >
                    #{r.numero_correlativo}
                  </Link>
                </td>
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
                <td colSpan={6} className="px-4 py-12 text-center text-ink-500">
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
