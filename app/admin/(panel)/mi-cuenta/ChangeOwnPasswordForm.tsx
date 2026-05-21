"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { changeOwnPassword } from "../usuarios/actions";

export function ChangeOwnPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const pwd = String(fd.get("password") || "");
    const confirm = String(fd.get("password_confirm") || "");
    setError(null);

    if (pwd !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    startTransition(async () => {
      const res = await changeOwnPassword(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success("Contraseña actualizada", {
        description: "Cerrá sesión y volvé a entrar para usarla.",
      });
      form.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label" htmlFor="password">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="password_confirm">
          Repetí la nueva contraseña
        </label>
        <input
          id="password_confirm"
          name="password_confirm"
          type="password"
          required
          minLength={8}
          className="input"
        />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
