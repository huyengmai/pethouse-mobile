package com.pethouse.review.service.impl;

import com.pethouse.booking_hai.dto.mapper.BookingMapper;
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.entity.Booking;
import com.pethouse.booking_hai.entity.BookingStatus;
import com.pethouse.booking_hai.repository.BookingRepository;
import com.pethouse.common.config.SecurityUtils;
import com.pethouse.review.dto.mapper.ReviewMapper;
import com.pethouse.review.dto.request.ReviewRequest;
import com.pethouse.review.dto.response.ReviewResponse;
import com.pethouse.review.entity.Review;
import com.pethouse.review.repository.ReviewRepository;
import com.pethouse.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ReviewMapper reviewMapper;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getPublicReviews() {
        List<Review> reviews = reviewRepository.findTop3ByOrderByCreatedAtDesc();
        return reviewMapper.toResponseList(reviews);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews() {
        Long userId = securityUtils.getCurrentUserId();
        List<Review> reviews = reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return reviewMapper.toResponseList(reviews);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getEligibleBookings() {
        Long userId = securityUtils.getCurrentUserId();
        List<Booking> completedBookings = bookingRepository.findByUserIdAndStatus(userId, BookingStatus.COMPLETED);

        return completedBookings.stream()
                .filter(booking -> !reviewRepository.existsByBookingId(booking.getId()))
                .map(bookingMapper::toResponse)
                .toList();
    }

    @Override
    public ReviewResponse createReview(ReviewRequest request) {
        Long userId = securityUtils.getCurrentUserId();

        // Kiểm tra booking tồn tại và thuộc về user
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only review your own bookings");
        }

        // Kiểm tra booking đã COMPLETED
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalStateException("You can only review completed bookings");
        }

        // Kiểm tra chưa có review cho booking này
        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new IllegalStateException("You have already reviewed this booking");
        }

        Review review = Review.builder()
                .user(securityUtils.getCurrentUser())
                .booking(booking)
                .vetClinic(booking.getVetClinic())
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request) {
        Long userId = securityUtils.getCurrentUserId();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Kiểm tra review thuộc về user
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only update your own reviews");
        }

        review.setRating(request.getRating());
        review.setContent(request.getContent());

        review = reviewRepository.save(review);
        return reviewMapper.toResponse(review);
    }

    @Override
    public void deleteReview(Long reviewId) {
        Long userId = securityUtils.getCurrentUserId();

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Kiểm tra review thuộc về user hoặc là admin
        if (!review.getUser().getId().equals(userId) && !securityUtils.isAdmin()) {
            throw new IllegalStateException("You can only delete your own reviews");
        }

        reviewRepository.delete(review);
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        return reviewMapper.toResponse(review);
    }
}
