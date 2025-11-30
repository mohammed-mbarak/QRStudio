import { useQRStore } from '../../store/useQRStore'
import { downloadQR } from '../../utils/downloadQR'

const QRPreview = () => {
  const { currentQR, isLoading } = useQRStore()

  const handleDownload = () => {
    if (currentQR?.imageUrl) {
      downloadQR(currentQR.imageUrl, `qr-code-${Date.now()}.png`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-cyan-400/30"></div>
        </div>
        <p className="mt-4 text-gray-200 text-lg">Generating your QR code...</p>
        <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
      </div>
    )
  }

  return (
    <div className="text-center h-full">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center justify-center">
        <svg className="w-6 h-6 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        QR Code Preview
      </h3>

      {currentQR ? (
        <div className="space-y-6">
          {/* QR Image */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-600/50">
            <img
              src={currentQR.imageUrl}
              alt="Generated QR Code"
              className="mx-auto max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>

          {/* QR Details */}
          <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-600/30 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Type:</span>
              <span className="text-cyan-400 font-semibold capitalize">{currentQR.type}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Size:</span>
              <span className="text-gray-300">{currentQR.size}px</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-300">Created:</span>
              <span className="text-gray-300">
                {new Date(currentQR.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-600/30">
              <span className="font-medium text-gray-300 block mb-2">Content:</span>
              <p className="text-gray-300 text-sm bg-slate-700/30 rounded-lg p-3 break-all">
                {currentQR.content}
              </p>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full py-3 px-6 bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <div className="w-32 h-32 bg-linear-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-600">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1 1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1 1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>

          <p className="text-xl font-semibold text-gray-300 mb-2">No QR Code Generated</p>
          <p className="text-gray-400 text-center max-w-sm">
            Fill out the form and click "Generate QR Code" to create your custom QR code
          </p>
        </div>
      )}
    </div>
  )
}

export default QRPreview
