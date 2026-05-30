"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ResetForm } from "./ResetForm";

type GateState =
  | { status: "loading" }
  | { status: "ready"; email: string | null }
  | { status: "expired"; reason: string };

// Captura los tokens del HASH que deja Supabase tras verificar el link
// (#access_token=...&refresh_token=...&type=recovery), monta la sesion
// con setSession() — eso escribe las cookies de @supabase/ssr en el
// dominio ipeperu.com — y recien ahi muestra el formulario. Si no hay
// hash (recarga, bookmark) pero ya hay sesion activa via cookie, igual
// deja pasar. En cualquier otro caso muestra "enlace expirado".
export function RecoveryGate() {
  const [state, setState] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");
      const errorDescription = params.get("error_description");

      // Caso 1: Supabase nos manda un error en el hash (link expirado
      // del lado server, ya usado, etc.).
      if (errorDescription) {
        setState({
          status: "expired",
          reason: errorDescription.replace(/\+/g, " "),
        });
        return;
      }

      // Caso 2: tenemos los tokens — montamos sesion.
      if (accessToken && refreshToken && type === "recovery") {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Limpiamos el hash de la URL para que un F5 no reintente con
        // tokens ya usados.
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", cleanUrl);

        if (error || !data.session) {
          setState({
            status: "expired",
            reason: error?.message ?? "No se pudo iniciar la sesión de recuperación.",
          });
          return;
        }
        setState({
          status: "ready",
          email: data.session.user.email ?? null,
        });
        return;
      }

      // Caso 3: sin hash — quiza ya hay sesion (el usuario recargo la
      // pagina despues de haber clickeado el link). Verificamos cookie.
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setState({ status: "ready", email: data.user.email ?? null });
        return;
      }

      setState({
        status: "expired",
        reason: "El link de recuperación ya no es válido.",
      });
    }

    init();
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-ink-100 bg-ink-50 p-4 text-sm text-ink-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-300 border-t-ink-700" />
        Validando enlace…
      </div>
    );
  }

  if (state.status === "expired") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold">Enlace expirado o inválido</p>
        <p className="mt-1 text-xs">
          {state.reason} Pedí uno nuevo desde la página de recuperación.
        </p>
        <Link
          href="/admin/recuperar"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-black hover:bg-brand-400"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <>
      {state.email ? (
        <p className="mb-6 text-sm text-ink-600">
          Definí una contraseña nueva para{" "}
          <span className="font-mono text-ink-900">{state.email}</span>. Mínimo
          8 caracteres.
        </p>
      ) : (
        <p className="mb-6 text-sm text-ink-600">
          Definí tu nueva contraseña. Mínimo 8 caracteres.
        </p>
      )}
      <ResetForm />
    </>
  );
}
