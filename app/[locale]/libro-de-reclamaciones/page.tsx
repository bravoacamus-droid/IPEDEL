import { notFound } from "next/navigation";
import { BookText, Building2, Hash, MapPin } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LibroReclamacionesForm } from "@/components/public/LibroReclamacionesForm";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Libro de Reclamaciones",
};

export default async function LibroReclamacionesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="bg-ink-50">
      <section className="bg-ink-900 text-white">
        <div className="container-page pt-32 pb-16">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500 text-black">
              <BookText className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight">{dict.ldr.title}</h1>
              <p className="mt-2 max-w-3xl text-ink-300">{dict.ldr.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="card overflow-hidden p-0">
          {/* Cabecera oficial — denominación + datos del proveedor (DS 011-2011-PCM Art. 5) */}
          <div className="border-b-2 border-brand-500 bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-700">
                  Hoja de Reclamación
                </p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-ink-900">
                  Libro de Reclamaciones
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  Conforme al Código de Protección y Defensa del Consumidor
                  (Ley N° 29571, DS 011-2011-PCM)
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-ink-50 p-4 text-xs text-ink-700">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={1.6} />
                <div>
                  <p className="font-semibold text-ink-900">N° de hoja</p>
                  <p className="text-ink-600">Se asigna al registrar</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-ink-100 pt-5 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={1.6} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                    Razón social
                  </p>
                  <p className="text-ink-900">{SITE.legalName}</p>
                  <p className="text-xs text-ink-500">RUC {SITE.ruc}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" strokeWidth={1.6} />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500">
                    Dirección del establecimiento
                  </p>
                  <p className="text-ink-900">{SITE.address.line1}</p>
                  <p className="text-xs text-ink-500">{SITE.address.line2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6 sm:p-8">
            <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
              {dict.ldr.legal_note}
            </p>
            <LibroReclamacionesForm dict={dict} />
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-500">
          Tras enviar el formulario podrás descargar tu copia en PDF y recibirás
          también una copia por correo electrónico, conforme al Art. 4 del DS
          011-2011-PCM. Tu reclamación es resguardada por dos (2) años (Art. 12).
        </p>
      </section>
    </div>
  );
}
