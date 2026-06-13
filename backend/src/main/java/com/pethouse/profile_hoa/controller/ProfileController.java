package com.pethouse.profile_hoa.controller;

import com.pethouse.auth_hoa.dto.response.UserResponse;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.profile_hoa.dto.PetDTO;
import com.pethouse.profile_hoa.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // Lấy thông tin User hiện tại
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .username(user.getUsername())
                .build());
    }

    // Cập nhật User Profile
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserResponse request) {
        return ResponseEntity.ok(profileService.updateUserProfile(user.getUsername(), request));
    }

    // Lấy danh sách thú cưng của tôi
    @GetMapping("/pets")
    public ResponseEntity<List<PetDTO>> getMyPets(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(profileService.getMyPets(user.getId()));
    }

    // Thêm thú cưng mới
    @PostMapping("/pets")
    public ResponseEntity<PetDTO> addPet(
            @AuthenticationPrincipal User user,
            @RequestBody PetDTO petDTO) {
        return ResponseEntity.ok(profileService.createPet(user, petDTO));
    }

    // Cập nhật thông tin thú cưng
    @PutMapping("/pets/{petId}")
    public ResponseEntity<PetDTO> updatePet(
            @PathVariable Long petId,
            @AuthenticationPrincipal User currentUser, // Đảm bảo User này không null
            @RequestBody PetDTO petDTO) {
        
        if (currentUser == null) return ResponseEntity.status(401).build();
        
        // Truyền currentUser.getId() vào service để check quyền sở hữu
        PetDTO result = profileService.updatePet(petId, currentUser.getId(), petDTO);
        return ResponseEntity.ok(result);
    }

    // Xoá thú cưng
    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Void> deletePet(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        profileService.deletePet(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}