import { useEffect, useMemo, useState } from "react";
import EventCard from "./EventCard.jsx";
import EventForm from "./EventForm.jsx";
import EmptyState from "./EmptyState.jsx";
import Skeleton from "./Skeleton.jsx";
import { api } from "../lib/api.js";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EventsView({ events, volunteers, loading, onCreateEvent }) {
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [registeringId, setRegisteringId] = useState("");

  useEffect(() => {
    if (events.length > 0 && selectedId == null) {
      setSelectedId(events[0].event_id);
    }
  }, [events, selectedId]);

  useEffect(() => {
    if (selectedId == null) return;
    setAttendeesLoading(true);
    api.events
      .volunteersFor(selectedId)
      .then(setAttendees)
      .catch(() => toast.error("Couldn't load attendees for this event."))
      .finally(() => setAttendeesLoading(false));
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const availableToRegister = useMemo(() => {
    const registeredIds = new Set(attendees.map((a) => a.volunteer_id));
    return volunteers.filter((v) => !registeredIds.has(v.volunteer_id));
  }, [volunteers, attendees]);

  const handleRegister = async () => {
    if (!registeringId) return;
    try {
      await api.events.registerVolunteer(selectedId, registeringId);
      const updated = await api.events.volunteersFor(selectedId);
      setAttendees(updated);
      setRegisteringId("");
      toast.success("Attendance registered.");
    } catch (err) {
      toast.error(err.message || "Couldn't register attendance.");
    }
  };

  const handleUnregister = async (volunteerId) => {
    try {
      await api.events.removeVolunteer(selectedId, volunteerId);
      setAttendees((prev) => prev.filter((a) => a.volunteer_id !== volunteerId));
      toast.success("Attendance removed.");
    } catch (err) {
      toast.error(err.message || "Couldn't remove attendance.");
    }
  };

  const selectedEvent = events.find((e) => e.event_id === selectedId);

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,280px)_1fr]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-sm uppercase tracking-wide text-ink-soft">Events</h3>
          {isAuthenticated && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-light"
            >
              + New
            </button>
          )}
        </div>

        {loading ? (
          <Skeleton rows={3} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description={
              isAuthenticated ? "Create the first event to start tracking attendance." : "Sign in to create the first event."
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {events.map((ev) => (
              <EventCard key={ev.event_id} event={ev} active={ev.event_id === selectedId} onSelect={setSelectedId} />
            ))}
          </div>
        )}
      </div>

      <div>
        {!selectedEvent ? (
          <EmptyState title="Select an event" description="Choose an event on the left to manage its attendance." />
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
              <div>
                <h3 className="font-display text-lg text-ink">{selectedEvent.name}</h3>
                <p className="text-sm text-ink-soft">
                  {new Date(selectedEvent.event_date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <select
                    value={registeringId}
                    onChange={(e) => setRegisteringId(e.target.value)}
                    className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
                  >
                    <option value="">Register a volunteer…</option>
                    {availableToRegister.map((v) => (
                      <option key={v.volunteer_id} value={v.volunteer_id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleRegister}
                    disabled={!registeringId}
                    className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {attendeesLoading ? (
              <Skeleton rows={3} />
            ) : attendees.length === 0 ? (
              <EmptyState
                title="No attendees yet"
                description={
                  isAuthenticated
                    ? "Register a volunteer above to record their attendance."
                    : "Sign in to register attendance."
                }
              />
            ) : (
              <div className="flex flex-col gap-2">
                {attendees.map((v) => (
                  <div
                    key={v.volunteer_id}
                    className="flex items-center justify-between rounded-lg border border-line bg-surface px-4 py-3"
                  >
                    <div>
                      <span className="font-display text-sm text-ink">{v.name}</span>
                      <span className="ml-2 font-mono text-[11px] text-ink-faint">
                        #{String(v.volunteer_id).padStart(4, "0")}
                      </span>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => handleUnregister(v.volunteer_id)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-danger-soft hover:text-danger"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <EventForm
          onSubmit={async (payload) => {
            const created = await onCreateEvent(payload);
            setShowForm(false);
            if (created) setSelectedId(created.event_id);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
