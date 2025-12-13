import React, { useState, useEffect } from "react";

function App() {
  // --- CRUD state ---
  const [volunteers, setVolunteers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "" });
  const [editingId, setEditingId] = useState(null);

  // --- Report state ---
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [report, setReport] = useState([]);

  // --- Event attendance state ---
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [volunteersForEvent, setVolunteersForEvent] = useState([]);

  const API_URL = "http://localhost:5000/api/volunteers";
  const EVENTS_URL = "http://localhost:5000/api/events";

  // --- Fetch all volunteers ---
  const fetchVolunteers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setVolunteers(data.data);
    } catch (error) {
      console.error("Failed to fetch volunteers:", error);
    }
  };

  // --- Fetch all events ---
  const fetchEvents = async () => {
    try {
      const res = await fetch(EVENTS_URL);
      const data = await res.json();
      if (data.success) setEvents(data.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
    fetchEvents();
  }, []);

  // --- Fetch volunteers for selected event ---
  const fetchVolunteersForEvent = async (eventId) => {
    if (!eventId) return;
    try {
      const res = await fetch(`${EVENTS_URL}/${eventId}/volunteers`);
      const data = await res.json();
      if (data.success) setVolunteersForEvent(data.data);
    } catch (error) {
      console.error("Failed to fetch volunteers for event:", error);
    }
  };

  // --- Form handlers ---
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed");
      setForm({ name: "", email: "", phone: "", age: "" });
      setEditingId(null);
      fetchVolunteers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (v) => {
    setForm({ name: v.name, email: v.email, phone: v.phone, age: v.age });
    setEditingId(v.volunteer_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");
      fetchVolunteers();
    } catch (error) {
      console.error(error);
    }
  };

  // --- Report handler ---
  const handleGenerateReport = async () => {
    if (!minAge || !maxAge) {
      alert("Please enter both minimum and maximum age");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minAge, maxAge }),
      });

      const data = await res.json();
      if (data.success) setReport(data.data);
      else alert("Failed to fetch report");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Volunteer Manager</h1>

      {/* --- Volunteer Form --- */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} required />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" onClick={() => { setForm({ name: "", email: "", phone: "", age: "" }); setEditingId(null); }}>Cancel</button>}
      </form>

      {/* --- Volunteer Table --- */}
      <h2>All Volunteers</h2>
      <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v.volunteer_id}>
              <td>{v.volunteer_id}</td>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.phone}</td>
              <td>{v.age}</td>
              <td>
                <button onClick={() => handleEdit(v)}>Edit</button>
                <button onClick={() => handleDelete(v.volunteer_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Age Report --- */}
      <h2>Volunteer Age Report</h2>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input type="number" placeholder="Youngest Age" value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        <input type="number" placeholder="Oldest Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} />
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {report.length > 0 && (
        <>
          <p>Total Volunteers in Range: {report.length}</p>
          <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Age</th>
              </tr>
            </thead>
            <tbody>
              {report.map((v) => (
                <tr key={v.volunteer_id}>
                  <td>{v.volunteer_id}</td>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>{v.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* --- Volunteers by Event --- */}
      <h2>Volunteers by Event</h2>
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            fetchVolunteersForEvent(e.target.value);
          }}
        >
          <option value="">Select an event</option>
          {events.map((ev) => (
            <option key={ev.event_id} value={ev.event_id}>
              {ev.name} ({ev.event_date})
            </option>
          ))}
        </select>
      </div>

      {volunteersForEvent.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Age</th>
            </tr>
          </thead>
          <tbody>
            {volunteersForEvent.map((v) => (
              <tr key={v.volunteer_id}>
                <td>{v.volunteer_id}</td>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td>{v.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
