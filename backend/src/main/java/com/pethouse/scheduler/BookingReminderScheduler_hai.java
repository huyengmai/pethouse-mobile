package com.pethouse.scheduler;

import com.pethouse.booking_hai.entity.Booking;
import com.pethouse.booking_hai.entity.BookingStatus;
import com.pethouse.booking_hai.repository.BookingRepository;
import com.pethouse.booking_hai.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class BookingReminderScheduler_hai {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    // Chạy lúc 7h sáng hàng ngày
    @Scheduled(cron = "0 0 7 * * ?")
    public void sendDailyBookingReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDateTime startOfTomorrow = tomorrow.atStartOfDay();
        LocalDateTime endOfTomorrow = tomorrow.atTime(LocalTime.MAX);

        log.info("Running daily reminder scheduler for bookings on {}", tomorrow);

        // Lấy các booking có status BOOKED và ngày đặt lịch là ngày mai
        List<Booking> bookingsTomorrow = bookingRepository
                .findByBookingDateBetweenAndStatus(startOfTomorrow, endOfTomorrow, BookingStatus.BOOKED);

        if (bookingsTomorrow.isEmpty()) {
            log.info("No bookings to remind for tomorrow.");
            return;
        }

        for (Booking booking : bookingsTomorrow) {
            try {
                emailService.sendReminderByUserId(booking.getUserId(), booking);
                log.info("Sent reminder email for booking ID: {}", booking.getId());
            } catch (Exception e) {
                log.error("Failed to send reminder for booking ID: " + booking.getId(), e);
            }
        }
    }
}
