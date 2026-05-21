"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { softDeleteReclamacion } from "./actions";

// Botón con confirmación que ejecuta soft-delete (no borra de DB,
// solo marca deleted_at). Permite cumplir la obligación legal de
// conservar reclamos 2 años (Indecopi) mientras se mantiene el
// panel limpio para el operador.
export function DeleteReclamacionButton({
  id,
  numero,
  variant = "icon",
}: {
  id: string;
  numero: number;
  variant?: "icon" | "full";
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    const ok = window.confirm(
      `¿Eliminar la reclamación N° ${numero} del panel?\n\nSe ocultará del listado pero se conserva en base de datos para cumplir la obligación legal de preservar reclamos por 2 años (Indecopi).`,
    );
    if (!ok) return;
    startTransition(async () => {
      const res = await softDeleteReclamacion(id);
      if (res && "error" in res) {
        window.alert(`No se pudo eliminar: ${res.error}`);
        return;
      }
      router.push("/admin/reclamaciones");
      router.refresh();
    });
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {pending ? "Eliminando…" : "Eliminar reclamación"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-ink-400 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
      aria-label={`Eliminar reclamación N° ${numero}`}
      title="Eliminar reclamación"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
