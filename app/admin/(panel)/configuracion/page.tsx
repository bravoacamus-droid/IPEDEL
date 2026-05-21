import { createClient } from "@/lib/supabase/server";

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Configuración</h1>
        <p className="text-sm text-ink-600">
          Datos de la empresa y de tu cuenta.
        </p>
      </div>
      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">Empresa</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink-500">Razón social</dt>
            <dd className="text-ink-900 font-medium">IPE DEL PERU S.A.C.</dd>
          </div>
          <div>
            <dt className="text-ink-500">RUC</dt>
            <dd className="text-ink-900 font-medium">20197900378</dd>
          </div>
          <div>
            <dt className="text-ink-500">Teléfono</dt>
            <dd className="text-ink-900">+511 304-5520</dd>
          </div>
          <div>
            <dt className="text-ink-500">Email</dt>
            <dd className="text-ink-900">consultas@ipeperu.com</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-ink-500">Dirección</dt>
            <dd className="text-ink-900">Calle el Boulevard 182, of. 901, Surco — Lima 33</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-ink-500">
          Edición de datos de empresa, redes sociales y horarios en Sprint 5.
        </p>
      </div>
      <div className="card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500">Mi cuenta</h2>
        <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-ink-500">Nombre</dt>
            <dd className="text-ink-900">{profile?.full_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Email</dt>
            <dd className="text-ink-900">{profile?.email}</dd>
          </div>
          <div>
            <dt className="text-ink-500">Rol</dt>
            <dd className="text-ink-900 capitalize">{profile?.role}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-ink-500">
          Cambio de contraseña disponible mediante recuperación por correo.
        </p>
      </div>
    </div>
  );
}
