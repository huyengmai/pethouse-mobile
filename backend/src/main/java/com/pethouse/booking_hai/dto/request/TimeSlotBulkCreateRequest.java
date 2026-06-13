package com.pethouse.booking_hai.dto.request;

import com.pethouse.booking_hai.entity.ServiceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class TimeSlotBulkCreateRequest {
    
    @NotNull
    private Long vetClinicId;
    
    @NotNull
    private List<LocalDate> dates; // VD: [2025-01-01, 2025-01-02, ...]
    
    @NotNull
    private List<TimeSlotTimeRange> timeRanges; // VD: [{08:00-09:00}, {09:00-10:00}]
    
    @NotNull
    private ServiceType serviceType;
    
    private Integer maxCapacity = 1;
    
    @Data
    public static class TimeSlotTimeRange {
        private LocalTime startTime;
        private LocalTime endTime;
    }
}