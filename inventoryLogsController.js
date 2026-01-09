// inventorylogsController.js

const db = require('../db');  // Assuming you have a `db` module that connects to PostgreSQL

// Create Inventory Log
exports.createInventoryLog = async (req, res) => {
  const { product_id, quantity, action, timestamp } = req.body;

  try {
    const query = 'INSERT INTO inventory_logs (product_id, quantity, action, timestamp) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await db.query(query, [product_id, quantity, action, timestamp]);
    res.status(201).json({ message: 'Inventory log created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating inventory log:', err);
    res.status(500).json({ error: 'Error creating inventory log' });
  }
};

// Get All Inventory Logs
exports.getInventoryLogs = async (req, res) => {
  try {
    const query = 'SELECT * FROM inventory_logs';
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching inventory logs:', err);
    res.status(500).json({ error: 'Error fetching inventory logs' });
  }
};

// Update Inventory Log
exports.updateInventoryLog = async (req, res) => {
  const { log_id, quantity, action } = req.body;

  try {
    const query = 'UPDATE inventory_logs SET quantity = $1, action = $2 WHERE id = $3 RETURNING *';
    const result = await db.query(query, [quantity, action, log_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventory log not found' });
    }
    res.status(200).json({ message: 'Inventory log updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating inventory log:', err);
    res.status(500).json({ error: 'Error updating inventory log' });
  }
};

// Delete Inventory Log
exports.deleteInventoryLog = async (req, res) => {
  const { log_id } = req.params;

  try {
    const query = 'DELETE FROM inventory_logs WHERE id = $1 RETURNING *';
    const result = await db.query(query, [log_id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventory log not found' });
    }
    res.status(200).json({ message: 'Inventory log deleted successfully' });
  } catch (err) {
    console.error('Error deleting inventory log:', err);
    res.status(500).json({ error: 'Error deleting inventory log' });
  }
};
