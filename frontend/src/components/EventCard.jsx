function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

export default function EventCard({ event, active, onSelect }) {
  return (
    <button
      onClick={() => onSelect(event.event_id)}
      className={`flex w-full items-stretch overflow-hidden rounded-lg border text-left transition-colors ${
        active ? "border-primary" : "border-line hover:border-primary/40"
      }`}
    >
      <div
        className={`flex w-20 shrink-0 flex-col items-center justify-center border-r border-dashed py-3 font-mono text-xs ${
          active ? "border-primary/40 bg-primary-soft text-primary" : "border-line bg-bg text-ink-soft"
        }`}
      >
        {formatDate(event.event_date)
          .split(" ")
          .map((part, i) => (
            <span key={i} className={i === 0 ? "uppercase tracking-wide" : "text-sm tabular"}>
              {part.replace(",", "")}
            </span>
          ))}
      </div>
      <div className="flex flex-1 items-center bg-surface px-4 py-3">
        <div className="min-w-0">
          <div className="truncate font-display text-base text-ink">{event.name}</div>
          <div className="font-mono text-[11px] text-ink-faint">
            EVT-#{String(event.event_id).padStart(4, "0")}
          </div>
        </div>
      </div>
    </button>
  );
}
