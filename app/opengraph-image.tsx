import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "IPE del Perú SAC — Agente de carga internacional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #262626 60%, #485f00 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 12,
              height: 48,
              background: "#96c600",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#c2d971",
            }}
          >
            IPE del Perú SAC
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Confianza logística que cruza fronteras
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#d8d8d8",
              maxWidth: 900,
            }}
          >
            Agente de carga internacional · 30+ años · Red en 40+ países
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#8a8a8a",
          }}
        >
          <span>RUC 20197900378</span>
          <span>ipeperu.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
