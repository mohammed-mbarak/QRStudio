import { api } from './api'

export const qrService = {
  generateQR: async (qrData) => {
    const response = await api.post('/api/qr/generate', qrData)
    return response
  },

  getQRCodes: async () => {
    const response = await api.get('/api/qr')
    return response
  },

  getQRCode: async (id) => {
    const response = await api.get(`/api/qr/${id}`)
    return response
  },

  healthCheck: async () => {
    const response = await api.get('/api/qr/health')
    return response
  },
}