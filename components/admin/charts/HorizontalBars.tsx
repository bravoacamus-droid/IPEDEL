// Lista de barras horizontales con label + value. Util para
// distribuciones cuando hay muchos items y un donut quedaria saturado.
export type HBarDatum = {
  label: string;
  value: number;
  color?: string;
};

export function HorizontalBars({
  data,
  emptyMessage = "Sin datos para mostrar",
}: {
  data: HBarDatum[];
  emptyMessage?: string;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-ink-400">
        {emptyMessage}
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const widthPct = (d.value / max) * 100;
        const totalPct = ((d.value / total) * 100).toFixed(0);
        return (
          <li key={d.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate text-ink-700">{d.label}</span>
              <span className="shrink-0 font-medium text-ink-900">
                {d.value}{" "}
                <span className="text-xs font-normal text-ink-500">({totalPct}%)</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${widthPct}%`,
                  background: d.color || "#96c600",
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
