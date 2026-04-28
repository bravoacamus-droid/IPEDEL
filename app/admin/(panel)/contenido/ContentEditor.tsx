"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { upsertContent, deleteContent } from "./actions";
import type { SiteContent } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";

export function ContentEditor({ rows }: { rows: SiteContent[] }) {
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<{ key: string; locale: "es" | "en" } | null>(null);
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setAdding(true);
            setEditing(null);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Nueva entrada
        </button>
      </div>

      {adding && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-ink-900 mb-4">Nueva entrada</h3>
          <ContentForm
            mode="create"
            onCancel={() => setAdding(false)}
            onSaved={() => {
              setAdding(false);
              router.refresh();
            }}
          />
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">Sección</th>
              <th className="px-4 py-3 text-left">Llave</th>
              <th className="px-4 py-3 text-left">Idioma</th>
              <th className="px-4 py-3 text-left">Valor</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((c) => {
              const isEditing = editing?.key === c.key && editing.locale === c.locale;
              if (isEditing) {
                return (
                  <tr key={`${c.key}-${c.locale}`} className="bg-brand-50/50">
                    <td colSpan={5} className="px-4 py-4">
                      <ContentForm
                        mode="edit"
                        initial={c}
                        onCancel={() => setEditing(null)}
                        onSaved={() => {
                          setEditing(null);
                          router.refresh();
                        }}
                      />
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={`${c.key}-${c.locale}`}>
                  <td className="px-4 py-3 text-ink-700">{c.section}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-900">{c.key}</td>
                  <td className="px-4 py-3 uppercase text-ink-600">{c.locale}</td>
                  <td className="px-4 py-3 text-ink-800 max-w-md truncate">{c.value}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing({ key: c.key, locale: c.locale });
                          setAdding(false);
                        }}
                        className="text-ink-500 hover:text-ink-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <DeleteButton entryKey={c.key} locale={c.locale} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentForm({
  mode,
  initial,
  onCancel,
  onSaved,
}: {
  mode: "create" | "edit";
  initial?: SiteContent;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await upsertContent(fd);
      if (res && "error" in res && res.error) setError(res.error);
      else onSaved();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label">Sección</label>
          <input
            name="section"
            className="input"
            defaultValue={initial?.section ?? ""}
            placeholder="home, nosotros…"
          />
        </div>
        <div>
          <label className="label">Llave *</label>
          <input
            name="key"
            required
            className="input font-mono"
            defaultValue={initial?.key ?? ""}
            placeholder="home_hero_title"
            readOnly={mode === "edit"}
          />
        </div>
        <div>
          <label className="label">Idioma *</label>
          <select
            name="locale"
            className="input"
            defaultValue={initial?.locale ?? "es"}
            disabled={mode === "edit"}
          >
            <option value="es">ES — Español</option>
            <option value="en">EN — English</option>
          </select>
          {mode === "edit" && (
            <input type="hidden" name="locale" value={initial!.locale} />
          )}
        </div>
      </div>
      <div>
        <label className="label">Valor *</label>
        <textarea
          name="value"
          required
          rows={4}
          className="input"
          defaultValue={initial?.value ?? ""}
        />
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

function DeleteButton({ entryKey, locale }: { entryKey: string; locale: "es" | "en" }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (!confirm(`¿Eliminar entrada ${entryKey} (${locale})?`)) return;
        startTransition(async () => {
          await deleteContent(entryKey, locale);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="text-ink-400 hover:text-rose-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
