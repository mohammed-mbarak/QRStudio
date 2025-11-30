import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useQRStore } from '../../store/useQRStore'
import QRGenerator from '../../components/QRGenerator/QRGenerator'

// Mock the store
jest.mock('../../store/useQRStore')

describe('QRGenerator Component', () => {
  const mockGenerateQR = jest.fn()

  beforeEach(() => {
    useQRStore.mockReturnValue({
      generateQR: mockGenerateQR,
      isLoading: false,
      error: null,
    })
  })

  test('renders QR generator form', () => {
    render(<QRGenerator />)
    
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate qr code/i })).toBeInTheDocument()
  })

  test('submits form with correct data', async () => {
    render(<QRGenerator />)
    
    await userEvent.type(screen.getByLabelText(/content/i), 'https://example.com')
    await userEvent.click(screen.getByRole('button', { name: /generate qr code/i }))
    
    expect(mockGenerateQR).toHaveBeenCalledWith({
      content: 'https://example.com',
      size: 200,
      margin: 4,
      colorDark: '#000000',
      colorLight: '#ffffff',
    })
  })
})