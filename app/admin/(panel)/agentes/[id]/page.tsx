import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types/database";
import { AgentForm } from "../AgentForm";
import { DeleteAgentButton } from "./DeleteAgentButton";

export default async function AgenteEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("agents").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const agent = data as Agent;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/agentes"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Agentes
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink-900">{agent.name}</h1>
          <p className="text-sm text-ink-600">{agent.country}</p>
        </div>
        <DeleteAgentButton id={agent.id} />
      </div>
      <div className="card p-6">
        <AgentForm mode="edit" agent={agent} />
      </div>
    </div>
  );
}
