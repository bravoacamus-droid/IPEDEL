import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  FileText,
  DollarSign,
  Users,
  FileEdit,
  Settings,
  UserCog,
  ShieldCheck,
  ScrollText,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { Toaster } from "sonner";
import { requireStaff } from "@/lib/auth/rbac";
import { SECTION_ACCESS, type Section } from "@/lib/auth/rbac";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types/database";

export const dynamic = "force-dynamic";

type NavItem = {
  section: Section;
  href: string;
  label: string;
  icon: LucideIcon;
};

const NAV: NavItem[] = [
  { section: "dashboard", href: "/admin", label: "Panel", icon: LayoutDashboard },
  { section: "embarques", href: "/admin/embarques", label: "Embarques", icon: Package },
  { section: "reclamaciones", href: "/admin/reclamaciones", label: "Reclamaciones", icon: FileText },
  { section: "tarifario", href: "/admin/tarifario", label: "Tarifario", icon: DollarSign },
  { section: "agentes", href: "/admin/agentes", label: "Agentes", icon: Users },
  { section: "contenido", href: "/admin/contenido", label: "Contenido web", icon: FileEdit },
  { section: "usuarios", href: "/admin/usuarios", label: "Usuarios", icon: UserCog },
  { section: "auditoria", href: "/admin/auditoria", label: "Auditoría", icon: ScrollText },
  { section: "configuracion", href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

function navFor(role: UserRole): NavItem[] {
  return NAV.filter((n) => SECTION_ACCESS[n.section].includes(role));
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  const nav = navFor(staff.role);

  // Contador de reclamaciones pendientes para mostrar como badge
  // junto al item "Reclamaciones". Solo se calcula si el rol tiene
  // acceso a esa sección.
  let pendingReclamaciones = 0;
  if (SECTION_ACCESS.reclamaciones.includes(staff.role)) {
    const supabase = await createClient();
    const { count } = await supabase
      .from("reclamaciones")
      .select("id", { count: "exact", head: true })
      .eq("estado", "pendiente")
      .is("deleted_at", null);
    pendingReclamaciones = count ?? 0;
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="hidden md:flex w-64 flex-col bg-ink-900 text-white">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-ink-800">
          <Image
            src="/logo-horizontal.png"
            alt="IPE del Perú"
            width={140}
            height={32}
            className="h-7 w-auto bg-white rounded p-1"
          />
          <span className="text-xs uppercase tracking-wider text-brand-300">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((n) => {
            const showBadge =
              n.section === "reclamaciones" && pendingReclamaciones > 0;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-200 hover:bg-ink-800 hover:text-white"
              >
                <n.icon className="h-4 w-4" />
                <span className="flex-1">{n.label}</span>
                {showBadge && (
                  <span
                    className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white"
                    aria-label={`${pendingReclamaciones} reclamaciones pendientes`}
                  >
                    {pendingReclamaciones > 99 ? "99+" : pendingReclamaciones}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink-800 px-4 py-4 text-xs">
          <Link
            href="/admin/mi-cuenta"
            className="-mx-2 mb-3 block rounded-md px-2 py-2 hover:bg-ink-800"
          >
            <p className="flex items-center gap-1.5 text-ink-300">
              <ShieldCheck
                className={
                  staff.role === "admin"
                    ? "h-3 w-3 text-brand-400"
                    : "h-3 w-3 text-ink-500"
                }
              />
              <span className="truncate">{staff.fullName || staff.email}</span>
            </p>
            <p
              className={
                staff.role === "admin"
                  ? "mt-0.5 capitalize text-brand-300 font-medium"
                  : "mt-0.5 capitalize text-ink-500"
              }
            >
              {staff.role === "admin" ? "Administrador" : "Operador"}
            </p>
          </Link>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="inline-flex items-center gap-2 text-ink-300 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1">
        <header className="md:hidden flex items-center justify-between border-b bg-white px-4 py-3">
          <span className="font-semibold text-ink-900">IPEDEL · Admin</span>
          <form action="/admin/logout" method="post">
            <button type="submit" className="text-sm text-ink-600">
              Salir
            </button>
          </form>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
