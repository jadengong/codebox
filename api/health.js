export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : 'N/A',
    memory: process.memoryUsage ? process.memoryUsage() : 'N/A',
    supportedLanguages: ['python', 'javascript', 'java', 'cpp'],
    environment: 'vercel-serverless',
    note: 'Running on Vercel serverless functions'
  });
}
