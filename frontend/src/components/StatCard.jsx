export default function StatCard({ label, value, suffix }) {
  return (
    <div className="group rounded-lg border border-line bg-surface px-5 py-4 transition-transform duration-150 hover:-rotate-1 hover:shadow-sm">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-faint">{label}</div>
      <div className="mt-1 flex items-baseline gap-1 font-mono text-3xl tabular text-ink">
        {value}
        {suffix && <span className="text-sm text-ink-soft">{suffix}</span>}
      </div>
    </div>
  );
}
