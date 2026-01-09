const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products?page=1
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // Number of products per page
    const offset = (page - 1) * limit;

    const totalResult = await db.query('SELECT COUNT(*) FROM products');
    const totalCount = parseInt(totalResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    const productsResult = await db.query(`
      SELECT p.*, d.name AS department_name
      FROM products p
      LEFT JOIN departments d ON p.department_id = d.id
      ORDER BY p.id ASC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      products: productsResult.rows,
      totalPages,
    });
  } catch (err) {
    console.error('Error fetching products with pagination:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products - Add a new product
router.post('/', async (req, res) => {
  const { name, department_id, mrp, quantity } = req.body;

  // Validate that all required fields are provided, including quantity
  if (!name || !department_id || !mrp || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert the new product into the products table
    const result = await db.query(
      'INSERT INTO products (name, department_id, mrp, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, department_id, mrp, quantity]
    );

    // Respond with the newly created product
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
});
// GET /api/products-names - Get all product names (for Inventory Logs dropdown)
router.get('/products-names', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching product names:', err);
    res.status(500).json({ error: 'Failed to fetch product names' });
  }
});
// Route to fetch all products (used for dropdowns without pagination)
router.get('/all', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ error: 'Failed to fetch all products' });
  }
});


module.exports = router;
