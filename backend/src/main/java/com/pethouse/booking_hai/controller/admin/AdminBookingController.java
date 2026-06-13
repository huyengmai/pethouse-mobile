package com.pethouse.booking_hai.controller.admin;

import com.pethouse.booking_hai.dto.request.AdminBookingUpdateRequest; // Giả sử bạn có DTO này, nếu chưa thì tạo (xem bên dưới)
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.dto.response.BookingStatsResponse;
import com.pethouse.booking_hai.entity.BookingStatus;
import com.pethouse.booking_hai.service.BookingService;
import com.pethouse.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Áp dụng cho toàn controller
public class AdminBookingController {

    private final BookingService bookingService;

    /**
     * Lấy tất cả bookings với filter (status, vetClinicId, date range) và phân trang
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<BookingResponse>>> getAllBookingsWithFilters(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) Long vetClinicId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {

        Page<BookingResponse> responses = bookingService.getAllBookingsAdmin(status, vetClinicId, startDate, endDate, pageable);

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Cập nhật status booking (generic update)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String adminNote) {

        BookingResponse response = bookingService.updateBookingStatus(id, status, adminNote);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking status updated"));
    }

    /**
     * Xác nhận booking (PENDING → BOOKED)
     */
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.confirmBooking(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking confirmed"));
    }

    /**
     * Hoàn thành booking (BOOKED → COMPLETED)
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingResponse>> completeBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String adminNote) {
        BookingResponse response = bookingService.completeBooking(id, adminNote);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking completed"));
    }

    /**
     * Hủy booking với lý do
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> adminCancelBooking(
            @PathVariable Long id,
            @RequestParam String reason) {
        BookingResponse response = bookingService.adminCancelBooking(id, reason);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking cancelled by admin"));
    }

    /**
     * Thống kê bookings
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<BookingStatsResponse>> getBookingStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        BookingStatsResponse stats = bookingService.getBookingStats(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}