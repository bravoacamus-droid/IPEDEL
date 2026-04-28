import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const supabase = await createClient();
  const { data: title } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "nosotros_title")
    .eq("locale", locale)
    .maybeSingle();
  const { data: body } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "nosotros_body")
    .eq("locale", locale)
    .maybeSingle();

  return (
    <div className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page py-16">
          <h1 className="text-4xl font-semibold tracking-tight">
            {title?.value || (locale === "es" ? "Sobre nosotros" : "About us")}
          </h1>
        </div>
      </section>
      <section className="container-page py-12 max-w-3xl">
        <p className="text-lg text-ink-700 leading-relaxed">{body?.value}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              {locale === "es" ? "Misión" : "Mission"}
            </h2>
            <p className="mt-2 text-ink-700">
              {locale === "es"
                ? "Brindar soluciones logísticas internacionales confiables, eficientes y a la medida del cliente, conectando al Perú con el mundo."
                : "Deliver reliable, efficient and tailored international logistics solutions that connect Peru with the world."}
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              {locale === "es" ? "Visión" : "Vision"}
            </h2>
            <p className="mt-2 text-ink-700">
              {locale === "es"
                ? "Ser el agente de carga referente en el Perú por nuestra trayectoria, compromiso y red internacional de socios estratégicos."
                : "Be Peru's reference freight forwarder, recognized for our experience, commitment and global partner network."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
