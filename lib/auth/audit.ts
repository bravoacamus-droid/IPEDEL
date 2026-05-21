import "server-only";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Tipos de acciones registrables. Mantener este set acotado facilita
// reportes/filtros en la UI de auditoría.
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "soft_delete"
  | "restore"
  | "login"
  | "logout"
  | "password_reset"
  | "role_change"
  | "toggle_active";

export type AuditEntity =
  | "user"
  | "shipment"
  | "shipment_event"
  | "reclamacion"
  | "tarifa"
  | "agent"
  | "site_content"
  | "auth";

export type AuditInput = {
  action: AuditAction;
  entityType: AuditEntity;
  entityId?: string | null;
  entityLabel?: string | null;
  /** Diff o snapshot. Para updates conviene { campo: { from, to } }. */
  changes?: Record<string, unknown> | null;
};

// Registra una entrada de auditoría usando el contexto del staff
// actualmente autenticado. Best-effort: si falla la escritura no
// rompe el flujo principal (solo loguea por consola).
export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? null;

    const admin = createAdminClient();
    const { error } = await admin.from("audit_log").insert({
      actor_id: user.id,
      actor_email: profile?.email ?? user.email ?? "unknown",
      actor_name: profile?.full_name ?? null,
      actor_role: profile?.role ?? null,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      entity_label: input.entityLabel ?? null,
      changes: input.changes ?? null,
      ip_address: ip,
    });
    if (error) {
      console.warn("audit_log insert failed (non-fatal):", error.message);
    }
  } catch (e) {
    console.warn("logAudit failed (non-fatal):", e);
  }
}

// Helper para construir un diff "campo: { from, to }" entre el estado
// anterior y el nuevo, omitiendo claves sin cambio. Útil dentro de
// updateX actions cuando ya tenemos el objeto previo cargado.
export function diff<T extends Record<string, unknown>>(
  before: T | null | undefined,
  after: Partial<T>,
): Record<string, { from: unknown; to: unknown }> {
  const out: Record<string, { from: unknown; to: unknown }> = {};
  if (!before) return out;
  for (const key of Object.keys(after) as Array<keyof T>) {
    if (before[key] !== after[key]) {
      out[String(key)] = { from: before[key], to: after[key] };
    }
  }
  return out;
}
