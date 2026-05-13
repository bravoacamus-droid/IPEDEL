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
  const isEs = locale === "es";
  return (
    <article className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isEs ? "Política de cookies" : "Cookies policy"}
          </h1>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 text-ink-700 space-y-4">
        <p>
          {isEs
            ? "Este sitio utiliza cookies estrictamente necesarias para la operación del servicio (sesión administrativa, preferencias de idioma) y, opcionalmente, cookies analíticas anonimizadas."
            : "This site uses cookies strictly necessary for the operation of the service (admin session, language preferences) and, optionally, anonymized analytics cookies."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "1. Cookies necesarias" : "1. Necessary cookies"}
        </h2>
        <p>
          {isEs
            ? "Se utilizan para autenticar al usuario administrador, recordar el idioma seleccionado y proteger la sesión. Estas cookies no requieren consentimiento."
            : "These are used to authenticate the admin user, remember the selected language and secure the session. They do not require consent."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "2. Cookies analíticas" : "2. Analytics cookies"}
        </h2>
        <p>
          {isEs
            ? "Si en el futuro se incorporan herramientas de analítica, solicitaremos consentimiento explícito a través de un banner que permita aceptarlas o rechazarlas."
            : "If analytics tools are added in the future, we will request explicit consent via a banner that allows you to accept or decline them."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "3. Cómo gestionar cookies" : "3. How to manage cookies"}
        </h2>
        <p>
          {isEs
            ? "El usuario puede borrar o bloquear cookies desde la configuración de su navegador. Si las bloquea, algunas funcionalidades del sitio (como el panel administrativo) podrían dejar de funcionar."
            : "Users can delete or block cookies in their browser settings. If blocked, some site features (such as the admin panel) may stop working."}
        </p>
      </section>
    </article>
  );
}
