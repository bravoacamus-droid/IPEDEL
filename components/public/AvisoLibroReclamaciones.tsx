import Link from "next/link";
import { BookText } from "lucide-react";

// Aviso del Libro de Reclamaciones — formato del Anexo 2 del
// DS 011-2011-PCM. Debe ser visible para el consumidor en el sitio
// (Art. 9). Versión digital del cartelito que las empresas exhiben
// físicamente en sus locales.

export function AvisoLibroReclamaciones({ locale }: { locale: "es" | "en" }) {
  const isEs = locale === "es";
  return (
    <Link
      href={`/${locale}/libro-de-reclamaciones`}
      aria-label={
        isEs
          ? "Libro de Reclamaciones — registrar reclamo o queja"
          : "Complaints book — register a complaint"
      }
      className="group flex items-stretch overflow-hidden rounded-lg border-2 border-brand-500 bg-white text-left text-ink-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="flex w-12 shrink-0 items-center justify-center bg-brand-500 text-black transition-colors group-hover:bg-brand-400">
        <BookText className="h-6 w-6" strokeWidth={1.6} />
      </span>
      <span className="flex flex-col justify-center px-4 py-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">
          {isEs ? "Libro de Reclamaciones" : "Complaints book"}
        </span>
        <span className="text-xs leading-snug text-ink-700">
          {isEs ? (
            <>
              Conforme al Código de Protección y Defensa del Consumidor —{" "}
              <span className="font-medium">Ley N° 29571</span>
            </>
          ) : (
            <>
              Per Peruvian Consumer Protection Code —{" "}
              <span className="font-medium">Law N° 29571</span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
