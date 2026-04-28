import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Reclamacion } from "@/lib/types/database";
import { formatDateTime } from "@/lib/utils";
import { RespuestaForm } from "./RespuestaForm";

export default async function ReclamacionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("reclamaciones")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const r = data as Reclamacion;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin/reclamaciones"
            className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Reclamaciones
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-ink-900">
            Reclamación N° {r.numero_correlativo}
          </h1>
          <p className="text-sm text-ink-600">
            {formatDateTime(r.fecha)} ·
            <span className="ml-2 capitalize">{r.tipo}</span> ·
            <span
              className={`ml-2 badge ${
                r.estado === "pendiente"
                  ? "bg-rose-100 text-rose-700"
                  : r.estado === "atendido"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-brand-100 text-brand-800"
              }`}
            >
              {r.estado}
            </span>
          </p>
        </div>
        <a
          href={`/api/reclamaciones/${id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          <Download className="h-4 w-4" /> Descargar PDF
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Datos del consumidor">
            <Field label="Nombre">{r.nombres} {r.apellidos}</Field>
            <Field label="Documento">{r.tipo_documento} {r.numero_documento}</Field>
            <Field label="Email">{r.email}</Field>
            <Field label="Teléfono">{r.telefono || "—"}</Field>
            <Field label="Dirección">{r.direccion || "—"}</Field>
            {r.es_menor_edad && (
              <>
                <Field label="Representante">{r.representante_nombre}</Field>
                <Field label="DNI representante">{r.representante_documento}</Field>
              </>
            )}
          </Section>

          <Section title="Detalle del bien o servicio">
            <Field label="Bien / servicio">{r.bien_servicio}</Field>
            {r.monto_reclamado && <Field label="Monto reclamado">S/ {r.monto_reclamado}</Field>}
            <FullField label="Detalle">{r.detalle}</FullField>
            <FullField label="Pedido del consumidor">{r.pedido_consumidor}</FullField>
          </Section>

          {r.respuesta_empresa && (
            <Section title="Respuesta de la empresa">
              <FullField label={`Registrada ${r.fecha_respuesta ? formatDateTime(r.fecha_respuesta) : ""}`}>
                {r.respuesta_empresa}
              </FullField>
            </Section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
              Registrar respuesta
            </h3>
            <RespuestaForm id={id} initial={r} />
          </div>
          <div className="card p-5 text-xs text-ink-500">
            Plazo legal: 30 días calendario desde la fecha del reclamo. IP: {r.ip_address || "n/d"}.
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-500 mb-4">
        {title}
      </h2>
      <dl className="grid gap-4 sm:grid-cols-2 text-sm">{children}</dl>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="text-ink-900">{children}</dd>
    </div>
  );
}

function FullField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="sm:col-span-2">
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="text-ink-800 whitespace-pre-wrap mt-1">{children}</dd>
    </div>
  );
}
