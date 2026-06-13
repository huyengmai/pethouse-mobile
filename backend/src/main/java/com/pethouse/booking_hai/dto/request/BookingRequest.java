package com.pethouse.booking_hai.dto.request;

import com.pethouse.booking_hai.entity.Booking;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BookingRequest {

    @NotNull(message = "Yêu cầu chọn thú cưng")
    private Long petId;

    @NotNull(message = "Yêu cầu chọn khung giờ")
    private Long slotId;

    @NotBlank(message = "Loại dịch vụ không được để trống")
    private String serviceType;

    @NotNull(message = "Vet Clinic ID không được để trống")
    private Long vetClinicId;
    
    @NotNull(message = "Ngày đặt lịch không được để trống")
    @FutureOrPresent(message = "Ngày đặt lịch phải là hiện tại hoặc tương lai")
    private LocalDateTime bookingDate;
    
    private String note;
}