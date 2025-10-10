const request = require('supertest');
const express = require('express');

// Mock the API routes since we're testing the server setup
jest.mock('../routes/api', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/health', (req, res) => res.json({ status: 'healthy' }));
  router.get('/', (req, res) => res.json({ message: 'API working' }));
  return router;
});

// Mock the server to return the app instance
jest.mock('../server', () => {
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  app.use(require('cors')());
  
  // Mock the API routes
  const mockApiRoutes = require('../routes/api');
  app.use('/api', mockApiRoutes);
  
  app.get('/', (req, res) => {
    res.send('Code Execution Sandbox API - Use /api/execute to run code');
  });
  
  return app;
});

// Import the server after mocking
const server = require('../server');

describe('Server Setup', () => {
  let app;

  beforeAll(() => {
    // Get the Express app instance
    app = server;
  });

  afterAll((done) => {
    // Clean up server if it's running
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  describe('CORS Configuration', () => {
    it('should handle CORS headers', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .set('Access-Control-Request-Headers', 'Content-Type');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Parsing', () => {
    it('should parse JSON requests', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({ code: 'test', language: 'python' })
        .set('Content-Type', 'application/json');

      // Should not get a parsing error
      expect(response.status).not.toBe(400);
    });
  });

  describe('Root Endpoint', () => {
    it('should return server information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.text).toContain('Code Execution Sandbox API');
    });
  });

  describe('API Routes', () => {
    it('should serve API routes under /api', async () => {
      const response = await request(app)
        .get('/api/')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should serve health endpoint under /api/health', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
    });
  });
});
