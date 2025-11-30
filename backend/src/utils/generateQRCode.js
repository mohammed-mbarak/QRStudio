import QRCode from 'qrcode';
import { logger } from './logger.js';

/**
 * Generate QR code as base64 string
 * @param {string} data - The data to encode in QR code
 * @returns {Promise<string>} Base64 encoded QR code image
 */
const generateQRCode = async (data, options = {}) => {
  try {
    const {
      size = 300,
      margin = 1,
      colorDark = '#000000',
      colorLight = '#FFFFFF'
    } = options;

    const qrCodeOptions = {
      width: size,
      margin,
      color: {
        dark: colorDark,
        light: colorLight
      },
      errorCorrectionLevel: 'M'
    };

    const qrCodeDataURL = await QRCode.toDataURL(data, qrCodeOptions);
    return qrCodeDataURL;
  } catch (error) {
    logger.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

export default generateQRCode;
