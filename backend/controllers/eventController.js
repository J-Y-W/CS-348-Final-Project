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
    await sql`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ`;

    const newEvent = await sql`
      INSERT INTO events (name, event_date)
      VALUES (${name}, ${event_date})
      RETURNING *
    `;

    await sql`COMMIT`;
    res.status(201).json({ success: true, data: newEvent[0] });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create event" });
  }
};