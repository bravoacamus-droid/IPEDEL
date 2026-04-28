import Link from "next/link";
import { Package, FileText, MessageSquare, DollarSign, Users, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [shipmentsActive, shipmentsDelivered, reclamacionesPend, mensajesUnread, agentes, tarifas] =
    await Promise.all([
      supabase.from("shipments").select("id", { count: "exact", head: true }).neq("status", "entregado"),
      supabase.from("shipments").select("id", { count: "exact", head: true }).eq("status", "entregado"),
      supabase.from("reclamaciones").select("id", { count: "exact", head: true }).eq("estado", "pendiente"),
      supabase.from("contacts").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("agents").select("id", { count: "exact", head: true }),
      supabase.from("tarifario").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const tiles = [
    { href: "/admin/embarques", label: "Embarques activos", value: shipmentsActive.count ?? 0, icon: Package, accent: "bg-brand-500" },
    { href: "/admin/embarques?status=entregado", label: "Embarques entregados", value: shipmentsDelivered.count ?? 0, icon: Package, accent: "bg-ink-200" },
    { href: "/admin/reclamaciones", label: "Reclamaciones pendientes", value: reclamacionesPend.count ?? 0, icon: FileText, accent: "bg-rose-500" },
    { href: "/admin/mensajes", label: "Mensajes no leídos", value: mensajesUnread.count ?? 0, icon: MessageSquare, accent: "bg-amber-500" },
    { href: "/admin/agentes", label: "Agentes registrados", value: agentes.count ?? 0, icon: Users, accent: "bg-ink-300" },
    { href: "/admin/tarifario", label: "Tarifas publicadas", value: tarifas.count ?? 0, icon: DollarSign, accent: "bg-ink-300" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Panel administrativo</h1>
        <p className="mt-1 text-sm text-ink-600">Resumen de la operación de IPE del Perú SAC.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start gap-3">
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${t.accent} text-black`}>
                <t.icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{t.label}</p>
                <p className="mt-1 text-2xl font-semibold text-ink-900">{t.value}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-400 group-hover:text-ink-700" />
            </div>
          </Link>
        ))}
      </div>
      <div className="card p-6 text-sm text-ink-700">
        <h2 className="text-base font-semibold text-ink-900">Sprints en progreso</h2>
        <ul className="mt-3 space-y-1.5 list-disc pl-5">
          <li><span className="font-medium">Sprint 1 ✓</span> — Auth admin, schema Supabase, sitio público funcional, paleta verde, ES/EN básico.</li>
          <li><span className="font-medium">Sprint 2</span> — CRUD completo embarques + edición tarifario en este panel.</li>
          <li><span className="font-medium">Sprint 3</span> — Generación PDF de reclamaciones, emails SMTP Stellar.</li>
          <li><span className="font-medium">Sprint 4</span> — Mapa interactivo de agentes (react-simple-maps).</li>
          <li><span className="font-medium">Sprint 5</span> — CMS de contenido, traducción completa EN.</li>
          <li><span className="font-medium">Sprint 6</span> — SEO, imágenes IA finales, despliegue Vercel + dominio.</li>
        </ul>
      </div>
    </div>
  );
}
