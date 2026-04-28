"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/[locale]/contacto/actions";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    submitContact,
    undefined,
  );

  if (state?.ok) {
    return (
      <div className="rounded-lg bg-brand-50 border border-brand-300 p-6 text-brand-900">
        <p className="font-semibold">✓ {dict.contact.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="nombre"
          label={dict.contact.name}
          required
          error={state?.ok === false ? state.errors?.nombre?.[0] : undefined}
        />
        <Field name="empresa" label={dict.contact.company} />
        <Field name="email" type="email" label={dict.contact.email} required />
        <Field name="telefono" label={dict.contact.phone} />
      </div>
      <Field name="asunto" label={dict.contact.subject} required />
      <div>
        <label className="label" htmlFor="mensaje">
          {dict.contact.message}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows={5}
          className="input"
          minLength={10}
        />
      </div>
      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>{dict.contact.consent}</span>
      </label>
      {state?.ok === false && state.message && (
        <p className="text-sm text-rose-600">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? dict.common.loading : dict.contact.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input id={name} name={name} type={type} required={required} className="input" />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
