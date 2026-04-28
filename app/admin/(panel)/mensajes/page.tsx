import { createClient } from "@/lib/supabase/server";
import type { Contact } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";
import { MensajeActions } from "./MensajeActions";

export default async function MensajesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("contacts").select("*").order("created_at", { ascending: false }).limit(200);
  if (filter === "unread") query = query.eq("is_read", false);
  const { data } = await query;
  const list = (data as Contact[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Mensajes de contacto</h1>
          <p className="text-sm text-ink-600">{list.length} mensajes.</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-ink-200 text-xs">
          <a
            href="/admin/mensajes"
            className={`px-3 py-1.5 ${!filter ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-50"}`}
          >
            Todos
          </a>
          <a
            href="/admin/mensajes?filter=unread"
            className={`px-3 py-1.5 ${filter === "unread" ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-50"}`}
          >
            No leídos
          </a>
        </div>
      </div>
      <div className="space-y-3">
        {list.map((c) => (
          <div key={c.id} className={`card p-5 ${!c.is_read ? "border-l-4 border-l-brand-500" : ""}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-ink-900">{c.asunto || "(sin asunto)"}</p>
              <span className="text-xs text-ink-500">{formatDateTime(c.created_at)}</span>
            </div>
            <p className="mt-1 text-sm text-ink-600">
              {c.nombre}
              {c.empresa ? ` · ${c.empresa}` : ""} ·{" "}
              <a href={`mailto:${c.email}`} className="text-brand-700 hover:underline">
                {c.email}
              </a>
              {c.telefono && ` · ${c.telefono}`}
            </p>
            <p className="mt-3 text-sm text-ink-800 whitespace-pre-wrap">{c.mensaje}</p>
            <div className="mt-4">
              <MensajeActions id={c.id} isRead={c.is_read} />
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-center text-ink-500 py-12">
            {filter === "unread" ? "No hay mensajes sin leer." : "Sin mensajes."}
          </p>
        )}
      </div>
    </div>
  );
}
