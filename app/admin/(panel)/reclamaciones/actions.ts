"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/auth/audit";

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

  const { data: before } = await supabase
    .from("reclamaciones")
    .select("numero_correlativo, estado")
    .eq("id", id)
    .maybeSingle();

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

  await logAudit({
    action: "update",
    entityType: "reclamacion",
    entityId: id,
    entityLabel: `N° ${before?.numero_correlativo ?? "?"}`,
    changes: {
      estado: { from: before?.estado, to: parsed.data.estado },
      respuesta: "registrada",
    },
  });

  revalidatePath("/admin/reclamaciones");
  revalidatePath(`/admin/reclamaciones/${id}`);
  return { ok: true } as const;
}

export async function cambiarEstadoReclamacion(
  id: string,
  estado: "pendiente" | "atendido" | "cerrado",
) {
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("reclamaciones")
    .select("numero_correlativo, estado")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("reclamaciones")
    .update({ estado })
    .eq("id", id);
  if (error) return { error: error.message } as const;

  await logAudit({
    action: "update",
    entityType: "reclamacion",
    entityId: id,
    entityLabel: `N° ${before?.numero_correlativo ?? "?"}`,
    changes: { estado: { from: before?.estado, to: estado } },
  });

  revalidatePath("/admin/reclamaciones");
  revalidatePath(`/admin/reclamaciones/${id}`);
  return { ok: true } as const;
}

// Soft-delete: oculta la reclamación del panel pero la conserva en
// DB. Indecopi (DS 011-2011-PCM Art. 12) exige preservar los reclamos
// 2 años — un hard-delete violaría esa obligación.
export async function softDeleteReclamacion(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" } as const;

  const { data: before } = await supabase
    .from("reclamaciones")
    .select("numero_correlativo")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("reclamaciones")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { error: error.message } as const;

  await logAudit({
    action: "soft_delete",
    entityType: "reclamacion",
    entityId: id,
    entityLabel: `N° ${before?.numero_correlativo ?? "?"}`,
  });

  revalidatePath("/admin/reclamaciones");
  return { ok: true } as const;
}
