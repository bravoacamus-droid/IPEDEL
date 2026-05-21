// Donut chart minimalista en SVG. Recibe segmentos con label, value
// y color. El total se muestra al centro del donut.

export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

export function DonutChart({
  segments,
  size = 160,
  thickness = 22,
  centerLabel,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerLabel?: { value: string | number; sub?: string };
}) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-ink-400"
        style={{ height: size }}
      >
        Sin datos
      </div>
    );
  }

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((s, i) => {
          const len = (s.value / total) * circ;
          const dasharray = `${len} ${circ - len}`;
          const dashoffset = -offset;
          offset += len;
          return (
            <circle
              key={`${s.label}-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
            />
          );
        })}
        {centerLabel && (
          <g className="rotate-90" style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <text
              x={cx}
              y={cy - 2}
              textAnchor="middle"
              fontSize={24}
              fontWeight={700}
              fill="#0a0a0a"
            >
              {centerLabel.value}
            </text>
            {centerLabel.sub && (
              <text
                x={cx}
                y={cy + 16}
                textAnchor="middle"
                fontSize={10}
                fill="#737373"
              >
                {centerLabel.sub}
              </text>
            )}
          </g>
        )}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {segments.map((s) => {
          const pct = ((s.value / total) * 100).toFixed(0);
          return (
            <li key={s.label} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-ink-700">{s.label}</span>
              <span className="ml-auto pl-3 font-medium text-ink-900">
                {s.value}{" "}
                <span className="text-xs font-normal text-ink-500">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
