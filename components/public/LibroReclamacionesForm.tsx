"use client";

import { useActionState, useState } from "react";
import { submitReclamacion, type ReclamacionState } from "@/app/[locale]/libro-de-reclamaciones/actions";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import { UbigeoSelect } from "./UbigeoSelect";

export function LibroReclamacionesForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<ReclamacionState, FormData>(
    submitReclamacion,
    undefined,
  );
  const [esMenor, setEsMenor] = useState(false);

  if (state?.ok) {
    return (
      <div className="rounded-lg bg-brand-50 border border-brand-300 p-6 text-brand-900">
        <p className="font-semibold">
          ✓ {dict.ldr.success.replace("{n}", String(state.numero))}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-8">
      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-3">
          {dict.ldr.type}
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Radio name="tipo" value="reclamo" label={dict.ldr.type_reclamo} required />
          <Radio name="tipo" value="queja" label={dict.ldr.type_queja} />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-3">
          {dict.ldr.consumer_data}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="nombres" label={dict.ldr.first_name} required />
          <Field name="apellidos" label={dict.ldr.last_name} required />
          <div>
            <label className="label">{dict.ldr.doc_type}</label>
            <select name="tipo_documento" defaultValue="DNI" className="input">
              <option value="DNI">DNI</option>
              <option value="CE">Carné de Extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>
          <Field name="numero_documento" label={dict.ldr.doc_number} required />
          <Field name="email" type="email" label={dict.ldr.email} required />
          <Field name="telefono" label={dict.ldr.phone} />
        </div>
        <div className="mt-4">
          <Field name="direccion" label={dict.ldr.address} />
        </div>
        <div className="mt-4">
          <UbigeoSelect
            required
            labels={{
              departamento: "Departamento",
              provincia: "Provincia",
              distrito: "Distrito",
            }}
          />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="es_menor_edad"
            checked={esMenor}
            onChange={(e) => setEsMenor(e.target.checked)}
          />
          {dict.ldr.minor}
        </label>
        {esMenor && (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field name="representante_nombre" label={dict.ldr.rep_name} required={esMenor} />
            <Field name="representante_documento" label={dict.ldr.rep_doc} required={esMenor} />
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-3">
          {dict.ldr.service_data}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="bien_servicio" label={dict.ldr.service} required />
          <Field name="monto_reclamado" label={dict.ldr.amount} type="number" />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="detalle">
            {dict.ldr.detail} *
          </label>
          <textarea id="detalle" name="detalle" required rows={4} className="input" minLength={20} />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="pedido_consumidor">
            {dict.ldr.request} *
          </label>
          <textarea
            id="pedido_consumidor"
            name="pedido_consumidor"
            required
            rows={3}
            className="input"
            minLength={10}
          />
        </div>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>{dict.ldr.consent}</span>
      </label>

      {state?.ok === false && state.message && (
        <p className="text-sm text-rose-600">{state.message}</p>
      )}

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? dict.common.loading : dict.ldr.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="input" />
    </div>
  );
}

function Radio({
  name,
  value,
  label,
  required,
}: {
  name: string;
  value: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-ink-200 p-3 text-sm hover:border-brand-500 cursor-pointer has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
      <input type="radio" name={name} value={value} required={required} className="mt-0.5" />
      <span>{label}</span>
    </label>
  );
}
