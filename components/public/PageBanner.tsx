import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Premium banner reusable across all internal public pages.
// - Background: ink-900 with subtle radial brand glow + faint logo watermark
// - Optional eyebrow, breadcrumb, title, subtitle
// - Optional right-side image slot (e.g. service hero)

export function PageBanner({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  rightSlot,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { href: string; label: string }[];
  rightSlot?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      {/* Decoración: logo watermark + glow brand */}
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

      <div
        className={cn(
          "container-page relative pt-32 pb-20 sm:pt-36 sm:pb-24",
          rightSlot && "grid items-center gap-12 lg:grid-cols-12",
        )}
      >
        <div
          className={cn(
            rightSlot ? "lg:col-span-7" : "max-w-3xl",
            align === "center" && !rightSlot && "mx-auto text-center",
          )}
        >
          {breadcrumb && breadcrumb.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mb-5 flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.18em] text-white/60"
            >
              {breadcrumb.map((b, i) => (
                <span key={b.href} className="flex items-center gap-1">
                  <Link href={b.href} className="hover:text-white">
                    {b.label}
                  </Link>
                  {i < breadcrumb.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-white/40" />
                  )}
                </span>
              ))}
            </nav>
          )}
          {eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-300 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "text-balance font-semibold leading-[1.05] tracking-tight",
              "mt-5 text-4xl sm:text-5xl md:text-6xl",
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
        {rightSlot && <div className="lg:col-span-5">{rightSlot}</div>}
      </div>
    </section>
  );
}
