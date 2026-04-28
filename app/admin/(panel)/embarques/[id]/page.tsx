import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SHIPMENT_STATUS_LABELS, type Shipment, type ShipmentEvent } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";
import { ShipmentForm } from "../ShipmentForm";
import { EventForm } from "./EventForm";
import { DeleteShipmentButton, DeleteEventButton } from "./buttons";

export default async function EmbarqueDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: shipment } = await supabase
    .from("shipments")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!shipment) notFound();

  const { data: events } = await supabase
    .from("shipment_events")
    .select("*")
    .eq("shipment_id", id)
    .order("event_date", { ascending: false });

  const list = (events as ShipmentEvent[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/embarques"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Embarques
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink-900">
            HBL {(shipment as Shipment).hbl_number}
          </h1>
          <p className="text-sm text-ink-600">
            Estado actual: <span className="badge bg-brand-100 text-brand-800">
              {SHIPMENT_STATUS_LABELS[(shipment as Shipment).status].es}
            </span>
          </p>
        </div>
        <DeleteShipmentButton id={id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-base font-semibold text-ink-900">Datos del embarque</h2>
          <p className="text-sm text-ink-600 mb-5">Cualquier cambio se publica al instante.</p>
          <ShipmentForm mode="edit" shipment={shipment as Shipment} />
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-base font-semibold text-ink-900">Agregar evento</h2>
            <p className="text-sm text-ink-600 mb-5">
              Cada evento aparece en la línea de tiempo pública del HBL.
            </p>
            <EventForm shipmentId={id} />
          </div>
          <div className="card p-6">
            <h2 className="text-base font-semibold text-ink-900">Línea de tiempo</h2>
            <ol className="mt-4 space-y-4">
              {list.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-3 border-l-2 pl-4 -ml-1 py-1"
                  style={{ borderColor: e.is_current ? "var(--color-brand-500)" : "var(--color-ink-200)" }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">
                      {e.status_label}
                      {e.is_current && (
                        <span className="ml-2 badge bg-brand-100 text-brand-800">Actual</span>
                      )}
                    </p>
                    <p className="text-xs text-ink-500">
                      {formatDateTime(e.event_date)}
                      {e.location && ` · ${e.location}`}
                    </p>
                    {e.description && (
                      <p className="mt-1 text-sm text-ink-700">{e.description}</p>
                    )}
                  </div>
                  <DeleteEventButton eventId={e.id} shipmentId={id} />
                </li>
              ))}
              {list.length === 0 && (
                <li className="text-sm text-ink-500">Aún sin eventos.</li>
              )}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
