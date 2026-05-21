import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireSectionAccess } from "@/lib/auth/rbac";
import { NewUserForm } from "./NewUserForm";

export default async function NuevoUsuarioPage() {
  await requireSectionAccess("usuarios");
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Usuarios
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink-900">Nuevo usuario</h1>
        <p className="text-sm text-ink-600">
          Crea una cuenta con acceso al panel. La contraseña inicial se entrega
          al usuario; debería cambiarla en su primer ingreso desde "Mi cuenta".
        </p>
      </div>
      <NewUserForm />
    </div>
  );
}
