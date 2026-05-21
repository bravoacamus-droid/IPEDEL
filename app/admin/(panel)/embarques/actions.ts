"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ShipmentSchema = z.object({
  hbl_number: z.string().min(3),
  mbl_number: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  origin: z.string().optional().or(z.literal("")),
  destination: z.string().optional().or(z.literal("")),
  // carrier y containers permanecen en DB para histórico pero ya no
  // se envían desde el form. Se aceptan opcionalmente para no romper
  // payloads externos. Volumen reemplaza al "transportista" en UI.
  carrier: z.string().optional().or(z.literal("")),
  mode: z.enum(["aereo", "maritimo", "terrestre"]),
  status: z.enum([
    "recibido",
    "en_transito",
    "en_aduana",
    "desconsolidado",
    "en_almacen",
    "en_despacho",
    "en_camino_entrega",
    "entregado",
  ]),
  eta: z.string().optional().or(z.literal("")),
  etd: z.string().optional().or(z.literal("")),
  client_name: z.string().optional().or(z.literal("")),
  weight_kg: z.string().optional().or(z.literal("")),
  volumen_cbm: z.string().optional().or(z.literal("")),
  containers: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

function emptyToNull(o: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) out[k] = v === "" ? null : v;
  return out;
}

export async function createShipment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const parsed = ShipmentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }

  const payload = emptyToNull({
    ...parsed.data,
    weight_kg: parsed.data.weight_kg ? Number(parsed.data.weight_kg) : null,
    volumen_cbm: parsed.data.volumen_cbm ? Number(parsed.data.volumen_cbm) : null,
    created_by: user.id,
  });

  const { data, error } = await supabase
    .from("shipments")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: { _form: [error.message] } } as const;

  revalidatePath("/admin/embarques");
  redirect(`/admin/embarques/${data.id}`);
}

export async function updateShipment(id: string, formData: FormData) {
  const supabase = await createClient();
  const parsed = ShipmentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }

  const payload = emptyToNull({
    ...parsed.data,
    weight_kg: parsed.data.weight_kg ? Number(parsed.data.weight_kg) : null,
    volumen_cbm: parsed.data.volumen_cbm ? Number(parsed.data.volumen_cbm) : null,
  });

  const { error } = await supabase.from("shipments").update(payload).eq("id", id);
  if (error) return { error: { _form: [error.message] } } as const;

  revalidatePath("/admin/embarques");
  revalidatePath(`/admin/embarques/${id}`);
  return { ok: true } as const;
}

export async function deleteShipment(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("shipments").delete().eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/embarques");
  redirect("/admin/embarques");
}

const EventSchema = z.object({
  shipment_id: z.string().uuid(),
  event_date: z.string().min(1),
  status_label: z.string().min(2),
  location: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  is_current: z.union([z.literal("on"), z.literal("")]).optional(),
});

export async function addShipmentEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const parsed = EventSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }
  const isCurrent = parsed.data.is_current === "on";

  if (isCurrent) {
    // Reset other events for this shipment
    await supabase
      .from("shipment_events")
      .update({ is_current: false })
      .eq("shipment_id", parsed.data.shipment_id);
  }

  const { error } = await supabase.from("shipment_events").insert({
    shipment_id: parsed.data.shipment_id,
    event_date: parsed.data.event_date,
    status_label: parsed.data.status_label,
    location: parsed.data.location || null,
    description: parsed.data.description || null,
    is_current: isCurrent,
    created_by: user.id,
  });
  if (error) return { error: { _form: [error.message] } } as const;

  revalidatePath(`/admin/embarques/${parsed.data.shipment_id}`);
  return { ok: true } as const;
}

export async function deleteShipmentEvent(eventId: string, shipmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("shipment_events").delete().eq("id", eventId);
  if (error) return { error: error.message } as const;
  revalidatePath(`/admin/embarques/${shipmentId}`);
  return { ok: true } as const;
}
