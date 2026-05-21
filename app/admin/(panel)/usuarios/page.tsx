import Link from "next/link";
import { Plus, ShieldCheck, User as UserIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSectionAccess } from "@/lib/auth/rbac";
import { formatDateTime } from "@/lib/utils";
import type { UserRole } from "@/lib/types/database";
import { UserRowActions } from "./UserRowActions";

type ProfileWithAuth = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  last_sign_in_at: string | null;
};

export default async function UsuariosPage() {
  const staff = await requireSectionAccess("usuarios");

  const admin = createAdminClient();
  // Listamos vía Auth Admin API para obtener last_sign_in_at y luego
  // hacemos join manual con profiles para tener el rol y full_name.
  const { data: usersResp } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  const authUsers = usersResp?.users ?? [];

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, email, full_name, role, created_at");
  const profilesById = new Map(
    ((profiles ?? []) as Array<{
      id: string;
      email: string;
      full_name: string | null;
      role: UserRole;
      created_at: string;
    }>).map((p) => [p.id, p]),
  );

  const rows: ProfileWithAuth[] = authUsers
    .map((u) => {
      const p = profilesById.get(u.id);
      if (!p) return null;
      return {
        id: u.id,
        email: p.email,
        full_name: p.full_name,
        role: p.role,
        created_at: p.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
      };
    })
    .filter((r): r is ProfileWithAuth => r !== null)
    .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Usuarios</h1>
          <p className="text-sm text-ink-600">
            {rows.length} cuenta{rows.length === 1 ? "" : "s"} con acceso al panel.
            Solo administradores pueden gestionar usuarios.
          </p>
        </div>
        <Link href="/admin/usuarios/nuevo" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Último ingreso</th>
              <th className="px-4 py-3 text-left">Creado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((u) => {
              const isMe = u.id === staff.userId;
              return (
                <tr key={u.id} className="hover:bg-ink-50">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <span
                        className={
                          u.role === "admin"
                            ? "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700"
                            : "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600"
                        }
                      >
                        {u.role === "admin" ? (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        ) : (
                          <UserIcon className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900">
                          {u.full_name || "—"}
                          {isMe && (
                            <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                              Tú
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-ink-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        u.role === "admin"
                          ? "badge bg-brand-100 text-brand-800"
                          : "badge bg-ink-100 text-ink-700"
                      }
                    >
                      {u.role === "admin" ? "Administrador" : "Operador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {u.last_sign_in_at ? formatDateTime(u.last_sign_in_at) : "Nunca"}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{formatDateTime(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <UserRowActions
                      userId={u.id}
                      email={u.email}
                      currentRole={u.role}
                      currentName={u.full_name ?? ""}
                      isSelf={isMe}
                    />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-500">
                  Sin usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
        <p className="font-semibold">Política de roles</p>
        <ul className="mt-1 list-disc pl-4 space-y-0.5">
          <li>
            <strong>Administrador:</strong> acceso total — panel, embarques,
            reclamaciones, tarifario, agentes, contenido web, usuarios y
            configuración.
          </li>
          <li>
            <strong>Operador:</strong> solo embarques y reclamaciones (uso
            operativo diario).
          </li>
        </ul>
      </div>
    </div>
  );
}
