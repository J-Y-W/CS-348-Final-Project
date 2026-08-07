import { useEffect, useState } from "react";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { api } from "./lib/api.js";
import Nav from "./components/Nav.jsx";
import StatCard from "./components/StatCard.jsx";
import RosterView from "./components/RosterView.jsx";
import EventsView from "./components/EventsView.jsx";
import ReportsView from "./components/ReportsView.jsx";
import LoginForm from "./components/LoginForm.jsx";

function Dashboard() {
  const toast = useToast();
  const { isAuthenticated, email, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [tab, setTab] = useState("roster");
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [v, e] = await Promise.all([api.volunteers.list(), api.events.list()]);
      setVolunteers(v);
      setEvents(e);
    } catch (err) {
      toast.error(err.message || "Couldn't load data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateVolunteer = async (payload) => {
    try {
      const created = await api.volunteers.create(payload);
      setVolunteers((prev) => [...prev, created]);
      toast.success(`${created.name} added to the roster.`);
    } catch (err) {
      toast.error(err.message || "Couldn't add volunteer.");
      throw err;
    }
  };

  const handleUpdateVolunteer = async (id, payload) => {
    try {
      const updated = await api.volunteers.update(id, payload);
      setVolunteers((prev) => prev.map((v) => (v.volunteer_id === id ? updated : v)));
      toast.success(`${updated.name} updated.`);
    } catch (err) {
      toast.error(err.message || "Couldn't update volunteer.");
      throw err;
    }
  };

  const handleDeleteVolunteer = async (id) => {
    try {
      await api.volunteers.remove(id);
      setVolunteers((prev) => prev.filter((v) => v.volunteer_id !== id));
      toast.success("Volunteer removed.");
    } catch (err) {
      toast.error(err.message || "Couldn't delete volunteer.");
    }
  };

  const handleCreateEvent = async (payload) => {
    try {
      const created = await api.events.create(payload);
      setEvents((prev) =>
        [...prev, created].sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      );
      toast.success(`${created.name} scheduled.`);
      return created;
    } catch (err) {
      toast.error(err.message || "Couldn't create event.");
      return null;
    }
  };

  const upcomingCount = events.filter((e) => new Date(e.event_date) >= new Date().setHours(0, 0, 0, 0)).length;
  const avgAge = volunteers.length
    ? Math.round(volunteers.reduce((sum, v) => sum + Number(v.age || 0), 0) / volunteers.length)
    : 0;

  const tabs = [
    { id: "roster", label: "Roster", count: volunteers.length },
    { id: "events", label: "Events", count: events.length },
    { id: "reports", label: "Reports" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Field Roster</p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">Volunteer Management</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Track your roster, log event attendance, and pull reports — all in one place.
          </p>
        </div>

        <div className="shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-md border border-line bg-surface px-3 py-2">
              <span className="font-mono text-xs text-ink-soft">{email}</span>
              <button
                onClick={logout}
                className="rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-bg hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="rounded-md border border-line bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-primary/40"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Volunteers" value={volunteers.length} />
        <StatCard label="Upcoming events" value={upcomingCount} />
        <StatCard label="Total events" value={events.length} />
        <StatCard label="Average age" value={avgAge || "—"} />
      </div>

      <Nav tabs={tabs} active={tab} onChange={setTab} />
      <div className="rounded-b-lg rounded-tr-lg border border-line bg-surface p-5 sm:p-6">
        {tab === "roster" && (
          <RosterView
            volunteers={volunteers}
            loading={loading}
            onCreate={handleCreateVolunteer}
            onUpdate={handleUpdateVolunteer}
            onDelete={handleDeleteVolunteer}
          />
        )}
        {tab === "events" && (
          <EventsView
            events={events}
            volunteers={volunteers}
            loading={loading}
            onCreateEvent={handleCreateEvent}
          />
        )}
        {tab === "reports" && <ReportsView volunteers={volunteers} />}
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </ToastProvider>
  );
}
