"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { softDeleteReclamacion } from "./actions";
import { useConfirm } from "@/components/admin/ConfirmDialog";

// Soft-delete con confirmación tipo modal (reemplaza window.confirm).
// La reclamación se marca como eliminada (deleted_at) pero permanece
// en DB durante 2 años para cumplir DS 011-2011-PCM Art. 12.
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
  const { confirm, dialog, close } = useConfirm();

  async function handleClick() {
    const ok = await confirm({
      title: `Eliminar reclamación N° ${numero}`,
      description: (
        <>
          Se ocultará del listado pero permanece en base de datos para cumplir
          el plazo legal de conservación de 2 años (Indecopi).
        </>
      ),
      confirmLabel: "Eliminar",
      variant: "danger",
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await softDeleteReclamacion(id);
      close();
      if (res && "error" in res) {
        toast.error("No se pudo eliminar", { description: res.error });
        return;
      }
      toast.success(`Reclamación N° ${numero} eliminada`);
      router.push("/admin/reclamaciones");
      router.refresh();
    });
  }

  if (variant === "full") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {pending ? "Eliminando…" : "Eliminar reclamación"}
        </button>
        {dialog}
      </>
    );
  }

  return (
    <>
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
      {dialog}
    </>
  );
}
