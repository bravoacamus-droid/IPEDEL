"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toggleMensajeRead, deleteMensaje } from "./actions";

export function MensajeActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await toggleMensajeRead(id, isRead);
            router.refresh();
          })
        }
        className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-50"
      >
        {isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
        {isRead ? "Marcar no leído" : "Marcar leído"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirm("¿Eliminar este mensaje?")) return;
          startTransition(async () => {
            await deleteMensaje(id);
            router.refresh();
          });
        }}
        className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" /> Eliminar
      </button>
    </div>
  );
}
