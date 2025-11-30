/* eslint-env jest,node */
import '@testing-library/jest-dom'

// -----------------------------
// Mock environment variables
// -----------------------------
process.env.VITE_API_URL = 'http://localhost:5000'

// -----------------------------
// Mock localStorage
// -----------------------------
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// -----------------------------
// Mock window.URL.createObjectURL
// -----------------------------
global.URL.createObjectURL = jest.fn()

// -----------------------------
// Optional: Mock fetch if needed
// -----------------------------
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//   })
// )
