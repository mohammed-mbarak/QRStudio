import request from 'supertest';
import app from '../../app.js';
import QRCode from '../../models/QRCodeModel.js';

// Mock the generateQRCode utility
jest.mock('../../utils/generateQRCode.js', () => ({
  __esModule: true,
  default: jest.fn()
}));
import generateQRCode from '../../utils/generateQRCode.js';

describe('QR Routes Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/qr/generate', () => {
    test('should generate QR code successfully', async () => {
      const mockQRImage = 'data:image/png;base64,mockbase64string';
      generateQRCode.mockResolvedValue(mockQRImage);

      const qrData = {
        data: 'https://example.com',
        type: 'url',
        size: 300
      };

      const response = await request(app)
        .post('/api/qr/generate')
        .send(qrData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('QR code generated successfully');
      expect(response.body.data.data).toBe(qrData.data);
      expect(response.body.data.type).toBe(qrData.type);
    });

    test('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/qr/generate')
        .send({ data: '' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/qr', () => {
    test('should return list of QR codes', async () => {
      const mockQRCodes = [
        { data: 'test1', type: 'text' },
        { data: 'test2', type: 'url' }
      ];

      QRCode.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            skip: jest.fn().mockResolvedValue(mockQRCodes)
          })
        })
      });

      QRCode.countDocuments = jest.fn().mockResolvedValue(2);

      const response = await request(app)
        .get('/api/qr')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.qrCodes).toHaveLength(2);
    });
  });

  describe('GET /api/qr/health', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/qr/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('QR Code Generator API is running');
    });
  });
});