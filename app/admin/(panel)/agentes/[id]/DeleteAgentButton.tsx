"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteAgent } from "../actions";

export function DeleteAgentButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm("¿Eliminar este agente?")) return;
        startTransition(async () => {
          await deleteAgent(id);
        });
      }}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Eliminando…" : "Eliminar"}
    </button>
  );
}
