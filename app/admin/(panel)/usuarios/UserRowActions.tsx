"use client";

import { useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MoreVertical, KeyRound, UserCog, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import type { UserRole } from "@/lib/types/database";
import {
  deleteUser,
  resetUserPassword,
  updateUserName,
  updateUserRole,
} from "./actions";

// Acciones por usuario: cambiar nombre, cambiar rol, resetear
// contraseña y eliminar. Todo encapsulado en un solo dropdown +
// modals inline para mantener la tabla limpia.
export function UserRowActions({
  userId,
  email,
  currentRole,
  currentName,
  isSelf,
}: {
  userId: string;
  email: string;
  currentRole: UserRole;
  currentName: string;
  isSelf: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<"name" | "role" | "password" | "delete" | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number; openUp: boolean }>(
    { top: 0, right: 0, openUp: false },
  );
  const [mounted, setMounted] = useState(false);

  // El menú se renderiza vía portal a document.body para escapar el
  // overflow-hidden del card de la tabla — antes la opción "Eliminar"
  // se cortaba en las últimas filas. Posición se calcula con
  // getBoundingClientRect del botón, fijada en viewport. Si no hay
  // espacio abajo, abre hacia arriba.
  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    function recalc() {
      const btn = buttonRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      // Alto aproximado del menú según items visibles (4-5 items × ~36px + paddings)
      const menuH = isSelf ? 100 : 175;
      const spaceBelow = window.innerHeight - r.bottom;
      const openUp = spaceBelow < menuH + 12;
      setPos({
        top: openUp ? r.top - 4 : r.bottom + 4,
        right: window.innerWidth - r.right,
        openUp,
      });
    }
    recalc();
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [open, isSelf]);

  // Click-outside con listener global (en lugar de onBlur que falla
  // cuando el menú está en otro nodo DOM via portal).
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const t = e.target as Node;
      if (
        buttonRef.current?.contains(t) ||
        menuRef.current?.contains(t)
      ) {
        return;
      }
      setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const menu = open ? (
    <div
      ref={menuRef}
      className="fixed z-50 w-52 rounded-md border border-ink-200 bg-white py-1 text-sm shadow-lg"
      style={
        pos.openUp
          ? { bottom: window.innerHeight - pos.top, right: pos.right }
          : { top: pos.top, right: pos.right }
      }
    >
      <button
        type="button"
        onClick={() => {
          setModal("name");
          setOpen(false);
        }}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-ink-700 hover:bg-ink-50"
      >
        <Pencil className="h-3.5 w-3.5" /> Cambiar nombre
      </button>
      {!isSelf && (
        <button
          type="button"
          onClick={() => {
            setModal("role");
            setOpen(false);
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-left text-ink-700 hover:bg-ink-50"
        >
          <UserCog className="h-3.5 w-3.5" /> Cambiar rol
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setModal("password");
          setOpen(false);
        }}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-ink-700 hover:bg-ink-50"
      >
        <KeyRound className="h-3.5 w-3.5" /> Resetear contraseña
      </button>
      {!isSelf && (
        <button
          type="button"
          onClick={() => {
            setModal("delete");
            setOpen(false);
          }}
          className="flex w-full items-center gap-2 border-t border-ink-100 px-3 py-2 text-left text-rose-700 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> Eliminar usuario
        </button>
      )}
    </div>
  ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
        aria-label="Acciones del usuario"
        aria-expanded={open}
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {mounted && menu && createPortal(menu, document.body)}

      {modal === "name" && (
        <ChangeNameModal
          userId={userId}
          email={email}
          currentName={currentName}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "role" && (
        <ChangeRoleModal
          userId={userId}
          email={email}
          currentRole={currentRole}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "password" && (
        <ResetPasswordModal
          userId={userId}
          email={email}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "delete" && (
        <DeleteUserModal userId={userId} email={email} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function ModalShell({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-ink-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-600">{description}</p>}
        </div>
        <div className="px-6 py-5">{children}</div>
        <div className="flex justify-end gap-2 border-t border-ink-100 bg-ink-50 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            data-modal-cancel
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function ChangeNameModal({
  userId,
  email,
  currentName,
  onClose,
}: {
  userId: string;
  email: string;
  currentName: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await updateUserName(userId, fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success("Nombre actualizado");
      onClose();
      router.refresh();
    });
  }

  return (
    <ModalShell title="Cambiar nombre" description={email} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="full_name">
            Nombre completo
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            minLength={2}
            defaultValue={currentName}
            className="input"
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </form>
    </ModalShell>
  );
}

function ChangeRoleModal({
  userId,
  email,
  currentRole,
  onClose,
}: {
  userId: string;
  email: string;
  currentRole: UserRole;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await updateUserRole(userId, fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success("Rol actualizado");
      onClose();
      router.refresh();
    });
  }

  return (
    <ModalShell title="Cambiar rol" description={email} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="role">
            Nuevo rol
          </label>
          <select id="role" name="role" defaultValue={currentRole} className="input">
            <option value="admin">Administrador — acceso total</option>
            <option value="operator">Operador — solo embarques y reclamaciones</option>
          </select>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
          {pending ? "Guardando…" : "Cambiar rol"}
        </button>
      </form>
    </ModalShell>
  );
}

function ResetPasswordModal({
  userId,
  email,
  onClose,
}: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const res = await resetUserPassword(userId, fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSuccess("Contraseña actualizada. El usuario debe usar la nueva en su próximo ingreso.");
    });
  }

  return (
    <ModalShell
      title="Resetear contraseña"
      description={email}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="label" htmlFor="password">
            Nueva contraseña
          </label>
          <input
            id="password"
            name="password"
            type="text"
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="input font-mono"
          />
          <p className="mt-1 text-xs text-ink-500">
            La contraseña se muestra para que puedas copiarla y entregarla al usuario.
          </p>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {success && <p className="text-sm text-brand-700">{success}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
          {pending ? "Guardando…" : "Resetear contraseña"}
        </button>
      </form>
    </ModalShell>
  );
}

function DeleteUserModal({
  userId,
  email,
  onClose,
}: {
  userId: string;
  email: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState("");
  const router = useRouter();

  const canDelete = confirm === email;

  function handleDelete() {
    if (!canDelete) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      toast.success("Usuario eliminado");
      onClose();
      router.refresh();
    });
  }

  return (
    <ModalShell
      title="Eliminar usuario"
      description="Esta acción es permanente y no se puede deshacer."
      onClose={onClose}
    >
      <div className="space-y-3">
        <p className="text-sm text-ink-700">
          Vas a eliminar permanentemente al usuario{" "}
          <span className="font-semibold text-ink-900">{email}</span>. Perderá
          acceso al panel inmediatamente.
        </p>
        <div>
          <label className="label" htmlFor="confirm-email">
            Escribe el correo para confirmar
          </label>
          <input
            id="confirm-email"
            type="text"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={email}
            className="input font-mono"
          />
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button
          type="button"
          onClick={handleDelete}
          disabled={!canDelete || pending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          {pending ? "Eliminando…" : "Eliminar usuario"}
        </button>
      </div>
    </ModalShell>
  );
}
