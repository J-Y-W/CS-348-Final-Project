import { sql } from '../config/db.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateVolunteerInput({ name, age, email, phone }) {
  if (!name || !String(name).trim()) return 'Name is required';
  if (!email || !EMAIL_RE.test(email)) return 'A valid email is required';
  if (!phone || !String(phone).trim()) return 'Phone is required';
  const ageNum = Number(age);
  if (age === undefined || age === null || age === '' || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
    return 'Age must be a number between 0 and 120';
  }
  return null;
}

// Get all volunteers
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await sql`SELECT * FROM volunteers ORDER BY volunteer_id ASC`;
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch volunteers' });
  }
};

// Get a single volunteer
export const getVolunteer = async (req, res) => {
  const { id } = req.params;
  try {
    const volunteer = await sql`SELECT * FROM volunteers WHERE volunteer_id = ${id}`;
    if (volunteer.length === 0) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: volunteer[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch volunteer' });
  }
};

// Create a new volunteer
export const createVolunteer = async (req, res) => {
  const { name, age, email, phone } = req.body;
  const validationError = validateVolunteerInput({ name, age, email, phone });
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    const newVolunteer = await sql`
      INSERT INTO volunteers (name, age, email, phone)
      VALUES (${name}, ${age}, ${email}, ${phone})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: newVolunteer[0] });
  } catch (error) {
    // Postgres unique_violation on the email column
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'A volunteer with this email already exists' });
    }
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create volunteer' });
  }
};

// Update an existing volunteer
export const updateVolunteer = async (req, res) => {
  const { id } = req.params;
  const { name, age, email, phone } = req.body;
  const validationError = validateVolunteerInput({ name, age, email, phone });
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  try {
    const updated = await sql`
      UPDATE volunteers
      SET name=${name}, age=${age}, email=${email}, phone=${phone}
      WHERE volunteer_id=${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, error: 'A volunteer with this email already exists' });
    }
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update volunteer' });
  }
};

// Delete a volunteer
export const deleteVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await sql`
      DELETE FROM volunteers
      WHERE volunteer_id=${id}
      RETURNING *
    `;

    if (deleted.length === 0) {
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete volunteer' });
  }
};

// Get volunteers by age range (read-only)
export const getVolunteersByAge = async (req, res) => {
  const { minAge, maxAge } = req.body;
  const min = parseInt(minAge, 10);
  const max = parseInt(maxAge, 10);

  if (Number.isNaN(min) || Number.isNaN(max)) {
    return res.status(400).json({ success: false, error: 'Please provide minAge and maxAge' });
  }

  try {
    const volunteers = await sql`
      SELECT * FROM volunteers
      WHERE age BETWEEN ${min} AND ${max}
      ORDER BY age ASC
    `;
    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch volunteers by age' });
  }
};
