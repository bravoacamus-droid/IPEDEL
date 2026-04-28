import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ContactForm } from "@/components/public/ContactForm";

export default async function ContactPage({
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
        <div className="container-page py-16">
          <h1 className="text-4xl font-semibold tracking-tight">{dict.contact.title}</h1>
          <p className="mt-3 max-w-2xl text-ink-300">{dict.contact.subtitle}</p>
        </div>
      </section>

      <section className="container-page py-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-6 sm:p-8">
          <ContactForm dict={dict} />
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500">
              {locale === "es" ? "Datos de contacto" : "Contact details"}
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <span className="text-ink-700">{dict.footer.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-brand-600" />
                <a href={`tel:${dict.footer.phone}`} className="text-ink-700 hover:text-ink-900">
                  {dict.footer.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-600" />
                <a href={`mailto:${dict.footer.email}`} className="text-ink-700 hover:text-ink-900">
                  {dict.footer.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="card p-6 text-xs text-ink-500">
            <p>IPE del Perú SAC</p>
            <p>RUC 20197900378</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
