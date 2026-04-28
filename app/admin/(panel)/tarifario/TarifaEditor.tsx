"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { createTarifa, updateTarifa, deleteTarifa, toggleTarifa } from "./actions";
import type { Tarifa } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export function TarifaEditor({ rows }: { rows: Tarifa[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Nueva tarifa
        </button>
      </div>
      {adding && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Nueva tarifa</h3>
          <TarifaFormFields
            mode="create"
            onCancel={() => setAdding(false)}
            onSaved={() => {
              setAdding(false);
              router.refresh();
            }}
          />
        </div>
      )}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">Modalidad</th>
              <th className="px-4 py-3 text-left">Doc</th>
              <th className="px-4 py-3 text-left">Servicio</th>
              <th className="px-4 py-3 text-left">Precio</th>
              <th className="px-4 py-3 text-left">Moneda</th>
              <th className="px-4 py-3 text-left">Unidad</th>
              <th className="px-4 py-3 text-left">Activo</th>
              <th className="px-4 py-3 text-left">Actualizado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((r) => {
              const isEditing = editingId === r.id;
              if (isEditing) {
                return (
                  <tr key={r.id} className="bg-brand-50/50">
                    <td colSpan={9} className="px-4 py-4">
                      <TarifaFormFields
                        mode="edit"
                        tarifa={r}
                        onCancel={() => setEditingId(null)}
                        onSaved={() => {
                          setEditingId(null);
                          router.refresh();
                        }}
                      />
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={r.id}>
                  <td className="px-4 py-3 capitalize text-ink-700">{r.modalidad}</td>
                  <td className="px-4 py-3 text-ink-700">{r.doc_transporte}</td>
                  <td className="px-4 py-3 text-ink-900">{r.denominacion}</td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{r.precio}</td>
                  <td className="px-4 py-3 text-ink-600">{r.moneda}</td>
                  <td className="px-4 py-3 text-ink-600">{r.unidad_cobro || "—"}</td>
                  <td className="px-4 py-3">
                    <ToggleButton id={r.id} active={r.is_active} />
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-500">
                    {formatDateTime(r.updated_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(r.id);
                          setAdding(false);
                        }}
                        className="text-ink-500 hover:text-ink-900"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <DeleteButton id={r.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-ink-500">
                  Sin tarifas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TarifaFormFields({
  mode,
  tarifa,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  tarifa?: Tarifa;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = mode === "create" ? await createTarifa(fd) : await updateTarifa(tarifa!.id, fd);
      if (res && "error" in res && res.error) {
        const e = res.error as { _form?: string[] };
        setError(e._form?.[0] || "No se pudo guardar.");
      } else {
        onSaved();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div>
          <label className="label">Modalidad *</label>
          <select name="modalidad" defaultValue={tarifa?.modalidad ?? "aereo"} className="input" required>
            <option value="aereo">Aéreo</option>
            <option value="maritimo">Marítimo</option>
          </select>
        </div>
        <div>
          <label className="label">Doc</label>
          <input name="doc_transporte" defaultValue={tarifa?.doc_transporte ?? ""} className="input" placeholder="AWB / BL" />
        </div>
        <div className="lg:col-span-2">
          <label className="label">Servicio *</label>
          <input name="denominacion" required defaultValue={tarifa?.denominacion ?? ""} className="input" />
        </div>
        <div>
          <label className="label">Precio *</label>
          <input name="precio" required defaultValue={tarifa?.precio ?? ""} className="input" placeholder="250 ó 0.008 × CIF" />
        </div>
        <div>
          <label className="label">Moneda *</label>
          <select name="moneda" defaultValue={tarifa?.moneda ?? "DOLARES"} className="input" required>
            <option value="DOLARES">DOLARES</option>
            <option value="SOLES">SOLES</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="label">Unidad de cobro</label>
          <input name="unidad_cobro" defaultValue={tarifa?.unidad_cobro ?? ""} className="input" placeholder="/ AWB" />
        </div>
        <div>
          <label className="label">Orden</label>
          <input name="orden" type="number" defaultValue={tarifa?.orden?.toString() ?? "0"} className="input" />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={tarifa ? tarifa.is_active : true}
            />
            Activo
          </label>
        </div>
      </div>
      <div>
        <label className="label">Notas</label>
        <input name="notas" defaultValue={tarifa?.notas ?? ""} className="input" />
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-primary">
          <Check className="h-4 w-4" /> {isPending ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
        >
          <X className="h-4 w-4" /> Cancelar
        </button>
      </div>
    </form>
  );
}

function ToggleButton({ id, active }: { id: string; active: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleTarifa(id, active);
          router.refresh();
        });
      }}
      className={`badge cursor-pointer ${
        active ? "bg-brand-100 text-brand-800" : "bg-ink-100 text-ink-600"
      }`}
    >
      {active ? "Sí" : "No"}
    </button>
  );
}

function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm("¿Eliminar esta tarifa?")) return;
        startTransition(async () => {
          await deleteTarifa(id);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="text-ink-400 hover:text-rose-600 disabled:opacity-50"
      title="Eliminar"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
