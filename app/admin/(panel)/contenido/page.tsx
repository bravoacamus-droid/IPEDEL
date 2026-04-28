import { createClient } from "@/lib/supabase/server";
import type { SiteContent } from "@/lib/types/database";

export default async function ContenidoPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("*")
    .order("section")
    .order("key");
  const list = (data as SiteContent[]) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Contenido editable</h1>
        <p className="text-sm text-ink-600">
          {list.length} entradas · edición inline en Sprint 5.
        </p>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-xs font-medium uppercase tracking-wider text-ink-600">
            <tr>
              <th className="px-4 py-3 text-left">Sección</th>
              <th className="px-4 py-3 text-left">Llave</th>
              <th className="px-4 py-3 text-left">Idioma</th>
              <th className="px-4 py-3 text-left">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {list.map((c) => (
              <tr key={`${c.key}-${c.locale}`}>
                <td className="px-4 py-3 text-ink-700">{c.section}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-900">{c.key}</td>
                <td className="px-4 py-3 uppercase text-ink-600">{c.locale}</td>
                <td className="px-4 py-3 text-ink-800 max-w-xl">{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
