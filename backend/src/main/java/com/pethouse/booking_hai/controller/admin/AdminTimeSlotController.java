package com.pethouse.booking_hai.controller.admin;

import com.pethouse.booking_hai.dto.request.TimeSlotBulkCreateRequest;
import com.pethouse.booking_hai.dto.request.TimeSlotCreateRequest;
import com.pethouse.booking_hai.dto.response.TimeSlotResponse;
import com.pethouse.booking_hai.service.TimeSlotService;
import com.pethouse.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/time-slots")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTimeSlotController {

    private final TimeSlotService timeSlotService;

    /**
     * Tạo time slot đơn lẻ
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TimeSlotResponse>> createTimeSlot(
            @Valid @RequestBody TimeSlotCreateRequest request) {
        TimeSlotResponse response = timeSlotService.createTimeSlot(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Time slot created"));
    }

    /**
     * Tạo bulk time slots
     */
    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> createBulkTimeSlots(
            @Valid @RequestBody TimeSlotBulkCreateRequest request) {
        List<TimeSlotResponse> responses = timeSlotService.createBulkTimeSlots(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(responses, "Bulk time slots created"));
    }

    /**
     * Lấy time slots theo clinic và date
     */
    @GetMapping("/clinic/{vetClinicId}")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getTimeSlotsByClinicAndDate(
            @PathVariable Long vetClinicId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<TimeSlotResponse> responses = timeSlotService.getTimeSlotsByClinicAndDate(vetClinicId, date);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Lấy time slots theo clinic và date range
     */
    @GetMapping("/clinic/{vetClinicId}/range")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getTimeSlotsByClinicAndDateRange(
            @PathVariable Long vetClinicId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TimeSlotResponse> responses = timeSlotService.getTimeSlotsByClinicAndDateRange(vetClinicId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * Cập nhật time slot
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> updateTimeSlot(
            @PathVariable Long id,
            @Valid @RequestBody TimeSlotCreateRequest request) {
        TimeSlotResponse response = timeSlotService.updateTimeSlot(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Time slot updated"));
    }

    /**
     * Toggle availability
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> toggleSlotAvailability(
            @PathVariable Long id,
            @RequestParam Boolean available) {
        TimeSlotResponse response = timeSlotService.toggleSlotAvailability(id, available);
        return ResponseEntity.ok(ApiResponse.success(response, "Availability toggled"));
    }

    /**
     * Xóa time slot
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTimeSlot(@PathVariable Long id) {
        timeSlotService.deleteTimeSlot(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Time slot deleted"));
    }
}