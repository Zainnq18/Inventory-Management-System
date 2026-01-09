const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

const PIN = '2005';

// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;  // use username here instead of userId or email

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
    res.status(201).send('User created');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).send('User already exists or database error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Optionally generate JWT here and send it with response

    res.json({ message: 'Login successful', username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Reset password route
router.post('/reset-password', async (req, res) => {
  const { username, pin, newPassword } = req.body;

  if (pin !== PIN) {
    return res.status(403).json({ message: 'Invalid security key (PIN)' });
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    const result = await db.query('UPDATE users SET password = $1 WHERE username = $2', [hashed, username]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;
