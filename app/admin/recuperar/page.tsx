import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Globe2, KeyRound, Phone, ShieldCheck } from "lucide-react";
import { RecoverForm } from "./RecoverForm";

export const metadata = { title: "Recuperar contraseña · IPE del Perú" };

export default function RecoverPasswordPage() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-12">
      <section className="flex min-h-screen flex-col px-6 py-10 sm:px-10 lg:col-span-5 lg:px-12">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Volver al inicio de sesión
        </Link>

        <div className="mx-auto my-auto w-full max-w-md py-12">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <KeyRound className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            Ingresá el correo asociado a tu cuenta y te enviaremos un enlace
            para restablecer tu contraseña. El enlace expira en 1 hora.
          </p>

          <div className="mt-8">
            <RecoverForm />
          </div>

          <p className="mt-6 text-center text-xs text-ink-500">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-brand-700 hover:text-brand-900"
            >
              Volver a ingresar
            </Link>
          </p>
        </div>

        <footer className="mt-auto pt-6 text-[11px] text-ink-400">
          © {new Date().getFullYear()} IPE del Perú SAC · RUC 20197900378
        </footer>
      </section>

      <aside className="relative hidden overflow-hidden bg-ink-900 lg:col-span-7 lg:flex">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(150,198,0,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(194,217,113,0.20),transparent_55%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-1/2 h-[480px] w-[480px] -translate-y-1/2 rounded-full bg-brand-500/20 blur-[120px]"
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-white xl:p-16">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-horizontal-white.png"
              alt="IPE del Perú SAC"
              className="h-10 w-auto"
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-brand-300">
              Recuperación de acceso
            </p>
          </div>

          <div className="max-w-xl">
            <Image
              src="/logo-vertical.png"
              alt=""
              aria-hidden="true"
              width={64}
              height={64}
              className="mb-6 h-12 w-auto opacity-90"
            />
            <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight xl:text-4xl">
              Tu seguridad es nuestra prioridad.
            </h2>
            <p className="mt-5 text-base text-white/75 xl:text-lg">
              Por seguridad, el correo se envía solo si la cuenta existe. El
              enlace de recuperación expira en 1 hora y solo puede usarse una
              vez. Si no recibís el mensaje en unos minutos, revisá la carpeta
              de spam.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-300" />
              +511 304-5520
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-brand-300" />
              ipeperu.com
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-white/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              Solo personal autorizado
            </span>
          </div>
        </div>
      </aside>
    </main>
  );
}
