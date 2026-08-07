import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import volunteerRoutes from './routes/volunteerRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { sql } from './config/db.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Add it to backend/.env (see .env.example).');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
  })
);
app.use(helmet());
app.use(morgan("dev"));

app.use('/api/auth', authRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS volunteers (
            volunteer_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            age INT,
            email VARCHAR(255) NOT NULL UNIQUE,
            phone VARCHAR(15) NOT NULL
        )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        event_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        event_date DATE NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS volunteer_events (
        volunteer_id INT NOT NULL REFERENCES volunteers(volunteer_id) ON DELETE CASCADE,
        event_id INT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
        PRIMARY KEY (volunteer_id, event_id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_ve_event_id ON volunteer_events(event_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_volunteers_age ON volunteers(age);
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        admin_id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
      )
    `;

    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn(
      'ADMIN_EMAIL / ADMIN_PASSWORD not set in backend/.env — skipping admin seed. ' +
      'Sign-in will fail until an admin user exists.'
    );
    return;
  }

  try {
    const existing = await sql`SELECT admin_id FROM admin_users WHERE email = ${ADMIN_EMAIL.toLowerCase()}`;
    if (existing.length > 0) return;

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await sql`
      INSERT INTO admin_users (email, password_hash)
      VALUES (${ADMIN_EMAIL.toLowerCase()}, ${passwordHash})
    `;
    console.log(`Seeded admin user: ${ADMIN_EMAIL}`);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
}

initDB()
  .then(seedAdmin)
  .then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
});