import express from 'express';
import { getVolunteers, createVolunteer, getVolunteer, updateVolunteer, deleteVolunteer, getVolunteersByAge } from '../controllers/volunteerController.js';

const router = express.Router();

router.get("/", getVolunteers);
router.get("/:id", getVolunteer);
router.put("/:id", updateVolunteer);
router.delete("/:id", deleteVolunteer);
router.post("/", createVolunteer);
router.post("/report", getVolunteersByAge);
export default router;