import { useMemo, useState } from "react";
import VolunteerCard from "./VolunteerCard.jsx";
import VolunteerForm from "./VolunteerForm.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import EmptyState from "./EmptyState.jsx";
import Skeleton from "./Skeleton.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function RosterView({ volunteers, loading, onCreate, onUpdate, onDelete }) {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [formTarget, setFormTarget] = useState(null); // null closed, {} = create, volunteer = edit
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return volunteers;
    return volunteers.filter(
      (v) => v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q)
    );
  }, [volunteers, query]);

  const handleSubmit = async (payload) => {
    if (formTarget?.volunteer_id) {
      await onUpdate(formTarget.volunteer_id, payload);
    } else {
      await onCreate(payload);
    }
    setFormTarget(null);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
        />
        {isAuthenticated && (
          <button
            onClick={() => setFormTarget({})}
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light"
          >
            + Add volunteer
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={volunteers.length === 0 ? "No volunteers yet" : "No matches"}
          description={
            volunteers.length === 0
              ? isAuthenticated
                ? "Add the first volunteer to start building the roster."
                : "Sign in to start building the roster."
              : "Try a different name or email."
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((v) => (
            <VolunteerCard
              key={v.volunteer_id}
              volunteer={v}
              editable={isAuthenticated}
              onEdit={setFormTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {formTarget && (
        <VolunteerForm
          initial={
            formTarget.volunteer_id
              ? {
                  name: formTarget.name,
                  email: formTarget.email,
                  phone: formTarget.phone,
                  age: String(formTarget.age),
                }
              : null
          }
          onSubmit={handleSubmit}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete volunteer"
          description={`Remove ${deleteTarget.name} from the roster? This can't be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await onDelete(deleteTarget.volunteer_id);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
