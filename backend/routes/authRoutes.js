import express from 'express';
import rateLimit from 'express-rate-limit';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Slow down brute-force attempts against the login endpoint specifically
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many sign-in attempts, please try again later' },
});

router.post('/login', loginLimiter, login);

export default router;
