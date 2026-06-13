// src/api/useAdminBookingApi.js

import axios from 'axios';
import { authHelpers } from '../../../../api/authApi'; 

import { API_HOST } from '../../../../config/api'

const API_BASE_URL = API_HOST

export const useAdminBookingApi = () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptors giống bookingApi
  api.interceptors.request.use((config) => {
    const token = authHelpers.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authHelpers.clearAuthData();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  // Helper function để lọc bỏ params rỗng
  const cleanParams = (params) => {
    const cleaned = {};
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  return {
    // Lấy tất cả bookings với filters và phân trang (params: { status, vetClinicId, startDate, endDate, page, size })
    getAllBookings: async (params = {}) => {
      const response = await api.get('/api/admin/bookings', { params: cleanParams(params) });
      return response.data;
    },

    // Cập nhật status chung (status: 'PENDING'|'BOOKED'|'COMPLETED'|'CANCELLED', adminNote optional)
    updateBookingStatus: async (id, status, adminNote) => {
      const response = await api.patch(`/api/admin/bookings/${id}/status`, null, {
        params: { status, adminNote },
      });
      return response.data;
    },

    // Xác nhận booking (PENDING → BOOKED)
    confirmBooking: async (id) => {
      const response = await api.patch(`/api/admin/bookings/${id}/confirm`);
      return response.data;
    },

    // Hoàn thành booking (BOOKED → COMPLETED)
    completeBooking: async (id, adminNote) => {
      const response = await api.patch(`/api/admin/bookings/${id}/complete`, null, {
        params: { adminNote },
      });
      return response.data;
    },

    // Hủy booking với lý do
    cancelBooking: async (id, reason) => {
      const response = await api.patch(`/api/admin/bookings/${id}/cancel`, null, {
        params: { reason },
      });
      return response.data;
    },

    // Lấy stats (params: { startDate, endDate })
    getBookingStats: async (params = {}) => {
      const response = await api.get('/api/admin/bookings/stats', { params: cleanParams(params) });
      return response.data;
    },
  };
};