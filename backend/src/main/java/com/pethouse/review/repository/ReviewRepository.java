package com.pethouse.review.repository;

import com.pethouse.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Lấy reviews của user, sắp xếp theo thời gian mới nhất
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Lấy 3 reviews mới nhất cho HomePage
    List<Review> findTop3ByOrderByCreatedAtDesc();

    // Kiểm tra booking đã có review chưa
    boolean existsByBookingId(Long bookingId);

    // Tìm review theo booking
    Optional<Review> findByBookingId(Long bookingId);

    // Lấy reviews theo vet clinic
    List<Review> findByVetClinicIdOrderByCreatedAtDesc(Long vetClinicId);
}
