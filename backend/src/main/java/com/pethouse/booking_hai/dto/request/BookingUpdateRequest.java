package com.pethouse.booking_hai.dto.request;

import com.pethouse.booking_hai.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingUpdateRequest {
    
    private LocalDateTime bookingDate;
    
    @NotNull(message = "Trạng thái đặt lịch không được để trống")
    private BookingStatus status;
    
    private String note;
}