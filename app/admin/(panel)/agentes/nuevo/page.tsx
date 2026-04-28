import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AgentForm } from "../AgentForm";

export default function NuevoAgentePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/agentes"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Agentes
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink-900">Nuevo agente</h1>
      </div>
      <div className="card p-6">
        <AgentForm mode="create" />
      </div>
    </div>
  );
}
