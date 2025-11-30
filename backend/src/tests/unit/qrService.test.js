import qrService from '../../services/qrService.js';
import QRCode from '../../models/QRCodeModel.js';

// Mock the generateQRCode utility
jest.mock('../../utils/generateQRCode.js', () => ({
  __esModule: true,
  default: jest.fn()
}));
import generateQRCode from '../../utils/generateQRCode.js';

describe('QR Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateQRCode', () => {
    test('should generate and save QR code', async () => {
      const mockData = 'https://example.com';
      const mockQRImage = 'data:image/png;base64,mockbase64string';
      
      generateQRCode.mockResolvedValue(mockQRImage);

      const result = await qrService.generateQRCode({
        data: mockData,
        type: 'url',
        size: 300
      });

      expect(result).toBeDefined();
      expect(result.data).toBe(mockData);
      expect(result.type).toBe('url');
      expect(result.qrCodeImage).toBe(mockQRImage);
      expect(generateQRCode).toHaveBeenCalledWith(mockData, {
        size: 300,
        margin: 1,
        colorDark: '#000000',
        colorLight: '#FFFFFF'
      });
    });

    test('should throw error for empty data', async () => {
      await expect(qrService.generateQRCode({ data: '' }))
        .rejects
        .toThrow('QR code data is required');
    });
  });

  describe('getQRCodeById', () => {
    test('should return QR code by ID', async () => {
      const mockQR = {
        _id: '507f1f77bcf86cd799439011',
        data: 'test data',
        type: 'text'
      };
      
      QRCode.findById = jest.fn().mockResolvedValue(mockQR);

      const result = await qrService.getQRCodeById('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockQR);
      expect(QRCode.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    test('should throw error for non-existent QR code', async () => {
      QRCode.findById = jest.fn().mockResolvedValue(null);

      await expect(qrService.getQRCodeById('nonexistent'))
        .rejects
        .toThrow('QR code not found');
    });
  });
});