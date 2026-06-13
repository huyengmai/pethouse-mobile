package com.pethouse.booking_hai.entity;

import com.pethouse.vetfinder_huyen.entity.VetClinic;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"vet_clinic_id", "date", "start_time", "service_type"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // THÊM MỚI: Liên kết với VetClinic
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_clinic_id")
    private VetClinic vetClinic;

    //SỬA: Tách date & time riêng (dễ query hơn)
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    // Service type
    @Column(name = "service_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ServiceType serviceType;

    // ⭐ THÊM MỚI: Capacity management
    @Column(name = "max_capacity")
    @Builder.Default
    private Integer maxCapacity = 1; // Số lượng booking tối đa

    @Column(name = "current_bookings")
    @Builder.Default
    private Integer currentBookings = 0; // Số lượng booking hiện tại

    // Availability
    @Column(name = "available", nullable = false)
    @Builder.Default
    private Boolean available = true;

    @Column(name = "note")
    private String note;

    // THÊM: Helper methods
    @Transient
    public boolean hasAvailableCapacity() {
        return available && currentBookings < maxCapacity;
    }

    public void incrementBooking() {
        this.currentBookings++;
        if (this.currentBookings >= this.maxCapacity) {
            this.available = false;
        }
    }

    public void decrementBooking() {
        if (this.currentBookings > 0) {
            this.currentBookings--;
            this.available = true;
        }
    }
}