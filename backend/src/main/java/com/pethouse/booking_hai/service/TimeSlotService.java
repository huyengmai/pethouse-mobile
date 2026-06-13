package com.pethouse.booking_hai.service;

import com.pethouse.booking_hai.dto.request.TimeSlotBulkCreateRequest;
import com.pethouse.booking_hai.dto.request.TimeSlotCreateRequest;
import com.pethouse.booking_hai.dto.response.TimeSlotResponse;
import com.pethouse.booking_hai.entity.ServiceType;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {

    List<TimeSlotResponse> getAvailableSlots(Long vetClinicId, LocalDate date, ServiceType serviceType);

    TimeSlotResponse createTimeSlot(TimeSlotCreateRequest request);

    List<TimeSlotResponse> createBulkTimeSlots(TimeSlotBulkCreateRequest request);

    List<TimeSlotResponse> getTimeSlotsByClinicAndDate(Long vetClinicId, LocalDate date);

    List<TimeSlotResponse> getTimeSlotsByClinicAndDateRange(Long vetClinicId, LocalDate startDate, LocalDate endDate);

    TimeSlotResponse updateTimeSlot(Long slotId, TimeSlotCreateRequest request);

    void deleteTimeSlot(Long slotId);

    TimeSlotResponse toggleSlotAvailability(Long slotId, Boolean isAvailable);
}