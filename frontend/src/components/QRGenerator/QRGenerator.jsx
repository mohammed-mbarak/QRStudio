import { useState } from 'react'
import { useQRStore } from '../../store/useQRStore'
import QRPreview from './QRPreview'
import Button from '../UI/Button'
import InputField from '../UI/InputField'

const QRGenerator = () => {
  const { generateQR, isLoading, error } = useQRStore()
  const [formData, setFormData] = useState({
    data: '',
    type: 'text',
    size: 300,
    margin: 1,
    colorDark: '#000000',
    colorLight: '#ffffff',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.data.trim()) return

    await generateQR(formData)
  }

  const qrTypes = [
    { value: 'text', label: 'Text' },
    { value: 'url', label: 'URL' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'vcard', label: 'vCard' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
          QR Code Generator
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Create beautiful, customizable QR codes for various purposes. Perfect for marketing, sharing contacts, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-linear-to-br from-slate-800/50 to-purple-900/30 rounded-2xl shadow-2xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generate QR Code
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* QR Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                QR Code Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {qrTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      formData.type === type.value
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/25'
                        : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="Content *"
              name="data"
              type="text"
              value={formData.data}
              onChange={handleChange}
              placeholder={
                formData.type === 'url' ? 'https://example.com' :
                formData.type === 'email' ? 'email@example.com' :
                formData.type === 'phone' ? '+1234567890' :
                'Enter your text content...'
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Size (px)"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                min="100"
                max="1000"
              />

              <InputField
                label="Margin"
                name="margin"
                type="number"
                value={formData.margin}
                onChange={handleChange}
                min="0"
                max="10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dark Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    name="colorDark"
                    value={formData.colorDark}
                    onChange={handleChange}
                    className="w-12 h-12 cursor-pointer rounded-lg border border-slate-600 bg-slate-700"
                  />
                  <span className="text-gray-300 text-sm font-mono">{formData.colorDark}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Light Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    name="colorLight"
                    value={formData.colorLight}
                    onChange={handleChange}
                    className="w-12 h-12 cursor-pointer rounded-lg border border-slate-600 bg-slate-700"
                  />
                  <span className="text-gray-300 text-sm font-mono">{formData.colorLight}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !formData.data.trim()}
              className="w-full py-4 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating QR Code...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate QR Code
                </div>
              )}
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="bg-linear-to-br from-slate-800/50 to-purple-900/30 rounded-2xl shadow-2xl border border-purple-500/20 p-6 backdrop-blur-sm">
          <QRPreview formData={formData} />
        </div>
      </div>
    </div>
  )
}

export default QRGenerator
