import generateQRCode from '../../utils/generateQRCode.js';

describe('QR Code Generation', () => {
  test('should generate QR code as base64 string', async () => {
    const data = 'https://example.com';
    const qrCode = await generateQRCode(data);
    
    expect(qrCode).toBeDefined();
    expect(typeof qrCode).toBe('string');
    expect(qrCode).toContain('data:image/png;base64');
  });

  test('should generate QR code with custom options', async () => {
    const data = 'Test data';
    const options = {
      size: 400,
      margin: 2,
      colorDark: '#FF0000',
      colorLight: '#00FF00'
    };
    
    const qrCode = await generateQRCode(data, options);
    
    expect(qrCode).toBeDefined();
    expect(qrCode).toContain('data:image/png;base64');
  });

  test('should throw error for empty data', async () => {
    await expect(generateQRCode('')).rejects.toThrow();
  });
});