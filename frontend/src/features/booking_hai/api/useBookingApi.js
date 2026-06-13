// src/features/booking_hai/api/useBookingApi.js

import axios from 'axios'
import { authHelpers } from '../../../api/authApi'

import { API_HOST } from '../../../config/api'

const API_BASE_URL = API_HOST

export const useBookingApi = () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
  })

  api.interceptors.request.use((config) => {
    const token = authHelpers.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

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

  return {
    // Lấy slot trống
    getAvailableSlots: async (vetClinicId, date, serviceType) => {
      const res = await api.get('/api/bookings/slots/available', {
        params: { vetClinicId, date, serviceType }
      })
      return res.data
    },

    // Tạo booking
    createBooking: async ({ slotId, petId, note = '', serviceType, vetClinicId, bookingDate }) => {
      const res = await api.post('/api/bookings', {
        slotId,
        petId,
        note,
        serviceType,
        vetClinicId,
        bookingDate
      })
      return res.data
    },

    // Lấy bookings của user hiện tại
    getMyBookings: async () => {
      const res = await api.get('/api/bookings/my')
      return res.data
    },

    // Hủy booking
    cancelBooking: async (bookingId) => {
      const res = await api.patch(`/api/bookings/${bookingId}/cancel`)
      return res.data
    },
  }
}
