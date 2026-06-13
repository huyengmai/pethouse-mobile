package com.pethouse.booking_hai.service.impl;

import com.pethouse.booking_hai.dto.request.TimeSlotBulkCreateRequest;
import com.pethouse.booking_hai.dto.request.TimeSlotCreateRequest;
import com.pethouse.booking_hai.dto.response.TimeSlotResponse;
import com.pethouse.booking_hai.entity.ServiceType;
import com.pethouse.booking_hai.service.TimeSlotService;
import com.pethouse.booking_hai.entity.TimeSlot;
import com.pethouse.booking_hai.repository.BookingRepository;
import com.pethouse.booking_hai.repository.TimeSlotRepository;
import com.pethouse.common.exception.BadRequestException;
import com.pethouse.common.exception.ResourceNotFoundException;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.repository.VetClinicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final VetClinicRepository vetClinicRepository;
    private final BookingRepository bookingRepository;

    /**
     * Lấy slots available cho user (public API)
     */
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(Long vetClinicId, LocalDate date, ServiceType serviceType) {
        List<TimeSlot> slots = timeSlotRepository
            .findByVetClinicIdAndDateAndServiceTypeAndAvailableTrueOrderByStartTime(
                vetClinicId, date, serviceType
            );
        
        return slots.stream()
            .filter(TimeSlot::hasAvailableCapacity)
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    /**
     * ADMIN: Tạo 1 slot đơn lẻ
     */
    @Transactional
    public TimeSlotResponse createTimeSlot(TimeSlotCreateRequest request) {
        // Validate vet clinic tồn tại
        VetClinic vetClinic = vetClinicRepository.findById(request.getVetClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Vet clinic not found"));

        // Check duplicate
        if (timeSlotRepository.existsByVetClinicIdAndDateAndStartTimeAndServiceType(
                request.getVetClinicId(), request.getDate(), 
                request.getStartTime(), request.getServiceType())) {
            throw new BadRequestException("Time slot already exists");
        }

        // Validate time logic
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BadRequestException("End time must be after start time");
        }

        TimeSlot slot = TimeSlot.builder()
            .vetClinic(vetClinic)
            .date(request.getDate())
            .startTime(request.getStartTime())
            .endTime(request.getEndTime())
            .serviceType(request.getServiceType())
            .maxCapacity(request.getMaxCapacity())
            .currentBookings(0)
            .available(request.getAvailable())
            .note(request.getNote())
            .build();

        TimeSlot saved = timeSlotRepository.save(slot);
        log.info("Created time slot ID: {} for clinic: {}", saved.getId(), vetClinic.getName());
        
        return toResponse(saved);
    }

    /**
     * ADMIN: Tạo nhiều slots cùng lúc (bulk)
     */
    @Transactional
    public List<TimeSlotResponse> createBulkTimeSlots(TimeSlotBulkCreateRequest request) {
        VetClinic vetClinic = vetClinicRepository.findById(request.getVetClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Vet clinic not found"));

        List<TimeSlot> slots = new ArrayList<>();

        for (LocalDate date : request.getDates()) {
            for (TimeSlotBulkCreateRequest.TimeSlotTimeRange timeRange : request.getTimeRanges()) {
                // Skip nếu đã tồn tại
                if (timeSlotRepository.existsByVetClinicIdAndDateAndStartTimeAndServiceType(
                        request.getVetClinicId(), date, 
                        timeRange.getStartTime(), request.getServiceType())) {
                    log.warn("Skipping duplicate slot: {} {} {}", date, timeRange.getStartTime(), request.getServiceType());
                    continue;
                }

                TimeSlot slot = TimeSlot.builder()
                    .vetClinic(vetClinic)
                    .date(date)
                    .startTime(timeRange.getStartTime())
                    .endTime(timeRange.getEndTime())
                    .serviceType(request.getServiceType())
                    .maxCapacity(request.getMaxCapacity())
                    .currentBookings(0)
                    .available(true)
                    .build();

                slots.add(slot);
            }
        }

        List<TimeSlot> saved = timeSlotRepository.saveAll(slots);
        log.info("Bulk created {} time slots for clinic: {}", saved.size(), vetClinic.getName());

        return saved.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * ADMIN: Lấy tất cả slots của clinic trong 1 ngày
     */
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getTimeSlotsByClinicAndDate(Long vetClinicId, LocalDate date) {
        List<TimeSlot> slots = timeSlotRepository.findByVetClinicIdAndDateOrderByStartTime(
            vetClinicId, date);
        return slots.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * ADMIN: Lấy slots trong khoảng thời gian
     */
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getTimeSlotsByClinicAndDateRange(
            Long vetClinicId, LocalDate startDate, LocalDate endDate) {
        List<TimeSlot> slots = timeSlotRepository
            .findByVetClinicIdAndDateBetweenOrderByDateAscStartTimeAsc(
                vetClinicId, startDate, endDate);
        return slots.stream().map(this::toResponse).collect(Collectors.toList());
    }

    /**
     * ADMIN: Cập nhật slot
     */
    @Transactional
    public TimeSlotResponse updateTimeSlot(Long slotId, TimeSlotCreateRequest request) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        // Chỉ update các field được phép
        if (request.getMaxCapacity() != null) {
            slot.setMaxCapacity(request.getMaxCapacity());
        }
        if (request.getAvailable() != null) {
            slot.setAvailable(request.getAvailable());
        }
        if (request.getNote() != null) {
            slot.setNote(request.getNote());
        }

        // Tự động cập nhật available status dựa vào capacity
        if (slot.getCurrentBookings() >= slot.getMaxCapacity()) {
            slot.setAvailable(false);
        }

        return toResponse(timeSlotRepository.save(slot));
    }

    /**
     * ADMIN: Xóa slot (chỉ xóa nếu chưa có booking)
     */
    @Transactional
    public void deleteTimeSlot(Long slotId) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        // Check có booking nào đang active không
        boolean hasActiveBookings = bookingRepository.existsBySlotIdAndStatusNot(
            slotId, com.pethouse.booking_hai.entity.BookingStatus.CANCELLED);

        if (hasActiveBookings) {
            throw new BadRequestException("Cannot delete slot with active bookings");
        }

        timeSlotRepository.delete(slot);
        log.info("Deleted time slot ID: {}", slotId);
    }

    /**
     * ADMIN: Bật/tắt slot
     */
    @Transactional
    public TimeSlotResponse toggleSlotAvailability(Long slotId, Boolean isAvailable) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        slot.setAvailable(isAvailable);
        return toResponse(timeSlotRepository.save(slot));
    }

    // ===== HELPER METHODS =====
    
    private TimeSlotResponse toResponse(TimeSlot slot) {
        return TimeSlotResponse.builder()
            .id(slot.getId())
            .vetClinicId(slot.getVetClinic().getId())
            .vetClinicName(slot.getVetClinic().getName())
            .date(slot.getDate())
            .startTime(slot.getStartTime())
            .endTime(slot.getEndTime())
            .serviceType(slot.getServiceType())
            .maxCapacity(slot.getMaxCapacity())
            .currentBookings(slot.getCurrentBookings())
            .available(slot.getAvailable())
            .note(slot.getNote())
            .build();
    }
}