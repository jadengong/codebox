const express = require('express');
const { runCodeInDocker, cleanupTempFiles } = require('../codeExecution');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    supportedLanguages: ['python', 'javascript']
  });
});

// Handle GET request to test API
router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the code execution sandbox API!',
    supportedLanguages: ['python', 'javascript'],
    endpoints: {
      'GET /health': 'Health check and system status',
      'POST /execute': 'Execute code in the specified language',
      'GET /': 'API information'
    }
  });
});

// Handle POST /api/execute
router.post('/execute', async (req, res) => {
  const { code, language } = req.body;

  // Input validation
  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Code is required and must be a non-empty string',
      received: { code: code || null, language: language || null }
    });
  }

  if (!language || typeof language !== 'string') {
    return res.status(400).json({ 
      error: 'Language must be specified',
      received: { code: code.trim(), language: language || null }
    });
  }

  // Trim the code to remove unnecessary whitespace
  const trimmedCode = code.trim();
  
  // Check for reasonable code length (prevent abuse)
  if (trimmedCode.length > 10000) {
    return res.status(400).json({ 
      error: 'Code is too long. Maximum length is 10,000 characters.',
      received: { codeLength: trimmedCode.length, language }
    });
  }

  try {
    console.log(`[API] Executing ${language} code (${trimmedCode.length} chars)`);
    
    const result = await runCodeInDocker(trimmedCode, language);

    res.json({
      success: true,
      message: 'Code executed successfully',
      result: result,
      metadata: {
        language: language,
        codeLength: trimmedCode.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[API] Execution error:', error);
    
    // Handle specific error types
    if (error.message.includes('Unsupported language')) {
      return res.status(400).json({ 
        error: error.message,
        supportedLanguages: ['python', 'javascript']
      });
    }
    
    if (error.message.includes('Code must be')) {
      return res.status(400).json({ error: error.message });
    }

    // Generic server error
    res.status(500).json({ 
      error: 'Internal server error during code execution',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    });
  }
});

// Manual cleanup endpoint (for admin use)
router.post('/cleanup', (req, res) => {
  try {
    cleanupTempFiles();
    res.json({ 
      message: 'Cleanup initiated',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[API] Cleanup error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate cleanup',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
});

module.exports = router;
