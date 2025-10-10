module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.json({ 
      message: 'Welcome to the code execution sandbox API!',
      supportedLanguages: ['python', 'javascript'],
      endpoints: {
        'GET /api/health': 'Health check and system status',
        'POST /api/execute': 'Execute code in the specified language',
        'GET /api/': 'API information'
      }
    });
  } catch (error) {
    console.error('[API] Index error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
