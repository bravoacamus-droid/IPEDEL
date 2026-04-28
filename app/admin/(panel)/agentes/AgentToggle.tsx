"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleAgent } from "./actions";

export function AgentToggle({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleAgent(id, active);
          router.refresh();
        })
      }
      className={`badge cursor-pointer ${
        active ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"
      }`}
    >
      {active ? "Activo" : "Inactivo"}
    </button>
  );
}
