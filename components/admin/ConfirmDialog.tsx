"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

// Modal de confirmación con foco automático en "Cancelar" (default
// seguro) y tecla Esc para cerrar. Variant "danger" pinta el botón
// de confirmación en rojo (para eliminaciones).
export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Cerrar con Esc.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => !pending && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-md rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3 border-b border-ink-100 px-6 py-4">
          {isDanger && (
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          )}
          <div>
            <h2 id="confirm-title" className="text-lg font-semibold text-ink-900">
              {title}
            </h2>
            {description && (
              <div className="mt-1 text-sm text-ink-600">{description}</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 bg-ink-50 px-6 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            autoFocus
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={
              isDanger
                ? "rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                : "rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-black hover:bg-brand-400 disabled:opacity-50"
            }
          >
            {pending ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook simple para usar el dialog imperativamente desde cualquier
// client component:
//
//   const { confirm, dialog } = useConfirm();
//   const ok = await confirm({ title: "...", variant: "danger" });
//   if (ok) doSomething();
//   return <>{dialog}{...}</>;
export function useConfirm() {
  const [state, setState] = useState<
    | (Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel" | "pending"> & {
        resolve: (v: boolean) => void;
      })
    | null
  >(null);
  const [pending, setPending] = useState(false);

  function confirm(opts: Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel" | "pending">) {
    return new Promise<boolean>((resolve) => {
      setPending(false);
      setState({ ...opts, resolve });
    });
  }

  const dialog = (
    <ConfirmDialog
      open={state !== null}
      title={state?.title ?? ""}
      description={state?.description}
      confirmLabel={state?.confirmLabel}
      cancelLabel={state?.cancelLabel}
      variant={state?.variant}
      pending={pending}
      onConfirm={() => {
        setPending(true);
        state?.resolve(true);
        // El consumidor cierra el dialog explícitamente llamando
        // setState(null) cuando termina su accion async.
      }}
      onCancel={() => {
        state?.resolve(false);
        setState(null);
      }}
    />
  );

  // close() permite cerrar el dialog después de que la promesa
  // resuelva (típicamente cuando la action server terminó).
  function close() {
    setState(null);
    setPending(false);
  }

  return { confirm, dialog, close };
}
