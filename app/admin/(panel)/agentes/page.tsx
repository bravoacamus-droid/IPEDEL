import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types/database";
import { AgentToggle } from "./AgentToggle";

export default async function AdminAgentesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("agents").select("*").order("display_order");
  const list = (data as Agent[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Agentes</h1>
          <p className="text-sm text-ink-600">{list.length} registrados.</p>
        </div>
        <Link href="/admin/agentes/nuevo" className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo agente
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
                  {a.country}
                </p>
                <Link
                  href={`/admin/agentes/${a.id}`}
                  className="font-semibold text-ink-900 hover:underline"
                >
                  {a.name}
                </Link>
                <p className="text-sm text-ink-600">{a.city || ""}</p>
              </div>
              <AgentToggle id={a.id} active={a.is_active} />
            </div>
            <p className="mt-3 text-xs text-ink-500">{a.contact_email}</p>
            <p className="text-xs text-ink-500">{a.contact_phone}</p>
            {a.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {a.services.map((s) => (
                  <span key={s} className="badge bg-ink-100 text-ink-700">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
