package com.pethouse.booking_hai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pethouse.booking_hai.entity.ServiceType;
import com.pethouse.booking_hai.entity.TimeSlot;

import jakarta.persistence.LockModeType;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    
    // ⭐ GIỮ NGUYÊN: Lấy slots available
    List<TimeSlot> findByAvailableTrue();

    List<TimeSlot> findByServiceTypeAndAvailableTrue(ServiceType serviceType);

    // ⭐ SỬA: Check duplicate theo vetClinic + date + time + service
    boolean existsByVetClinicIdAndDateAndStartTimeAndServiceType(
        Long vetClinicId,
        LocalDate date,
        LocalTime startTime,
        ServiceType serviceType
    );

    // ⭐ GIỮ NGUYÊN: Pessimistic lock
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TimeSlot t WHERE t.id = :id")
    Optional<TimeSlot> findByIdWithLock(@Param("id") Long id);

    // ⭐ SỬA: Query theo vetClinic + date + service
    List<TimeSlot> findByVetClinicIdAndDateAndServiceTypeAndAvailableTrueOrderByStartTime(
        Long vetClinicId, LocalDate date, ServiceType serviceType);

    // ⭐ THÊM MỚI: Lấy tất cả slots của clinic trong 1 ngày
    List<TimeSlot> findByVetClinicIdAndDateOrderByStartTime(
        Long vetClinicId, LocalDate date);

    // ⭐ THÊM MỚI: Lấy slots trong khoảng thời gian
    List<TimeSlot> findByVetClinicIdAndDateBetweenOrderByDateAscStartTimeAsc(
        Long vetClinicId, LocalDate startDate, LocalDate endDate);

    // ⭐ THÊM MỚI: Đếm số slots available của clinic
    @Query("SELECT COUNT(t) FROM TimeSlot t LEFT JOIN t.vetClinic vc WHERE vc.id = :vetClinicId AND t.available = true AND t.date >= :date")
    Long countAvailableSlotsByClinic(@Param("vetClinicId") Long vetClinicId, @Param("date") LocalDate date);
}