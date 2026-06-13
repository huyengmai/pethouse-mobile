import { Link } from 'react-router-dom'
import BookingList from '../components/BookingList'
import { authHelpers } from '../../../api/authApi'

export default function MyBookingsPage() {
  const isAuthenticated = authHelpers.isAuthenticated()

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-green to-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <span>📅</span>
            <span className="text-sm font-semibold text-primary">Quản lý lịch hẹn</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Lịch đặt của tôi
          </h1>
          <p className="text-gray-600">Theo dõi và quản lý các lịch hẹn của thú cưng</p>
        </div>

        {isAuthenticated ? (
          <BookingList />
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🔒</div>
            <p className="text-lg text-gray-600 mb-6">
              Vui lòng đăng nhập để xem lịch đặt
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span>🚀</span>
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
