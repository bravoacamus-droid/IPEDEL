import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/lib/types/database";
import { ContentEditor } from "./ContentEditor";

export default async function ContenidoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("*")
    .order("section")
    .order("key");
  const list = (data as SiteContent[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Contenido editable</h1>
        <p className="text-sm text-ink-600">
          {list.length} entradas · cualquier cambio se publica al instante en el sitio.
        </p>
      </div>
      <ContentEditor rows={list} />
    </div>
  );
}
