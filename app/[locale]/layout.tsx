import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const isEs = locale === "es";

  return {
    title: isEs
      ? "IPE del Perú SAC — Agente de carga internacional"
      : "IPE del Perú SAC — International freight forwarder",
    description: isEs
      ? "Agencia de carga internacional con más de 30 años de experiencia. Servicios aéreos, marítimos y terrestres. Red de agentes en más de 40 países. Tracking por HBL."
      : "International freight forwarder with over 30 years of experience. Air, sea and land services. Partner network in 40+ countries. HBL tracking.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      type: "website",
      locale: isEs ? "es_PE" : "en_US",
      siteName: "IPE del Perú SAC",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar locale={locale as Locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale as Locale} dict={dict} />
    </div>
  );
}
