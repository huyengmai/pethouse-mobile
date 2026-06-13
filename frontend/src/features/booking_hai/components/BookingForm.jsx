 import { useState, useEffect } from 'react'
  import { useBookingApi } from '../api/useBookingApi'
  import { toast } from 'react-toastify'
  import { authHelpers } from '../../../api/authApi'
  import { Clock, CheckCircle, AlertCircle, Loader, Dog, Cat } from 'lucide-react'
  import PetSelector from './PetSelector'

  export default function BookingForm({ selectedDate, serviceType, vetClinicId }) {
    const isAuthenticated = authHelpers.isAuthenticated()
    const bookingApi = useBookingApi()

    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [selectedPet, setSelectedPet] = useState(null)
    const [note, setNote] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Fetch time slots
    useEffect(() => {
      if (!isAuthenticated || !selectedDate || !vetClinicId || !serviceType) return

      const fetchSlots = async () => {
        setLoading(true)
        try {
          const year = selectedDate.getFullYear()
          const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
          const day = String(selectedDate.getDate()).padStart(2, '0')
          const dateStr = `${year}-${month}-${day}`

          const response = await bookingApi.getAvailableSlots(vetClinicId, dateStr, serviceType)
          const data = response.data?.data || response.data || response
          setSlots(Array.isArray(data) ? data : [])
          setSelectedSlot(null)
        } catch (err) {
          console.error('Lỗi khi tải khung giờ:', err)
          toast.error('Không thể tải khung giờ trống')
          setSlots([])
        } finally {
          setLoading(false)
        }
      }
      fetchSlots()
    }, [selectedDate, serviceType, vetClinicId, isAuthenticated])

    const handleSubmit = async () => {
      if (!selectedPet) {
        toast.error('Vui lòng chọn thú cưng')
        return
      }
      if (!selectedSlot) {
        toast.error('Vui lòng chọn khung giờ')
        return
      }

      // Validate pet ID
      if (!selectedPet.id) {
        toast.error('Thông tin thú cưng không hợp lệ. Vui lòng chọn lại.')
        console.error('selectedPet object:', selectedPet)
        return
      }

      setSubmitting(true)
      try {
        const year = selectedDate.getFullYear()
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(selectedDate.getDate()).padStart(2, '0')

        // Handle both "HH:mm" and "HH:mm:ss" formats
        let timeStr = selectedSlot.startTime
        if (timeStr.length === 5) {
          // "08:00" → "08:00:00"
          timeStr = timeStr + ':00'
        } else if (timeStr.length === 8) {
          // "08:00:00" → keep as is
          timeStr = timeStr
        }

        const bookingDateTime = `${year}-${month}-${day}T${timeStr}`

        const bookingData = {
          slotId: Number(selectedSlot.id),
          petId: Number(selectedPet.id),
          note: note || '',
          serviceType: serviceType,
          vetClinicId: Number(vetClinicId),
          bookingDate: bookingDateTime
        }

        console.log('📤 Sending booking request:', bookingData)
        console.log('📅 Parsed datetime:', new Date(bookingDateTime).toISOString())

        const response = await bookingApi.createBooking(bookingData)
        console.log('✅ Booking response:', response)

        toast.success('Đặt lịch thành công!')
        setNote('')
        setSelectedSlot(null)

        // Reload slots
        const dateStr = `${year}-${month}-${day}`
        const reloadResponse = await bookingApi.getAvailableSlots(vetClinicId, dateStr, serviceType)
        const reloadData = reloadResponse.data?.data || reloadResponse.data || reloadResponse
        setSlots(Array.isArray(reloadData) ? reloadData : [])
      } catch (err) {
        console.error('❌ Lỗi khi đặt lịch:', err)
        console.error('Error response:', err.response?.data)

        const errorMessage = err.response?.data?.message
          || err.response?.data?.error
          || err.message
          || 'Đặt lịch thất bại'
        toast.error(errorMessage)
      } finally {
        setSubmitting(false)
      }
    }

    if (!vetClinicId) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle size={32} className="text-orange-500 mb-2" />
          <p className="text-sm font-semibold text-orange-600 mb-1">Vui lòng chọn phòng khám</p>
          <p className="text-xs text-gray-500">Hãy chọn phòng khám để xem khung giờ trống</p>
        </div>
      )
    }

    const getPetTypeLabel = (species) => {
      const labels = {
        'Chó': 'Chó',
        'Mèo': 'Mèo',
        'Chim': 'Chim',
        'Cá': 'Cá',
        'Thỏ': 'Thỏ',
        'Hamster': 'Hamster',
        'Khác': 'Khác'
      }
      return labels[species] || 'Thú cưng'
    }

    return (
      <div className="space-y-4">
        {/* Step 1: Chọn thú cưng */}
        <div className="bg-bg-purple rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">1</div>
            <h3 className="text-sm font-semibold text-gray-800">Chọn thú cưng</h3>
          </div>
          <PetSelector
            selectedPetId={selectedPet?.id || null}
            onSelectPet={setSelectedPet}
          />
        </div>

        {/* Step 2: Chọn khung giờ */}
        {selectedPet && (
          <div className="bg-bg-blue rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">2</div>
              <h3 className="text-sm font-semibold text-gray-800">Chọn khung giờ</h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader size={24} className="text-blue-500 animate-spin" />
              </div>
            ) : slots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={24} className="text-red-400 mb-2" />
                <p className="text-sm font-medium text-red-500">Không có khung giờ trống</p>
                <p className="text-xs text-gray-500 mt-1">Vui lòng chọn ngày khác</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`relative p-2.5 rounded-xl text-xs font-medium transition-all ${
                      selectedSlot?.id === slot.id
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white hover:bg-blue-50 border border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <Clock size={14} className={selectedSlot?.id === slot.id ? 'text-white' : 'text-blue-500'} />        
                      <span>{slot.startTime}</span>
                      <span className="text-[10px] opacity-70">{slot.endTime}</span>
                    </div>
                    {selectedSlot?.id === slot.id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center">
                        <CheckCircle size={10} />
                      </div>
                    )}
                    <div className={`absolute bottom-1 right-1 text-[9px] px-1 rounded ${
                      selectedSlot?.id === slot.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {slot.currentBookings || 0}/{slot.maxCapacity || 1}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Xác nhận đặt lịch */}
        {selectedPet && selectedSlot && (
          <div className="bg-bg-green rounded-xl p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">3</div>
              <h3 className="text-sm font-semibold text-gray-800">Xác nhận đặt lịch</h3>
            </div>

            <div className="space-y-3">
              {/* Thông tin tổng hợp */}
              <div className="bg-white rounded-xl p-3 shadow-sm border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="text-green-500" size={16} />
                  <h4 className="text-sm font-semibold text-green-700">Thông tin đặt lịch</h4>
                </div>

                {/* Thông tin thú cưng */}
                <div className="bg-purple-50 rounded-lg p-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-full">
                      {selectedPet.species === 'Chó' ?
                        <Dog size={16} className="text-purple-600" /> :
                        <Cat size={16} className="text-purple-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-purple-800 truncate">{selectedPet.name}</p>
                      <p className="text-xs text-purple-600">
                        {getPetTypeLabel(selectedPet.species)}
                        {selectedPet.breed && ` • ${selectedPet.breed}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Các thông tin khác */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Giờ:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedSlot.startTime} - {selectedSlot.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Ngày:</span>
                    <span className="font-medium text-gray-800">
                      {selectedDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}    
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Dịch vụ:</span>
                    <span className="font-medium text-gray-800">
                      {serviceType === 'VACCINE' ? 'Tiêm phòng' : 'Grooming'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Còn trống:</span>
                    <span className="font-medium text-gray-800">
                      {(selectedSlot.maxCapacity || 1) - (selectedSlot.currentBookings || 0)} chỗ
                    </span>
                  </div>
                </div>
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ghi chú (tùy chọn)</label>
                <textarea
                  placeholder="Nhập ghi chú về tình trạng sức khỏe, yêu cầu đặc biệt..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:border-green-400 focus:ring-1 focus:ring-green-100 outline-none transition-all resize-none"
                />
              </div>

              {/* Nút xác nhận */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2" 
              >
                {submitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Xác nhận đặt lịch
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    )
  }