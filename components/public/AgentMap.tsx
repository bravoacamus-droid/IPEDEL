"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";
import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Compass,
} from "lucide-react";
import type { Agent } from "@/lib/types/database";
import { cn } from "@/lib/utils";

// Globo 3D real con WebGL (cobe). Auto-rotación, drag para girar y
// "fly to" cuando el usuario selecciona un agente.

export function AgentMap({
  agents,
  locale,
}: {
  agents: Agent[];
  locale: "es" | "en";
}) {
  const isEs = locale === "es";
  const validAgents = useMemo(
    () => agents.filter((a) => a.lat != null && a.lng != null),
    [agents],
  );

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = validAgents.find((a) => a.id === selectedId) ?? null;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs para la animación / interacción
  const phiRef = useRef(0);
  const thetaRef = useRef(0.18);
  const targetPhiRef = useRef<number | null>(null);
  const targetThetaRef = useRef<number | null>(null);
  const pointerDownRef = useRef<number | null>(null);
  const pointerMovementRef = useRef(0);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let width = 0;

    const onResize = () => {
      width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const markers = validAgents.map((a) => ({
      location: [Number(a.lat), Number(a.lng)] as [number, number],
      size: 0.06,
    }));

    // Marker dorado/blanco para Lima (sede IPE) — siempre presente
    markers.push({
      location: [-12.0464, -77.0428],
      size: 0.09,
    });

    const dpr = Math.min(window.devicePixelRatio || 2, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: 0,
      theta: 0.18,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 22000,
      mapBrightness: 5.5,
      // Tonos: tierra slate-oscuro, marker brand verde, glow tenue blanco
      baseColor: [0.22, 0.25, 0.22],
      markerColor: [150 / 255, 198 / 255, 0],
      glowColor: [0.95, 1, 0.85],
      markers,
    });

    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);

      // Auto-rotate cuando no hay interacción ni target activo
      if (
        !isInteractingRef.current &&
        targetPhiRef.current === null &&
        targetThetaRef.current === null
      ) {
        phiRef.current += 0.0028;
      }

      // Lerp suave hacia un target (cuando se selecciona un agente)
      const lerp = 0.06;
      if (targetPhiRef.current !== null) {
        const diff = targetPhiRef.current - phiRef.current;
        phiRef.current += diff * lerp;
        if (Math.abs(diff) < 0.002) {
          phiRef.current = targetPhiRef.current;
          targetPhiRef.current = null;
        }
      }
      if (targetThetaRef.current !== null) {
        const diff = targetThetaRef.current - thetaRef.current;
        thetaRef.current += diff * lerp;
        if (Math.abs(diff) < 0.002) {
          thetaRef.current = targetThetaRef.current;
          targetThetaRef.current = null;
        }
      }

      globe.update({
        phi: phiRef.current + pointerMovementRef.current,
        theta: thetaRef.current,
        width: width * dpr,
        height: width * dpr,
      });
    }
    raf = requestAnimationFrame(frame);

    // Fade-in
    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 0);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validAgents.length]);

  // Cuando se selecciona un agente, lerp hacia su ubicación
  useEffect(() => {
    if (!selected) return;
    const lng = Number(selected.lng);
    const lat = Number(selected.lat);
    // En cobe, phi rota horizontalmente: phi=0 mira a (lng=0).
    // Para centrar a `lng`, phi target = -lng en radianes.
    targetPhiRef.current = (-lng * Math.PI) / 180;
    // theta rota verticalmente; positivo mira hacia abajo del ecuador.
    targetThetaRef.current = (-lat * Math.PI) / 180;
  }, [selected]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Globo 3D */}
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-square w-full max-w-[640px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-full"
            style={{
              background:
                "radial-gradient(circle at center, rgba(150,198,0,0.18), transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              pointerDownRef.current =
                e.clientX - pointerMovementRef.current * 100;
              isInteractingRef.current = true;
              targetPhiRef.current = null;
              targetThetaRef.current = null;
              if (canvasRef.current) {
                canvasRef.current.style.cursor = "grabbing";
              }
            }}
            onPointerUp={() => {
              isInteractingRef.current = false;
              pointerDownRef.current = null;
              if (canvasRef.current) {
                canvasRef.current.style.cursor = "grab";
              }
            }}
            onPointerOut={() => {
              isInteractingRef.current = false;
              pointerDownRef.current = null;
            }}
            onMouseMove={(e) => {
              if (pointerDownRef.current !== null) {
                const delta = e.clientX - pointerDownRef.current;
                pointerMovementRef.current = delta / 200;
                phiRef.current += pointerMovementRef.current;
                pointerMovementRef.current = 0;
                pointerDownRef.current = e.clientX;
              }
            }}
            onTouchStart={(e) => {
              if (e.touches[0]) {
                pointerDownRef.current = e.touches[0].clientX;
                isInteractingRef.current = true;
                targetPhiRef.current = null;
                targetThetaRef.current = null;
              }
            }}
            onTouchEnd={() => {
              isInteractingRef.current = false;
              pointerDownRef.current = null;
            }}
            onTouchMove={(e) => {
              if (pointerDownRef.current !== null && e.touches[0]) {
                const delta = e.touches[0].clientX - pointerDownRef.current;
                phiRef.current += delta / 100;
                pointerDownRef.current = e.touches[0].clientX;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              cursor: "grab",
              contain: "layout paint size",
              opacity: 0,
              transition: "opacity 1s ease",
            }}
          />
        </div>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs uppercase tracking-[0.2em] text-ink-500">
          <Compass className="h-3.5 w-3.5 text-brand-600" strokeWidth={1.6} />
          {isEs
            ? "Arrastra para girar el globo · Click en un agente para enfocarlo"
            : "Drag to rotate · Click an agent to focus"}
        </p>
      </div>

      {/* Panel de agentes */}
      <aside className="lg:col-span-5">
        <div className="rounded-2xl border border-ink-100 bg-white p-1 shadow-sm">
          <div className="border-b border-ink-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {isEs ? "Red de agentes" : "Agent network"}
            </p>
            <p className="mt-1 text-sm text-ink-600">
              {isEs ? (
                <>
                  <span className="font-semibold text-ink-900">
                    {validAgents.length}
                  </span>{" "}
                  socios destacados en{" "}
                  <span className="font-semibold text-ink-900">+40 países</span>.
                </>
              ) : (
                <>
                  <span className="font-semibold text-ink-900">
                    {validAgents.length}
                  </span>{" "}
                  featured partners across{" "}
                  <span className="font-semibold text-ink-900">40+ countries</span>.
                </>
              )}
            </p>
          </div>
          <ul className="max-h-[520px] divide-y divide-ink-100 overflow-y-auto">
            {validAgents.map((a) => {
              const isActive = a.id === selectedId;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(isActive ? null : a.id)}
                    className={cn(
                      "group flex w-full items-start gap-4 px-5 py-4 text-left transition-colors",
                      isActive ? "bg-brand-50/70" : "hover:bg-ink-50",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full transition-all",
                        isActive
                          ? "bg-brand-500 ring-4 ring-brand-200"
                          : "bg-brand-300 group-hover:bg-brand-500",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {a.name}
                        </p>
                        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-brand-700">
                          {a.country}
                        </span>
                      </div>
                      {a.city && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                          <MapPin className="h-3 w-3" />
                          {a.city}
                        </p>
                      )}
                      {isActive && (
                        <div className="mt-3 space-y-1.5 text-xs">
                          {a.contact_email && (
                            <a
                              href={`mailto:${a.contact_email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-ink-700 hover:text-brand-700"
                            >
                              <Mail className="h-3 w-3 text-brand-600" />
                              {a.contact_email}
                            </a>
                          )}
                          {a.contact_phone && (
                            <a
                              href={`tel:${a.contact_phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-ink-700 hover:text-brand-700"
                            >
                              <Phone className="h-3 w-3 text-brand-600" />
                              {a.contact_phone}
                            </a>
                          )}
                          {a.website && (
                            <a
                              href={a.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-brand-700 hover:underline"
                            >
                              {a.website}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {a.services?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {a.services.map((s) => (
                                <span
                                  key={s}
                                  className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-ink-600 ring-1 ring-ink-200"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
