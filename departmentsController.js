// departmentsController.js

const db = require('../db');  // Import the existing db.js

// Controller function to fetch departments
exports.getDepartments = async (req, res) => {
  try {
    // Query the database to fetch all departments
    const result = await db.query('SELECT * FROM departments');
    
    // Return the rows of departments as a response
    res.json(result.rows);  // 'result.rows' contains the department data
  } catch (err) {
    console.error('Error fetching departments:', err);
    res.status(500).json({ message: 'Error fetching departments' });
  }
};
