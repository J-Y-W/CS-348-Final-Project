import { sql } from '../config/db.js';

// Get all volunteers (read-only, no transaction needed)
export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await sql`SELECT * FROM volunteers ORDER BY volunteer_id ASC`;
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch volunteers' });
  }
};

// Create a new volunteer
export const createVolunteer = async (req, res) => {
  const { name, age, email, phone } = req.body;
  if (!name || !age || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Name, age, email, and phone are required' });
  }

  try {
    await sql`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ`;

    const newVolunteer = await sql`
      INSERT INTO volunteers (name, age, email, phone)
      VALUES (${name}, ${age}, ${email}, ${phone})
      RETURNING *
    `;

    await sql`COMMIT`;
    res.status(201).json({ success: true, data: newVolunteer[0] });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create volunteer' });
  }
};

// Update an existing volunteer
export const updateVolunteer = async (req, res) => {
  const { id } = req.params;
  const { name, age, email, phone } = req.body;
  if (!name || !age || !email || !phone) {
    return res.status(400).json({ success: false, error: 'Name, age, email, and phone are required' });
  }

  try {
    await sql`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ`;

    const updated = await sql`
      UPDATE volunteers
      SET name=${name}, age=${age}, email=${email}, phone=${phone}
      WHERE volunteer_id=${id}
      RETURNING *
    `;

    if (updated.length === 0) {
      await sql`ROLLBACK`;
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }

    await sql`COMMIT`;
    res.status(200).json({ success: true, data: updated[0] });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to update volunteer' });
  }
};

// Delete a volunteer
export const deleteVolunteer = async (req, res) => {
  const { id } = req.params;

  try {
    await sql`BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ`;

    const deleted = await sql`
      DELETE FROM volunteers
      WHERE volunteer_id=${id}
      RETURNING *
    `;

    if (deleted.length === 0) {
      await sql`ROLLBACK`;
      return res.status(404).json({ success: false, error: 'Volunteer not found' });
    }

    await sql`COMMIT`;
    res.status(200).json({ success: true, data: deleted[0] });
  } catch (error) {
    await sql`ROLLBACK`;
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete volunteer' });
  }
};

// Get volunteers by age range (read-only)
export const getVolunteersByAge = async (req, res) => {
  const { minAge, maxAge } = req.body;

  if (!minAge || !maxAge) {
    return res.status(400).json({ success: false, error: 'Please provide minAge and maxAge' });
  }

  try {
    const volunteers = await sql`
      SELECT * FROM volunteers
      WHERE age BETWEEN ${parseInt(minAge)} AND ${parseInt(maxAge)}
      ORDER BY age ASC
    `;

    res.json({ success: true, data: volunteers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch volunteers by age' });
  }
};


export const getVolunteer = async (req, res) => {
    const { id } = req.params;
    try {
        const volunteer = await sql`SELECT * FROM volunteers WHERE volunteer_id = ${id}`;
        
        res.status(200).json({ success: true, data: volunteer[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch volunteer' });
    }
}