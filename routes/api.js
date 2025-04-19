const express = require('express');
const router = express.Router();
const pool = require('../config/db') // import pool instance from db.js

// Handle GET request
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the code execution sandbox API!' });
});

// Handle POST request
router.post('/execute', async (req, res) => {
  const { code } = req.body;

  if (code) {
    try {
      // Simulating code execution (replace with real code execution logic)
      const result = 'Executed code: ${code}'; // Placeholder

      // Insert code and its result into database
      const query = 'INSERT INTO executions (code, result) VALUES ($1, $2) RETURNING *';
      const values = [code, result];
      const dbResult = await pool.query(query, values);

      res.json({
        message: 'Code execution started.',
        code,
        result,
        execution_id: dbResult.rows[0].id, // Return execution ID from database
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error'});
    } 
  } else {
    res.status(400).json({ error: 'No code provided.'});
  }
});

// Handle PUT request
router.put('/update', (req, res) => {
  res.json({ message: 'Update request received!' });
});

// Handle DELETE request
router.delete('/delete', (req, res) => {
  res.json({ message: 'Delete request received!' });
});

module.exports = router;