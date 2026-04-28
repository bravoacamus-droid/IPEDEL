"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Mail, MapPin, Phone, X } from "lucide-react";
import type { Agent } from "@/lib/types/database";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export function AgentMap({ agents, locale }: { agents: Agent[]; locale: "es" | "en" }) {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const visible = agents.filter((a) => a.lat != null && a.lng != null);

  return (
    <div className="relative">
      <div className="rounded-xl border border-ink-100 bg-ink-50 overflow-hidden">
        <ComposableMap
          projectionConfig={{ scale: 155 }}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup zoom={1} center={[-30, 10]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#ffffff"
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#f4faea", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {visible.map((a) => {
              const isHovered = hovered === a.id;
              const isSelected = selected?.id === a.id;
              return (
                <Marker
                  key={a.id}
                  coordinates={[Number(a.lng), Number(a.lat)]}
                  onMouseEnter={() => setHovered(a.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(a)}
                >
                  <circle
                    r={isSelected || isHovered ? 9 : 6}
                    fill="#96c600"
                    stroke="#000"
                    strokeWidth={isSelected ? 2 : 1}
                    style={{ cursor: "pointer", transition: "all 0.15s ease" }}
                  />
                  <circle
                    r={isHovered ? 14 : 0}
                    fill="#96c600"
                    fillOpacity={0.25}
                    style={{ pointerEvents: "none", transition: "all 0.2s ease" }}
                  />
                  {isHovered && !isSelected && (
                    <text
                      textAnchor="middle"
                      y={-14}
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 10,
                        fontWeight: 600,
                        fill: "#0a0a0a",
                        paintOrder: "stroke",
                        stroke: "#fff",
                        strokeWidth: 3,
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
      </div>

      {selected && (
        <div className="absolute inset-x-4 bottom-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:max-w-sm rounded-xl border border-ink-100 bg-white shadow-lg p-5">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 text-ink-400 hover:text-ink-900"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
            {selected.country}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink-900">{selected.name}</h3>
          {selected.city && (
            <p className="flex items-center gap-1.5 text-sm text-ink-600">
              <MapPin className="h-3.5 w-3.5" />
              {selected.city}
            </p>
          )}
          {selected.services?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selected.services.map((s) => (
                <span key={s} className="badge bg-ink-100 text-ink-700">
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
                className="inline-block text-brand-700 hover:underline"
              >
                {selected.website}
              </a>
            )}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-ink-500 text-center">
        {locale === "es"
          ? "Haz clic en un punto para ver los datos de contacto."
          : "Click a marker to see contact details."}
      </p>
    </div>
  );
}
