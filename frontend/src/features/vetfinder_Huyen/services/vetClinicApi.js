import httpClient from '../../../api/httpClient'

export const vetClinicApi = {
  // Lấy tất cả phòng khám
  getAllClinics: () => httpClient.get('/vet-clinics'),

  // Lấy phòng khám theo ID
  getClinicById: (id) => httpClient.get(`/vet-clinics/${id}`),

  // Tìm kiếm theo từ khóa
  searchByKeyword: (keyword) => httpClient.get('/vet-clinics/search', { params: { keyword } }),

  // Tìm phòng khám gần vị trí
  findNearby: (lat, lng, radius = 10, service = null) => {
    const params = { lat, lng, radius }
    if (service) params.service = service
    return httpClient.get('/vet-clinics/nearby', { params })
  },

  // Lọc theo dịch vụ
  filterByService: (service) => httpClient.get('/vet-clinics/filter', { params: { service } }),

  // Lấy top rated
  getTopRated: () => httpClient.get('/vet-clinics/top-rated'),

  // Lấy link chỉ đường
  getDirections: (id, lat, lng) => httpClient.get(`/vet-clinics/${id}/directions`, { params: { lat, lng } }),
}

export const favoriteApi = {
  // Lấy danh sách yêu thích
  getFavorites: () => httpClient.get('/favorites'),

  // Toggle yêu thích
  toggleFavorite: (vetClinicId) => httpClient.post(`/favorites/toggle/${vetClinicId}`),

  // Kiểm tra đã yêu thích chưa
  checkFavorite: (vetClinicId) => httpClient.get(`/favorites/check/${vetClinicId}`),

  // Đếm số lượt yêu thích
  getFavoriteCount: (vetClinicId) => httpClient.get(`/favorites/count/${vetClinicId}`),
}

export default httpClient
