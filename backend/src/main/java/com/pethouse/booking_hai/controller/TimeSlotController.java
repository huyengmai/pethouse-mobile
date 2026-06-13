package com.pethouse.booking_hai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pethouse.booking_hai.dto.response.TimeSlotResponse;
import com.pethouse.booking_hai.entity.ServiceType;
import com.pethouse.booking_hai.service.TimeSlotService;
import com.pethouse.common.constants.ApiConstants;

import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping(ApiConstants.BOOKINGS + "/slots")
@RequiredArgsConstructor
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @GetMapping("/available")
    public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
            @RequestParam Long vetClinicId,
            @RequestParam LocalDate date,
            @RequestParam ServiceType serviceType) {

        List<TimeSlotResponse> slots = timeSlotService.getAvailableSlots(vetClinicId, date, serviceType);
        return ResponseEntity.ok(slots);
    }
}

record TimeSlotDTO(Long id, LocalTime startTime, LocalTime endTime) {}

