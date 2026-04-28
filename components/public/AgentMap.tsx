"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Marker,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";
import { ExternalLink, Mail, MapPin, Phone, X } from "lucide-react";
import type { Agent } from "@/lib/types/database";

// Topología de jsdelivr — no requiere API key.
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function AgentMap({
  agents,
  locale,
}: {
  agents: Agent[];
  locale: "es" | "en";
}) {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const visible = agents.filter((a) => a.lat != null && a.lng != null);

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
        {/* Vignette + brand glow para look pro */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(150,198,0,0.10), transparent 55%), radial-gradient(circle at 100% 100%, rgba(0,0,0,0.45), transparent 60%)",
          }}
        />

        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 165 }}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <defs>
            {/* Océano: gradiente noche-marina */}
            <radialGradient id="ocean-fill" cx="50%" cy="40%" r="80%">
              <stop offset="0%" stopColor="#0f1f2e" />
              <stop offset="55%" stopColor="#0a1623" />
              <stop offset="100%" stopColor="#040810" />
            </radialGradient>
            {/* Tierra: degradado sutil con tinte brand */}
            <linearGradient id="land-fill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c3a4a" />
              <stop offset="100%" stopColor="#1c2632" />
            </linearGradient>
            {/* Halo brand para los pines */}
            <radialGradient id="marker-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#96c600" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#96c600" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#96c600" stopOpacity="0" />
            </radialGradient>
            {/* Resplandor para marker activo */}
            <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ZoomableGroup zoom={1} center={[-15, 12]} maxZoom={4} minZoom={0.85}>
            {/* Esfera (océano) */}
            <Sphere
              id="sphere-ocean"
              fill="url(#ocean-fill)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={0.6}
            />
            {/* Líneas latitud/longitud */}
            <Graticule
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
              step={[15, 15]}
            />

            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="url(#land-fill)"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={0.4}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#3a4858", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>

            {visible.map((a) => {
              const isHovered = hovered === a.id;
              const isSelected = selected?.id === a.id;
              const active = isHovered || isSelected;
              return (
                <Marker
                  key={a.id}
                  coordinates={[Number(a.lng), Number(a.lat)]}
                  onMouseEnter={() => setHovered(a.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(a)}
                >
                  {/* Halo difuso permanente */}
                  <circle r={active ? 18 : 12} fill="url(#marker-halo)" />
                  {/* Pulso anillo solo cuando hover/selected */}
                  {active && (
                    <circle
                      r={11}
                      fill="none"
                      stroke="#96c600"
                      strokeWidth={1}
                      strokeOpacity={0.6}
                    />
                  )}
                  {/* Punto principal */}
                  <circle
                    r={active ? 6 : 4.5}
                    fill="#96c600"
                    stroke="#0a0a0a"
                    strokeWidth={1.4}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      filter: active ? "url(#marker-glow)" : undefined,
                    }}
                  />
                  {isHovered && !isSelected && (
                    <text
                      textAnchor="middle"
                      y={-15}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10.5,
                        fontWeight: 600,
                        fill: "#ffffff",
                        paintOrder: "stroke",
                        stroke: "rgba(0,0,0,0.85)",
                        strokeWidth: 3,
                        pointerEvents: "none",
                      }}
                    >
                      {a.name}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Leyenda flotante */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_8px_2px_rgba(150,198,0,0.6)]" />
          {locale === "es" ? "Agentes destacados" : "Featured agents"}
          <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-white">
            {visible.length}
          </span>
        </div>
      </div>

      {/* Card del agente seleccionado */}
      {selected && (
        <div className="absolute inset-x-4 bottom-4 z-30 sm:inset-auto sm:bottom-6 sm:right-6 sm:max-w-sm rounded-2xl border border-white/15 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-3 top-3 text-ink-400 hover:text-ink-900"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
            {selected.country}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink-900">{selected.name}</h3>
          {selected.city && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-600">
              <MapPin className="h-3.5 w-3.5" />
              {selected.city}
            </p>
          )}
          {selected.services?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selected.services.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-700 ring-1 ring-brand-100"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 space-y-1.5 text-sm">
            {selected.contact_email && (
              <a
                href={`mailto:${selected.contact_email}`}
                className="flex items-center gap-2 text-ink-700 hover:text-ink-900"
              >
                <Mail className="h-3.5 w-3.5 text-brand-600" />
                {selected.contact_email}
              </a>
            )}
            {selected.contact_phone && (
              <a
                href={`tel:${selected.contact_phone}`}
                className="flex items-center gap-2 text-ink-700 hover:text-ink-900"
              >
                <Phone className="h-3.5 w-3.5 text-brand-600" />
                {selected.contact_phone}
              </a>
            )}
            {selected.website && (
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-700 hover:underline"
              >
                {selected.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-center text-xs text-ink-500">
        {locale === "es"
          ? "Haz clic en un punto para ver los datos de contacto · arrastra para explorar el mapa."
          : "Click a marker to see contact details · drag to explore the map."}
      </p>
    </div>
  );
}
