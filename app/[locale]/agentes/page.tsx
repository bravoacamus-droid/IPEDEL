import { notFound } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createClient } from "@/lib/supabase/server";
import type { Agent } from "@/lib/types/database";
import { AgentMap } from "@/components/public/AgentMap";

export default async function AgentesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  const agents = (data as Agent[]) || [];

  return (
    <div className="bg-white">
      <section className="bg-ink-900 text-white">
        <div className="container-page py-16">
          <h1 className="text-4xl font-semibold tracking-tight">
            {locale === "es" ? "Agentes internacionales" : "International agents"}
          </h1>
          <p className="mt-3 max-w-2xl text-ink-300">
            {locale === "es"
              ? "Una red global de socios estratégicos en más de 40 países que respaldan cada operación de IPE del Perú."
              : "A global network of strategic partners in 40+ countries backing every IPE del Perú operation."}
          </p>
        </div>
      </section>

      <section className="container-page py-12 space-y-10">
        <AgentMap agents={agents} locale={locale as Locale} />

        <div>
          <h2 className="text-xl font-semibold text-ink-900">
            {locale === "es" ? "Agentes destacados" : "Featured agents"}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((a) => (
              <div key={a.id} className="card p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
                  {a.country}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink-900">{a.name}</h3>
                {a.city && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
                    <MapPin className="h-3.5 w-3.5" />
                    {a.city}
                  </p>
                )}
                {a.services && a.services.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.services.map((s) => (
                      <span key={s} className="badge bg-ink-100 text-ink-700">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="mt-4 space-y-1.5 text-sm">
                  {a.contact_email && (
                    <li className="flex items-center gap-2 text-ink-700">
                      <Mail className="h-3.5 w-3.5 text-brand-600" />
                      <a href={`mailto:${a.contact_email}`} className="hover:text-ink-900">
                        {a.contact_email}
                      </a>
                    </li>
                  )}
                  {a.contact_phone && (
                    <li className="flex items-center gap-2 text-ink-700">
                      <Phone className="h-3.5 w-3.5 text-brand-600" />
                      <a href={`tel:${a.contact_phone}`} className="hover:text-ink-900">
                        {a.contact_phone}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          {agents.length === 0 && (
            <p className="text-center text-ink-500 mt-6">{dict.common.loading}</p>
          )}
        </div>
      </section>
    </div>
  );
}
