package com.pethouse.booking_hai.repository;

import com.pethouse.booking_hai.entity.Booking;
import com.pethouse.booking_hai.entity.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // ===== GIỮ NGUYÊN =====
    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                   @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByUserIdAndDateRange(@Param("userId") Long userId,
                                            @Param("startDate") LocalDateTime startDate, 
                                            @Param("endDate") LocalDateTime endDate);
    
    // ⭐ SỬA: Cron nhắc nhở (query theo bookingDate)
    List<Booking> findByBookingDateBetweenAndStatus(
        LocalDateTime startDate, 
        LocalDateTime endDate, 
        BookingStatus status
    );
    
    // ===== THÊM MỚI: ADMIN QUERIES =====

    // Phân trang với filter - Native Query để tránh lỗi PostgreSQL với NULL params
    // Sử dụng SELECT b.* thay vì SELECT * để tránh duplicate alias 'id' từ JOIN
    @Query(value = "SELECT b.* FROM bookings b LEFT JOIN vet_clinics vc ON vc.id = b.vet_clinic_id WHERE " +
           "(CAST(:status AS VARCHAR) IS NULL OR b.status = CAST(:status AS VARCHAR)) AND " +
           "(CAST(:vetClinicId AS BIGINT) IS NULL OR vc.id = CAST(:vetClinicId AS BIGINT)) AND " +
           "(CAST(:startDate AS TIMESTAMP) IS NULL OR b.booking_date >= CAST(:startDate AS TIMESTAMP)) AND " +
           "(CAST(:endDate AS TIMESTAMP) IS NULL OR b.booking_date <= CAST(:endDate AS TIMESTAMP))",
           countQuery = "SELECT COUNT(*) FROM bookings b LEFT JOIN vet_clinics vc ON vc.id = b.vet_clinic_id WHERE " +
           "(CAST(:status AS VARCHAR) IS NULL OR b.status = CAST(:status AS VARCHAR)) AND " +
           "(CAST(:vetClinicId AS BIGINT) IS NULL OR vc.id = CAST(:vetClinicId AS BIGINT)) AND " +
           "(CAST(:startDate AS TIMESTAMP) IS NULL OR b.booking_date >= CAST(:startDate AS TIMESTAMP)) AND " +
           "(CAST(:endDate AS TIMESTAMP) IS NULL OR b.booking_date <= CAST(:endDate AS TIMESTAMP))",
           nativeQuery = true)
    Page<Booking> findAllWithFilters(
        @Param("status") String status,
        @Param("vetClinicId") Long vetClinicId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );

    // Thống kê bookings theo status - Native Query
    @Query(value = "SELECT COUNT(*) FROM bookings b WHERE b.status = CAST(:status AS VARCHAR) AND " +
           "(CAST(:startDate AS TIMESTAMP) IS NULL OR b.booking_date >= CAST(:startDate AS TIMESTAMP)) AND " +
           "(CAST(:endDate AS TIMESTAMP) IS NULL OR b.booking_date <= CAST(:endDate AS TIMESTAMP))",
           nativeQuery = true)
    Long countByStatusAndDateRange(
        @Param("status") String status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Bookings của 1 clinic
    List<Booking> findByVetClinicIdOrderByBookingDateDesc(Long vetClinicId);
    
    // Check slot đã được booking chưa
    boolean existsBySlotIdAndStatusNot(Long slotId, BookingStatus status);
}