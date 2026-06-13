import httpClient from '../../../api/httpClient';

const reviewService = {
    // Lấy reviews công khai (cho HomePage)
    getPublicReviews: async () => {
        const response = await httpClient.get('/reviews');
        return response.data;
    },

    // Lấy reviews của user hiện tại
    getMyReviews: async () => {
        const response = await httpClient.get('/reviews/my');
        return response.data;
    },

    // Lấy danh sách booking đủ điều kiện đánh giá
    getEligibleBookings: async () => {
        const response = await httpClient.get('/reviews/eligible-bookings');
        return response.data;
    },

    // Tạo review mới
    createReview: async (reviewData) => {
        const response = await httpClient.post('/reviews', reviewData);
        return response.data;
    },

    // Cập nhật review
    updateReview: async (reviewId, reviewData) => {
        const response = await httpClient.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    // Xóa review
    deleteReview: async (reviewId) => {
        const response = await httpClient.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    // Lấy review theo ID
    getReviewById: async (reviewId) => {
        const response = await httpClient.get(`/reviews/${reviewId}`);
        return response.data;
    }
};

export default reviewService;
