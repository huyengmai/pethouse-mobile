import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authHelpers } from '../../../api/authApi';
import reviewService from '../services/reviewService';
import ReviewForm from '../components/ReviewForm';

export default function ReviewPage() {
    const [eligibleBookings, setEligibleBookings] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('create'); // 'create' or 'my-reviews'

    // Kiểm tra đăng nhập
    if (!authHelpers.isAuthenticated()) {
        return <Navigate to="/login" state={{ from: '/review' }} />;
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsRes, reviewsRes] = await Promise.all([
                reviewService.getEligibleBookings(),
                reviewService.getMyReviews()
            ]);
            setEligibleBookings(bookingsRes.data || []);
            setMyReviews(reviewsRes.data || []);
        } catch (err) {
            setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateReview = async (reviewData) => {
        try {
            await reviewService.createReview(reviewData);
            setSelectedBooking(null);
            fetchData();
            alert('Đánh giá của bạn đã được gửi thành công!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleUpdateReview = async (reviewId, reviewData) => {
        try {
            await reviewService.updateReview(reviewId, reviewData);
            setEditingReview(null);
            fetchData();
            alert('Đánh giá đã được cập nhật!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
        try {
            await reviewService.deleteReview(reviewId);
            fetchData();
            alert('Đánh giá đã được xóa!');
        } catch (err) {
            alert(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const StarRating = ({ rating, interactive = false, onChange }) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => interactive && onChange && onChange(star)}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Đánh giá dịch vụ</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 justify-center">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'create'
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                        }`}
                    >
                        Tạo đánh giá mới
                    </button>
                    <button
                        onClick={() => setActiveTab('my-reviews')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                            activeTab === 'my-reviews'
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white'
                        }`}
                    >
                        Đánh giá của tôi ({myReviews.length})
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Tab: Create Review */}
                {activeTab === 'create' && (
                    <div>
                        {selectedBooking ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="mb-4 text-gray-500 hover:text-primary flex items-center gap-2"
                                >
                                    ← Quay lại
                                </button>
                                <ReviewForm
                                    booking={selectedBooking}
                                    onSubmit={handleCreateReview}
                                    onCancel={() => setSelectedBooking(null)}
                                />
                            </div>
                        ) : (
                            <div>
                                {eligibleBookings.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                        <div className="text-6xl mb-4">📝</div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                            Chưa có dịch vụ nào để đánh giá
                                        </h3>
                                        <p className="text-gray-500">
                                            Bạn cần hoàn thành một dịch vụ trước khi có thể đánh giá.
                                            Hãy đặt lịch và trải nghiệm dịch vụ của chúng tôi!
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                            Chọn dịch vụ để đánh giá ({eligibleBookings.length})
                                        </h2>
                                        {eligibleBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-primary"
                                                onClick={() => setSelectedBooking(booking)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-primary">
                                                            {booking.serviceType}
                                                        </h3>
                                                        <p className="text-gray-600 mt-1">
                                                            Thú cưng: {booking.petName || 'N/A'}
                                                        </p>
                                                        <p className="text-gray-600">
                                                            Cơ sở: {booking.vetClinicName || 'N/A'}
                                                        </p>
                                                        <p className="text-gray-500 text-sm mt-2">
                                                            Ngày hoàn thành: {formatDate(booking.completedAt || booking.bookingDate)}
                                                        </p>
                                                    </div>
                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                                        Hoàn thành
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: My Reviews */}
                {activeTab === 'my-reviews' && (
                    <div>
                        {editingReview ? (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="mb-4 text-gray-500 hover:text-primary flex items-center gap-2"
                                >
                                    ← Quay lại
                                </button>
                                <ReviewForm
                                    review={editingReview}
                                    onSubmit={(data) => handleUpdateReview(editingReview.id, data)}
                                    onCancel={() => setEditingReview(null)}
                                    isEditing
                                />
                            </div>
                        ) : myReviews.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                                <div className="text-6xl mb-4">⭐</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Bạn chưa có đánh giá nào
                                </h3>
                                <p className="text-gray-500">
                                    Hãy đánh giá các dịch vụ bạn đã sử dụng để giúp đỡ người dùng khác!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {myReviews.map((review) => (
                                    <div key={review.id} className="bg-white rounded-xl shadow-lg p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg text-primary">
                                                    {review.serviceType}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Cơ sở: {review.vetClinicName}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingReview(review)}
                                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} />
                                        <p className="text-gray-700 mt-3">{review.content}</p>
                                        {review.petName && (
                                            <p className="text-gray-500 text-sm mt-2">
                                                Thú cưng: {review.petName}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
