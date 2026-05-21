"use client";

import { useActionState, useState } from "react";
import { Download, Mail } from "lucide-react";
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
      <div className="rounded-2xl border border-brand-300 bg-brand-50 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-brand-900">
              {dict.ldr.success.replace("{n}", String(state.numero))}
            </p>
            <p className="mt-2 text-sm text-brand-800">{dict.ldr.keep_constancia}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={state.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-ink-800"
              >
                <Download className="h-4 w-4" strokeWidth={1.6} />
                {dict.ldr.download_copy}
              </a>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-300 bg-white px-5 py-2.5 text-sm text-brand-900">
                <Mail className="h-4 w-4" strokeWidth={1.6} />
                {dict.ldr.copy_sent_by_email}
              </span>
            </div>
            <p className="mt-4 text-xs text-brand-700">
              {dict.ldr.sheet_number} <span className="font-semibold">{state.numero}</span> ·
              IPE DEL PERU S.A.C. · RUC 20197900378
            </p>
          </div>
        </div>
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
