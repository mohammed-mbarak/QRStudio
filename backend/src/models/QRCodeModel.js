import mongoose from 'mongoose';

const qrCodeSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['url', 'text', 'email', 'phone', 'wifi', 'vcard'],
    default: 'text'
  },
  size: {
    type: Number,
    default: 300,
    min: 100,
    max: 1000
  },
  margin: {
    type: Number,
    default: 1,
    min: 0,
    max: 10
  },
  colorDark: {
    type: String,
    default: '#000000'
  },
  colorLight: {
    type: String,
    default: '#FFFFFF'
  },
  qrCodeImage: {
    type: String, // Base64 encoded QR code
    required: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
qrCodeSchema.index({ generatedAt: -1 });
qrCodeSchema.index({ type: 1 });

const QRCode = mongoose.model('QRCode', qrCodeSchema);

export default QRCode;