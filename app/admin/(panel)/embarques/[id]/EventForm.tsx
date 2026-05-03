"use client";

import { useTransition, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addShipmentEvent } from "../actions";
import { ACTIVE_SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS } from "@/lib/types/database";

export function EventForm({ shipmentId }: { shipmentId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("shipment_id", shipmentId);
    setError(null);
    startTransition(async () => {
      const res = await addShipmentEvent(formData);
      if (res && "error" in res && res.error) {
        setError((res.error as { _form?: string[] })._form?.[0] ?? "No se pudo agregar el evento.");
      } else {
        formRef.current?.reset();
        router.refresh();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="event_date">Fecha y hora *</label>
          <input
            id="event_date"
            name="event_date"
            type="datetime-local"
            required
            className="input"
            defaultValue={new Date().toISOString().slice(0, 16)}
          />
        </div>
        <div>
          <label className="label" htmlFor="status_label">Estado *</label>
          <select id="status_label" name="status_label" required className="input" defaultValue="">
            <option value="" disabled>Selecciona un estado</option>
            {ACTIVE_SHIPMENT_STATUSES.map((s) => (
              <option key={s} value={SHIPMENT_STATUS_LABELS[s].es}>
                {SHIPMENT_STATUS_LABELS[s].es}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="location">Ubicación</label>
        <input id="location" name="location" className="input" placeholder="Ej. Callao, Perú" />
      </div>
      <div>
        <label className="label" htmlFor="description">Descripción</label>
        <textarea id="description" name="description" rows={2} className="input" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input type="checkbox" name="is_current" defaultChecked />
        Marcar como estado actual
      </label>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Agregando…" : "Agregar evento"}
      </button>
    </form>
  );
}
