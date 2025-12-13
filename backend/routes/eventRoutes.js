import express from 'express';
import { getEvents, getVolunteersForEvent, createEvent } from '../controllers/eventController.js';

const router = express.Router();

// Get all events
router.get("/", getEvents);

// Create a new event
router.post("/", createEvent);

// Get all volunteers for a specific event
router.get("/:id/volunteers", getVolunteersForEvent);

export default router;
