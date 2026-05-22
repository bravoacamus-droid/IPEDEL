"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocale, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({
  current,
  scrolled = true,
}: {
  current: Locale;
  scrolled?: boolean;
}) {
  const pathname = usePathname() || "/";
  const other = alternateLocale(current);

  function buildHref(target: Locale) {
    const segments = pathname.split("/");
    if (segments.length > 1 && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = target;
    } else {
      segments.splice(1, 0, target);
    }
    return segments.join("/") || `/${target}`;
  }

  return (
    <div
      className={cn(
        "flex items-center overflow-hidden rounded-full border text-xs font-medium transition-colors",
        scrolled ? "border-ink-200" : "border-white/30",
      )}
    >
      <Link
        href={buildHref(current)}
        aria-current="page"
        className={cn(
          "px-2.5 py-1.5",
          scrolled ? "bg-ink-900 text-white" : "bg-white text-black",
        )}
      >
        {current.toUpperCase()}
      </Link>
      <Link
        href={buildHref(other)}
        className={cn(
          "px-2.5 py-1.5 transition-colors",
          scrolled
            ? "text-ink-800 hover:bg-ink-100"
            : "text-white hover:bg-white/15",
        )}
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );
}
