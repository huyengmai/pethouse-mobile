package com.pethouse.booking_hai.dto.response;

import com.pethouse.booking_hai.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long userId;
    private Long petId;
    private Long slotId;
    private Long vetClinicId;
    private String serviceType;
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private String note;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Nested info for display
    private PetInfo pet;
    private SlotInfo slot;
    private ClinicInfo vetClinic;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PetInfo {
        private Long id;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SlotInfo {
        private Long id;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private String serviceType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClinicInfo {
        private Long id;
        private String name;
        private String address;
    }
}
