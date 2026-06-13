package com.pethouse.booking_hai.dto.request;

import com.pethouse.booking_hai.entity.BookingStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminBookingUpdateRequest {
    private LocalDateTime bookingDate;
    private BookingStatus status;
    private String note;
    private String adminNote;
}
