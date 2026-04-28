import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types/database";

export default async function AdminAgentesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("agents").select("*").order("display_order");
  const list = (data as Agent[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Agentes</h1>
          <p className="text-sm text-ink-600">Listado para mapa interactivo (Sprint 4).</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <div key={a.id} className="card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-brand-600">{a.country}</p>
            <h2 className="mt-1 font-semibold text-ink-900">{a.name}</h2>
            <p className="text-sm text-ink-600">{a.city || ""}</p>
            <p className="mt-3 text-xs text-ink-500">{a.contact_email}</p>
            <p className="text-xs text-ink-500">{a.contact_phone}</p>
            <p className="mt-2 text-xs">
              <span className={`badge ${a.is_active ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"}`}>
                {a.is_active ? "Activo en mapa" : "Inactivo"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
