"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createShipment, updateShipment } from "./actions";
import {
  ACTIVE_SHIPMENT_STATUSES,
  SHIPMENT_STATUS_LABELS,
  type Shipment,
} from "@/lib/types/database";

export function ShipmentForm({
  mode,
  shipment,
}: {
  mode: "create" | "edit";
  shipment?: Shipment;
}) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    startTransition(async () => {
      const res =
        mode === "create"
          ? await createShipment(formData)
          : await updateShipment(shipment!.id, formData);
      if (res && "error" in res && res.error) {
        setErrors(res.error as Record<string, string[]>);
      } else if (mode === "edit") {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="hbl_number"
          label="HBL"
          required
          defaultValue={shipment?.hbl_number}
          error={errors.hbl_number?.[0]}
        />
        <Field name="mbl_number" label="MBL" defaultValue={shipment?.mbl_number ?? ""} />
        <Field name="client_name" label="Cliente" defaultValue={shipment?.client_name ?? ""} />
        <Field name="carrier" label="Transportista" defaultValue={shipment?.carrier ?? ""} />
        <Select
          name="mode"
          label="Modo"
          defaultValue={shipment?.mode ?? "aereo"}
          options={[
            { value: "aereo", label: "Aéreo" },
            { value: "maritimo", label: "Marítimo" },
            { value: "terrestre", label: "Terrestre" },
          ]}
        />
        <Select
          name="status"
          label="Estado"
          defaultValue={shipment?.status ?? "recibido"}
          options={ACTIVE_SHIPMENT_STATUSES.map((s) => ({ value: s, label: SHIPMENT_STATUS_LABELS[s].es }))}
        />
        <Field name="origin" label="Origen" defaultValue={shipment?.origin ?? ""} />
        <Field name="destination" label="Destino" defaultValue={shipment?.destination ?? ""} />
        <Field name="etd" type="date" label="ETD" defaultValue={shipment?.etd ?? ""} />
        <Field name="eta" type="date" label="ETA" defaultValue={shipment?.eta ?? ""} />
        <Field
          name="weight_kg"
          type="number"
          label="Peso (kg)"
          defaultValue={shipment?.weight_kg?.toString() ?? ""}
        />
        <Field name="containers" label="Contenedores" defaultValue={shipment?.containers ?? ""} />
      </div>
      <div>
        <label className="label">Descripción</label>
        <textarea
          name="description"
          rows={2}
          className="input"
          defaultValue={shipment?.description ?? ""}
        />
      </div>
      <div>
        <label className="label">Notas internas</label>
        <textarea
          name="notes"
          rows={3}
          className="input"
          defaultValue={shipment?.notes ?? ""}
        />
      </div>
      {errors._form && <p className="text-sm text-rose-600">{errors._form[0]}</p>}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? "Guardando…" : mode === "create" ? "Crear embarque" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="input"
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={defaultValue} className="input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
