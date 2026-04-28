"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createAgent, updateAgent } from "./actions";
import type { Agent } from "@/lib/types/database";

export function AgentForm({ mode, agent }: { mode: "create" | "edit"; agent?: Agent }) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setErrors({});
    setSuccess(false);
    startTransition(async () => {
      const res =
        mode === "create" ? await createAgent(fd) : await updateAgent(agent!.id, fd);
      if (res && "error" in res && res.error) {
        setErrors(res.error as Record<string, string[]>);
      } else if (mode === "edit") {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Nombre" required defaultValue={agent?.name} error={errors.name?.[0]} />
        <Field name="country" label="País" required defaultValue={agent?.country} error={errors.country?.[0]} />
        <Field name="city" label="Ciudad" defaultValue={agent?.city ?? ""} />
        <Field name="display_order" label="Orden" type="number" defaultValue={agent?.display_order?.toString() ?? "0"} />
        <Field name="lat" label="Latitud" type="number" defaultValue={agent?.lat?.toString() ?? ""} />
        <Field name="lng" label="Longitud" type="number" defaultValue={agent?.lng?.toString() ?? ""} />
        <Field name="contact_email" label="Email" type="email" defaultValue={agent?.contact_email ?? ""} />
        <Field name="contact_phone" label="Teléfono" defaultValue={agent?.contact_phone ?? ""} />
        <Field name="website" label="Sitio web" defaultValue={agent?.website ?? ""} />
        <Field
          name="services"
          label="Servicios (separados por coma)"
          defaultValue={agent?.services?.join(", ") ?? ""}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={agent ? agent.is_active : true}
        />
        Activo (visible en el mapa público)
      </label>
      {errors._form && <p className="text-sm text-rose-600">{errors._form[0]}</p>}
      {success && <p className="text-sm text-brand-700">✓ Cambios guardados.</p>}
      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? "Guardando…" : mode === "create" ? "Crear agente" : "Guardar cambios"}
      </button>
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
        step={type === "number" ? "any" : undefined}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
