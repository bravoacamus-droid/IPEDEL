import Link from "next/link";
import {
  Package,
  FileText,
  AlertTriangle,
  Plane,
  Ship,
  Truck,
  Calendar,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Inbox,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { requireSectionAccess } from "@/lib/auth/rbac";
import {
  SHIPMENT_STATUS_LABELS,
  type Reclamacion,
  type Shipment,
  type ShipmentMode,
  type ShipmentStatus,
} from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { BarChart } from "@/components/admin/charts/BarChart";
import { DonutChart } from "@/components/admin/charts/DonutChart";
import { HorizontalBars } from "@/components/admin/charts/HorizontalBars";

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

const MODE_LABEL: Record<ShipmentMode, { label: string; color: string }> = {
  aereo: { label: "Aéreo", color: "#96c600" },
  maritimo: { label: "Marítimo", color: "#0ea5e9" },
  terrestre: { label: "Terrestre", color: "#f59e0b" },
};

// Plazo legal de respuesta a reclamaciones (DS 011-2011-PCM Art. 8).
const SLA_DAYS = 30;
const SLA_WARNING_DAYS = 20;

export default async function AdminDashboard() {
  await requireSectionAccess("dashboard");
  const supabase = await createClient();

  // Ventanas de tiempo para deltas mes-a-mes.
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const last12Start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const next7End = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    shipmentsLast12,
    reclamacionesActivas,
    nextEtas,
    recentShipments,
  ] = await Promise.all([
    // Embarques de los últimos 12 meses (para charts + deltas + tops).
    supabase
      .from("shipments")
      .select("id, status, mode, created_at, weight_kg, volumen_cbm, eta, origin, destination")
      .gte("created_at", last12Start.toISOString()),
    // Reclamaciones para alertas + SLA + chart por mes.
    supabase
      .from("reclamaciones")
      .select("id, numero_correlativo, nombres, apellidos, fecha, estado, bien_servicio")
      .order("fecha", { ascending: true }),
    // Próximos ETAs (7 días).
    supabase
      .from("shipments")
      .select("id, hbl_number, client_name, origin, destination, mode, eta, status")
      .neq("status", "entregado")
      .gte("eta", new Date().toISOString().slice(0, 10))
      .lte("eta", next7End.toISOString().slice(0, 10))
      .order("eta", { ascending: true })
      .limit(8),
    // Últimos embarques creados.
    supabase
      .from("shipments")
      .select("id, hbl_number, client_name, mode, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const allShipments = (shipmentsLast12.data ?? []) as Pick<
    Shipment,
    "id" | "status" | "mode" | "created_at" | "weight_kg" | "volumen_cbm" | "eta" | "origin" | "destination"
  >[];
  const allReclamaciones = (reclamacionesActivas.data ?? []) as Pick<
    Reclamacion,
    "id" | "numero_correlativo" | "nombres" | "apellidos" | "fecha" | "estado" | "bien_servicio"
  >[];

  // ---------- KPIs principales ----------

  const thisMonthShipments = allShipments.filter(
    (s) => new Date(s.created_at) >= thisMonthStart,
  );
  const lastMonthShipments = allShipments.filter((s) => {
    const d = new Date(s.created_at);
    return d >= lastMonthStart && d < thisMonthStart;
  });
  const deltaShipments = thisMonthShipments.length - lastMonthShipments.length;

  const activeShipmentsTotal = allShipments.filter(
    (s) => s.status !== "entregado",
  ).length;

  const reclamacionesPendientes = allReclamaciones.filter(
    (r) => r.estado === "pendiente",
  );
  const reclamacionesOverdue = reclamacionesPendientes.filter(
    (r) => daysSince(r.fecha) > SLA_DAYS,
  );
  const reclamacionesWarning = reclamacionesPendientes.filter(
    (r) => daysSince(r.fecha) >= SLA_WARNING_DAYS && daysSince(r.fecha) <= SLA_DAYS,
  );

  const kgLastMonth = lastMonthShipments.reduce(
    (a, s) => a + (s.weight_kg ?? 0),
    0,
  );
  const kgThisMonth = thisMonthShipments.reduce(
    (a, s) => a + (s.weight_kg ?? 0),
    0,
  );
  const cbmThisMonth = thisMonthShipments.reduce(
    (a, s) => a + (s.volumen_cbm ?? 0),
    0,
  );

  // Tasa de cumplimiento: % reclamaciones cerradas dentro de 30 días
  // (sobre el total atendidas o cerradas en los últimos 90 días).
  const last90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const recentClosed = allReclamaciones.filter(
    (r) => r.estado !== "pendiente" && new Date(r.fecha) >= last90,
  );
  // Para el cálculo real necesitaríamos fecha_respuesta, pero
  // como aproximación usamos el plazo de 30 días desde fecha.
  const onTimeClosed = recentClosed.filter((r) => daysSince(r.fecha) <= SLA_DAYS).length;
  const complianceRate = recentClosed.length === 0
    ? 100
    : Math.round((onTimeClosed / recentClosed.length) * 100);

  // ---------- Datos para charts ----------

  // Embarques por mes (últimos 6).
  const monthlyBuckets: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyBuckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTHS_ES[d.getMonth()],
      count: 0,
    });
  }
  for (const s of allShipments) {
    const d = new Date(s.created_at);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthlyBuckets.find((b) => b.key === k);
    if (bucket) bucket.count++;
  }

  // Distribución por modo (últimos 12 meses).
  const byMode = (["aereo", "maritimo", "terrestre"] as ShipmentMode[]).map(
    (m) => ({
      label: MODE_LABEL[m].label,
      value: allShipments.filter((s) => s.mode === m).length,
      color: MODE_LABEL[m].color,
    }),
  );

  // Distribución por estado (snapshot actual).
  const STATUS_ORDER: ShipmentStatus[] = [
    "recibido",
    "en_transito",
    "en_almacen",
    "entregado",
  ];
  const byStatus = STATUS_ORDER.map((st) => ({
    label: SHIPMENT_STATUS_LABELS[st].es,
    value: allShipments.filter((s) => s.status === st).length,
  })).filter((b) => b.value > 0);

  // Reclamaciones por mes (últimos 6 meses), bar chart en paralelo
  // al de embarques.
  const recBuckets: { key: string; label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    recBuckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTHS_ES[d.getMonth()],
      count: 0,
    });
  }
  for (const r of allReclamaciones) {
    const d = new Date(r.fecha);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = recBuckets.find((b) => b.key === k);
    if (bucket) bucket.count++;
  }

  // Top destinos / orígenes — útil para identificar rutas dominantes
  // y enfocar negociaciones con líneas / agentes. Normaliza el string
  // y agrupa por valor exacto. Toma top 6.
  const TOP_N = 6;
  const topDest = topGroupBy(allShipments, (s) => s.destination, TOP_N);
  const topOri = topGroupBy(allShipments, (s) => s.origin, TOP_N);

  // ---------- Render ----------

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          Panel administrativo
        </h1>
        <p className="mt-1 text-sm text-ink-600">
          Resumen operativo de IPE del Perú SAC ·{" "}
          {now.toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Alertas críticas (solo si hay) */}
      {(reclamacionesOverdue.length > 0 || reclamacionesWarning.length > 0) && (
        <div className="rounded-lg border-l-4 border-rose-500 bg-rose-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900">
                Reclamaciones requieren atención
              </p>
              <ul className="mt-1 space-y-0.5 text-sm text-rose-800">
                {reclamacionesOverdue.length > 0 && (
                  <li>
                    <strong>{reclamacionesOverdue.length}</strong>{" "}
                    {reclamacionesOverdue.length === 1
                      ? "reclamación vencida"
                      : "reclamaciones vencidas"}{" "}
                    (más de {SLA_DAYS} días sin responder — incumple Ley 29571).
                  </li>
                )}
                {reclamacionesWarning.length > 0 && (
                  <li>
                    <strong>{reclamacionesWarning.length}</strong>{" "}
                    {reclamacionesWarning.length === 1
                      ? "reclamación por vencer"
                      : "reclamaciones por vencer"}{" "}
                    en los próximos días.
                  </li>
                )}
              </ul>
              <Link
                href="/admin/reclamaciones?estado=pendiente"
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-rose-700 hover:text-rose-900"
              >
                Revisar reclamaciones <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* KPI tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          href="/admin/embarques"
          icon={<Package className="h-4 w-4" />}
          label="Embarques activos"
          value={activeShipmentsTotal}
          sub={
            deltaShipments === 0
              ? `Este mes igual que el anterior`
              : deltaShipments > 0
              ? `+${deltaShipments} creados este mes vs anterior`
              : `${deltaShipments} creados este mes vs anterior`
          }
          delta={deltaShipments}
          accent="bg-brand-500"
        />
        <KpiCard
          href="/admin/reclamaciones?estado=pendiente"
          icon={<FileText className="h-4 w-4" />}
          label="Reclamaciones pendientes"
          value={reclamacionesPendientes.length}
          sub={
            reclamacionesOverdue.length > 0
              ? `${reclamacionesOverdue.length} venc${reclamacionesOverdue.length === 1 ? "ida" : "idas"} de plazo`
              : reclamacionesPendientes.length === 0
              ? "Todo al día"
              : `Plazo legal: ${SLA_DAYS} días`
          }
          accent={reclamacionesOverdue.length > 0 ? "bg-rose-500" : "bg-amber-500"}
        />
        <KpiCard
          icon={<Inbox className="h-4 w-4" />}
          label="Carga procesada este mes"
          value={`${formatNumber(kgThisMonth)} KG`}
          sub={
            cbmThisMonth > 0
              ? `${cbmThisMonth.toFixed(2)} CBM · ${kgLastMonth > 0 ? formatDelta(kgThisMonth, kgLastMonth) : "primer mes con datos"}`
              : kgLastMonth > 0
              ? formatDelta(kgThisMonth, kgLastMonth)
              : "Sin embarques anteriores"
          }
          accent="bg-ink-700"
        />
        <KpiCard
          icon={<Clock className="h-4 w-4" />}
          label="Cumplimiento SLA reclamos"
          value={`${complianceRate}%`}
          sub={
            recentClosed.length === 0
              ? "Sin reclamos cerrados últimos 90 días"
              : `${onTimeClosed} de ${recentClosed.length} dentro de ${SLA_DAYS} días`
          }
          accent={
            complianceRate >= 90
              ? "bg-brand-500"
              : complianceRate >= 70
              ? "bg-amber-500"
              : "bg-rose-500"
          }
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-700">
            Embarques creados — últimos 6 meses
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Total {monthlyBuckets.reduce((a, b) => a + b.count, 0)} embarques
          </p>
          <div className="mt-4">
            <BarChart
              data={monthlyBuckets.map((b) => ({ label: b.label, value: b.count }))}
              height={200}
            />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700">
            Distribución por modo
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Últimos 12 meses
          </p>
          <div className="mt-4">
            <DonutChart
              segments={byMode}
              size={140}
              centerLabel={{
                value: byMode.reduce((a, s) => a + s.value, 0),
                sub: "total",
              }}
            />
          </div>
        </div>
      </div>

      {/* Reclamaciones por mes — paralelo al chart de embarques */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-700">
            Reclamaciones por mes — últimos 6 meses
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Total {recBuckets.reduce((a, b) => a + b.count, 0)} reclamaciones
            recibidas
          </p>
          <div className="mt-4">
            <BarChart
              data={recBuckets.map((b) => ({ label: b.label, value: b.count }))}
              height={200}
              emptyMessage="Sin reclamaciones en los últimos 6 meses"
            />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700">
            Reclamaciones por estado
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">Activas en sistema</p>
          <div className="mt-5">
            <HorizontalBars
              data={[
                {
                  label: "Pendientes",
                  value: reclamacionesPendientes.length,
                  color: "#e11d48",
                },
                {
                  label: "Atendidas",
                  value: allReclamaciones.filter((r) => r.estado === "atendido").length,
                  color: "#f59e0b",
                },
                {
                  label: "Cerradas",
                  value: allReclamaciones.filter((r) => r.estado === "cerrado").length,
                  color: "#96c600",
                },
              ].filter((d) => d.value > 0)}
              emptyMessage="Sin reclamaciones activas"
            />
          </div>
        </div>
      </div>

      {/* Top destinos y orígenes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700">Top destinos</h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Ciudades / puertos más frecuentes — últimos 12 meses
          </p>
          <div className="mt-5">
            <HorizontalBars
              data={topDest}
              emptyMessage="Aún no hay datos de destinos"
            />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700">Top orígenes</h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Ciudades / puertos más frecuentes — últimos 12 meses
          </p>
          <div className="mt-5">
            <HorizontalBars
              data={topOri.map((d) => ({ ...d, color: "#0ea5e9" }))}
              emptyMessage="Aún no hay datos de orígenes"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-ink-700">
            Embarques por estado
          </h2>
          <p className="mt-0.5 text-xs text-ink-500">
            Distribución actual (últimos 12 meses)
          </p>
          <div className="mt-5">
            <HorizontalBars data={byStatus} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-sm font-semibold text-ink-700">
                Próximos arribos
              </h2>
              <p className="mt-0.5 text-xs text-ink-500">
                ETAs en los próximos 7 días
              </p>
            </div>
            <Link
              href="/admin/embarques"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              Ver todos →
            </Link>
          </div>
          <ul className="mt-5 space-y-3">
            {((nextEtas.data ?? []) as Array<{
              id: string;
              hbl_number: string;
              client_name: string | null;
              origin: string | null;
              destination: string | null;
              mode: ShipmentMode;
              eta: string;
            }>).map((s) => {
              const ModeIcon =
                s.mode === "maritimo"
                  ? Ship
                  : s.mode === "terrestre"
                  ? Truck
                  : Plane;
              return (
                <li key={s.id}>
                  <Link
                    href={`/admin/embarques/${s.id}`}
                    className="flex items-start gap-3 rounded-lg p-2 -mx-2 hover:bg-ink-50"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                      <ModeIcon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {s.hbl_number}
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {s.origin || "?"} → {s.destination || "?"}
                        {s.client_name ? ` · ${s.client_name}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right text-xs">
                      <p className="font-medium text-ink-900">
                        {formatDate(s.eta)}
                      </p>
                      <p className="text-ink-500">
                        {daysUntil(s.eta) === 0
                          ? "Hoy"
                          : daysUntil(s.eta) === 1
                          ? "Mañana"
                          : `En ${daysUntil(s.eta)} días`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
            {(!nextEtas.data || nextEtas.data.length === 0) && (
              <li className="flex items-center justify-center py-6 text-sm text-ink-400">
                <Calendar className="mr-2 h-4 w-4" /> Sin arribos programados
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Último movimiento + reclamaciones recientes */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink-700">
              Últimos embarques creados
            </h2>
            <Link
              href="/admin/embarques"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              Ver todos →
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-ink-100">
            {((recentShipments.data ?? []) as Array<{
              id: string;
              hbl_number: string;
              client_name: string | null;
              mode: ShipmentMode;
              status: ShipmentStatus;
              created_at: string;
            }>).map((s) => (
              <li key={s.id}>
                <Link
                  href={`/admin/embarques/${s.id}`}
                  className="flex items-center gap-3 py-2.5 hover:bg-ink-50/60 -mx-2 px-2 rounded-md"
                >
                  <span className="font-mono text-xs text-ink-700">
                    {s.hbl_number}
                  </span>
                  <span className="badge bg-ink-100 text-ink-700 capitalize">
                    {MODE_LABEL[s.mode].label}
                  </span>
                  <span className="badge bg-brand-100 text-brand-800">
                    {SHIPMENT_STATUS_LABELS[s.status].es}
                  </span>
                  <span className="ml-auto text-xs text-ink-500">
                    {formatDate(s.created_at)}
                  </span>
                </Link>
              </li>
            ))}
            {(!recentShipments.data || recentShipments.data.length === 0) && (
              <li className="py-6 text-center text-sm text-ink-400">
                Sin embarques registrados
              </li>
            )}
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-ink-700">
              Reclamaciones pendientes
            </h2>
            <Link
              href="/admin/reclamaciones"
              className="text-xs font-semibold text-brand-700 hover:text-brand-900"
            >
              Ver todas →
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-ink-100">
            {reclamacionesPendientes.slice(0, 5).map((r) => {
              const days = daysSince(r.fecha);
              const overdue = days > SLA_DAYS;
              const warning = days >= SLA_WARNING_DAYS && days <= SLA_DAYS;
              return (
                <li key={r.id}>
                  <Link
                    href={`/admin/reclamaciones/${r.id}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-ink-50/60 -mx-2 px-2 rounded-md"
                  >
                    <span className="font-mono text-xs text-ink-700">
                      #{r.numero_correlativo}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-900">
                      {r.nombres} {r.apellidos}
                    </span>
                    <span
                      className={
                        overdue
                          ? "badge bg-rose-100 text-rose-700"
                          : warning
                          ? "badge bg-amber-100 text-amber-800"
                          : "badge bg-ink-100 text-ink-600"
                      }
                    >
                      {days}d
                    </span>
                  </Link>
                </li>
              );
            })}
            {reclamacionesPendientes.length === 0 && (
              <li className="py-6 text-center text-sm text-ink-400">
                Sin reclamaciones pendientes — todo al día
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---------- Helpers ----------

function KpiCard({
  href,
  icon,
  label,
  value,
  sub,
  delta,
  accent,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  delta?: number;
  accent: string;
}) {
  const inner = (
    <div className="card group p-5">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${accent} text-black`}
        >
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-ink-900">{value}</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-600">
            {typeof delta === "number" && delta !== 0 && (
              <span
                className={
                  delta > 0
                    ? "inline-flex items-center gap-0.5 font-medium text-brand-700"
                    : "inline-flex items-center gap-0.5 font-medium text-rose-600"
                }
              >
                {delta > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
              </span>
            )}
            <span className="truncate">{sub}</span>
          </p>
        </div>
        {href && (
          <ArrowRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-ink-700" />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

function daysSince(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((target - today.getTime()) / (24 * 60 * 60 * 1000)));
}

function formatNumber(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toFixed(0);
}

function formatDelta(curr: number, prev: number): string {
  if (prev === 0) return curr > 0 ? "Sin base de comparación" : "";
  const pct = ((curr - prev) / prev) * 100;
  const arrow = pct >= 0 ? "↑" : "↓";
  return `${arrow} ${Math.abs(pct).toFixed(0)}% vs mes anterior`;
}

// Agrupa un array por la clave que devuelve el accessor, cuenta
// ocurrencias y devuelve los top N como { label, value } listos para
// HorizontalBars. Ignora valores nulos/vacíos.
function topGroupBy<T>(
  rows: T[],
  accessor: (row: T) => string | null | undefined,
  n: number,
): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const v = accessor(r);
    if (!v) continue;
    const key = v.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, value]) => ({ label, value }));
}
