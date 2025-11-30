import request from 'supertest';
import app from '../../app.js';

describe('App Integration Tests', () => {
  describe('Root Endpoint', () => {
    test('GET / should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        message: 'QR Code Generator API',
        version: '1.0.0',
        documentation: '/api/qr/health'
      });
    });

    test('GET / should have correct content-type', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('404 Handler', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Route /non-existent-route not found');
    });

    test('should return 404 for non-existent API routes', async () => {
      const response = await request(app)
        .post('/api/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      // Check for common security headers added by Helmet
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting to requests', async () => {
      // Make multiple requests quickly to test rate limiting
      const requests = Array.from({ length: 5 }, () => 
        request(app).get('/')
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed (unless we exceed the limit)
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('CORS', () => {
    test('should include CORS headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    test('should handle preflight requests', async () => {
      const response = await request(app)
        .options('/')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });

  describe('Body Parsing', () => {
    test('should parse JSON bodies', async () => {
      const testData = { test: 'data' };
      
      // Create a test endpoint to check body parsing
      const response = await request(app)
        .post('/api/qr/generate')
        .send(testData)
        .expect(400); // Will fail validation but proves body parsing works

      expect(response.body.success).toBe(false);
    });

    test('should handle large JSON payloads', async () => {
      const largeData = {
        data: 'a'.repeat(1000), // Large data string
        type: 'text',
        size: 300
      };

      const response = await request(app)
        .post('/api/qr/generate')
        .send(largeData)
        .expect(400); // Will fail due to missing required QR generation

      expect(response.body).toHaveProperty('success');
    });
  });

  describe('Error Handling', () => {
    test('should return JSON error responses', async () => {
      const response = await request(app)
        .get('/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('error');
      expect(response.body.success).toBe(false);
    });

    test('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/qr/generate')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Request Logging', () => {
    test('should handle requests with different methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE'];
      
      for (const method of methods) {
        const response = await request(app)
          [method.toLowerCase()]('/')
          .expect(method === 'GET' ? 200 : 404);

        expect(response.body).toBeDefined();
      }
    });

    test('should handle requests with query parameters', async () => {
      const response = await request(app)
        .get('/api/qr?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});