import axios from 'axios';
import { authHelpers } from '../../../api/authApi';
import { API_BASE_URL, resolveBackendUrl } from '../../../config/api';

const BASE_URL = API_BASE_URL;

export const fixImageUrl = (url) => {
    if (!url) return null;
    return resolveBackendUrl(url);
};

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = authHelpers.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            authHelpers.clearAuthData();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const diaryApi = {
    getAllAlbums: () => api.get(`/albums`),
    getAlbumById: (id) => api.get(`/albums/${id}`),
    createAlbum: (data) => api.post(`/albums`, data),
    deleteAlbum: (id) => api.delete(`/albums/${id}`),
    updateAlbum: (id, data) => api.put(`/albums/${id}`, data),
    
    getRecentDiaries: (limit = 10) => api.get(`/diaries/recent`, { params: { limit } }),
    getDiariesByAlbum: (albumId) => api.get(`/diaries`, { params: { albumId } }),
    getDiaryById: (id) => api.get(`/diaries/${id}`),
    createDiary: (data) => api.post(`/diaries`, data),
    updateDiary: (id, data) => api.put(`/diaries/${id}`, data),
    deleteDiary: (id) => api.delete(`/diaries/${id}`),

    uploadImage: (entryId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/images/upload?entryId=${entryId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteImage: (id) => api.delete(`/images/${id}`),

    searchAlbums: (params) => {
        let cleanParams = {};
        if (typeof params === 'string') {
            cleanParams.keyword = params;
        } else {
            if (params.keyword) cleanParams.keyword = params.keyword;
            if (params.startDate) cleanParams.startDate = params.startDate;
            if (params.endDate) cleanParams.endDate = params.endDate;
        }
        return api.get(`/albums/search`, { params: cleanParams });
    },

    searchDiaries: (params) => {
        const cleanParams = {};
        Object.keys(params).forEach(key => {
            if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
                cleanParams[key] = params[key];
            }
        });
        return api.get(`/diaries/search`, { params: cleanParams });
    },

    uploadAlbumCover: (albumId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post(`/albums/${albumId}/cover`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    
    deleteAlbumCover: (albumId) => {
        return api.delete(`/albums/${albumId}/cover`);
    },

    deleteMultipleDiaries: (diaryIds) => {
        return api.post(`/diaries/bulk-delete`, { diaryIds });
    },

    getAllDiariesByUser: () => {
        return api.get(`/diaries/all`);
    },

    moveDiariesToAlbum: (diaryIds, targetAlbumId) => {
        return api.post(`/diaries/move`, {
            diaryIds: diaryIds,
            targetAlbumId: targetAlbumId
        });
    }
};