"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export function HBLTracker({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const router = useRouter();
  const [hbl, setHbl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = hbl.trim();
    if (!value) return;
    router.push(`/${locale}/tracking?hbl=${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
        <input
          type="text"
          value={hbl}
          onChange={(e) => setHbl(e.target.value)}
          placeholder={dict.home.tracking_placeholder}
          className="input pl-9 h-12 text-base"
          aria-label={dict.tracking.input_label}
        />
      </div>
      <button type="submit" className="btn-primary h-12 px-6">
        {dict.home.tracking_button}
      </button>
    </form>
  );
}
