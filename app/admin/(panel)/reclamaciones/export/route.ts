import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSectionAccess } from "@/lib/auth/rbac";
import type { Reclamacion } from "@/lib/types/database";
import { csvResponse, toCsv } from "@/lib/utils/csv";
import { formatDateTime } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Exporta el listado de reclamaciones a CSV (mismos filtros que la
// página: q + estado + rango de fechas sobre fecha).
export async function GET(req: NextRequest) {
  await requireSectionAccess("reclamaciones");

  const q = req.nextUrl.searchParams.get("q") || undefined;
  const estado = req.nextUrl.searchParams.get("estado") || undefined;
  const from = req.nextUrl.searchParams.get("from") || undefined;
  const to = req.nextUrl.searchParams.get("to") || undefined;

  const supabase = await createClient();
  let query = supabase
    .from("reclamaciones")
    .select("*")
    .order("fecha", { ascending: false });
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
  const rows = (data as Reclamacion[]) || [];

  const headers = [
    "N°",
    "Fecha",
    "Tipo",
    "Estado",
    "Nombres",
    "Apellidos",
    "Documento",
    "Email",
    "Teléfono",
    "Ubicación",
    "Servicio",
    "Monto reclamado (S/)",
    "Detalle",
    "Pedido",
    "Respuesta",
    "Fecha respuesta",
  ];
  const body = rows.map((r) => [
    r.numero_correlativo,
    formatDateTime(r.fecha),
    r.tipo,
    r.estado,
    r.nombres,
    r.apellidos,
    `${r.tipo_documento} ${r.numero_documento}`,
    r.email,
    r.telefono,
    r.ubigeo_distrito_nombre
      ? `${r.ubigeo_distrito_nombre}, ${r.ubigeo_provincia_nombre}, ${r.ubigeo_departamento_nombre}`
      : "",
    r.bien_servicio,
    r.monto_reclamado,
    r.detalle,
    r.pedido_consumidor,
    r.respuesta_empresa,
    r.fecha_respuesta ? formatDateTime(r.fecha_respuesta) : "",
  ]);

  const csv = toCsv(headers, body);
  const ts = new Date().toISOString().slice(0, 10);
  return csvResponse(`reclamaciones-${ts}.csv`, csv);
}
