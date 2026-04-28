"use client";

import { use, useActionState } from "react";
import { signIn, type LoginState } from "./actions";

export function LoginForm({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ next?: string; error?: string }>;
}) {
  const sp = use(searchParamsPromise);
  const [state, action, pending] = useActionState<LoginState, FormData>(
    signIn,
    sp.error ? { ok: false, message: "Sesión cerrada o credenciales inválidas." } : undefined,
  );

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={sp.next || "/admin"} />
      <div>
        <label className="label" htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="input"
        />
      </div>
      {state?.ok === false && state.message && (
        <p className="text-sm text-rose-600">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
