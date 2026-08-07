import { sql } from '../config/db.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await sql`SELECT * FROM events ORDER BY event_date ASC`;
    res.json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

// Get all volunteers for a specific event
export const getVolunteersForEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const volunteers = await sql`
      SELECT v.*
      FROM volunteers v
      JOIN volunteer_events ve ON v.volunteer_id = ve.volunteer_id
      WHERE ve.event_id = ${id}
      ORDER BY v.name ASC
    `;
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch volunteers for event" });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  const { name, event_date } = req.body;
  if (!name || !event_date) {
    return res.status(400).json({ success: false, error: "Name and date are required" });
  }

  try {
    const newEvent = await sql`
      INSERT INTO events (name, event_date)
      VALUES (${name}, ${event_date})
      RETURNING *
    `;

    res.status(201).json({ success: true, data: newEvent[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ success: false, error: "An event with conflicting data already exists" });
    }
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create event" });
  }
};

// Register a volunteer's attendance at an event
export const registerAttendance = async (req, res) => {
  const { id } = req.params;
  const { volunteer_id } = req.body;

  if (!volunteer_id) {
    return res.status(400).json({ success: false, error: "volunteer_id is required" });
  }

  try {
    const event = await sql`SELECT event_id FROM events WHERE event_id = ${id}`;
    if (event.length === 0) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    const volunteer = await sql`SELECT volunteer_id FROM volunteers WHERE volunteer_id = ${volunteer_id}`;
    if (volunteer.length === 0) {
      return res.status(404).json({ success: false, error: "Volunteer not found" });
    }

    const existing = await sql`
      SELECT 1 FROM volunteer_events WHERE event_id = ${id} AND volunteer_id = ${volunteer_id}
    `;
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: "Volunteer is already registered for this event" });
    }

    await sql`
      INSERT INTO volunteer_events (volunteer_id, event_id)
      VALUES (${volunteer_id}, ${id})
    `;

    res.status(201).json({ success: true, data: { event_id: Number(id), volunteer_id: Number(volunteer_id) } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to register attendance" });
  }
};

// Remove a volunteer's attendance record for an event
export const removeAttendance = async (req, res) => {
  const { id, volunteerId } = req.params;

  try {
    const deleted = await sql`
      DELETE FROM volunteer_events
      WHERE event_id = ${id} AND volunteer_id = ${volunteerId}
      RETURNING *
    `;

    if (deleted.length === 0) {
      return res.status(404).json({ success: false, error: "Attendance record not found" });
    }

    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to remove attendance" });
  }
};