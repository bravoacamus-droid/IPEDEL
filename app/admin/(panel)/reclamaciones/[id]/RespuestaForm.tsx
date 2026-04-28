"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { registrarRespuesta } from "../actions";
import type { Reclamacion } from "@/lib/types/database";

export function RespuestaForm({ id, initial }: { id: string; initial: Reclamacion }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const res = await registrarRespuesta(id, fd);
      if (res && "error" in res && res.error) {
        setError(typeof res.error === "string" ? res.error : "No se pudo guardar.");
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3">
      <div>
        <label className="label" htmlFor="estado">Estado</label>
        <select
          id="estado"
          name="estado"
          defaultValue={initial.estado}
          className="input"
        >
          <option value="pendiente">Pendiente</option>
          <option value="atendido">Atendido</option>
          <option value="cerrado">Cerrado</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="respuesta_empresa">Respuesta</label>
        <textarea
          id="respuesta_empresa"
          name="respuesta_empresa"
          rows={6}
          required
          minLength={10}
          defaultValue={initial.respuesta_empresa ?? ""}
          className="input"
        />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      {success && <p className="text-sm text-brand-700">✓ Respuesta guardada.</p>}
      <button type="submit" disabled={isPending} className="btn-primary w-full justify-center">
        {isPending ? "Guardando…" : "Guardar respuesta"}
      </button>
    </form>
  );
}
