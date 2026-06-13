package com.pethouse.common.config;

import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    
    private final UserRepository userRepository;
    
    /**
     * Lấy User hiện tại đang đăng nhập
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() 
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("No authenticated user found");
        }
        
        // Nếu principal là User object
        if (authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        
        // Nếu principal là username string
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }
    
    /**
     * Lấy ID của user hiện tại
     */
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
    
    /**
     * Lấy username của user hiện tại
     */
    public String getCurrentUsername() {
        return getCurrentUser().getUsername();
    }
    
    /**
     * Kiểm tra user hiện tại có phải ADMIN không
     */
    public boolean isAdmin() {
        try {
            User user = getCurrentUser();
            return user.getRole() == User.Role.ADMIN;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Kiểm tra user hiện tại có role cụ thể không
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }
    
    /**
     * Kiểm tra user hiện tại có phải owner của resource không
     */
    public boolean isOwnerOrAdmin(Long resourceOwnerId) {
        try {
            User currentUser = getCurrentUser();
            return currentUser.getId().equals(resourceOwnerId) || isAdmin();
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Kiểm tra có user đang đăng nhập không
     */
    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null 
                && authentication.isAuthenticated() 
                && !"anonymousUser".equals(authentication.getPrincipal());
    }
}