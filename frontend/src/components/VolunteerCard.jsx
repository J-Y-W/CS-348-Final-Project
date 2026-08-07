function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function VolunteerCard({ volunteer, editable, onEdit, onDelete }) {
  return (
    <div className="group flex items-center gap-4 rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-primary/40">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft font-display text-sm text-primary">
        {initials(volunteer.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate font-display text-base text-ink">{volunteer.name}</span>
          <span className="shrink-0 font-mono text-[11px] text-ink-faint">
            #{String(volunteer.volunteer_id).padStart(4, "0")}
          </span>
        </div>
        <div className="truncate text-sm text-ink-soft">
          {volunteer.email} · {volunteer.phone}
        </div>
      </div>

      <div className="shrink-0 font-mono text-sm tabular text-ink-soft">{volunteer.age}</div>

      {editable && (
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            onClick={() => onEdit(volunteer)}
            className="rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-primary-soft hover:text-primary"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(volunteer)}
            className="rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-danger-soft hover:text-danger"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
