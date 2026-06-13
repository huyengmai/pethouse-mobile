package com.pethouse.booking_hai.dto.request;

import com.pethouse.booking_hai.entity.ServiceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TimeSlotCreateRequest {
    
    @NotNull(message = "Vet Clinic ID không được để trống")
    private Long vetClinicId;
    
    @NotNull(message = "Ngày không được để trống")
    private LocalDate date;
    
    @NotNull(message = "Giờ bắt đầu không được để trống")
    private LocalTime startTime;
    
    @NotNull(message = "Giờ kết thúc không được để trống")
    private LocalTime endTime;
    
    @NotNull(message = "Loại dịch vụ không được để trống")
    private ServiceType serviceType;
    
    private Integer maxCapacity = 1; // Mặc định 1
    
    private Boolean available = true;
    
    private String note;
}