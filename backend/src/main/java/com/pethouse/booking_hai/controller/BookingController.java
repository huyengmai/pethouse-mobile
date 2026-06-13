package com.pethouse.booking_hai.controller;

import com.pethouse.booking_hai.dto.request.BookingRequest;
import com.pethouse.booking_hai.dto.request.BookingUpdateRequest;
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.service.BookingService;
import com.pethouse.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import com.pethouse.common.constants.ApiConstants;

@RestController
@RequestMapping(ApiConstants.BOOKINGS)
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    /**
     * Tạo booking mới
     * ⭐ Chỉ USER và ADMIN đã đăng nhập mới tạo được
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingRequest request) {
        
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Booking created successfully"));
    }
    
    /**
     * Lấy booking theo ID
     * ⭐ USER chỉ xem được booking của mình, ADMIN xem được tất cả
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * Lấy tất cả bookings
     * ⭐ USER xem bookings của mình, ADMIN xem tất cả
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy bookings của user hiện tại
     * ⭐ User xem bookings của chính mình
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings() {
        List<BookingResponse> responses = bookingService.getMyBookings();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy bookings của user cụ thể
     * ⭐ CHỈ ADMIN hoặc chính user đó mới xem được
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByUserId(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<BookingResponse> responses = bookingService.getBookingsByUserId(userId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
    
    /**
     * Cập nhật booking
     * ⭐ USER chỉ update booking của mình, ADMIN update tất cả
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingUpdateRequest request) {
        
        BookingResponse response = bookingService.updateBooking(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking updated successfully"));
    }
    
    /**
     * Cancel booking
     * ⭐ USER có thể cancel booking của mình
     */
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Booking cancelled successfully"));
    }
    
    /**
     * Xóa booking
     * ⭐ CHỈ ADMIN mới xóa được
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Booking deleted successfully"));
    }
    
    /**
     * Lấy bookings theo khoảng thời gian
     * ⭐ CHỈ ADMIN
     */
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<BookingResponse> responses = bookingService.getBookingsByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
   
}