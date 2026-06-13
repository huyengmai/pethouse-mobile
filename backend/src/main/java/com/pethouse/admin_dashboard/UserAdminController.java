package com.pethouse.admin_dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        if (keyword != null && !keyword.isEmpty()) {
            return ResponseEntity.ok(userRepository.searchUsers(keyword, pageable));
        }
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
            .map(user -> {
                user.setFullName(userDetails.getFullName());
                user.setEmail(userDetails.getEmail());
                user.setPhone(userDetails.getPhone());
                user.setIsActive(userDetails.getIsActive());
                userRepository.save(user);
                return ResponseEntity.ok("Cập nhật thành công!");
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(user -> {
                user.setIsActive(!user.getIsActive());
                userRepository.save(user);
                return ResponseEntity.ok(user.getIsActive());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            userRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa người dùng và tất cả dữ liệu liên quan thành công.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }
}
