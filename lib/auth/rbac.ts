import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/database";

// Secciones del panel admin con los roles que pueden acceder.
// Modificación a estos arrays = cambio inmediato en sidebar + guard.
//
// Política (acordada con cliente, 21 may 2026):
//   admin    → todo
//   operator → embarques + reclamaciones
//              (no dashboard, no tarifario, no agentes, no contenido,
//               no configuración, no usuarios)
export const SECTION_ACCESS = {
  dashboard: ["admin"] as UserRole[],
  embarques: ["admin", "operator"] as UserRole[],
  reclamaciones: ["admin", "operator"] as UserRole[],
  tarifario: ["admin"] as UserRole[],
  agentes: ["admin"] as UserRole[],
  contenido: ["admin"] as UserRole[],
  configuracion: ["admin"] as UserRole[],
  usuarios: ["admin"] as UserRole[],
  auditoria: ["admin"] as UserRole[],
} as const;

export type Section = keyof typeof SECTION_ACCESS;

export type AuthedStaff = {
  userId: string;
  email: string;
  fullName: string | null;
  role: UserRole;
};

// Obtiene el staff autenticado y lanza redirect si no hay sesión o si
// el perfil no es admin/operator. Para usar al tope de cualquier
// página o action server-side.
export async function requireStaff(): Promise<AuthedStaff> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile.role !== "admin" && profile.role !== "operator")) {
    redirect("/admin/login?error=role");
  }

  return {
    userId: user.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role as UserRole,
  };
}

// Igual que requireStaff pero además exige que el rol pueda acceder a
// la sección indicada. Si no, redirect al landing del panel según rol.
export async function requireSectionAccess(section: Section): Promise<AuthedStaff> {
  const staff = await requireStaff();
  if (!SECTION_ACCESS[section].includes(staff.role)) {
    redirect(landingFor(staff.role));
  }
  return staff;
}

// Página de entrada por defecto según rol: admin va al dashboard,
// operator va directo a embarques.
export function landingFor(role: UserRole): string {
  return role === "admin" ? "/admin" : "/admin/embarques";
}

// Helper sincrónico para gates en client components o en código que
// ya recibe el rol como prop.
export function canAccess(role: UserRole, section: Section): boolean {
  return SECTION_ACCESS[section].includes(role);
}
