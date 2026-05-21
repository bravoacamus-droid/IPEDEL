import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  DollarSign,
  Users,
  FileEdit,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, email")
    .eq("id", user.id)
    .maybeSingle();

  // Hard gate: must be staff (admin or operator). Any user without a profile row
  // shouldn't reach this page, but if they do, send them to login.
  if (!profile || (profile.role !== "admin" && profile.role !== "operator")) {
    redirect("/admin/login?error=role");
  }

  const nav = [
    { href: "/admin", label: "Panel", icon: LayoutDashboard },
    { href: "/admin/embarques", label: "Embarques", icon: Package },
    { href: "/admin/reclamaciones", label: "Reclamaciones", icon: FileText },
    { href: "/admin/tarifario", label: "Tarifario", icon: DollarSign },
    { href: "/admin/agentes", label: "Agentes", icon: Users },
    { href: "/admin/contenido", label: "Contenido web", icon: FileEdit },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

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
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-ink-200 hover:bg-ink-800 hover:text-white"
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink-800 px-4 py-4 text-xs">
          <p className="text-ink-300">{profile.full_name || user.email}</p>
          <p className="text-ink-500 capitalize">{profile.role}</p>
          <form action="/admin/logout" method="post" className="mt-3">
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
    </div>
  );
}
