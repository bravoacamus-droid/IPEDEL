"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, MapPin } from "lucide-react";
import type { GlobeMethods } from "react-globe.gl";
import type { Agent } from "@/lib/types/database";
import { cn } from "@/lib/utils";

// react-globe.gl monta three.js — no funciona en SSR. Lazy-load del lado
// del cliente. Soporta: polígonos de países, zoom animado, etiquetas,
// auto-rotación y atmósfera. Ideal para sombrear países y enfocarlos.
const Globe = dynamic(
  () => import("react-globe.gl").then((m) => m.default),
  { ssr: false },
);

const GLOBE_TEXTURE =
  "https://unpkg.com/three-globe/example/img/earth-dark.jpg";
const COUNTRIES_TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Mapea nuestros agent.country (en español) a los `name` que vienen
// dentro del topology de world-atlas (en inglés).
const COUNTRY_NAME_MAP: Record<string, string[]> = {
  "Japón": ["Japan"],
  "Estados Unidos": ["United States of America", "United States"],
  "Bélgica": ["Belgium"],
  "Bangladesh": ["Bangladesh"],
  "Filipinas": ["Philippines"],
  "México": ["Mexico"],
};

function isAgentCountry(feature: { properties?: { name?: string } }) {
  const name = feature.properties?.name ?? "";
  return Object.values(COUNTRY_NAME_MAP).some((aliases) =>
    aliases.includes(name),
  );
}

function findAgentByFeature(
  agents: Agent[],
  feature: { properties?: { name?: string } },
): Agent | null {
  const name = feature.properties?.name ?? "";
  for (const a of agents) {
    const aliases = COUNTRY_NAME_MAP[a.country] ?? [];
    if (aliases.includes(name)) return a;
  }
  return null;
}

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

  const [countries, setCountries] = useState<object[]>([]);
  const [globeReady, setGlobeReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(560);

  // Cargar features GeoJSON del topology world-atlas.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ feature }, atlas] = await Promise.all([
        import("topojson-client"),
        fetch(COUNTRIES_TOPO_URL).then((r) => r.json()),
      ]);
      if (cancelled) return;
      const fc = feature(atlas, atlas.objects.countries) as unknown as {
        features: object[];
      };
      setCountries(fc.features);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Tamaño responsivo del globo.
  useEffect(() => {
    function onResize() {
      const w = containerRef.current?.offsetWidth ?? 560;
      setSize(Math.min(w, 720));
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Configurar controles cuando el globo esté listo o cambie selección.
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    const controls = globeRef.current.controls();
    if (controls) {
      controls.autoRotate = !selectedId;
      controls.autoRotateSpeed = 0.5;
      controls.enableZoom = false;
    }
  }, [selectedId, globeReady]);

  // Volar a la ubicación del agente seleccionado con zoom.
  useEffect(() => {
    if (!selected || !globeReady || !globeRef.current) return;
    globeRef.current.pointOfView(
      {
        lat: Number(selected.lat),
        lng: Number(selected.lng),
        altitude: 1.4,
      },
      1200,
    );
  }, [selected, globeReady]);

  // Vista por defecto al cargar.
  useEffect(() => {
    if (!globeReady || !globeRef.current) return;
    globeRef.current.pointOfView({ lat: 10, lng: -30, altitude: 2.3 });
  }, [globeReady]);

  function colorForPolygon(feature: { properties?: { name?: string } }) {
    if (!isAgentCountry(feature)) return "rgba(0, 0, 0, 0)";
    if (
      selected &&
      (COUNTRY_NAME_MAP[selected.country] ?? []).includes(
        feature.properties?.name ?? "",
      )
    ) {
      return "rgba(150, 198, 0, 0.85)";
    }
    return "rgba(150, 198, 0, 0.5)";
  }

  function altitudeForPolygon(feature: { properties?: { name?: string } }) {
    if (!isAgentCountry(feature)) return 0.006;
    if (
      selected &&
      (COUNTRY_NAME_MAP[selected.country] ?? []).includes(
        feature.properties?.name ?? "",
      )
    ) {
      return 0.04;
    }
    return 0.018;
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Globo 3D */}
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
                "radial-gradient(circle at center, rgba(150,198,0,0.22), transparent 65%)",
              filter: "blur(40px)",
            }}
          />
          {countries.length > 0 ? (
            <Globe
              ref={globeRef}
              width={size}
              height={size}
              backgroundColor="rgba(0, 0, 0, 0)"
              globeImageUrl={GLOBE_TEXTURE}
              showAtmosphere
              atmosphereColor="#96c600"
              atmosphereAltitude={0.18}
              polygonsData={countries}
              polygonAltitude={altitudeForPolygon}
              polygonCapColor={colorForPolygon}
              polygonSideColor={() => "rgba(150, 198, 0, 0.15)"}
              polygonStrokeColor={(d) =>
                isAgentCountry(d as { properties?: { name?: string } })
                  ? "rgba(255, 255, 255, 0.6)"
                  : "rgba(255, 255, 255, 0.08)"
              }
              polygonLabel={(d) => {
                const f = d as { properties?: { name?: string } };
                return isAgentCountry(f)
                  ? `<div style="background:#0a0a0a;color:#fff;padding:6px 10px;border-radius:6px;font-size:12px;font-weight:600;border:1px solid #96c600">${f.properties?.name}</div>`
                  : "";
              }}
              onPolygonClick={(d) => {
                const a = findAgentByFeature(
                  validAgents,
                  d as { properties?: { name?: string } },
                );
                if (a) setSelectedId(a.id === selectedId ? null : a.id);
              }}
              labelsData={validAgents}
              labelLat={(d) => Number((d as Agent).lat)}
              labelLng={(d) => Number((d as Agent).lng)}
              labelText={(d) => (d as Agent).country}
              labelSize={0.9}
              labelDotRadius={0.4}
              labelColor={() => "#ffffff"}
              labelResolution={2}
              labelAltitude={0.06}
              onLabelClick={(d) => {
                const a = d as Agent;
                setSelectedId(a.id === selectedId ? null : a.id);
              }}
              onGlobeReady={() => setGlobeReady(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-pulse rounded-full bg-brand-500/20" />
            </div>
          )}
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

      {/* Panel lateral */}
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
                    onClick={() =>
                      setSelectedId(isActive ? null : a.id)
                    }
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
