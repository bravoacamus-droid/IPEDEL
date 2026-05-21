import { notFound } from "next/navigation";
import { ExternalLink, Mail, MapPin, Phone, Clock } from "lucide-react";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ContactForm } from "@/components/public/ContactForm";
import { PageBanner } from "@/components/public/PageBanner";
import { FacebookIcon } from "@/components/public/BrandIcons";
import { MAPS_URL, SITE } from "@/lib/site";

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
      <PageBanner title={dict.contact.title} />

      <section className="container-page py-16 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-ink-900">
            {locale === "es" ? "Escríbenos un mensaje" : "Send us a message"}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {locale === "es"
              ? "Completa el formulario y nos ponemos en contacto contigo."
              : "Complete the form and we will get back to you."}
          </p>
          <div className="mt-6">
            <ContactForm dict={dict} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {locale === "es" ? "Datos de contacto" : "Contact details"}
            </h3>
            <ul className="mt-4 space-y-4 text-sm">
              <li>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3"
                  aria-label={
                    locale === "es"
                      ? "Abrir dirección en Google Maps"
                      : "Open address in Google Maps"
                  }
                >
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <MapPin className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-ink-900 group-hover:text-brand-700 inline-flex items-center gap-1.5">
                      {SITE.address.line1}
                      <ExternalLink className="h-3.5 w-3.5 text-ink-400" />
                    </p>
                    <p className="text-ink-500">{SITE.address.line2}</p>
                    <p className="mt-1 text-xs text-brand-700">
                      {locale === "es" ? "Ver en Google Maps" : "View on Google Maps"}
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`tel:${SITE.phoneTel}`} className="group flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Phone className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-ink-900 group-hover:text-brand-700">
                      {SITE.phone}
                    </p>
                    <p className="text-xs text-ink-500">
                      {locale === "es" ? "Lun a Vie · 8:30am – 6:00pm" : "Mon to Fri · 8:30am – 6:00pm"}
                    </p>
                  </div>
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="group flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <Mail className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-ink-900 group-hover:text-brand-700">{SITE.email}</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                    <FacebookIcon className="h-4 w-4" />
                  </span>
                  <span className="text-ink-900 group-hover:text-brand-700">Facebook</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="card overflow-hidden">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[4/3] bg-ink-100 group"
              aria-label={
                locale === "es"
                  ? "Abrir ubicación en Google Maps"
                  : "Open location in Google Maps"
              }
            >
              <iframe
                src="https://www.google.com/maps?q=Calle+el+Boulevard+182+Surco+Lima&output=embed"
                className="h-full w-full pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación IPE del Perú SAC"
                allowFullScreen
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-white/95 px-4 py-3 text-xs backdrop-blur">
                <span className="font-medium text-ink-900">
                  {locale === "es" ? "Cómo llegar" : "Get directions"}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-ink-500 group-hover:text-brand-700" />
              </div>
            </a>
          </div>

          <div className="card p-5 text-xs text-ink-500">
            <p className="font-semibold text-ink-700">{SITE.legalName}</p>
            <p>RUC {SITE.ruc}</p>
            <p className="mt-2 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-600" />
              {locale === "es" ? "Atención lunes a viernes" : "Open Monday to Friday"}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
