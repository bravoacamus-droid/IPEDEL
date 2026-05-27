import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Globe2, Lock, Phone, ShieldCheck } from "lucide-react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Acceso administrativo · IPE del Perú" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-12">
      {/* IZQUIERDA — formulario */}
      <section className="flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:col-span-5 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Volver al sitio
        </Link>

        <div className="mx-auto my-auto w-full max-w-md py-12">
          <Image
            src="/logo-vertical.png"
            alt="IPE del Perú SAC"
            width={64}
            height={64}
            className="h-14 w-auto"
            priority
          />
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            Bienvenido de vuelta
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Ingresá tus credenciales para acceder al panel administrativo.
          </p>

          <div className="mt-8">
            <LoginForm searchParamsPromise={searchParams} />
          </div>

          <div className="mt-8 flex items-start gap-2.5 rounded-lg border border-ink-100 bg-ink-50/60 p-3.5 text-xs text-ink-600">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"
              strokeWidth={1.8}
            />
            <p>
              Esta zona está reservada al personal autorizado de IPE del Perú
              SAC. Cualquier acceso sin permiso queda registrado.
            </p>
          </div>
        </div>

        <footer className="mt-auto pt-6 text-[11px] text-ink-400">
          © {new Date().getFullYear()} IPE del Perú SAC · RUC 20197900378
        </footer>
      </section>

      {/* DERECHA — panel branded (oculto en mobile) */}
      <aside className="relative hidden overflow-hidden bg-ink-900 lg:col-span-7 lg:flex">
        {/* Capa de gradient brand */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(150,198,0,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(194,217,113,0.20),transparent_55%)]"
        />
        {/* Patrón sutil */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Halo verde lateral */}
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-brand-500/20 blur-[120px]"
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-white xl:p-16">
          {/* Top — logo + brand */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-horizontal-white.png"
              alt="IPE del Perú SAC"
              className="h-10 w-auto"
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              Panel administrativo
            </p>
          </div>

          {/* Centro — claim institucional */}
          <div className="max-w-xl">
            <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight xl:text-4xl">
              Confianza logística que cruza fronteras.
            </h2>
            <p className="mt-5 text-base text-white/75 xl:text-lg">
              Más de tres décadas conectando al Perú con el mundo. Desde acá
              gestionás embarques, agentes, reclamaciones, tarifas y contenido
              del sitio.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat icon={<Globe2 className="h-4 w-4" />} value="40+" label="Países" />
              <Stat icon={<ShieldCheck className="h-4 w-4" />} value="30+" label="Años" />
              <Stat icon={<Lock className="h-4 w-4" />} value="2 FA" label="Seguridad" />
            </ul>
          </div>

          {/* Bottom — datos de contacto institucional */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-300" />
              +511 304-5520
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-brand-300" />
              ipeperu.com
            </span>
            <span className="ml-auto text-white/40">
              Calle el Boulevard 182, Surco — Lima 33
            </span>
          </div>
        </div>
      </aside>
    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <li className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-brand-500/15 text-brand-300">
        {icon}
      </div>
      <p className="mt-3 text-xl font-semibold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
    </li>
  );
}
