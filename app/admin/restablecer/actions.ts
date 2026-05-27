"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Schema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    password_confirm: z.string(),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: "Las contraseñas no coinciden.",
    path: ["password_confirm"],
  });

export type ResetState =
  | { ok: false; message: string }
  | undefined;

// Cuando el usuario llega via el magic link de recuperación, Supabase
// crea una sesión efímera. updateUser() opera sobre esa sesión.
export async function setNewPassword(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const parsed = Schema.safeParse({
    password: formData.get("password"),
    password_confirm: formData.get("password_confirm"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      message: "El enlace ya expiró o no es válido. Solicitá uno nuevo.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { ok: false, message: error.message };
  }

  // user destructured arriba garantiza que la sesion existe; el
  // redirect cierra el flujo.
  void user;
  redirect("/admin?reset=1");
}
