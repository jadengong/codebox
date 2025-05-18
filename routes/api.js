const express = require('express');
const { runCodeInDocker } = require('../codeExecution');
const router = express.Router();


// Handle GET request to test API
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the code execution sandbox API!' });
});

// Handle POST /api/execute
router.post('/execute', async (req, res) => {
  const { code, language } = req.body;

  if (code) {
    try {
      // Simulate code execution (placeholder)
      const result = await runCodeInDocker(code, language);

      res.json({
        message: 'Code execution started.',
        code,
        language,
        result
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
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
