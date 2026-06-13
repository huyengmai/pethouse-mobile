package com.pethouse.booking_hai.service;

import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository; 
import com.pethouse.booking_hai.entity.Booking;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository; 

    public void sendBookingConfirmation(User user, Booking booking) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("PetHouse - Đặt lịch thành công!");

        String text = String.format("""
            Chào %s,
            
            Bạn đã đặt lịch thành công cho bé %s:
            - Dịch vụ: %s
            - Thời gian: %s lúc %s
            - Trạng thái: Đang chờ xác nhận
            
            Chúng tôi sẽ liên hệ sớm!
            PetHouse Team
            """,
            user.getFullName(),
            booking.getPet().getName(),
            booking.getServiceType(), 
            booking.getBookingDate().toLocalDate(),
            booking.getBookingDate().toLocalTime()
        );

        msg.setText(text);
        mailSender.send(msg);
    }

    public void sendReminder(User user, Booking booking) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(user.getEmail());
        msg.setSubject("PetHouse - Nhắc nhở lịch hẹn ngày mai!");

        String text = String.format("""
            Chào %s,
            
            Nhắc nhở: Ngày mai bé %s có lịch:
            - Dịch vụ: %s
            - Thời gian: %s lúc %s
            
            Đừng quên nhé!
            PetHouse Team
            """,
            user.getFullName(),
            booking.getPet().getName(),
            booking.getServiceType(),
            booking.getBookingDate().toLocalDate(),
            booking.getBookingDate().toLocalTime()
        );

        msg.setText(text);
        mailSender.send(msg);
    }

    // === METHOD MỚI: dùng cho Scheduler (nhận userId thay vì User) ===
    public void sendReminderByUserId(Long userId, Booking booking) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        sendReminder(user, booking); // Gọi lại method cũ
    }
}