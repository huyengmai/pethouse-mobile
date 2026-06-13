import axios from 'axios'
import { authHelpers } from '../../../api/authApi'
import { API_HOST } from '../../../config/api'

const API_BASE_URL = API_HOST

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Interceptor tự động thêm token vào header
  api.interceptors.request.use((config) => {
    const token = authHelpers.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  // Response interceptor để xử lý 401
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authHelpers.clearAuthData()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )

  export const bookingApi = {
    // Lấy slot trống theo phòng khám, ngày + dịch vụ
    getAvailableSlots: async (vetClinicId, date, serviceType) => {
      const response = await api.get('/api/bookings/slots/available', {
        params: { vetClinicId, date, serviceType }
      })
      return response.data
    },

    // Tạo booking
    createBooking: async ({ slotId, petId, note = '', serviceType, vetClinicId, bookingDate }) => {
      const response = await api.post('/api/bookings', {
        slotId,
        petId,
        note,
        serviceType,
        vetClinicId,
        bookingDate
      })
      return response.data
    },

    // Lấy lịch của user hiện tại
    getMyBookings: async () => {
      const response = await api.get('/api/bookings/my')
      return response.data
    },

    // Hủy booking
    cancelBooking: async (bookingId) => {
      const response = await api.put(`/api/bookings/${bookingId}/cancel`)
      return response.data
    },

    // Complete (nếu cần)
    completeBooking: async (bookingId) => {
      const response = await api.put(`/api/bookings/${bookingId}/complete`)
      return response.data
    },
  }

  export default api