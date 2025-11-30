import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQRStore } from '../../store/useQRStore'
import QRGenerator from '../../components/QRGenerator/QRGenerator'

describe('API Integration', () => {
  test('handles successful QR generation', async () => {
    const mockGenerateQR = jest.fn().mockResolvedValue({
      id: '1',
      content: 'https://example.com',
      imageUrl: 'data:image/png;base64,mock-image-data',
      size: 200,
      createdAt: new Date().toISOString(),
    })

    useQRStore.mockReturnValue({
      generateQR: mockGenerateQR,
      isLoading: false,
      error: null,
      currentQR: null,
    })

    render(<QRGenerator />)

    await userEvent.type(screen.getByLabelText(/content/i), 'https://example.com')
    await userEvent.click(screen.getByRole('button', { name: /generate qr code/i }))

    await waitFor(() => {
      expect(mockGenerateQR).toHaveBeenCalledWith({
        content: 'https://example.com',
        size: 200,
        margin: 4,
        colorDark: '#000000',
        colorLight: '#ffffff',
      })
    })
  })
})