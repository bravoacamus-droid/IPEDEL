// Bar chart minimalista en SVG sin librerías. Pensado para series
// cortas (6-12 puntos) tipo "embarques creados por mes". Escala
// verticalmente al valor máximo y rotula el eje X con la etiqueta
// abreviada de cada barra.

export type BarDatum = {
  label: string;
  value: number;
};

export function BarChart({
  data,
  height = 180,
  emptyMessage = "Sin datos para mostrar",
}: {
  data: BarDatum[];
  height?: number;
  emptyMessage?: string;
}) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex h-44 items-center justify-center text-sm text-ink-400">
        {emptyMessage}
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const h = 100;
  const padTop = 12;
  const padBottom = 18;
  const barAreaH = h - padTop - padBottom;
  const slot = w / data.length;
  const barW = Math.max(2, slot * 0.55);
  const gap = slot - barW;

  return (
    <div style={{ height }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {/* Líneas guía horizontales */}
        {[0.25, 0.5, 0.75, 1].map((p) => {
          const y = padTop + barAreaH * (1 - p);
          return (
            <line
              key={p}
              x1={0}
              y1={y}
              x2={w}
              y2={y}
              stroke="#e4e4e4"
              strokeWidth={0.15}
              strokeDasharray="0.6 0.6"
            />
          );
        })}
        {data.map((d, i) => {
          const x = i * slot + gap / 2;
          const barH = (d.value / max) * barAreaH;
          const y = padTop + (barAreaH - barH);
          return (
            <g key={`${d.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(barH, 0.5)}
                fill="#96c600"
                rx={0.4}
              />
              {d.value > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 1.5}
                  textAnchor="middle"
                  fontSize={3}
                  fontWeight={600}
                  fill="#0a0a0a"
                >
                  {d.value}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={h - 4}
                textAnchor="middle"
                fontSize={3}
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
