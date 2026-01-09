const db = require('../db'); // ✅ CommonJS

const getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const offset = (page - 1) * limit;

    const result = await db.query(`
      SELECT p.id, p.name, p.quantity, p.mrp, d.name AS department_name
      FROM products p
      JOIN departments d ON p.department_id = d.id
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    const countResult = await db.query('SELECT COUNT(*) FROM products');
    const totalCount = countResult.rows[0].count;

    res.json({
      products: result.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

const createProduct = async (req, res) => {
  const { name, quantity, mrp, department_name } = req.body;

  try {
    const deptResult = await db.query(
      'SELECT id FROM departments WHERE name = $1',
      [department_name]
    );

    if (deptResult.rows.length === 0) {
      return res.status(400).json({ message: 'Department not found' });
    }

    const department_id = deptResult.rows[0].id;

    const result = await db.query(
      'INSERT INTO products (name, quantity, mrp, department_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, mrp, department_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
};
