"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireSectionAccess } from "@/lib/auth/rbac";

const CreateSchema = z.object({
  email: z.string().email("Correo inválido."),
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
  role: z.enum(["admin", "operator"]),
});

const UpdateRoleSchema = z.object({
  role: z.enum(["admin", "operator"]),
});

const UpdatePasswordSchema = z.object({
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

const UpdateNameSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
});

export type ActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string };

// Crea un nuevo staff (admin u operator). Usa el Auth Admin API para
// crear el usuario en auth.users con la contraseña ya seteada y
// email_confirm=true (no requiere clic en correo). Luego actualiza el
// perfil (auto-creado por trigger) con el rol indicado.
export async function createUser(formData: FormData): Promise<ActionResult> {
  await requireSectionAccess("usuarios");

  const parsed = CreateSchema.safeParse({
    email: formData.get("email"),
    full_name: formData.get("full_name"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const admin = createAdminClient();

  const { data: created, error: authErr } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  });
  if (authErr || !created.user) {
    return { ok: false, error: authErr?.message ?? "No se pudo crear el usuario." };
  }

  // El trigger handle_new_user crea la fila en profiles con rol por
  // defecto. Actualizamos rol y nombre con el admin client (bypass RLS).
  const { error: profErr } = await admin
    .from("profiles")
    .update({ role: parsed.data.role, full_name: parsed.data.full_name })
    .eq("id", created.user.id);
  if (profErr) {
    // Rollback del usuario auth para no dejar registros huérfanos.
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, error: `Error al asignar rol: ${profErr.message}` };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Usuario creado correctamente." };
}

export async function updateUserRole(
  userId: string,
  formData: FormData,
): Promise<ActionResult> {
  const staff = await requireSectionAccess("usuarios");
  if (staff.userId === userId) {
    return { ok: false, error: "No puedes cambiar tu propio rol." };
  }

  const parsed = UpdateRoleSchema.safeParse({ role: formData.get("role") });
  if (!parsed.success) {
    return { ok: false, error: "Rol inválido." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Rol actualizado." };
}

export async function updateUserName(
  userId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireSectionAccess("usuarios");
  const parsed = UpdateNameSchema.safeParse({ full_name: formData.get("full_name") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Nombre inválido." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ full_name: parsed.data.full_name })
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Nombre actualizado." };
}

export async function resetUserPassword(
  userId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireSectionAccess("usuarios");
  const parsed = UpdatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Contraseña inválida." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, message: "Contraseña actualizada." };
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  const staff = await requireSectionAccess("usuarios");
  if (staff.userId === userId) {
    return { ok: false, error: "No puedes eliminar tu propio usuario." };
  }

  const admin = createAdminClient();
  // Borrar de auth.users dispara CASCADE en profiles (FK on delete cascade).
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Usuario eliminado." };
}

// Cambio de contraseña propia (cualquier staff puede). No requiere
// rol admin — está bajo /admin/mi-cuenta.
export async function changeOwnPassword(formData: FormData): Promise<ActionResult> {
  const { requireStaff } = await import("@/lib/auth/rbac");
  const staff = await requireStaff();

  const parsed = UpdatePasswordSchema.safeParse({ password: formData.get("password") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Contraseña inválida." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(staff.userId, {
    password: parsed.data.password,
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true, message: "Contraseña cambiada correctamente." };
}
