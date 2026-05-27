"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const AgentSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  city: z.string().optional().or(z.literal("")),
  lat: z.string().optional().or(z.literal("")),
  lng: z.string().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  services: z.string().optional().or(z.literal("")),
  display_order: z.string().optional().or(z.literal("")),
  is_active: z.union([z.literal("on"), z.literal("")]).optional(),
});

function payloadFrom(d: z.infer<typeof AgentSchema>) {
  return {
    name: d.name,
    country: d.country,
    city: d.city || null,
    lat: d.lat ? Number(d.lat) : null,
    lng: d.lng ? Number(d.lng) : null,
    contact_email: d.contact_email || null,
    contact_phone: d.contact_phone || null,
    website: d.website || null,
    services: d.services
      ? d.services.split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    display_order: d.display_order ? Number(d.display_order) : 0,
    is_active: d.is_active === "on",
  };
}

export async function createAgent(formData: FormData) {
  const supabase = await createClient();
  const parsed = AgentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }
  const { error } = await supabase.from("agents").insert(payloadFrom(parsed.data));
  if (error) return { error: { _form: [error.message] } } as const;
  revalidatePath("/admin/agentes");
  revalidatePath("/[locale]/agentes", "page");
  redirect("/admin/agentes");
}

export async function updateAgent(id: string, formData: FormData) {
  const supabase = await createClient();
  const parsed = AgentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors } as const;
  }
  const { error } = await supabase.from("agents").update(payloadFrom(parsed.data)).eq("id", id);
  if (error) return { error: { _form: [error.message] } } as const;
  revalidatePath("/admin/agentes");
  revalidatePath("/[locale]/agentes", "page");
  return { ok: true } as const;
}

export async function deleteAgent(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/agentes");
  revalidatePath("/[locale]/agentes", "page");
  redirect("/admin/agentes");
}

export async function toggleAgent(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("agents")
    .update({ is_active: !current })
    .eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/agentes");
  revalidatePath("/[locale]/agentes", "page");
  return { ok: true } as const;
}
