export default function Skeleton({ rows = 4 }) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border border-line bg-surface px-4 py-3"
        >
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-line" />
          <div className="flex-1">
            <div className="h-3 w-1/3 animate-pulse rounded bg-line" />
            <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-line/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
