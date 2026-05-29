import { ImageResponse } from "next/og";

// Tamaño del icono — Next.js lo escala a las distintas resoluciones que
// piden los navegadores. Mantenemos 32px porque ahi se ve nitida la
// tipografia "IPE" sobre el fondo de marca.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Por que no usamos el .ico hecho a partir del logo vertical: a 16x16
// solo se distinguia el triangulo verde del isotipo y el cliente lo
// reportaba como "flechita negra" en la pestana. Aqui pintamos un bloque
// con la inicial corporativa, que queda legible en cualquier resolucion.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#96C600",
          color: "#000",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: -0.5,
          fontFamily: "system-ui, -apple-system, Segoe UI, Helvetica, Arial",
        }}
      >
        IPE
      </div>
    ),
    {
      ...size,
    },
  );
}
