"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ShieldCheck, User } from "lucide-react";
import { createUser } from "../actions";

// Genera una contraseña aleatoria legible (12 chars, mezcla
// letras + dígitos + un símbolo). Se muestra al admin para que la
// copie y entregue al nuevo usuario.
function generatePassword(): string {
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%&*";
  const all = lower + upper + digits + symbols;
  const pick = (s: string) => s[Math.floor(Math.random() * s.length)];
  // Garantiza al menos 1 de cada tipo, luego rellena hasta 12.
  const chars = [pick(lower), pick(upper), pick(digits), pick(symbols)];
  while (chars.length < 12) chars.push(pick(all));
  // Shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

export function NewUserForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [password, setPassword] = useState(() => generatePassword());
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const res = await createUser(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/admin/usuarios");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="full_name">
            Nombre completo
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            minLength={2}
            placeholder="Ej. María Ramírez"
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="usuario@ipeperu.com"
            className="input"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-ink-700 mb-3">Rol</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <RoleOption
            value="admin"
            label="Administrador"
            description="Acceso total al panel."
            icon={<ShieldCheck className="h-4 w-4" />}
          />
          <RoleOption
            value="operator"
            label="Operador"
            defaultChecked
            description="Solo embarques y reclamaciones."
            icon={<User className="h-4 w-4" />}
          />
        </div>
      </fieldset>

      <div>
        <label className="label flex items-center justify-between" htmlFor="password">
          <span>Contraseña inicial</span>
          <button
            type="button"
            onClick={() => setPassword(generatePassword())}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-900"
          >
            <RefreshCw className="h-3 w-3" /> Generar otra
          </button>
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input font-mono"
        />
        <p className="mt-1 text-xs text-ink-500">
          Cópiala y entregásela al usuario. Mínimo 8 caracteres.
        </p>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center gap-3 border-t border-ink-100 pt-4">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Creando…" : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}

function RoleOption({
  value,
  label,
  description,
  icon,
  defaultChecked,
}: {
  value: "admin" | "operator";
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-ink-200 p-3 hover:border-brand-500 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
      <input
        type="radio"
        name="role"
        value={value}
        defaultChecked={defaultChecked}
        required
        className="mt-1"
      />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
          {icon}
          {label}
        </p>
        <p className="mt-0.5 text-xs text-ink-600">{description}</p>
      </div>
    </label>
  );
}
