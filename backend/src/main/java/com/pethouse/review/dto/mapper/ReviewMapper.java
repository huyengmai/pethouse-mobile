package com.pethouse.review.dto.mapper;

import com.pethouse.review.dto.response.ReviewResponse;
import com.pethouse.review.entity.Review;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReviewMapper {

    public ReviewResponse toResponse(Review review) {
        if (review == null) return null;

        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullName())
                .bookingId(review.getBooking().getId())
                .vetClinicId(review.getVetClinic().getId())
                .vetClinicName(review.getVetClinic().getName())
                .serviceType(review.getBooking().getServiceType())
                .petName(review.getBooking().getPet() != null ? review.getBooking().getPet().getName() : null)
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }

    public List<ReviewResponse> toResponseList(List<Review> reviews) {
        if (reviews == null) return List.of();
        return reviews.stream().map(this::toResponse).toList();
    }
}
