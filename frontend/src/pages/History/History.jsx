import { useEffect } from 'react'
import { useQRStore } from '../../store/useQRStore'
import HistoryHeader from '../../components/QRHistory/HistoryHeader'
import HistoryList from '../../components/QRHistory/HistoryList'
import EmptyState from '../../components/QRHistory/EmptyState'
import LoadingState from '../../components/QRHistory/LoadingState'
import ErrorState from '../../components/QRHistory/ErrorState'
import Toast from '../../components/Toast/Toast'

const History = () => {
  // Use stable selectors — prevents unnecessary rerenders
  const qrHistory = useQRStore((state) => state.qrHistory)
  const getQRHistory = useQRStore((state) => state.getQRHistory)
  const isLoading = useQRStore((state) => state.isLoading)
  const error = useQRStore((state) => state.error)
  const toast = useQRStore((state) => state.toast)
  const clearToast = useQRStore((state) => state.clearToast)

  // Fetch history once (prevents infinite loop)
  useEffect(() => {
    getQRHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debug console logs
  useEffect(() => {
    if (qrHistory.length > 0) {
      console.log('QR History loaded:', qrHistory.length, 'items')
    }
  }, [qrHistory])

  // UI states
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />

  return (
    <>
      <div className="space-y-6">
        <HistoryHeader count={qrHistory.length} />

        {qrHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <HistoryList qrHistory={qrHistory} />
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </>
  )
}

export default History