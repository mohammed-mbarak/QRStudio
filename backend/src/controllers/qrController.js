import qrService from '../services/qrService.js';
import asyncHandler from '../middlewares/asyncHandler.js';

/**
 * @desc    Generate a new QR code
 * @route   POST /api/qr/generate
 * @access  Public
 */
const generateQR = asyncHandler(async (req, res) => {
  const { data, type, size, margin, colorDark, colorLight } = req.body;

  const qrCode = await qrService.generateQRCode({
    data,
    type,
    size,
    margin,
    colorDark,
    colorLight
  });

  res.status(201).json({
    success: true,
    message: 'QR code generated successfully',
    data: qrCode
  });
});

/**
 * @desc    Get QR code by ID
 * @route   GET /api/qr/:id
 * @access  Public
 */
const getQRCode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const qrCode = await qrService.getQRCodeById(id);

  res.status(200).json({
    success: true,
    data: qrCode
  });
});

/**
 * @desc    Get all QR codes with pagination
 * @route   GET /api/qr
 * @access  Public
 */
const getQRCodes = asyncHandler(async (req, res) => {
  const { page, limit, type, sortBy, sortOrder } = req.query;

  const result = await qrService.getQRCodes({
    page: parseInt(page),
    limit: parseInt(limit),
    type,
    sortBy,
    sortOrder
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * @desc    Health check endpoint
 * @route   GET /api/qr/health
 * @access  Public
 */
const healthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'QR Code Generator API is running',
    timestamp: new Date().toISOString()
  });
});

export {
  generateQR,
  getQRCode,
  getQRCodes,
  healthCheck
};