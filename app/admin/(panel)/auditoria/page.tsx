import Link from "next/link";
import {
  ShieldCheck,
  User as UserIcon,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  KeyRound,
  RefreshCw,
  Power,
  RotateCcw,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSectionAccess } from "@/lib/auth/rbac";
import { formatDateTime } from "@/lib/utils";

const ENTITY_LABELS: Record<string, string> = {
  user: "Usuario",
  shipment: "Embarque",
  shipment_event: "Evento de embarque",
  reclamacion: "Reclamación",
  tarifa: "Tarifa",
  agent: "Agente",
  site_content: "Contenido web",
  auth: "Autenticación",
};

const ACTION_LABELS: Record<string, string> = {
  create: "Creó",
  update: "Modificó",
  delete: "Eliminó",
  soft_delete: "Archivó",
  restore: "Restauró",
  login: "Ingresó",
  logout: "Cerró sesión",
  password_reset: "Reseteó contraseña",
  role_change: "Cambió rol",
  toggle_active: "Activó/Desactivó",
};

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  create: Plus,
  update: Pencil,
  delete: Trash2,
  soft_delete: Trash2,
  restore: RotateCcw,
  login: LogIn,
  logout: LogOut,
  password_reset: KeyRound,
  role_change: RefreshCw,
  toggle_active: Power,
};

const ACTION_COLORS: Record<string, string> = {
  create: "bg-brand-100 text-brand-800",
  update: "bg-sky-100 text-sky-800",
  delete: "bg-rose-100 text-rose-800",
  soft_delete: "bg-rose-100 text-rose-800",
  restore: "bg-brand-100 text-brand-800",
  login: "bg-ink-100 text-ink-700",
  logout: "bg-ink-100 text-ink-500",
  password_reset: "bg-amber-100 text-amber-800",
  role_change: "bg-purple-100 text-purple-800",
  toggle_active: "bg-ink-100 text-ink-700",
};

type AuditRow = {
  id: string;
  actor_id: string | null;
  actor_email: string;
  actor_name: string | null;
  actor_role: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  changes: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string;
    entity?: string;
    actor?: string;
    page?: string;
  }>;
}) {
  await requireSectionAccess("auditoria");

  const { action, entity, actor, page } = await searchParams;
  const pageNum = Math.max(1, Number(page) || 1);
  const perPage = 50;

  const admin = createAdminClient();
  let q = admin.from("audit_log").select("*", { count: "exact" });
  if (action) q = q.eq("action", action);
  if (entity) q = q.eq("entity_type", entity);
  if (actor) q = q.ilike("actor_email", `%${actor}%`);
  q = q
    .order("created_at", { ascending: false })
    .range((pageNum - 1) * perPage, pageNum * perPage - 1);

  const { data, count } = await q;
  const rows = (data ?? []) as AuditRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / perPage));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Auditoría</h1>
        <p className="text-sm text-ink-600">
          Registro de todas las acciones realizadas en el panel admin ·{" "}
          {count ?? 0} eventos en total.
        </p>
      </div>

      <form className="card flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-[150px] flex-1">
          <label className="label" htmlFor="actor">
            Usuario
          </label>
          <input
            id="actor"
            name="actor"
            defaultValue={actor || ""}
            placeholder="email parcial"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="action">
            Acción
          </label>
          <select
            id="action"
            name="action"
            defaultValue={action || ""}
            className="input"
          >
            <option value="">Todas</option>
            {Object.entries(ACTION_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="entity">
            Entidad
          </label>
          <select
            id="entity"
            name="entity"
            defaultValue={entity || ""}
            className="input"
          >
            <option value="">Todas</option>
            {Object.entries(ENTITY_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primary">
          Filtrar
        </button>
        {(action || entity || actor) && (
          <Link
            href="/admin/auditoria"
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
              <th className="px-4 py-3 text-left">Cuándo</th>
              <th className="px-4 py-3 text-left">Quién</th>
              <th className="px-4 py-3 text-left">Acción</th>
              <th className="px-4 py-3 text-left">Sobre</th>
              <th className="px-4 py-3 text-left">Detalle</th>
              <th className="px-4 py-3 text-left">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => {
              const Icon = ACTION_ICONS[r.action] ?? Pencil;
              const isAdmin = r.actor_role === "admin";
              return (
                <tr key={r.id} className="hover:bg-ink-50">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-600">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span
                        className={
                          isAdmin
                            ? "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700"
                            : "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600"
                        }
                      >
                        {isAdmin ? (
                          <ShieldCheck className="h-3 w-3" />
                        ) : (
                          <UserIcon className="h-3 w-3" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900">
                          {r.actor_name || r.actor_email}
                        </p>
                        {r.actor_name && (
                          <p className="text-xs text-ink-500">{r.actor_email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACTION_COLORS[r.action] ?? "bg-ink-100 text-ink-700"}`}
                    >
                      <Icon className="h-3 w-3" />
                      {ACTION_LABELS[r.action] ?? r.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-ink-900">
                      {ENTITY_LABELS[r.entity_type] ?? r.entity_type}
                    </p>
                    {r.entity_label && (
                      <p className="text-xs text-ink-600">{r.entity_label}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.changes && Object.keys(r.changes).length > 0 ? (
                      <ChangesPreview changes={r.changes} />
                    ) : (
                      <span className="text-xs text-ink-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-500">
                    {r.ip_address || "—"}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink-500">
                  Sin eventos para los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination current={pageNum} total={totalPages} params={{ action, entity, actor }} />
      )}
    </div>
  );
}

function ChangesPreview({ changes }: { changes: Record<string, unknown> }) {
  const entries = Object.entries(changes).slice(0, 3);
  return (
    <div className="space-y-0.5 text-xs">
      {entries.map(([k, v]) => {
        const val =
          typeof v === "object" && v !== null && "from" in v && "to" in v
            ? `${truncate(JSON.stringify((v as { from: unknown }).from))} → ${truncate(
                JSON.stringify((v as { to: unknown }).to),
              )}`
            : truncate(typeof v === "object" ? JSON.stringify(v) : String(v));
        return (
          <div key={k} className="text-ink-700">
            <span className="font-mono text-ink-500">{k}:</span> {val}
          </div>
        );
      })}
      {Object.keys(changes).length > 3 && (
        <p className="text-ink-400">+ {Object.keys(changes).length - 3} más</p>
      )}
    </div>
  );
}

function truncate(s: string, max = 40): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

function Pagination({
  current,
  total,
  params,
}: {
  current: number;
  total: number;
  params: { action?: string; entity?: string; actor?: string };
}) {
  function pageUrl(p: number): string {
    const sp = new URLSearchParams();
    if (params.action) sp.set("action", params.action);
    if (params.entity) sp.set("entity", params.entity);
    if (params.actor) sp.set("actor", params.actor);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `/admin/auditoria?${q}` : "/admin/auditoria";
  }
  return (
    <nav className="flex items-center justify-between gap-2 text-sm">
      <p className="text-ink-500">
        Página {current} de {total}
      </p>
      <div className="flex gap-2">
        {current > 1 && (
          <Link
            href={pageUrl(current - 1)}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-ink-700 hover:bg-ink-50"
          >
            ← Anterior
          </Link>
        )}
        {current < total && (
          <Link
            href={pageUrl(current + 1)}
            className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-ink-700 hover:bg-ink-50"
          >
            Siguiente →
          </Link>
        )}
      </div>
    </nav>
  );
}
