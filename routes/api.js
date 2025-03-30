const express = require('express');
const router = express.Router();

// Handle GET request
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the code execution sandbox API!' });
});

// Handle POST request
router.post('/execute', (req, res) => {
  const { code } = req.body;
  if (code) {
    // Code execution logic will go here (system automation, etc.)
    res.json({ message: 'Code execution started.', code });
  } else {
    res.status(400).json({ error: 'No code provided.' });
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