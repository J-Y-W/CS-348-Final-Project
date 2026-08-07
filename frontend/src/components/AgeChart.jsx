const BUCKETS = [
  { label: "<18", test: (a) => a < 18 },
  { label: "18–25", test: (a) => a >= 18 && a <= 25 },
  { label: "26–35", test: (a) => a >= 26 && a <= 35 },
  { label: "36–50", test: (a) => a >= 36 && a <= 50 },
  { label: "51–65", test: (a) => a >= 51 && a <= 65 },
  { label: "65+", test: (a) => a > 65 },
];

export default function AgeChart({ volunteers }) {
  const counts = BUCKETS.map((b) => ({
    label: b.label,
    count: volunteers.filter((v) => b.test(v.age)).length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  const width = 560;
  const height = 200;
  const barGap = 16;
  const barWidth = (width - barGap * (counts.length - 1)) / counts.length;

  return (
    <svg viewBox={`0 0 ${width} ${height + 28}`} className="w-full" role="img" aria-label="Volunteer age distribution">
      {counts.map((c, i) => {
        const barHeight = (c.count / max) * (height - 24);
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <g key={c.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              className="fill-primary/80 transition-all"
            />
            {c.count > 0 && (
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-ink font-mono text-[11px] tabular"
              >
                {c.count}
              </text>
            )}
            <text
              x={x + barWidth / 2}
              y={height + 20}
              textAnchor="middle"
              className="fill-ink-soft font-mono text-[11px]"
            >
              {c.label}
            </text>
          </g>
        );
      })}
      <line x1="0" y1={height} x2={width} y2={height} className="stroke-line" strokeWidth="1" />
    </svg>
  );
}
