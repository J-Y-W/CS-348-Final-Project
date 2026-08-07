import express from 'express';
import {
  getVolunteers,
  createVolunteer,
  getVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getVolunteersByAge,
} from '../controllers/volunteerController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Reads are public so the demo is browsable without signing in
router.get('/', getVolunteers);
router.get('/:id', getVolunteer);
router.post('/report', getVolunteersByAge);

// Writes require a signed-in admin
router.post('/', requireAuth, createVolunteer);
router.put('/:id', requireAuth, updateVolunteer);
router.delete('/:id', requireAuth, deleteVolunteer);

export default router;
