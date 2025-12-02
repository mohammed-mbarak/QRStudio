import QRCode from '../models/QRCodeModel.js';
import generateQRCode from '../utils/generateQRCode.js';
import { logger } from '../utils/logger.js';

class QRService {
  /**
   * Convert complex data objects to QR code string format
   */
  convertDataToQRString(data, type) {
    switch (type) {
      case 'text':
      case 'url':
        return data; // Already a string

      case 'email':
        // Format: mailto:email@example.com?subject=Hello&body=Message
        const emailParams = new URLSearchParams();
        if (data.subject) emailParams.append('subject', data.subject);
        if (data.body) emailParams.append('body', data.body);
        const emailQuery = emailParams.toString();
        return `mailto:${data.email}${emailQuery ? `?${emailQuery}` : ''}`;

      case 'phone':
        // Format: tel:+1234567890
        const cleanPhone = data.phone.replace(/\s/g, '');
        return `tel:${cleanPhone}`;

      case 'wifi':
        // Format: WIFI:S:SSID;T:Encryption;P:Password;H:Hidden;;
        return `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};H:${data.hidden ? 'true' : 'false'};;`;

      case 'vcard':
        // Format: vCard as string
        const vcardLines = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${data.firstName} ${data.lastName}`
        ];
        
        if (data.organization) vcardLines.push(`ORG:${data.organization}`);
        if (data.jobTitle) vcardLines.push(`TITLE:${data.jobTitle}`);
        if (data.phone) vcardLines.push(`TEL:${data.phone}`);
        if (data.email) vcardLines.push(`EMAIL:${data.email}`);
        if (data.website) vcardLines.push(`URL:${data.website}`);
        if (data.address) vcardLines.push(`ADR:;;${data.address}`);
        
        vcardLines.push('END:VCARD');
        return vcardLines.join('\n');

      default:
        return String(data);
    }
  }

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

      // Validate input data based on type
      if (!data) {
        throw new Error('QR code data is required');
      }

      // Convert data to QR string format for QR code generation
      const qrString = this.convertDataToQRString(data, type);

      if (qrString.length > 4000) {
        throw new Error('QR code data is too long (max 4000 characters)');
      }

      // Generate QR code image
      const qrCodeImage = await generateQRCode(qrString, {
        size,
        margin,
        colorDark,
        colorLight
      });

      // Create QR code document
      const qrCodeDoc = new QRCode({
        data: data, // Store the original data structure
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
   * Delete QR code by ID
   * @param {string} id - QR code ID
   * @returns {Promise<void>}
   */
  async deleteQRCode(id) {
    try {
      const qrCode = await QRCode.findById(id);
      if (!qrCode) {
        throw new Error('QR code not found');
      }

      await qrCode.deleteOne();
      
      logger.info(`QR code deleted successfully: ${id}`);
    } catch (error) {
      logger.error('Delete QR code error:', error);
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