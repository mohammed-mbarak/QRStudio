import QRGenerator from '../../components/QRGenerator/QRGenerator'
import Toast from '../../components/Toast/Toast'
import { useQRStore } from '../../store/useQRStore'

const Home = () => {
  const { toast, clearToast } = useQRStore()

  return (
    <div className="space-y-8">
      <QRGenerator />
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={clearToast}
        />
      )}
    </div>
  )
}

export default Home