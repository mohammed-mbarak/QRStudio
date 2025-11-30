import { useEffect } from 'react'
import { useQRStore } from '../../store/useQRStore'

const History = () => {
  const { qrHistory, getQRHistory, isLoading, error } = useQRStore()

  useEffect(() => {
    getQRHistory()
  }, [getQRHistory])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code History</h1>
        <p className="text-gray-600">Your previously generated QR codes</p>
      </div>

      {qrHistory.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No QR codes yet</h3>
          <p className="text-gray-600">Generate your first QR code to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrHistory.map((qr) => (
            <div key={qr.id} className="card">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <img
                  src={qr.imageUrl}
                  alt="QR Code"
                  className="w-full h-auto mx-auto"
                />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 break-word">
                  <span className="font-medium">Content:</span> {qr.content}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Size:</span> {qr.size}px
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(qr.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History