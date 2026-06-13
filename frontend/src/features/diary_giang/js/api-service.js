// API Service cho module Diary
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:9090';
const API_BASE_URL = `${API_HOST}/api`;
const USER_ID = 1; // TODO: Lấy từ authentication

class DiaryApiService {
    
    // ========== ALBUMS ==========
    static async getAllAlbums() {
        const response = await fetch(`${API_BASE_URL}/albums?userId=${USER_ID}`);
        if (!response.ok) throw new Error('Failed to load albums');
        return await response.json();
    }
    
    static async getAlbumById(albumId) {
        const response = await fetch(`${API_BASE_URL}/albums/${albumId}?userId=${USER_ID}`);
        if (!response.ok) throw new Error('Failed to load album');
        return await response.json();
    }
    
    static async createAlbum(data) {
        const response = await fetch(`${API_BASE_URL}/albums?userId=${USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create album');
        return await response.json();
    }
    
    static async updateAlbum(albumId, data) {
        const response = await fetch(`${API_BASE_URL}/albums/${albumId}?userId=${USER_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update album');
        return await response.json();
    }
    
    static async deleteAlbum(albumId) {
        const response = await fetch(`${API_BASE_URL}/albums/${albumId}?userId=${USER_ID}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete album');
    }
    
    static async searchAlbums(params) {
        // Xây dựng query string
        const queryParams = new URLSearchParams({ userId: USER_ID });

        if (typeof params === 'string') {
            // Hỗ trợ code cũ nếu chỉ truyền string
            if (params) queryParams.append('keyword', params);
        } else {
            // Hỗ trợ object { keyword, startDate, endDate }
            if (params.keyword) queryParams.append('keyword', params.keyword);
            if (params.startDate) queryParams.append('startDate', params.startDate);
            if (params.endDate) queryParams.append('endDate', params.endDate);
        }

        const response = await fetch(`${API_BASE_URL}/albums/search?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to search albums');
        return await response.json();
    }
    
    // ========== DIARIES ==========
    
    static async getDiariesByAlbum(albumId) {
        const response = await fetch(`${API_BASE_URL}/diaries?albumId=${albumId}&userId=${USER_ID}`);
        if (!response.ok) throw new Error('Failed to load diaries');
        return await response.json();
    }
    
    static async getDiaryById(entryId) {
        const response = await fetch(`${API_BASE_URL}/diaries/${entryId}?userId=${USER_ID}`);
        if (!response.ok) throw new Error('Failed to load diary');
        return await response.json();
    }
    
    static async createDiary(data) {
        const response = await fetch(`${API_BASE_URL}/diaries?userId=${USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create diary');
        return await response.json();
    }
    
    static async updateDiary(entryId, data) {
        const response = await fetch(`${API_BASE_URL}/diaries/${entryId}?userId=${USER_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update diary');
        return await response.json();
    }
    
    static async deleteDiary(entryId) {
        const response = await fetch(`${API_BASE_URL}/diaries/${entryId}?userId=${USER_ID}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete diary');
    }
    
    static async searchDiaries(params) {
        const queryParams = new URLSearchParams({ userId: USER_ID });

        // Chỉ append những tham số có giá trị (tránh gửi null/undefined)
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.albumId) queryParams.append('albumId', params.albumId);

        const response = await fetch(`${API_BASE_URL}/diaries/search?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to search diaries');
        return await response.json();
    }
    
    static async getRecentDiaries(limit = 10) {
        const response = await fetch(`${API_BASE_URL}/diaries/recent?userId=${USER_ID}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to load recent diaries');
        return await response.json();
    }
    
    static async getDiariesByDateRange(albumId, startDate, endDate) {
        const url = `${API_BASE_URL}/diaries/date-range?albumId=${albumId}&userId=${USER_ID}&startDate=${startDate}&endDate=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load diaries');
        return await response.json();
    }
    
    // ========== IMAGES ==========
    
    static async getImagesByEntry(entryId) {
        const response = await fetch(`${API_BASE_URL}/images?entryId=${entryId}`);
        if (!response.ok) throw new Error('Failed to load images');
        return await response.json();
    }
    
    static async addImageFromUrl(entryId, imageUrl, caption = '') {
        const response = await fetch(`${API_BASE_URL}/images/from-url?entryId=${entryId}&userId=${USER_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl, caption })
        });
        if (!response.ok) throw new Error('Failed to add image');
        return await response.json();
    }
    
    static async uploadImage(entryId, file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/images/upload?entryId=${entryId}&userId=${USER_ID}`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload image');
        return await response.json();
    }
    
    static async deleteImage(imageId) {
        const response = await fetch(`${API_BASE_URL}/images/${imageId}?userId=${USER_ID}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete image');
    }
    
    static async updateImageCaption(imageId, caption) {
        const response = await fetch(`${API_BASE_URL}/images/${imageId}/caption?userId=${USER_ID}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caption })
        });
        if (!response.ok) throw new Error('Failed to update caption');
        return await response.json();
    }
}

// ========== UTILITY FUNCTIONS ==========

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatMonthYear(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { 
        month: 'long', 
        year: 'numeric' 
    });
}

function groupDiariesByMonth(diaries) {
    const groups = {};
    
    diaries.forEach(diary => {
        const date = new Date(diary.entryDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
        
        if (!groups[monthKey]) {
            groups[monthKey] = {
                key: monthKey,
                name: monthName,
                diaries: []
            };
        }
        
        groups[monthKey].diaries.push(diary);
    });
    
    // Sắp xếp theo tháng giảm dần (mới nhất trước)
    return Object.values(groups).sort((a, b) => b.key.localeCompare(a.key));
}

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'block';
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) element.style.display = 'none';
}

function showError(message) {
    alert('❌ ' + message);
}

function showSuccess(message) {
    alert('✅ ' + message);
}