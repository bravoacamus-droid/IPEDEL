import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Premium banner reusable across all internal public pages.
// Modos:
//  · default → ink-900 con glow brand y watermark (texto blanco)
//  · backgroundImage → foto a pantalla completa con tarjeta de vidrio
//    esmerilado y texto en ink-900 oscuro (glassmorphism premium)

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  rightSlot,
  align = "left",
  backgroundImage,
  backgroundAlt = "",
  backgroundPosition = "center",
  verticalSpacing = "default",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { href: string; label: string }[];
  rightSlot?: React.ReactNode;
  align?: "left" | "center";
  backgroundImage?: string;
  backgroundAlt?: string;
  /** CSS object-position para encuadre fino del fondo. Útil cuando
   *  la zona "valiosa" de la foto no está al centro (logo arriba,
   *  edificio abajo, etc.). Acepta cualquier valor de object-position. */
  backgroundPosition?: string;
  /** Controla el padding vertical del banner. "low" baja la tarjeta
   *  para mostrar más imagen en la parte alta; "tall" hace el hero
   *  más alto y también baja un poco la tarjeta. */
  verticalSpacing?: "default" | "low" | "tall";
}) {
  const hasBg = Boolean(backgroundImage);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden",
        // Cuando hay imagen de fondo, NO usamos bg-ink-900 sobre la sección
        // porque taparía la imagen. La imagen pinta primero (orden DOM) y
        // los overlays/contenido encima sin necesidad de z-index negativos.
        !hasBg && "bg-ink-900 text-white",
        hasBg && "text-ink-900",
      )}
    >
      {hasBg ? (
        <>
          {/* Background image — sin position:absolute negativos; usa el orden
              natural de pintado: image → overlay → content. */}
          <Image
            src={backgroundImage!}
            alt={backgroundAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: backgroundPosition }}
          />
          {/* Overlay para legibilidad — más oscuro a la izquierda donde
              vive la tarjeta de vidrio. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(150,198,0,0.18),transparent_55%)]"
          />
        </>
      ) : (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 top-1/2 hidden -translate-y-1/2 opacity-[0.04] md:block"
          >
            <Image
              src="/logo-vertical.png"
              alt=""
              width={420}
              height={420}
              className="h-[28rem] w-auto"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 30%, rgba(150,198,0,0.18), transparent 45%), radial-gradient(circle at 90% 90%, rgba(194,217,113,0.14), transparent 50%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </>
      )}

      <div
        className={cn(
          "container-page relative",
          // Cuando hay imagen de fondo el banner es más compacto para que
          // la imagen no se "estire" demasiado al hacer object-cover.
          // El padding vertical es ajustable por página con verticalSpacing
          // para optimizar el encuadre de cada foto.
          hasBg && verticalSpacing === "low" && "pt-48 pb-8 sm:pt-56 sm:pb-10",
          hasBg && verticalSpacing === "default" && "pt-28 pb-14 sm:pt-32 sm:pb-16",
          hasBg && verticalSpacing === "tall" && "pt-44 pb-20 sm:pt-52 sm:pb-24",
          !hasBg && verticalSpacing === "tall" && "pt-40 pb-24 sm:pt-48 sm:pb-32",
          !hasBg && verticalSpacing !== "tall" && "pt-32 pb-20 sm:pt-36 sm:pb-24",
          rightSlot && !hasBg && "grid items-center gap-12 lg:grid-cols-12",
        )}
      >
        {/* Tarjeta de vidrio cuando hay imagen de fondo */}
        <div
          className={cn(
            !hasBg && rightSlot && "lg:col-span-7",
            !hasBg && !rightSlot && "max-w-3xl",
            align === "center" && !rightSlot && "mx-auto text-center",
            hasBg &&
              "max-w-3xl rounded-3xl border border-white/30 bg-white/30 p-8 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-10",
          )}
        >
          {breadcrumb && breadcrumb.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className={cn(
                "mb-5 flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.18em]",
                hasBg ? "text-ink-700" : "text-white/60",
              )}
            >
              {breadcrumb.map((b, i) => (
                <span key={b.href} className="flex items-center gap-1">
                  <Link
                    href={b.href}
                    className={cn(hasBg ? "hover:text-ink-900" : "hover:text-white")}
                  >
                    {b.label}
                  </Link>
                  {i < breadcrumb.length - 1 && (
                    <ChevronRight
                      className={cn(
                        "h-3 w-3",
                        hasBg ? "text-ink-400" : "text-white/40",
                      )}
                    />
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm",
                hasBg
                  ? "border-brand-700/30 bg-white/50 text-brand-800"
                  : "border-brand-300/40 bg-white/5 text-brand-300",
              )}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "text-balance font-semibold leading-[1.05] tracking-tight",
              "mt-5 text-4xl sm:text-5xl md:text-6xl",
              hasBg ? "text-ink-900" : "text-white",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-5 max-w-2xl text-base sm:text-lg",
                hasBg ? "text-ink-700" : "text-white/80",
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && !hasBg && <div className="lg:col-span-5">{rightSlot}</div>}
      </div>
    </section>
  );
}
