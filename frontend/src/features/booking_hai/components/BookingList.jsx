import { useState, useEffect } from 'react'
import { useBookingApi } from '../api/useBookingApi'
import { toast } from 'react-toastify'
import { Calendar, Clock, FileText, XCircle, CheckCircle, AlertCircle } from 'lucide-react'

export default function BookingList() {
  const bookingApi = useBookingApi()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingApi.getMyBookings()
        const data = response.data?.data || response.data || response
        setBookings(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Lỗi khi tải lịch đặt:', err)
        toast.error('Không thể tải lịch đặt')
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy lịch này?')) return
    try {
      await bookingApi.cancelBooking(id)
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
      toast.success('Đã hủy lịch thành công')
    } catch (err) {
      console.error('Lỗi khi hủy:', err)
      toast.error('Không thể hủy lịch')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { 
        bg: 'bg-yellow-light border-yellow', 
        text: 'text-yellow-700',
        label: 'Chờ xác nhận',
        icon: <Clock size={16} />
      },
      BOOKED: { 
        bg: 'bg-bg-blue border-blue-400', 
        text: 'text-blue-700',
        label: 'Đã xác nhận',
        icon: <CheckCircle size={16} />
      },
      COMPLETED: { 
        bg: 'bg-bg-green border-green-400', 
        text: 'text-green-700',
        label: 'Hoàn thành',
        icon: <CheckCircle size={16} />
      },
      CANCELLED: { 
        bg: 'bg-bg-pink border-red-300', 
        text: 'text-red-600',
        label: 'Đã hủy',
        icon: <XCircle size={16} />
      }
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.text} text-sm font-medium`}>
        {config.icon}
        {config.label}
      </div>
    )
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getServiceLabel = (type) => {
    const labels = {
      VACCINE: 'Tiêm phòng 💉',
      GROOMING: 'Tắm & Chăm sóc ✂️',
      CHECKUP: 'Khám tổng quát 🏥',
      SURGERY: 'Phẫu thuật 🔬'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-600">Đang tải lịch đặt...</p>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center bg-white rounded-2xl shadow-sm py-12">
        <div className="w-16 h-16 bg-bg-blue rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-primary" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Chưa có lịch đặt nào</h3>
        <p className="text-gray-500 mb-6">Hãy đặt lịch cho thú cưng của bạn ngay!</p>
        <a
          href="/vet-finder"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-all hover:-translate-y-1 hover:shadow-lg"
        >
          <span>🏥</span>
          Tìm phòng khám
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map(booking => (
        <div 
          key={booking.id} 
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
        >
          <div className="p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary text-white font-bold text-sm w-10 h-10 rounded-xl flex items-center justify-center">
                  #{booking.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Pet #{booking.petId}
                  </h3>
                  <p className="text-xs text-gray-500">Mã đặt lịch: {booking.id}</p>
                </div>
              </div>
              {getStatusBadge(booking.status)}
            </div>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-bg-orange p-2 rounded-lg">
                  <FileText size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Dịch vụ</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {getServiceLabel(booking.serviceType)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-bg-blue p-2 rounded-lg">
                  <Calendar size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Ngày hẹn</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDateTime(booking.bookingDate)}
                  </p>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="bg-yellow-light border-l-4 border-yellow p-3 rounded mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Ghi chú:</span> {booking.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            {booking.status === 'PENDING' && (
              <div className="pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Hủy lịch đặt
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
