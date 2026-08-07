import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sql } from '../config/db.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_RE.test(email) || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const users = await sql`SELECT * FROM admin_users WHERE email = ${email.toLowerCase()}`;
    const user = users[0];

    // Compare against a dummy hash even when the user doesn't exist, so response
    // timing doesn't reveal whether an email is registered.
    const hashToCheck = user?.password_hash || '$2a$10$CwTycUXWue0Thq9StjUM0uJ8Kk8pf1x0m5xkR0K3Xa5x4h9x2q4Xe';
    const valid = await bcrypt.compare(password, hashToCheck);

    if (!user || !valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ sub: user.admin_id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '12h',
    });

    res.json({ success: true, data: { token, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to sign in' });
  }
};
