"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternateLocale, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ current }: { current: Locale }) {
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
    <div className="flex items-center rounded-md border border-ink-200 text-xs font-medium overflow-hidden">
      <Link
        href={buildHref(current)}
        aria-current="page"
        className={cn(
          "px-2.5 py-1.5",
          "bg-ink-900 text-white",
        )}
      >
        {current.toUpperCase()}
      </Link>
      <Link
        href={buildHref(other)}
        className="px-2.5 py-1.5 text-ink-700 hover:bg-ink-100"
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );
}
