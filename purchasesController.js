const db = require('../db'); // Assuming you have a db.js file to handle your database queries

// Function to get all purchases
exports.getPurchases = async (req, res) => {
  try {
    // Query to get all the purchase data from the database
    const result = await db.query('SELECT * FROM purchases'); // Adjust this query if needed
    res.json(result.rows); // Send the query result as JSON
  } catch (err) {
    console.error('Error fetching purchases:', err);
    res.status(500).json({ message: 'Error fetching purchases' });
  }
};

// Function to add a new purchase
exports.addPurchase = async (req, res) => {
  const { customer_id, product_id, quantity } = req.body;

  if (!customer_id || !product_id || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const result = await db.query(
      'INSERT INTO purchases (customer_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [customer_id, product_id, quantity]
    );
    res.status(201).json(result.rows[0]); // Return the added purchase as JSON
  } catch (err) {
    console.error('Error adding purchase:', err);
    res.status(500).json({ message: 'Error adding purchase' });
  }
};
