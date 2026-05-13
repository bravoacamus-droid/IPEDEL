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
  const isEs = locale === "es";
  return (
    <article className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isEs ? "Términos y condiciones" : "Terms and conditions"}
          </h1>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 text-ink-700 space-y-4">
        <p>
          {isEs
            ? "El presente documento regula el uso del sitio web ipedelperu.com, operado por IPE del Perú SAC (RUC 20197900378). El acceso al sitio implica la aceptación de estos términos."
            : "This document governs the use of the ipedelperu.com website, operated by IPE del Perú SAC (RUC 20197900378). Accessing the site implies acceptance of these terms."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "1. Servicios" : "1. Services"}
        </h2>
        <p>
          {isEs
            ? "La información publicada en este sitio es referencial. Los servicios logísticos se contratan mediante propuesta comercial firmada y/o orden de servicio. Las tarifas publicadas son referenciales; para mayor información contáctenos."
            : "Information published on this site is for reference only. Logistics services are contracted via a signed commercial proposal and/or service order. Published tariffs are referential; please contact us for further information."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "2. Tracking" : "2. Tracking"}
        </h2>
        <p>
          {isEs
            ? "La información de tracking proviene de los sistemas de los transportistas y agentes; puede sufrir variaciones por causas operativas o de fuerza mayor."
            : "Tracking information comes from carrier and agent systems; it may vary due to operational reasons or force majeure."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "3. Limitación de responsabilidad" : "3. Limitation of liability"}
        </h2>
        <p>
          {isEs
            ? "IPE del Perú SAC no se responsabiliza por interrupciones temporales del sitio, por la información de terceros enlazados, ni por decisiones tomadas únicamente con base en el contenido referencial publicado."
            : "IPE del Perú SAC is not liable for temporary site interruptions, third-party linked information, or decisions made solely based on the reference content published."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "4. Propiedad intelectual" : "4. Intellectual property"}
        </h2>
        <p>
          {isEs
            ? "Logotipos, marca, contenido y diseño son propiedad de IPE del Perú SAC, salvo se indique lo contrario. Su uso requiere autorización por escrito."
            : "Logos, brand, content and design are the property of IPE del Perú SAC, unless otherwise indicated. Their use requires written authorization."}
        </p>
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "5. Legislación aplicable" : "5. Governing law"}
        </h2>
        <p>
          {isEs
            ? "Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los tribunales competentes de Lima."
            : "These terms are governed by the laws of the Republic of Peru. Any dispute shall be submitted to the competent courts of Lima."}
        </p>
      </section>
    </article>
  );
}
