"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Preloader inicial. Se muestra solo en el primer hit de la sesión
// (sessionStorage). Hace fade-out automático tras 700ms o cuando el
// document está listo, lo que ocurra después.

const SESSION_KEY = "ipedel_preloader_shown";

export function Preloader() {
  const [phase, setPhase] = useState<"hidden" | "showing" | "fading">("hidden");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    sessionStorage.setItem(SESSION_KEY, "1");

    setPhase("showing");

    const minDuration = 800;
    const start = performance.now();

    function done() {
      const elapsed = performance.now() - start;
      const wait = Math.max(minDuration - elapsed, 0);
      setTimeout(() => setPhase("fading"), wait);
    }

    if (document.readyState === "complete") {
      done();
    } else {
      window.addEventListener("load", done, { once: true });
    }

    return () => window.removeEventListener("load", done);
  }, []);

  useEffect(() => {
    if (phase !== "fading") return;
    const t = setTimeout(() => setPhase("hidden"), 600);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-ink-900 transition-opacity duration-500 ease-out",
        phase === "fading" && "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(150,198,0,0.2), transparent 55%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-7">
        <div className="rounded-xl bg-white px-5 py-3 shadow-2xl shadow-brand-500/30">
          <Image
            src="/logo-horizontal.png"
            alt="IPE del Perú"
            width={280}
            height={64}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </div>
        <div
          className="h-[3px] w-44 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
        >
          <div className="h-full w-1/3 rounded-full bg-brand-500 animate-[ipedel-loader_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
