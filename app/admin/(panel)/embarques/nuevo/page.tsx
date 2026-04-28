import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShipmentForm } from "../ShipmentForm";

export default function NuevoEmbarquePage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/embarques"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Embarques
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-ink-900">Nuevo embarque</h1>
        <p className="text-sm text-ink-600">Registra un nuevo HBL en el sistema.</p>
      </div>
      <div className="card p-6">
        <ShipmentForm mode="create" />
      </div>
    </div>
  );
}
