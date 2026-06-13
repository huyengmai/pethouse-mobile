// src/api/useAdminTimeSlotApi.js

import axios from 'axios';
import { authHelpers } from '../../../../api/authApi'; 

import { API_HOST } from '../../../../config/api'

const API_BASE_URL = API_HOST

export const useAdminTimeSlotApi = () => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptors giống trên
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

  return {
    // Tạo time slot đơn lẻ (data: TimeSlotCreateRequest object)
    createTimeSlot: async (data) => {
      const response = await api.post('/api/admin/time-slots', data);
      return response.data;
    },

    // Tạo bulk time slots (data: TimeSlotBulkCreateRequest object)
    createBulkTimeSlots: async (data) => {
      const response = await api.post('/api/admin/time-slots/bulk', data);
      return response.data;
    },

    // Lấy slots theo clinic và date (date: 'YYYY-MM-DD')
    getTimeSlotsByClinicAndDate: async (vetClinicId, date) => {
      const response = await api.get(`/api/admin/time-slots/clinic/${vetClinicId}`, {
        params: { date },
      });
      return response.data;
    },

    // Lấy slots theo clinic và range (startDate, endDate: 'YYYY-MM-DD')
    getTimeSlotsByClinicAndDateRange: async (vetClinicId, startDate, endDate) => {
      const response = await api.get(`/api/admin/time-slots/clinic/${vetClinicId}/range`, {
        params: { startDate, endDate },
      });
      return response.data;
    },

    // Cập nhật time slot (data: partial TimeSlotCreateRequest)
    updateTimeSlot: async (id, data) => {
      const response = await api.put(`/api/admin/time-slots/${id}`, data);
      return response.data;
    },

    // Toggle availability (available: true/false)
    toggleSlotAvailability: async (id, available) => {
      const response = await api.patch(`/api/admin/time-slots/${id}/toggle`, null, {
        params: { available },
      });
      return response.data;
    },

    // Xóa time slot
    deleteTimeSlot: async (id) => {
      const response = await api.delete(`/api/admin/time-slots/${id}`);
      return response.data;
    },
  };
};