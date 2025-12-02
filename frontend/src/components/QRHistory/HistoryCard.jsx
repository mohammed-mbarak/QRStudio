import { useQRStore } from '../../store/useQRStore'
import DeleteButton from './DeleteButton'

const HistoryCard = ({ qr }) => {
  const deleteQRCode = useQRStore((state) => state.deleteQRCode)

  const handleImageError = (e) => {
    console.error('Image failed to load for QR:', qr.id)
    console.log('Image URL that failed:', qr.imageUrl?.substring(0, 100))
    e.target.style.display = 'none'
    e.target.parentElement.innerHTML = `
      <div class="text-center text-gray-500">
        <div class="text-4xl mb-2">⚠️</div>
        <p class="text-sm font-medium">Failed to load QR image</p>
        <p class="text-xs mt-1">Type: ${qr.type}</p>
        <p class="text-xs mt-1">URL: ${qr.imageUrl?.substring(0, 30)}...</p>
      </div>
    `
  }

  const handleImageLoad = () => {
    console.log('Image loaded successfully for:', qr.id)
  }

  return (
    <div className="card p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* QR Image */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center items-center min-h-[200px]">
        {qr.imageUrl ? (
          <img
            src={qr.imageUrl}
            alt="QR Code"
            className="w-full max-w-[200px] h-auto"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📱</div>
            <p className="text-sm font-medium">No QR image found</p>
            <p className="text-xs mt-1">Type: {qr.type}</p>
            <p className="text-xs mt-1">ID: {qr.id?.substring(0, 8)}</p>
          </div>
        )}
      </div>

      {/* QR Details */}
      <div className="space-y-3 grow">
        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Type
          </span>
          <p className="text-sm font-medium text-gray-900">{qr.type || 'Unknown'}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Content
          </span>
          <p className="text-sm text-gray-700 break-word mt-1 max-h-20 overflow-y-auto">
            {typeof qr.content === 'object'
              ? JSON.stringify(qr.content, null, 2)
              : qr.content || 'No content'}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            <span className="text-xs font-semibold text-gray-500">
              Size
            </span>
            <p className="text-sm">{qr.size || 300}px</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-gray-500">
              Created
            </span>
            <p className="text-sm">
              {qr.createdAt
                ? new Date(qr.createdAt).toLocaleDateString()
                : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Button - Now at the bottom */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <DeleteButton 
          onDelete={deleteQRCode} 
          qrId={qr.id}
        />
      </div>
    </div>
  )
}

export default HistoryCard