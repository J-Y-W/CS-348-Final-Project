import { useState } from "react";
import AgeChart from "./AgeChart.jsx";
import EmptyState from "./EmptyState.jsx";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";

export default function ReportsView({ volunteers }) {
  const toast = useToast();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (minAge === "" || maxAge === "") {
      toast.error("Enter both a minimum and maximum age.");
      return;
    }
    if (Number(minAge) > Number(maxAge)) {
      toast.error("Minimum age can't be greater than maximum age.");
      return;
    }
    setLoading(true);
    try {
      const data = await api.volunteers.byAgeRange(minAge, maxAge);
      setReport(data);
    } catch (err) {
      toast.error(err.message || "Couldn't generate the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 font-display text-sm uppercase tracking-wide text-ink-soft">Age distribution</h3>
        {volunteers.length === 0 ? (
          <EmptyState title="No data yet" description="Add volunteers to see the age breakdown." />
        ) : (
          <div className="rounded-lg border border-line bg-surface p-4">
            <AgeChart volunteers={volunteers} />
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-display text-sm uppercase tracking-wide text-ink-soft">Age-range report</h3>
        <form onSubmit={handleGenerate} className="mb-4 flex flex-wrap items-end gap-3">
          <label className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Youngest age</span>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(e.target.value)}
              className="mt- w-28 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
          </label>
          <label className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Oldest age</span>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="mt-1 w-28 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate report"}
          </button>
        </form>

        {report && (
          <>
            <p className="mb-2 font-mono text-sm tabular text-ink-soft">
              {report.length} volunteer{report.length === 1 ? "" : "s"} in range
            </p>
            {report.length === 0 ? (
              <EmptyState title="No volunteers in this range" description="Try widening the age range." />
            ) : (
              <div className="overflow-hidden rounded-lg border border-line">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-bg text-ink-soft">
                      <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-wide">ID</th>
                      <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-wide">Name</th>
                      <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-wide">Email</th>
                      <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-wide">Phone</th>
                      <th className="px-4 py-2 font-mono text-[11px] uppercase tracking-wide">Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.map((v) => (
                      <tr key={v.volunteer_id} className="border-b border-line last:border-0 bg-surface">
                        <td className="px-4 py-2 font-mono text-ink-faint">
                          #{String(v.volunteer_id).padStart(4, "0")}
                        </td>
                        <td className="px-4 py-2 text-ink">{v.name}</td>
                        <td className="px-4 py-2 text-ink-soft">{v.email}</td>
                        <td className="px-4 py-2 text-ink-soft">{v.phone}</td>
                        <td className="px-4 py-2 font-mono tabular text-ink-soft">{v.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
