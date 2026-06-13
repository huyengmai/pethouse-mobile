package com.pethouse.auth_hoa.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pethouse.auth_hoa.entity.PasswordResetToken;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.PasswordResetTokenRepository;
import com.pethouse.auth_hoa.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    private static final int CODE_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    @Transactional
    public void sendResetCode(String email) {
        // Check if user with this email exists
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email không tồn tại trong hệ thống");
        }

        // Delete any existing token for this email
        tokenRepository.deleteByEmail(email);

        // Generate 6-digit code
        String code = generateCode();

        // Create new token
        PasswordResetToken token = PasswordResetToken.builder()
                .email(email)
                .code(code)
                .expiryDate(Instant.now().plus(CODE_EXPIRY_MINUTES, ChronoUnit.MINUTES))
                .verified(false)
                .attempts(0)
                .build();

        tokenRepository.save(token);

        // Send email
        sendCodeEmail(email, code);
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        PasswordResetToken token = tokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đặt lại mật khẩu"));

        // Check if expired
        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new RuntimeException("Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới");
        }

        // Check if max attempts exceeded
        if (token.hasExceededMaxAttempts()) {
            tokenRepository.delete(token);
            throw new RuntimeException("Bạn đã nhập sai quá " + MAX_ATTEMPTS + " lần. Vui lòng yêu cầu mã mới");
        }

        // Verify code
        if (!token.getCode().equals(code)) {
            token.incrementAttempts();
            tokenRepository.save(token);

            int remainingAttempts = MAX_ATTEMPTS - token.getAttempts();
            if (remainingAttempts > 0) {
                throw new RuntimeException("Mã xác thực không đúng. Còn " + remainingAttempts + " lần thử");
            } else {
                tokenRepository.delete(token);
                throw new RuntimeException("Bạn đã nhập sai quá " + MAX_ATTEMPTS + " lần. Vui lòng yêu cầu mã mới");
            }
        }

        // Mark as verified
        token.setVerified(true);
        tokenRepository.save(token);

        return true;
    }

    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        PasswordResetToken token = tokenRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu đặt lại mật khẩu"));

        // Check if verified
        if (!token.getVerified()) {
            throw new RuntimeException("Mã xác thực chưa được xác nhận");
        }

        // Check if code matches (extra security)
        if (!token.getCode().equals(code)) {
            throw new RuntimeException("Mã xác thực không hợp lệ");
        }

        // Check if expired (even after verification)
        if (token.isExpired()) {
            tokenRepository.delete(token);
            throw new RuntimeException("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thử lại");
        }

        // Get user and update password
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete the token
        tokenRepository.delete(token);
    }

    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-digit code from 100000 to 999999
        return String.valueOf(code);
    }

    private void sendCodeEmail(String email, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setSubject("PetHouse - Mã xác thực đặt lại mật khẩu");

        String text = String.format("""
            Xin chào,

            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản PetHouse.

            Mã xác thực của bạn là: %s

            Mã này sẽ hết hạn sau %d phút.

            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

            Trân trọng,
            PetHouse Team
            """,
            code, CODE_EXPIRY_MINUTES
        );

        msg.setText(text);
        mailSender.send(msg);
    }
}
