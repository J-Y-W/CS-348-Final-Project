import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import volunteerRoutes from './routes/volunteerRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

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
    
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log('Server is running on port ' + PORT);
    });
});