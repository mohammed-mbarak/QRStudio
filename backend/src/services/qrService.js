import QRCode from '../models/QRCodeModel.js';
import generateQRCode from '../utils/generateQRCode.js';
import { logger } from '../utils/logger.js';

class QRService {
  /**
   * Generate and save QR code
   * @param {Object} qrData - QR code data and options
   * @returns {Promise<Object>} Generated QR code document
   */
  async generateQRCode(qrData) {
    try {
      const {
        data,
        type = 'text',
        size = 300,
        margin = 1,
        colorDark = '#000000',
        colorLight = '#FFFFFF'
      } = qrData;

      // Validate input data
      if (!data || data.trim().length === 0) {
        throw new Error('QR code data is required');
      }

      if (data.length > 4000) {
        throw new Error('QR code data is too long (max 4000 characters)');
      }

      // Generate QR code image
      const qrCodeImage = await generateQRCode(data, {
        size,
        margin,
        colorDark,
        colorLight
      });

      // Create QR code document
      const qrCodeDoc = new QRCode({
        data: data.trim(),
        type,
        size,
        margin,
        colorDark,
        colorLight,
        qrCodeImage
      });

      await qrCodeDoc.save();
      
      logger.info(`QR code generated successfully for type: ${type}`);
      
      return {
        id: qrCodeDoc._id,
        data: qrCodeDoc.data,
        type: qrCodeDoc.type,
        size: qrCodeDoc.size,
        margin: qrCodeDoc.margin,
        colorDark: qrCodeDoc.colorDark,
        colorLight: qrCodeDoc.colorLight,
        qrCodeImage: qrCodeDoc.qrCodeImage,
        generatedAt: qrCodeDoc.generatedAt
      };
    } catch (error) {
      logger.error('QR service error:', error);
      throw error;
    }
  }

  /**
   * Get QR code by ID
   * @param {string} id - QR code ID
   * @returns {Promise<Object>} QR code document
   */
  async getQRCodeById(id) {
    try {
      const qrCode = await QRCode.findById(id);
      if (!qrCode) {
        throw new Error('QR code not found');
      }
      return qrCode;
    } catch (error) {
      logger.error('Get QR code error:', error);
      throw error;
    }
  }

  /**
   * Get all QR codes with pagination
   * @param {Object} options - Pagination and filter options
   * @returns {Promise<Object>} Paginated QR codes
   */
  async getQRCodes(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        sortBy = 'generatedAt',
        sortOrder = 'desc'
      } = options;

      const query = {};
      if (type) {
        query.type = type;
      }

      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const qrCodes = await QRCode.find(query)
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await QRCode.countDocuments(query);

      return {
        qrCodes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      logger.error('Get QR codes error:', error);
      throw error;
    }
  }
}

export default new QRService();