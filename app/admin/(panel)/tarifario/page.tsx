import { createClient } from "@/lib/supabase/server";
import type { Tarifa } from "@/lib/types/database";
import { TarifaEditor } from "./TarifaEditor";
import { requireSectionAccess } from "@/lib/auth/rbac";

export default async function AdminTarifarioPage() {
  await requireSectionAccess("tarifario");
  const supabase = await createClient();
  const { data } = await supabase
    .from("tarifario")
    .select("*")
    .order("modalidad")
    .order("orden");
  const rows = (data as Tarifa[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Tarifario</h1>
        <p className="text-sm text-ink-600">
          Cualquier cambio se publica al instante en el tarifario.
        </p>
      </div>
      <TarifaEditor rows={rows} />
    </div>
  );
}
