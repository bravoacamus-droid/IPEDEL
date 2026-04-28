import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

export const metadata = { title: "Política de cookies" };

export default async function PoliticaCookies({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page py-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "es" ? "Política de cookies" : "Cookies policy"}
          </h1>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 text-ink-700 space-y-4">
        <p>Este sitio utiliza cookies estrictamente necesarias para la operación del servicio (sesión administrativa, preferencias de idioma) y, opcionalmente, cookies analíticas anonimizadas.</p>
        <h2 className="text-lg font-semibold text-ink-900">1. Cookies necesarias</h2>
        <p>Se utilizan para autenticar al usuario administrador, recordar el idioma seleccionado y proteger la sesión. Estas cookies no requieren consentimiento.</p>
        <h2 className="text-lg font-semibold text-ink-900">2. Cookies analíticas</h2>
        <p>Si en el futuro se incorporan herramientas de analítica, solicitaremos consentimiento explícito a través de un banner que permita aceptarlas o rechazarlas.</p>
        <h2 className="text-lg font-semibold text-ink-900">3. Cómo gestionar cookies</h2>
        <p>El usuario puede borrar o bloquear cookies desde la configuración de su navegador. Si las bloquea, algunas funcionalidades del sitio (como el panel administrativo) podrían dejar de funcionar.</p>
      </section>
    </article>
  );
}
