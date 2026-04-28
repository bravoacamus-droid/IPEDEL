"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleMensajeRead(id: string, current: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contacts")
    .update({
      is_read: !current,
      responded_at: !current ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/mensajes");
  return { ok: true } as const;
}

export async function deleteMensaje(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/mensajes");
  return { ok: true } as const;
}
