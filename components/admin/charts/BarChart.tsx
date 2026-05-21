// Bar chart minimalista en SVG sin librerías. Usa viewBox proporcional
// y preserveAspectRatio "xMidYMid meet" para que el texto NO se
// distorsione horizontalmente cuando el contenedor es ancho.

export type BarDatum = {
  label: string;
  value: number;
};

const BASE_W = 600;
const BASE_H = 200;

export function BarChart({
  data,
  height = 200,
  emptyMessage = "Sin datos para mostrar",
}: {
  data: BarDatum[];
  height?: number;
  emptyMessage?: string;
}) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div
        className="flex items-center justify-center text-sm text-ink-400"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const padX = 10;
  const padTop = 20;
  const padBottom = 26;
  const innerW = BASE_W - 2 * padX;
  const innerH = BASE_H - padTop - padBottom;
  const slot = innerW / data.length;
  const barW = Math.min(slot * 0.55, 56);
  const offset = (slot - barW) / 2;

  return (
    <div className="w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${BASE_W} ${BASE_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
      >
        {/* Líneas guía horizontales */}
        {[0.25, 0.5, 0.75, 1].map((p) => {
          const y = padTop + innerH * (1 - p);
          return (
            <line
              key={p}
              x1={padX}
              y1={y}
              x2={BASE_W - padX}
              y2={y}
              stroke="#e4e4e4"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}
        {data.map((d, i) => {
          const x = padX + i * slot + offset;
          const barH = (d.value / max) * innerH;
          const y = padTop + (innerH - barH);
          return (
            <g key={`${d.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 2)}
                fill="#96c600"
                rx={3}
              />
              {d.value > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={600}
                  fill="#0a0a0a"
                >
                  {d.value}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={BASE_H - 8}
                textAnchor="middle"
                fontSize={11}
                fill="#737373"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
