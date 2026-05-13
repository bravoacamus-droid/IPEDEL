"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import createGlobe from "cobe";
import { ExternalLink, MapPin } from "lucide-react";
import type { Agent } from "@/lib/types/database";
import { cn } from "@/lib/utils";

// Globo 3D real (WebGL via cobe) con auto-rotación + drag para girar.
// Al seleccionar un agente, el globo "vuela" hacia su país y queda
// estático. Cada país de la red lleva su nombre superpuesto en HTML
// que se reposiciona en cada frame según la rotación del globo.

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

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const phiRef = useRef(0);
  const thetaRef = useRef(0.18);
  const targetPhiRef = useRef<number | null>(null);
  const targetThetaRef = useRef<number | null>(null);
  const pointerDownRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);

  // Mantiene un ref sincronizado del selectedId para que el frame loop
  // sepa si debe pausar la auto-rotación.
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let width = 0;
    let height = 0;

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    onResize();

    const markers = validAgents.map((a) => ({
      location: [Number(a.lat), Number(a.lng)] as [number, number],
      size: 0.04,
    }));
    markers.push({ location: [-12.0464, -77.0428], size: 0.06 });

    const dpr = Math.min(window.devicePixelRatio || 2, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: height * dpr,
      phi: 0,
      theta: 0.18,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 22000,
      mapBrightness: 5.5,
      baseColor: [0.22, 0.25, 0.22],
      markerColor: [150 / 255, 198 / 255, 0],
      glowColor: [0.95, 1, 0.85],
      markers,
    });

    let raf = 0;
    function frame() {
      raf = requestAnimationFrame(frame);

      const hasSelection = selectedIdRef.current !== null;

      // Auto-rotate: solo si no hay interacción, ni target activo, ni
      // un agente seleccionado.
      if (
        !isInteractingRef.current &&
        !hasSelection &&
        targetPhiRef.current === null &&
        targetThetaRef.current === null
      ) {
        phiRef.current += 0.0028;
      }

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
        phi: phiRef.current,
        theta: thetaRef.current,
        width: width * dpr,
        height: height * dpr,
      });

      // Reposicionar las etiquetas según la rotación actual. La proyección
      // sigue exactamente la convención de cobe (ver node_modules/cobe).
      for (const a of validAgents) {
        const el = labelRefs.current.get(a.id);
        if (!el) continue;
        const proj = project(
          Number(a.lat),
          Number(a.lng),
          phiRef.current,
          thetaRef.current,
        );
        // Coordenadas normalizadas 0..1 (igual fórmula que cobe).
        const sx = ((proj.ndcX + 1) / 2) * width;
        const sy = ((proj.ndcY + 1) / 2) * height;
        const facing = proj.z;
        const opacity = facing > 0.2 ? 1 : facing > -0.05 ? facing * 4 + 0.2 : 0;
        el.style.transform = `translate(${sx}px, ${sy}px)`;
        el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      }
    }
    raf = requestAnimationFrame(frame);

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

  // Cuando se selecciona un agente, lerp hacia su ubicación.
  // Fórmulas derivadas de la matriz de rotación cobe (ver project() abajo):
  //   xr = 0  cuando  cos(phi + lngR) = 0  →  phi = π/2 − lngR
  //   yr = 0  cuando  theta = lat
  // Con lngR = lng·π/180 − π → phi target = 3π/2 − lng·π/180.
  // Normalizamos a la diferencia más corta vs phi actual para evitar
  // que el globo de la vuelta larga al cambiar de país.
  useEffect(() => {
    if (!selected) return;
    const lng = Number(selected.lng);
    const lat = Number(selected.lat);
    let phiTarget = (3 * Math.PI) / 2 - (lng * Math.PI) / 180;
    const cur = phiRef.current;
    while (phiTarget - cur > Math.PI) phiTarget -= 2 * Math.PI;
    while (phiTarget - cur < -Math.PI) phiTarget += 2 * Math.PI;
    targetPhiRef.current = phiTarget;
    targetThetaRef.current = (lat * Math.PI) / 180;
  }, [selected]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Globo 3D + etiquetas overlay */}
      <div className="lg:col-span-7">
        <div
          ref={containerRef}
          className="relative mx-auto aspect-square w-full max-w-[640px]"
        >
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
              pointerDownRef.current = e.clientX;
              isInteractingRef.current = true;
              targetPhiRef.current = null;
              targetThetaRef.current = null;
              if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
            }}
            onPointerUp={() => {
              isInteractingRef.current = false;
              pointerDownRef.current = null;
              if (canvasRef.current) canvasRef.current.style.cursor = "grab";
            }}
            onPointerOut={() => {
              isInteractingRef.current = false;
              pointerDownRef.current = null;
            }}
            onMouseMove={(e) => {
              if (pointerDownRef.current !== null) {
                const delta = e.clientX - pointerDownRef.current;
                phiRef.current += delta / 200;
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

          {/* Etiquetas HTML superpuestas con el nombre de cada país.
              Se reposicionan en cada frame y se ocultan cuando el
              punto está al otro lado del globo. */}
          <div className="pointer-events-none absolute inset-0">
            {validAgents.map((a) => {
              const isActive = a.id === selectedId;
              return (
                <div
                  key={a.id}
                  ref={(el) => {
                    if (el) labelRefs.current.set(a.id, el);
                    else labelRefs.current.delete(a.id);
                  }}
                  className={cn(
                    "pointer-events-auto absolute left-0 top-0 -translate-x-1/2 select-none whitespace-nowrap",
                    "flex -translate-y-[200%] flex-col items-center gap-1.5",
                  )}
                  style={{ opacity: 0, transition: "opacity 0.3s ease" }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(isActive ? null : a.id)}
                    className={cn(
                      "group flex flex-col items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-lg backdrop-blur-md transition-all",
                      isActive
                        ? "bg-brand-500 text-black ring-2 ring-brand-300"
                        : "bg-white/90 text-ink-900 hover:bg-brand-500 hover:text-black",
                    )}
                  >
                    <span>{a.country}</span>
                  </button>
                  {/* Línea conectora hacia el marker */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-3 w-px",
                      isActive ? "bg-brand-500" : "bg-white/70",
                    )}
                  />
                  {/* Punto sobre el marker para reforzar la "delineación" */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rounded-full ring-2",
                      isActive
                        ? "bg-brand-500 ring-brand-300 ring-offset-2 ring-offset-ink-900"
                        : "bg-white ring-white/40",
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-ink-500">
          {selectedId
            ? isEs
              ? "Click en otro país para cambiar · arrastra para girar"
              : "Click another country to switch · drag to spin"
            : isEs
            ? "Click un país para enfocar · arrastra para girar"
            : "Click a country to focus · drag to spin"}
        </p>
      </div>

      {/* Panel lateral — lista y detalle del agente seleccionado */}
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
                        <div className="mt-3 space-y-2 text-xs">
                          {a.website && (
                            <a
                              href={a.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-[11px] font-semibold text-black hover:bg-brand-400"
                            >
                              {isEs ? "Ver sitio del agente" : "View agent site"}
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

// Proyecta un punto (lat, lng) a coordenadas NDC del canvas siguiendo
// EXACTAMENTE la convención de cobe (ver node_modules/cobe/dist/index.esm.js,
// funciones U y O). Sin esta paridad las etiquetas no caen sobre los markers.
//
//   U: lat,lng → 3D con offset −π en longitud:
//     x = −cos(lat)·cos(lng − π)
//     y =  sin(lat)
//     z =  cos(lat)·sin(lng − π)
//
//   O: aplica rotación phi (vertical) y theta (horizontal) y proyecta a
//   coordenadas NDC. ndcX, ndcY ∈ [−R, R] con R = ee + p = 0.85.
//   visible = zr ≥ 0.
function project(lat: number, lng: number, phi: number, theta: number) {
  const R = 0.85;
  const latR = (lat * Math.PI) / 180;
  const lngR = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(latR);

  const x = -R * cosLat * Math.cos(lngR);
  const y = R * Math.sin(latR);
  const z = R * cosLat * Math.sin(lngR);

  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const xr = cosP * x + sinP * z;
  const yr = sinP * sinT * x + cosT * y - cosP * sinT * z;
  const zr = -sinP * cosT * x + sinT * y + cosP * cosT * z;

  // DOM Y va hacia abajo → invertimos signo de yr al devolverlo.
  return { ndcX: xr, ndcY: -yr, z: zr };
}
