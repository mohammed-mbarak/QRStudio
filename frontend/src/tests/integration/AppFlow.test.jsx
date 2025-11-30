import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import App from '../../App'

describe('App Flow Integration', () => {
  test('navigates between pages', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Check initial page
    expect(screen.getByText(/qr code generator/i)).toBeInTheDocument()

    // Navigate to history
    await userEvent.click(screen.getByRole('link', { name: /history/i }))
    expect(screen.getByText(/qr code history/i)).toBeInTheDocument()

    // Navigate back to home
    await userEvent.click(screen.getByRole('link', { name: /generate qr/i }))
    expect(screen.getByText(/qr code generator/i)).toBeInTheDocument()
  })
})