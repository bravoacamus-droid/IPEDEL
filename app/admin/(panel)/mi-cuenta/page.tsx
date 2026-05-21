import { requireStaff } from "@/lib/auth/rbac";
import { ChangeOwnPasswordForm } from "./ChangeOwnPasswordForm";

export default async function MiCuentaPage() {
  const staff = await requireStaff();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Mi cuenta</h1>
        <p className="text-sm text-ink-600">
          Información de tu cuenta y cambio de contraseña.
        </p>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
          Información
        </h2>
        <dl className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-500">Nombre</dt>
            <dd className="text-ink-900 font-medium">{staff.fullName || "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Correo</dt>
            <dd className="text-ink-900">{staff.email}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Rol</dt>
            <dd className="text-ink-900">
              {staff.role === "admin" ? "Administrador" : "Operador"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
          Cambiar contraseña
        </h2>
        <p className="mt-1 text-xs text-ink-500">
          Mínimo 8 caracteres. Cerrá sesión y volvé a entrar para usar la
          nueva contraseña.
        </p>
        <div className="mt-4">
          <ChangeOwnPasswordForm />
        </div>
      </div>
    </div>
  );
}
