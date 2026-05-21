"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/auth/audit";

const TarifaSchema = z.object({
  modalidad: z.enum(["aereo", "maritimo"]),
  doc_transporte: z.string().optional().or(z.literal("")),
  denominacion: z.string().min(2),
  precio: z.string().min(1),
  moneda: z.enum(["DOLARES", "SOLES"]),
  unidad_cobro: z.string().optional().or(z.literal("")),
  notas: z.string().optional().or(z.literal("")),
  orden: z.string().optional().or(z.literal("")),
  is_active: z.union([z.literal("on"), z.literal("")]).optional(),
  tipo_operacion: z.string().optional().or(z.literal("")),
  tipo_envio: z.string().optional().or(z.literal("")),
});

function payloadFrom(parsed: z.infer<typeof TarifaSchema>) {
  return {
    modalidad: parsed.modalidad,
    doc_transporte: parsed.doc_transporte || null,
    denominacion: parsed.denominacion,
    precio: parsed.precio,
    moneda: parsed.moneda,
    unidad_cobro: parsed.unidad_cobro || null,
    notas: parsed.notas || null,
    orden: parsed.orden ? Number(parsed.orden) : 0,
    is_active: parsed.is_active === "on",
    tipo_operacion: parsed.tipo_operacion || "INGRESO",
    tipo_envio: parsed.tipo_envio || "IMPORTACION",
  };
}

export async function createTarifa(formData: FormData) {
  const supabase = await createClient();
  const parsed = TarifaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }
  const payload = payloadFrom(parsed.data);
  const { data, error } = await supabase
    .from("tarifario")
    .insert(payload)
    .select("id")
    .single();
  if (error) return { error: { _form: [error.message] } } as const;
  await logAudit({
    action: "create",
    entityType: "tarifa",
    entityId: data.id,
    entityLabel: `${payload.modalidad} · ${payload.denominacion}`,
    changes: { precio: payload.precio, moneda: payload.moneda },
  });
  revalidatePath("/admin/tarifario");
  revalidatePath("/[locale]/tarifario", "page");
  return { ok: true } as const;
}

export async function updateTarifa(id: string, formData: FormData) {
  const supabase = await createClient();
  const parsed = TarifaSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }
  const payload = payloadFrom(parsed.data);
  const { data: before } = await supabase
    .from("tarifario")
    .select("denominacion, precio, moneda")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("tarifario").update(payload).eq("id", id);
  if (error) return { error: { _form: [error.message] } } as const;
  await logAudit({
    action: "update",
    entityType: "tarifa",
    entityId: id,
    entityLabel: `${payload.modalidad} · ${payload.denominacion}`,
    changes: {
      precio: { from: before?.precio, to: payload.precio },
      moneda: { from: before?.moneda, to: payload.moneda },
    },
  });
  revalidatePath("/admin/tarifario");
  revalidatePath("/[locale]/tarifario", "page");
  return { ok: true } as const;
}

export async function deleteTarifa(id: string) {
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("tarifario")
    .select("modalidad, denominacion")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("tarifario").delete().eq("id", id);
  if (error) return { error: error.message } as const;
  await logAudit({
    action: "delete",
    entityType: "tarifa",
    entityId: id,
    entityLabel: before ? `${before.modalidad} · ${before.denominacion}` : id,
  });
  revalidatePath("/admin/tarifario");
  revalidatePath("/[locale]/tarifario", "page");
  return { ok: true } as const;
}

export async function toggleTarifa(id: string, current: boolean) {
  const supabase = await createClient();
  const { data: before } = await supabase
    .from("tarifario")
    .select("denominacion")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase
    .from("tarifario")
    .update({ is_active: !current })
    .eq("id", id);
  if (error) return { error: error.message } as const;
  await logAudit({
    action: "toggle_active",
    entityType: "tarifa",
    entityId: id,
    entityLabel: before?.denominacion ?? id,
    changes: { is_active: { from: current, to: !current } },
  });
  revalidatePath("/admin/tarifario");
  revalidatePath("/[locale]/tarifario", "page");
  return { ok: true } as const;
}
