import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSectionAccess } from "@/lib/auth/rbac";
import {
  SHIPMENT_STATUS_LABELS,
  type Shipment,
  type ShipmentStatus,
} from "@/lib/types/database";
import { csvResponse, toCsv } from "@/lib/utils/csv";
import { formatDate } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Exporta el listado de embarques a CSV. Respeta los mismos filtros
// que la página: status, q (HBL), from/to (rango de fechas sobre
// created_at). Accesible para admin y operator.
export async function GET(req: NextRequest) {
  await requireSectionAccess("embarques");

  const status = req.nextUrl.searchParams.get("status") || undefined;
  const q = req.nextUrl.searchParams.get("q") || undefined;
  const from = req.nextUrl.searchParams.get("from") || undefined;
  const to = req.nextUrl.searchParams.get("to") || undefined;

  const supabase = await createClient();
  let query = supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (q) query = query.ilike("hbl_number", `%${q}%`);
  if (from) query = query.gte("created_at", `${from}T00:00:00`);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);
  const { data } = await query;
  const rows = (data as Shipment[]) || [];

  const headers = [
    "HBL",
    "MBL",
    "Cliente",
    "Modo",
    "Estado",
    "Origen",
    "Destino",
    "ETD",
    "ETA",
    "Peso (KG)",
    "Volumen (CBM)",
    "Descripción",
    "Creado",
  ];
  const body = rows.map((s) => [
    s.hbl_number,
    s.mbl_number,
    s.client_name,
    s.mode,
    SHIPMENT_STATUS_LABELS[s.status as ShipmentStatus]?.es ?? s.status,
    s.origin,
    s.destination,
    s.etd ? formatDate(s.etd) : "",
    s.eta ? formatDate(s.eta) : "",
    s.weight_kg,
    s.volumen_cbm,
    s.description,
    formatDate(s.created_at),
  ]);

  const csv = toCsv(headers, body);
  const ts = new Date().toISOString().slice(0, 10);
  return csvResponse(`embarques-${ts}.csv`, csv);
}
