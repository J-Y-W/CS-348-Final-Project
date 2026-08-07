import express from 'express';
import {
  getEvents,
  getVolunteersForEvent,
  createEvent,
  registerAttendance,
  removeAttendance,
} from '../controllers/eventController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Reads are public so the demo is browsable without signing in
router.get("/", getEvents);
router.get("/:id/volunteers", getVolunteersForEvent);

// Writes require a signed-in admin
router.post("/", requireAuth, createEvent);
router.post("/:id/volunteers", requireAuth, registerAttendance);
router.delete("/:id/volunteers/:volunteerId", requireAuth, removeAttendance);

export default router;
