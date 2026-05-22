"use client";

import { useActionState } from "react";
import { CheckCircle2, Mail, Send, ShieldAlert } from "lucide-react";
import { requestPasswordReset, type RequestResetState } from "./actions";

export function RecoverForm() {
  const [state, action, pending] = useActionState<RequestResetState, FormData>(
    requestPasswordReset,
    undefined,
  );

  // Estado de éxito (mensaje neutral, no revela si existe la cuenta)
  if (state?.ok) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-black">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-900">
              Si existe una cuenta con ese correo, ya enviamos las instrucciones.
            </p>
            <p className="mt-1.5 text-xs text-brand-800">
              Revisá la bandeja de entrada de{" "}
              <span className="font-mono">{state.emailSent}</span> en los
              próximos minutos. El enlace expira en 1 hora.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-600"
        >
          Correo electrónico
        </label>
        <div className="relative mt-1.5">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu.correo@ipeperu.com"
            className="block w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {state?.ok === false && state.message && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          <ShieldAlert
            className="mt-0.5 h-4 w-4 shrink-0 text-rose-600"
            strokeWidth={1.8}
          />
          <p>{state.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-black shadow-sm transition-all hover:bg-brand-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar enlace de recuperación
          </>
        )}
      </button>
    </form>
  );
}
