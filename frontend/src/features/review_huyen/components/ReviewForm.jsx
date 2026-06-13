import { useState } from 'react';

export default function ReviewForm({ booking, review, onSubmit, onCancel, isEditing = false }) {
    const [rating, setRating] = useState(review?.rating || 5);
    const [content, setContent] = useState(review?.content || '');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            alert('Vui lòng chọn số sao từ 1 đến 5');
            return;
        }
        if (!content.trim()) {
            alert('Vui lòng nhập nội dung đánh giá');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({
                bookingId: booking?.id || review?.bookingId,
                rating,
                content: content.trim()
            });
        } finally {
            setSubmitting(false);
        }
    };

    const StarRating = () => {
        return (
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                    >
                        <span className={star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                        </span>
                    </button>
                ))}
            </div>
        );
    };

    const getRatingText = () => {
        const texts = {
            1: 'Rất tệ',
            2: 'Tệ',
            3: 'Bình thường',
            4: 'Tốt',
            5: 'Tuyệt vời'
        };
        return texts[hoveredRating || rating] || '';
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">
                {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá dịch vụ'}
            </h2>

            {/* Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700">
                    {booking?.serviceType || review?.serviceType}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                    Cơ sở: {booking?.vetClinicName || review?.vetClinicName}
                </p>
                {(booking?.petName || review?.petName) && (
                    <p className="text-gray-600 text-sm">
                        Thú cưng: {booking?.petName || review?.petName}
                    </p>
                )}
            </div>

            {/* Rating */}
            <div>
                <label className="block text-gray-700 font-medium mb-3">
                    Đánh giá của bạn
                </label>
                <div className="flex items-center gap-4">
                    <StarRating />
                    <span className="text-lg font-medium text-primary">
                        {getRatingText()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Nhận xét của bạn
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    required
                />
                <p className="text-gray-500 text-sm mt-1">
                    {content.length}/500 ký tự
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    disabled={submitting}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                >
                    {submitting ? 'Đang gửi...' : isEditing ? 'Cập nhật' : 'Gửi đánh giá'}
                </button>
            </div>
        </form>
    );
}
