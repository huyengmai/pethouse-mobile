package com.pethouse.review.service;

import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.review.dto.request.ReviewRequest;
import com.pethouse.review.dto.response.ReviewResponse;

import java.util.List;

public interface ReviewService {

    // Lấy danh sách reviews công khai (cho HomePage)
    List<ReviewResponse> getPublicReviews();

    // Lấy reviews của user hiện tại
    List<ReviewResponse> getMyReviews();

    // Lấy danh sách booking đủ điều kiện đánh giá (COMPLETED + chưa có review)
    List<BookingResponse> getEligibleBookings();

    // Tạo review mới
    ReviewResponse createReview(ReviewRequest request);

    // Cập nhật review
    ReviewResponse updateReview(Long reviewId, ReviewRequest request);

    // Xóa review
    void deleteReview(Long reviewId);

    // Lấy review theo ID
    ReviewResponse getReviewById(Long reviewId);
}
