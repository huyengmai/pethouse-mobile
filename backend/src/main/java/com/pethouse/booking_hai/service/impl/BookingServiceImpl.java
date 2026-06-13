package com.pethouse.booking_hai.service.impl;

import com.pethouse.booking_hai.dto.mapper.BookingMapper;
import com.pethouse.booking_hai.dto.request.AdminBookingUpdateRequest;
import com.pethouse.booking_hai.dto.request.BookingRequest;
import com.pethouse.booking_hai.dto.request.BookingUpdateRequest;
import com.pethouse.booking_hai.dto.response.BookingResponse;
import com.pethouse.booking_hai.dto.response.BookingStatsResponse;
import com.pethouse.booking_hai.entity.Booking;
import com.pethouse.booking_hai.entity.BookingStatus;
import com.pethouse.profile_hoa.entity.Pet;
import com.pethouse.booking_hai.entity.TimeSlot;
import com.pethouse.booking_hai.repository.BookingRepository;
import com.pethouse.booking_hai.repository.TimeSlotRepository;
import com.pethouse.booking_hai.service.BookingService;
import com.pethouse.booking_hai.service.EmailService;
import com.pethouse.common.config.SecurityUtils;
import com.pethouse.common.exception.BadRequestException;
import com.pethouse.common.exception.ForbiddenException;
import com.pethouse.common.exception.ResourceNotFoundException;
import com.pethouse.profile_hoa.repo.PetsRepository;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.repository.VetClinicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final VetClinicRepository vetClinicRepository;
    private final PetsRepository petRepository;
    private final UserRepository userRepository;
    private final BookingMapper bookingMapper;
    private final SecurityUtils securityUtils;
    private final EmailService emailService;

    // ============================================================
    // USER APIs (CẬP NHẬT)
    // ============================================================

    /**
     * Tạo booking - ⭐ THÊM TRANSACTION + LOCK
     */
    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        log.info("User {} tạo booking cho slot {}", currentUserId, request.getSlotId());

        // 1. Validate Pet ownership
        Pet pet = petRepository.findById(request.getPetId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy pet"));
        
        if (!pet.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Bạn không sở hữu pet này");
        }

        // 2. Validate VetClinic exists
        VetClinic vetClinic = vetClinicRepository.findById(request.getVetClinicId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phòng khám"));

        // 3. ⭐ LOCK TIME SLOT (Pessimistic Write Lock)
        TimeSlot slot = timeSlotRepository.findByIdWithLock(request.getSlotId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy time slot"));

        // 4. Validate slot availability
        if (!slot.hasAvailableCapacity()) {
            throw new BadRequestException("Đã hết chỗ trong khung giờ này");
        }

        // 5. Validate service type matching (so sánh enum với String)
        if (!slot.getServiceType().name().equals(request.getServiceType())) {
            throw new BadRequestException("Loại dịch vụ không khớp với khung giờ đã chọn");
        }

        // 6. Validate slot belongs to selected clinic
        if (!slot.getVetClinic().getId().equals(request.getVetClinicId())) {
            throw new BadRequestException("Khung giờ không thuộc phòng khám đã chọn");
        }

        // 7. Create booking
        Booking booking = Booking.builder()
            .userId(currentUserId)
            .pet(pet)
            .slot(slot)
            .vetClinic(vetClinic)
            .serviceType(request.getServiceType())
            .bookingDate(request.getBookingDate())
            .note(request.getNote())
            .status(BookingStatus.PENDING)
            .build();

        Booking savedBooking = bookingRepository.save(booking);

        // 8. ⭐ Update slot capacity (QUAN TRỌNG!)
        slot.incrementBooking();
        timeSlotRepository.save(slot);

        log.info("Booking created: ID={}, Slot capacity: {}/{}", 
            savedBooking.getId(), slot.getCurrentBookings(), slot.getMaxCapacity());

        // 9. Send confirmation email (async - không fail nếu lỗi)
        try {
            User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user"));
            emailService.sendBookingConfirmation(user, savedBooking);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email xác nhận booking", e);
        }

        return bookingMapper.toResponse(savedBooking);
    }

    /**
     * Lấy booking theo ID (GIỮ NGUYÊN)
     */
    @Override
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking với ID: " + id));
        
        checkAccessPermission(booking);
        return bookingMapper.toResponse(booking);
    }

    /**
     * Lấy tất cả bookings (GIỮ NGUYÊN)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        Long currentUserId = securityUtils.getCurrentUserId();
        boolean isAdmin = securityUtils.isAdmin();

        List<Booking> bookings;
        if (isAdmin) {
            bookings = bookingRepository.findAll();
        } else {
            bookings = bookingRepository.findByUserId(currentUserId);
        }

        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy bookings của user hiện tại
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {
        Long currentUserId = securityUtils.getCurrentUserId();
        List<Booking> bookings = bookingRepository.findByUserId(currentUserId);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy bookings của user với date range (GIỮ NGUYÊN)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByUserId(Long userId, LocalDate startDate, LocalDate endDate) {
        if (!securityUtils.isOwnerOrAdmin(userId)) {
            throw new ForbiddenException("Bạn không có quyền xem các booking này");
        }
        
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<Booking> bookings = bookingRepository.findByUserIdAndDateRange(userId, startDateTime, endDateTime);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật booking - User chỉ sửa note (GIỮ NGUYÊN)
     */
    @Override
    @Transactional
    public BookingResponse updateBooking(Long id, BookingUpdateRequest request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking với ID: " + id));

        boolean isAdmin = securityUtils.isAdmin();
        boolean isOwner = securityUtils.isOwnerOrAdmin(booking.getUserId());

        if (!isOwner && !isAdmin) {
            throw new ForbiddenException("Bạn không có quyền cập nhật booking này");
        }

        // ADMIN có thể update status
        if (isAdmin && request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }

        // Cả USER và ADMIN đều có thể update note
        if (request.getNote() != null) {
            booking.setNote(request.getNote());
        }

        Booking updatedBooking = bookingRepository.save(booking);
        log.info("Booking {} updated {}", id, isAdmin ? "by Admin" : "by User");

        return bookingMapper.toResponse(updatedBooking);
    }

    /**
     * Cancel booking - ⭐ THÊM: Giải phóng slot
     */
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking với ID: " + id));
        
        checkAccessPermission(booking);
        
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new ForbiddenException("Không thể hủy booking đã hoàn thành");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new ForbiddenException("Booking đã được hủy trước đó");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);

        // ⭐ Giải phóng slot capacity
        TimeSlot slot = booking.getSlot();
        slot.decrementBooking();
        timeSlotRepository.save(slot);
        
        log.info("Booking {} cancelled, slot capacity restored: {}/{}", 
            id, slot.getCurrentBookings(), slot.getMaxCapacity());

        return bookingMapper.toResponse(updatedBooking);
    }

    /**
     * Xóa booking (GIỮ NGUYÊN)
     */
    @Override
    @Transactional
    public void deleteBooking(Long id) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Chỉ admin mới có quyền xóa booking");
        }
        
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking với ID: " + id));
        
        bookingRepository.delete(booking);
        log.info("Admin đã xóa booking {}", id);
    }

    /**
     * Lấy bookings theo date range (GIỮ NGUYÊN)
     */
    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Chỉ admin mới có thể xem booking theo khoảng thời gian");
        }
        
        List<Booking> bookings = bookingRepository.findByDateRange(startDate, endDate);
        return bookings.stream()
                .map(bookingMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy available time slots (GIỮ NGUYÊN - TODO)
     */
    @Override
    @Transactional(readOnly = true)
    public List<TimeSlot> getAvailableTimeSlots(LocalDate date, String serviceType) {
        // TODO: Implement logic
        throw new UnsupportedOperationException("Not implemented yet");
    }

    // ============================================================
    // ADMIN APIs (THÊM MỚI)
    // ============================================================

    /**
     * ⭐ ADMIN: Lấy tất cả bookings với filter & pagination
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BookingResponse> getAllBookingsAdmin(
            BookingStatus status, Long vetClinicId, 
            LocalDate startDate, LocalDate endDate, Pageable pageable) {
        
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;

        // Convert enum to String for native query
        String statusStr = status != null ? status.name() : null;

        Page<Booking> bookings = bookingRepository.findAllWithFilters(
            statusStr, vetClinicId, startDateTime, endDateTime, pageable);

        return bookings.map(bookingMapper::toResponse);
    }

    /**
     * ⭐ ADMIN: Cập nhật booking (full control)
     */
    @Override
    @Transactional
    public BookingResponse adminUpdateBooking(Long bookingId, AdminBookingUpdateRequest request) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));

        if (request.getBookingDate() != null) {
            booking.setBookingDate(request.getBookingDate());
        }
        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }
        if (request.getNote() != null) {
            booking.setNote(request.getNote());
        }
        if (request.getAdminNote() != null) {
            booking.setAdminNote(request.getAdminNote());
        }

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * ⭐ ADMIN: Thay đổi status
     */
    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus status, String adminNote) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));

        booking.setStatus(status);
        if (adminNote != null) {
            booking.setAdminNote(adminNote);
        }

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * ⭐ ADMIN: Xác nhận booking (PENDING → CONFIRMED)
     */
    @Override
    @Transactional
    public BookingResponse confirmBooking(Long bookingId) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể xác nhận các booking ở trạng thái PENDING");
        }

        booking.setStatus(BookingStatus.BOOKED);
        log.info("Admin xác nhận booking {}", bookingId);

        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * ⭐ ADMIN: Hoàn thành booking (BOOKED → COMPLETED)
     */
    @Override
    @Transactional
    public BookingResponse completeBooking(Long bookingId, String adminNote) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new BadRequestException("Chỉ có thể hoàn thành các booking ở trạng thái BOOKED");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        if (adminNote != null) {
            booking.setAdminNote(adminNote);
        }

        log.info("Admin hoàn thành booking {}", bookingId);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * ⭐ ADMIN: Hủy booking với lý do
     */
    @Override
    @Transactional
    public BookingResponse adminCancelBooking(Long bookingId, String reason) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy booking"));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setAdminNote("Hủy bởi admin: " + reason);

        // Giải phóng slot
        TimeSlot slot = booking.getSlot();
        slot.decrementBooking();
        timeSlotRepository.save(slot);

        log.info("Admin đã hủy booking {}: {}", bookingId, reason);
        return bookingMapper.toResponse(bookingRepository.save(booking));
    }

    /**
     * ⭐ ADMIN: Thống kê bookings
     */
    @Override
    @Transactional(readOnly = true)
    public BookingStatsResponse getBookingStats(LocalDate startDate, LocalDate endDate) {
        if (!securityUtils.isAdmin()) {
            throw new ForbiddenException("Admin only");
        }

        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;

        // Pass enum name as String for native query
        Long pending = bookingRepository.countByStatusAndDateRange(
            BookingStatus.PENDING.name(), startDateTime, endDateTime);

        Long confirmed = bookingRepository.countByStatusAndDateRange(
            BookingStatus.BOOKED.name(), startDateTime, endDateTime);

        Long completed = bookingRepository.countByStatusAndDateRange(
            BookingStatus.COMPLETED.name(), startDateTime, endDateTime);

        Long cancelled = bookingRepository.countByStatusAndDateRange(
            BookingStatus.CANCELLED.name(), startDateTime, endDateTime);

        Long total = pending + confirmed + completed + cancelled;

        return BookingStatsResponse.builder()
            .totalBookings(total)
            .pendingBookings(pending)
            .confirmedBookings(confirmed)
            .completedBookings(completed)
            .cancelledBookings(cancelled)
            .build();
    }

    // ============================================================
    // HELPER METHODS
    // ============================================================

    private void checkAccessPermission(Booking booking) {
        if (!securityUtils.isOwnerOrAdmin(booking.getUserId())) {
            throw new ForbiddenException("Bạn không có quyền truy cập booking này");
        }
    }
}