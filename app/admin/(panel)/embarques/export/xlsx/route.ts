import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireSectionAccess } from "@/lib/auth/rbac";
import {
  SHIPMENT_STATUS_LABELS,
  type Shipment,
  type ShipmentStatus,
} from "@/lib/types/database";
import { buildBrandedXlsx, xlsxResponse } from "@/lib/utils/xlsx";
import { formatDate } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Export branded XLSX de embarques. Respeta filtros: status, q (HBL),
// from / to (rango de fechas sobre created_at). Header con logo +
// colores corporativos + freeze pane + zebra striping.
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

  // Subtítulo con resumen de filtros aplicados
  const filterParts: string[] = [];
  if (from && to) filterParts.push(`Desde ${from} hasta ${to}`);
  else if (from) filterParts.push(`Desde ${from}`);
  else if (to) filterParts.push(`Hasta ${to}`);
  if (status) {
    const lbl = SHIPMENT_STATUS_LABELS[status as ShipmentStatus]?.es ?? status;
    filterParts.push(`Estado: ${lbl}`);
  }
  if (q) filterParts.push(`HBL contiene: "${q}"`);
  const subtitle = filterParts.length
    ? `Reporte filtrado · ${filterParts.join(" · ")}`
    : "Reporte completo de embarques";

  const buffer = await buildBrandedXlsx<Shipment>({
    title: "Embarques",
    subtitle,
    sheetName: "Embarques",
    columns: [
      { header: "HBL", width: 18 },
      { header: "MBL", width: 16 },
      { header: "Cliente", width: 24 },
      { header: "Modo", width: 12 },
      { header: "Estado", width: 16 },
      { header: "Origen", width: 22 },
      { header: "Destino", width: 22 },
      { header: "ETD", width: 14 },
      { header: "ETA", width: 14 },
      { header: "Peso (KG)", width: 12 },
      { header: "Volumen (CBM)", width: 14 },
      { header: "Descripción", width: 36 },
      { header: "Creado", width: 16 },
    ],
    rows,
    rowToValues: (s) => [
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
    ],
  });

  const ts = new Date().toISOString().slice(0, 10);
  return xlsxResponse(`embarques-${ts}.xlsx`, buffer);
}
