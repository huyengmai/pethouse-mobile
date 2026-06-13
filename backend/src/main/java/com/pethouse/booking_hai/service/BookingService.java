package com.pethouse.booking_hai.service;

import com.pethouse.booking_hai.dto.request.AdminBookingUpdateRequest;
import com.pethouse.booking_hai.dto.request.BookingRequest;
import com.pethouse.booking_hai.dto.request.BookingUpdateRequest;
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.dto.response.BookingStatsResponse;
import com.pethouse.booking_hai.entity.BookingStatus;
import com.pethouse.booking_hai.entity.TimeSlot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingService {

    // ===== USER APIs (GIỮ NGUYÊN) =====
    
    BookingResponse createBooking(BookingRequest request);

    BookingResponse getBookingById(Long bookingId);

    List<BookingResponse> getBookingsByUserId(Long userId, LocalDate startDate, LocalDate endDate);

    List<BookingResponse> getAllBookings(); // USER xem của mình, ADMIN xem tất cả

    List<BookingResponse> getMyBookings(); // Lấy bookings của user hiện tại

    BookingResponse updateBooking(Long bookingId, BookingUpdateRequest request);

    BookingResponse cancelBooking(Long bookingId);

    void deleteBooking(Long bookingId);

    List<BookingResponse> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<TimeSlot> getAvailableTimeSlots(LocalDate date, String serviceType);

    // ===== ADMIN APIs (THÊM MỚI) =====
    
    /**
     * Admin lấy tất cả bookings với filter & pagination
     */
    Page<BookingResponse> getAllBookingsAdmin(
        BookingStatus status, 
        Long vetClinicId, 
        LocalDate startDate, 
        LocalDate endDate, 
        Pageable pageable
    );

    /**
     * Admin cập nhật booking (full control)
     */
    BookingResponse adminUpdateBooking(Long bookingId, AdminBookingUpdateRequest request);

    /**
     * Admin thay đổi status booking
     */
    BookingResponse updateBookingStatus(Long bookingId, BookingStatus status, String adminNote);

    /**
     * Admin xác nhận booking (PENDING → CONFIRMED)
     */
    BookingResponse confirmBooking(Long bookingId);

    /**
     * Admin hoàn thành booking (CONFIRMED → COMPLETED)
     */
    BookingResponse completeBooking(Long bookingId, String adminNote);

    /**
     * Admin hủy booking với lý do
     */
    BookingResponse adminCancelBooking(Long bookingId, String reason);

    /**
     * Thống kê bookings
     */
    BookingStatsResponse getBookingStats(LocalDate startDate, LocalDate endDate);
}