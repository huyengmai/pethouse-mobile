package com.pethouse.booking_hai.dto.mapper;

import com.pethouse.booking_hai.dto.request.BookingRequest;
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.entity.Booking;
import com.pethouse.profile_hoa.entity.Pet;
import com.pethouse.booking_hai.entity.TimeSlot;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookingMapper {

    @Mapping(source = "pet.id", target = "petId")
    @Mapping(source = "slot.id", target = "slotId")
    @Mapping(source = "vetClinic.id", target = "vetClinicId")
    @Mapping(source = "pet", target = "pet")
    @Mapping(source = "slot", target = "slot")
    @Mapping(source = "vetClinic", target = "vetClinic")
    BookingResponse toResponse(Booking booking);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)  
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Booking toEntity(BookingRequest request);

    // Nested mappers
    default BookingResponse.PetInfo mapPet(Pet pet) {
        if (pet == null) return null;
        return BookingResponse.PetInfo.builder()
                .id(pet.getId())
                .name(pet.getName())
                .build();
    }

    default BookingResponse.SlotInfo mapSlot(TimeSlot slot) {
        if (slot == null) return null;
        return BookingResponse.SlotInfo.builder()
                .id(slot.getId())
                .date(slot.getDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .serviceType(slot.getServiceType() != null ? slot.getServiceType().name() : null)
                .build();
    }

    default BookingResponse.ClinicInfo mapVetClinic(VetClinic clinic) {
        if (clinic == null) return null;
        return BookingResponse.ClinicInfo.builder()
                .id(clinic.getId())
                .name(clinic.getName())
                .address(clinic.getAddress())
                .build();
    }
}
