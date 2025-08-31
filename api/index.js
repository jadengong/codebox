export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    message: 'Welcome to CodeBox API - Running on Vercel!',
    supportedLanguages: ['python', 'javascript', 'java', 'cpp'],
    endpoints: {
      'GET /api': 'API information (this endpoint)',
      'GET /api/health': 'Health check and system status',
      'POST /api/execute': 'Execute code in the specified language'
    },
    environment: 'vercel-serverless',
    note: 'This is a demo version running on Vercel serverless functions. JavaScript execution is fully functional, other languages show demo output.'
  });
}
