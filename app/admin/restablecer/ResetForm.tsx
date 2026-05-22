"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Eye, EyeOff, Lock, ShieldAlert } from "lucide-react";
import { setNewPassword, type ResetState } from "./actions";

export function ResetForm() {
  const [state, action, pending] = useActionState<ResetState, FormData>(
    setNewPassword,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-600"
        >
          Nueva contraseña
        </label>
        <div className="relative mt-1.5">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            strokeWidth={1.8}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            className="block w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-10 pr-11 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ink-400 hover:bg-ink-100 hover:text-ink-700"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="password_confirm"
          className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink-600"
        >
          Confirmar contraseña
        </label>
        <div className="relative mt-1.5">
          <Lock
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            strokeWidth={1.8}
          />
          <input
            id="password_confirm"
            name="password_confirm"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Repetí la nueva contraseña"
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
            Guardando…
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Guardar nueva contraseña
          </>
        )}
      </button>
    </form>
  );
}
