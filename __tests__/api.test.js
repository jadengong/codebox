const request = require('supertest');
const express = require('express');
const apiRoutes = require('../routes/api');

// Create a test app instance
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('supportedLanguages');
      expect(response.body.supportedLanguages).toEqual(['python', 'javascript', 'java', 'cpp']);
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('supportedLanguages');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.supportedLanguages).toEqual(['python', 'javascript', 'java', 'cpp']);
    });
  });

  describe('POST /api/execute', () => {
    it('should execute Python code successfully', async () => {
      const testCode = 'print("Hello, World!")';
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: testCode,
          language: 'python'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('result');
      expect(response.body).toHaveProperty('metadata');
      expect(response.body.metadata.language).toBe('python');
      expect(response.body.metadata.codeLength).toBe(testCode.length);
    });

    it('should execute JavaScript code successfully', async () => {
      const testCode = 'console.log("Hello, World!");';
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: testCode,
          language: 'javascript'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.metadata.language).toBe('javascript');
    });

    it('should execute Java code successfully', async () => {
      const testCode = 'System.out.println("Hello, World!");';
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: testCode,
          language: 'java'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.metadata.language).toBe('java');
    });

    it('should execute C++ code successfully', async () => {
      const testCode = 'cout << "Hello, World!" << endl;';
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: testCode,
          language: 'c++'
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.metadata.language).toBe('c++');
    });

    it('should reject empty code', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: '',
          language: 'python'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is required');
    });

    it('should reject whitespace-only code', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: '   \n\t   ',
          language: 'python'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is required');
    });

    it('should reject missing language', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: 'print("Hello")'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Language must be specified');
    });

    it('should reject code that is too long', async () => {
      const longCode = 'a'.repeat(10001);
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: longCode,
          language: 'python'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is too long');
    });

    it('should reject unsupported language', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: 'print("Hello")',
          language: 'unsupported'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Unsupported language');
    });

    it('should handle missing code field', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          language: 'python'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is required');
    });

    it('should handle non-string code', async () => {
      const response = await request(app)
        .post('/api/execute')
        .send({
          code: 123,
          language: 'python'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Code is required');
    });
  });

  describe('POST /api/cleanup', () => {
    it('should initiate cleanup successfully', async () => {
      const response = await request(app)
        .post('/api/cleanup')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Cleanup initiated');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
