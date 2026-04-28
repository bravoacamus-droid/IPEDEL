import { notFound } from "next/navigation";
import { BookText } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { LibroReclamacionesForm } from "@/components/public/LibroReclamacionesForm";

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
        <div className="card p-6 sm:p-8">
          <p className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 mb-6">
            {dict.ldr.legal_note}
          </p>
          <LibroReclamacionesForm dict={dict} />
        </div>
      </section>
    </div>
  );
}
