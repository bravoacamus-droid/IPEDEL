import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

export const metadata = { title: "Términos y condiciones" };

export default async function TerminosCondiciones({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <article className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "es" ? "Términos y condiciones" : "Terms and conditions"}
          </h1>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 text-ink-700 space-y-4">
        <p>El presente documento regula el uso del sitio web ipedelperu.com, operado por IPE del Perú SAC (RUC 20197900378). El acceso al sitio implica la aceptación de estos términos.</p>
        <h2 className="text-lg font-semibold text-ink-900">1. Servicios</h2>
        <p>La información publicada en este sitio es referencial. Los servicios logísticos se contratan mediante propuesta comercial firmada y/o orden de servicio. Las tarifas publicadas son referenciales; para mayor información contáctenos.</p>
        <h2 className="text-lg font-semibold text-ink-900">2. Tracking</h2>
        <p>La información de tracking proviene de los sistemas de los transportistas y agentes; puede sufrir variaciones por causas operativas o de fuerza mayor.</p>
        <h2 className="text-lg font-semibold text-ink-900">3. Limitación de responsabilidad</h2>
        <p>IPE del Perú SAC no se responsabiliza por interrupciones temporales del sitio, por la información de terceros enlazados, ni por decisiones tomadas únicamente con base en el contenido referencial publicado.</p>
        <h2 className="text-lg font-semibold text-ink-900">4. Propiedad intelectual</h2>
        <p>Logotipos, marca, contenido y diseño son propiedad de IPE del Perú SAC, salvo se indique lo contrario. Su uso requiere autorización por escrito.</p>
        <h2 className="text-lg font-semibold text-ink-900">5. Legislación aplicable</h2>
        <p>Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los tribunales competentes de Lima.</p>
      </section>
    </article>
  );
}
