export default async function handler(req, res) {
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

  res.json({ 
    message: 'Welcome to CodeBox API - Running on Vercel!',
    supportedLanguages: ['python', 'javascript', 'typescript', 'java', 'kotlin', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift'],
    endpoints: {
      'GET /api': 'API information (this endpoint)',
      'GET /api/health': 'Health check and system status',
      'POST /api/execute': 'Execute code in the specified language'
    },
    environment: 'vercel-serverless',
    note: 'This is a demo version running on Vercel serverless functions. JavaScript execution is fully functional, other languages show demo output.'
  });
}
