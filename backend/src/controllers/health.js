module.exports = async function handler(req, res) {
  console.log('[API] Health function called:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('[API] Health: Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    console.log('[API] Health: Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? process.uptime() : 'N/A',
      memory: process.memoryUsage ? process.memoryUsage() : 'N/A',
      supportedLanguages: ['python', 'javascript'],
      environment: 'vercel-serverless',
      note: 'Running on Vercel serverless functions'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
