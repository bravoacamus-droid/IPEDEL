"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const RespuestaSchema = z.object({
  respuesta_empresa: z.string().min(10),
  estado: z.enum(["pendiente", "atendido", "cerrado"]),
});

export async function registrarRespuesta(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" } as const;

  const parsed = RespuestaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Completa la respuesta y selecciona un estado." } as const;
  }

  const { error } = await supabase
    .from("reclamaciones")
    .update({
      respuesta_empresa: parsed.data.respuesta_empresa,
      estado: parsed.data.estado,
      fecha_respuesta: parsed.data.estado === "pendiente" ? null : new Date().toISOString(),
      responded_by: user.id,
    })
    .eq("id", id);

  if (error) return { error: error.message } as const;

  revalidatePath("/admin/reclamaciones");
  revalidatePath(`/admin/reclamaciones/${id}`);
  return { ok: true } as const;
}

export async function cambiarEstadoReclamacion(
  id: string,
  estado: "pendiente" | "atendido" | "cerrado",
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("reclamaciones")
    .update({ estado })
    .eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/reclamaciones");
  revalidatePath(`/admin/reclamaciones/${id}`);
  return { ok: true } as const;
}
