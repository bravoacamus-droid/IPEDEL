"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteShipment, deleteShipmentEvent } from "../actions";

export function DeleteShipmentButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  function onClick() {
    if (!confirm("¿Eliminar este embarque y todos sus eventos? Esta acción no se puede deshacer.")) return;
    startTransition(async () => {
      await deleteShipment(id);
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {isPending ? "Eliminando…" : "Eliminar embarque"}
    </button>
  );
}

export function DeleteEventButton({
  eventId,
  shipmentId,
}: {
  eventId: string;
  shipmentId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  function onClick() {
    if (!confirm("¿Eliminar este evento de la línea de tiempo?")) return;
    startTransition(async () => {
      await deleteShipmentEvent(eventId, shipmentId);
      router.refresh();
    });
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending}
      className="text-ink-400 hover:text-rose-600 disabled:opacity-50"
      title="Eliminar evento"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
