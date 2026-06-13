package com.pethouse.booking_hai.dto.response;

import com.pethouse.booking_hai.entity.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlotResponse {
    private Long id;
    private Long vetClinicId;
    private String vetClinicName; // Hiển thị tên phòng khám
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private ServiceType serviceType;
    private Integer maxCapacity;
    private Integer currentBookings;
    private Boolean available;
    private String note;
}