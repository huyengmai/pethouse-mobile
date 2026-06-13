import axios from 'axios';

import { API_BASE_URL } from '../../../config/api'

const API_URL = `${API_BASE_URL}/profile`;

// Hàm helper để lấy Token từ sessionStorage
const getAuthHeader = () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const profileService = {
    // --- USER PROFILE ---
    // Lấy thông tin cá nhân của tôi
    getMyProfile: async () => {
        const response = await axios.get(`${API_URL}/me`, { headers: getAuthHeader() });
        return response.data;
    },

    // Cập nhật thông status cá nhân
    updateMyProfile: async (userData) => {
        const response = await axios.put(`${API_URL}/me`, userData, { headers: getAuthHeader() });
        return response.data;
    },

    // --- PET PROFILE ---
    // Lấy danh sách thú cưng của tôi
    getMyPets: async () => {
        const response = await axios.get(`${API_URL}/pets`, { headers: getAuthHeader() });
        return response.data;
    },

    // Thêm thú cưng mới
    addPet: async (petData) => {
        const response = await axios.post(`${API_URL}/pets`, petData, { headers: getAuthHeader() });
        return response.data;
    },

    // Cập nhật thông tin thú cưng
    updatePet: async (petId, petData) => {
        const response = await axios.put(`${API_URL}/pets/${petId}`, petData, { headers: getAuthHeader() });
        return response.data;
    },

    // Xóa hồ sơ thú cưng
    deletePet: async (id) => {
        const response = await axios.delete(`${API_URL}/pets/${id}`, { headers: getAuthHeader() });
        return response.data;
    }
};