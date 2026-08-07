export default function Nav({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 px-2 sm:px-0" role="tablist" aria-label="Sections">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative rounded-t-lg border border-b-0 px-4 py-2.5 font-display text-sm transition-colors ${
              isActive
                ? "-mb-px border-line bg-surface text-ink"
                : "border-transparent bg-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 font-mono text-[10px] tabular ${
                  isActive ? "bg-primary-soft text-primary" : "bg-line/70 text-ink-soft"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
