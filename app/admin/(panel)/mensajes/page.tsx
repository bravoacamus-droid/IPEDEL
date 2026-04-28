import { createClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export default async function MensajesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const list = (data as Contact[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Mensajes de contacto</h1>
        <p className="text-sm text-ink-600">{list.length} mensajes recientes.</p>
      </div>
      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className={`card p-5 ${!c.is_read ? "border-l-4 border-l-brand-500" : ""}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-ink-900">{c.asunto || "(sin asunto)"}</p>
              <span className="text-xs text-ink-500">{formatDateTime(c.created_at)}</span>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              {c.nombre} {c.empresa ? `· ${c.empresa}` : ""} · <a href={`mailto:${c.email}`} className="text-brand-700 hover:underline">{c.email}</a>
              {c.telefono && ` · ${c.telefono}`}
            </p>
            <p className="mt-3 text-sm text-ink-800 whitespace-pre-wrap">{c.mensaje}</p>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center text-ink-500 py-12">Sin mensajes.</p>
        )}
      </div>
    </div>
  );
}
