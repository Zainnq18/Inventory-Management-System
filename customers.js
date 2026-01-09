const express = require('express');
const router = express.Router();
const pool = require('../db'); // make sure your db.js is correctly exporting the pool

// GET all customers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
