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

  return (
    <article className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page py-12">
          <h1 className="text-3xl font-semibold tracking-tight">
            {locale === "es" ? "Política de privacidad" : "Privacy policy"}
          </h1>
          <p className="mt-2 text-sm text-ink-300">
            {locale === "es" ? "Conforme a la Ley 29733 (Protección de Datos Personales)." : "Per Peruvian Law 29733 (Personal Data Protection)."}
          </p>
        </div>
      </section>
      <section className="container-page max-w-3xl py-10 prose prose-sm prose-neutral text-ink-700 space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">1. Identidad del responsable</h2>
        <p>IPE del Perú SAC, RUC 20197900378, con domicilio en Calle el Boulevard 182, of. 901, Surco — Lima 33, Perú.</p>

        <h2 className="text-lg font-semibold text-ink-900">2. Datos personales que tratamos</h2>
        <p>Recopilamos únicamente los datos que el usuario proporciona voluntariamente a través de formularios de contacto, libro de reclamaciones, registro de embarques y otras interacciones. Esto puede incluir: nombres, apellidos, documento de identidad, correo electrónico, teléfono, dirección, empresa.</p>

        <h2 className="text-lg font-semibold text-ink-900">3. Finalidad del tratamiento</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Atender consultas y solicitudes comerciales.</li>
          <li>Tramitar y dar seguimiento a operaciones logísticas.</li>
          <li>Cumplir obligaciones legales (libro de reclamaciones, fiscalización).</li>
          <li>Enviar información sobre nuestros servicios cuando exista consentimiento expreso.</li>
        </ul>

        <h2 className="text-lg font-semibold text-ink-900">4. Conservación</h2>
        <p>Los datos se conservan por el tiempo necesario para cumplir con la finalidad declarada y obligaciones legales (incluyendo el plazo mínimo de 2 años para reclamaciones, según Indecopi).</p>

        <h2 className="text-lg font-semibold text-ink-900">5. Derechos del titular (ARCO)</h2>
        <p>El titular puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición escribiendo a <a className="text-brand-700 underline" href="mailto:ventas@ipedelperu.com">ventas@ipedelperu.com</a>.</p>

        <h2 className="text-lg font-semibold text-ink-900">6. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas razonables para proteger la información, incluyendo cifrado en tránsito (HTTPS) y control de acceso a las bases de datos.</p>

        <h2 className="text-lg font-semibold text-ink-900">7. Terceros</h2>
        <p>No vendemos ni cedemos datos personales a terceros con fines comerciales. Solo se comparte información con proveedores logísticos y autoridades cuando es indispensable para ejecutar el servicio o cumplir la ley.</p>
      </section>
    </article>
  );
}
