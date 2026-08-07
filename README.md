# Volunteer Management System

A full-stack volunteer management application built on the PERN stack (PostgreSQL, Express.js, React, Node.js). Organizations can manage a volunteer roster, schedule events, track attendance, and generate age-range reports through a dashboard interface.

## Features

### Volunteer Roster
- Add, edit, and remove volunteers with client- and server-side validation
- Search the roster by name or email
- Duplicate-email detection

### Event Management
- Create events with a name and date
- Register or remove volunteer attendance per event
- View attendee lists per event

### Authentication
- Single-admin JWT authentication protects all write actions (create/edit/delete volunteers, create events, register/remove attendance)
- Anyone can browse the roster, events, and reports without signing in — only mutations require login
- Passwords are bcrypt-hashed; the admin account is seeded automatically on server startup from `ADMIN_EMAIL`/`ADMIN_PASSWORD`
- Login is rate-limited (10 attempts / 15 min) to slow brute-force attempts

### Reporting
- Age-distribution chart across the whole roster
- Filterable age-range report with summary counts

### Engineering details worth noting
- Parameterized SQL queries throughout (no string-built SQL)
- Centralized API client with typed error handling on the frontend
- Toast notifications and inline form validation instead of `alert()`/`window.confirm()`
- Loading skeletons and empty states for every data view

---

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express
**Database:** PostgreSQL (Neon serverless)

---

## Database Design

```
Volunteers(volunteer_id, name, age, email, phone)
Events(event_id, name, event_date)
Volunteer_Events(volunteer_id, event_id)   -- composite PK, many-to-many attendance
```

---

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/J-Y-W/Volunteer-Management-System.git
cd Volunteer-Management-System

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**backend/.env** (copy from `backend/.env.example`):

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
FRONTEND_URL=
JWT_SECRET=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-before-deploying
```

`DATABASE_URL` is your Neon connection string. Leave `FRONTEND_URL` empty locally; set it to your deployed frontend URL in production to restrict CORS. Generate `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`ADMIN_EMAIL`/`ADMIN_PASSWORD` are seeded into the database as the one admin account on first startup (only if that email doesn't already exist) — sign in with these credentials to add/edit/delete data. Change the default password before deploying anywhere public.

**frontend/.env** (copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run

```bash
# from the repo root, runs both servers concurrently
npm run dev
```

Or separately:

```bash
cd backend && npm run dev     # http://localhost:5000
cd frontend && npm run dev    # http://localhost:5173
```

Tables (`volunteers`, `events`, `volunteer_events`) and indexes are created automatically on server startup if they don't already exist.

---

## API Endpoints

### Volunteers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/volunteers | Get all volunteers |
| GET | /api/volunteers/:id | Get a volunteer by ID |
| POST | /api/volunteers | Create a volunteer *(auth required)* |
| PUT | /api/volunteers/:id | Update a volunteer *(auth required)* |
| DELETE | /api/volunteers/:id | Delete a volunteer *(auth required)* |
| POST | /api/volunteers/report | Generate an age-range report |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Get all events |
| POST | /api/events | Create an event *(auth required)* |
| GET | /api/events/:id/volunteers | Get all volunteers attending an event |
| POST | /api/events/:id/volunteers | Register a volunteer's attendance (`{ volunteer_id }`) *(auth required)* |
| DELETE | /api/events/:id/volunteers/:volunteerId | Remove an attendance record *(auth required)* |

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Sign in with `{ email, password }`, returns a JWT |

Include the token on protected requests as `Authorization: Bearer <token>`.

---

## Deployment

- **Frontend:** deploy `frontend/` to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's `/api` URL.
- **Backend:** deploy `backend/` to Render or Railway. Set `DATABASE_URL`, `FRONTEND_URL` (your deployed frontend origin), `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
- **Database:** already on Neon; no separate hosting needed.

If your backend host sleeps on inactivity (e.g. Render's free tier), expect a slow first request after idle periods.

---

## Future Enhancements

- Pagination and sorting on the volunteer roster
- Automated tests (API + component)
- Multiple admin accounts / role-based permissions (currently a single seeded admin)

---

## Author

Justin Wang

Purdue University
B.S. Computer Science
