import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

export const metadata = { title: "Política de privacidad" };

export default async function PoliticaPrivacidad({
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
            {isEs ? "Política de privacidad" : "Privacy policy"}
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            {isEs
              ? "Conforme a la Ley 29733 (Protección de Datos Personales)."
              : "Per Peruvian Law 29733 (Personal Data Protection)."}
          </p>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 prose prose-sm prose-neutral text-ink-700 space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "1. Identidad del responsable" : "1. Data controller"}
        </h2>
        <p>
          {isEs
            ? "IPE del Perú SAC, RUC 20197900378, con domicilio en Calle el Boulevard 182, of. 901, Surco — Lima 33, Perú."
            : "IPE del Perú SAC, RUC 20197900378, with registered office at Calle el Boulevard 182, of. 901, Surco — Lima 33, Peru."}
        </p>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "2. Datos personales que tratamos" : "2. Personal data we process"}
        </h2>
        <p>
          {isEs
            ? "Recopilamos únicamente los datos que el usuario proporciona voluntariamente a través de formularios de contacto, libro de reclamaciones, registro de embarques y otras interacciones. Esto puede incluir: nombres, apellidos, documento de identidad, correo electrónico, teléfono, dirección, empresa."
            : "We only collect data that the user voluntarily provides through contact forms, the complaints book, shipment registrations and other interactions. This may include: first names, last names, ID document, email, phone, address and company."}
        </p>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "3. Finalidad del tratamiento" : "3. Purpose of processing"}
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            {isEs
              ? "Atender consultas y solicitudes comerciales."
              : "Respond to inquiries and commercial requests."}
          </li>
          <li>
            {isEs
              ? "Tramitar y dar seguimiento a operaciones logísticas."
              : "Process and follow up on logistics operations."}
          </li>
          <li>
            {isEs
              ? "Cumplir obligaciones legales (libro de reclamaciones, fiscalización)."
              : "Comply with legal obligations (complaints book, audits)."}
          </li>
          <li>
            {isEs
              ? "Enviar información sobre nuestros servicios cuando exista consentimiento expreso."
              : "Send information about our services when explicit consent has been given."}
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "4. Conservación" : "4. Retention"}
        </h2>
        <p>
          {isEs
            ? "Los datos se conservan por el tiempo necesario para cumplir con la finalidad declarada y obligaciones legales (incluyendo el plazo mínimo de 2 años para reclamaciones, según Indecopi)."
            : "Data is retained for as long as needed to fulfill the stated purpose and legal obligations (including the 2-year minimum for complaints, per Indecopi)."}
        </p>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "5. Derechos del titular (ARCO)" : "5. Data subject rights (ARCO)"}
        </h2>
        <p>
          {isEs ? (
            <>
              El titular puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición escribiendo a{" "}
              <a className="text-brand-700 underline" href="mailto:ventas@ipedelperu.com">
                ventas@ipedelperu.com
              </a>
              .
            </>
          ) : (
            <>
              Data subjects can exercise their rights of Access, Rectification, Cancellation and Objection by writing to{" "}
              <a className="text-brand-700 underline" href="mailto:ventas@ipedelperu.com">
                ventas@ipedelperu.com
              </a>
              .
            </>
          )}
        </p>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "6. Seguridad" : "6. Security"}
        </h2>
        <p>
          {isEs
            ? "Aplicamos medidas técnicas y organizativas razonables para proteger la información, incluyendo cifrado en tránsito (HTTPS) y control de acceso a las bases de datos."
            : "We apply reasonable technical and organizational measures to protect information, including encryption in transit (HTTPS) and database access controls."}
        </p>

        <h2 className="text-lg font-semibold text-ink-900">
          {isEs ? "7. Terceros" : "7. Third parties"}
        </h2>
        <p>
          {isEs
            ? "No vendemos ni cedemos datos personales a terceros con fines comerciales. Solo se comparte información con proveedores logísticos y autoridades cuando es indispensable para ejecutar el servicio o cumplir la ley."
            : "We do not sell or transfer personal data to third parties for commercial purposes. Information is only shared with logistics providers and authorities when essential to deliver the service or comply with the law."}
        </p>
      </section>
    </article>
  );
}
