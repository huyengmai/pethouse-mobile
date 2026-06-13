package com.pethouse.common.config;

import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed guest_user for VetFinder favorites feature
        if (userRepository.findByUsername("guest_user").isEmpty()) {
            User guestUser = User.builder()
                    .username("guest_user")
                    .password(passwordEncoder.encode("guest_password"))
                    .fullName("Guest User")
                    .email("guest@example.com")
                    .phone("0000000000")
                    .role(User.Role.USER)
                    .build();
            userRepository.save(guestUser);
            log.info("Created guest_user for VetFinder favorites feature");
        } else {
            log.info("guest_user already exists");
        }
    }
}
