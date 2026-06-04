# Volunteer Management System

A full-stack volunteer management application built using the PERN stack (PostgreSQL, Express.js, React, and Node.js). This application allows organizations to manage volunteers, track event attendance, and generate volunteer reports through an intuitive web interface.

## Features

### Volunteer Management
- Add new volunteers
- View all volunteers
- Update volunteer information
- Delete volunteers
- Store volunteer details including:
  - Volunteer ID
  - Name
  - Age
  - Email
  - Phone Number

### Event Management
- Store volunteer events
- Track event information including:
  - Event ID
  - Event Name
  - Event Date

### Attendance Tracking
- Maintain volunteer attendance records through a many-to-many relationship
- View all volunteers who attended a selected event
- Populate event selection dynamically from the database

### Reporting
- Generate reports based on volunteer age ranges
- Filter volunteers between a minimum and maximum age
- Display all matching volunteer information
- Show summary statistics such as total volunteers returned

### Security
- Parameterized SQL queries to prevent SQL injection attacks
- Input validation for user-provided data

---

## Technologies Used

### Frontend
- React
- JavaScript
- Vite

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL
- Neon Database

### Middleware
- CORS
- Helmet
- Morgan
- Dotenv

---

## Database Design

### Volunteers

```
Volunteers(volunteer_id, name, age, email, phone)
```

- volunteer_id is the primary key
- name stores the volunteer's name
- age stores the volunteer's age
- email stores the volunteer's email address
- phone stores the volunteer's phone number

### Events

```
Events(event_id, name, event_date)
```

- event_id is the primary key
- name stores the name of the event
- event_date stores the date of the event

### Volunteer_Events

```
Volunteer_Events(volunteer_id, event_id)
```

- (volunteer_id, event_id) is the composite primary key
- volunteer_id references Volunteers(volunteer_id)
- event_id references Events(event_id)
- stores attendance records linking volunteers to events

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/J-Y-W/Volunteer-Management-System.git
cd Volunteer-Management-System
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=your_neon_database_url
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend runs on:

```
http://localhost:5000
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## API Endpoints

### Volunteers

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/volunteers | Get all volunteers |
| GET | /api/volunteers/:id | Get a volunteer by ID |
| POST | /api/volunteers | Create a volunteer |
| PUT | /api/volunteers/:id | Update a volunteer |
| DELETE | /api/volunteers/:id | Delete a volunteer |

### Reports

| Method | Endpoint | Description |
|----------|----------|----------|
| POST | /api/volunteers/report | Generate an age-range report |

### Events

| Method | Endpoint | Description |
|----------|----------|----------|
| GET | /api/events | Get all events |
| POST | /api/events | Create an event |
| GET | /api/events/:id/volunteers | Get all volunteers attending a specific event |

---

## Future Enhancements

- Event creation and editing through the frontend
- Attendance registration interface
- Volunteer search functionality
- Sorting and filtering options
- Dashboard analytics and visualizations
- Authentication and user roles

---

## Author

Justin Wang

Purdue University  
B.S. Computer Science
