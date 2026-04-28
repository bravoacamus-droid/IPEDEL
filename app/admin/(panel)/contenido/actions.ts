"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const ContentSchema = z.object({
  key: z.string().min(2),
  locale: z.enum(["es", "en"]),
  value: z.string().min(1),
  section: z.string().optional().or(z.literal("")),
});

export async function upsertContent(formData: FormData) {
  const supabase = await createClient();
  const parsed = ContentSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: "Datos inválidos" } as const;
  }
  const { error } = await supabase.from("site_content").upsert({
    key: parsed.data.key,
    locale: parsed.data.locale,
    value: parsed.data.value,
    section: parsed.data.section || null,
  });
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/contenido");
  revalidatePath("/[locale]", "layout");
  return { ok: true } as const;
}

export async function deleteContent(key: string, locale: "es" | "en") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .delete()
    .eq("key", key)
    .eq("locale", locale);
  if (error) return { error: error.message } as const;
  revalidatePath("/admin/contenido");
  return { ok: true } as const;
}
