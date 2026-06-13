package com.pethouse.profile_hoa.service;

import com.pethouse.auth_hoa.dto.response.UserResponse;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.auth_hoa.repo.UserRepository;
import com.pethouse.profile_hoa.dto.PetDTO;
import com.pethouse.profile_hoa.entity.Pet;
import com.pethouse.profile_hoa.repo.PetsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PetsRepository petRepository;

    // --- Logic cho User Profile ---
    @Transactional
    public UserResponse updateUserProfile(String username, UserResponse updateData) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFullName(updateData.getFullName());
        user.setEmail(updateData.getEmail());
        user.setPhone(updateData.getPhone());
        
        return mapToUserResponse(userRepository.save(user));
    }

    // --- Logic cho Pet Profile ---
    public List<PetDTO> getMyPets(Long userId) {
        return petRepository.findByUserId(userId).stream()
                .map(this::mapToPetDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PetDTO createPet(User owner, PetDTO petDTO) {
        Pet pet = Pet.builder()
                .name(petDTO.getName())
                .species(petDTO.getSpecies())
                .breed(petDTO.getBreed())
                .birthDate(petDTO.getBirthDate())
                .weight(petDTO.getWeight())
                .gender(petDTO.getGender())
                .user(owner)
                .build();
        return mapToPetDTO(petRepository.save(pet));
    }

    // --- CHỨC NĂNG CHỈNH SỬA PET MỚI THÊM ---
    @Transactional
    public PetDTO updatePet(Long petId, Long userId, PetDTO updateData) {
        // 1. Tìm pet trong DB
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng với ID: " + petId));

        // 2. Kiểm tra quyền sở hữu (Security Check)
        if (!pet.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa thú cưng này");
        }

        // 3. Cập nhật các trường thông tin
        pet.setName(updateData.getName());
        pet.setSpecies(updateData.getSpecies());
        pet.setBreed(updateData.getBreed());
        pet.setBirthDate(updateData.getBirthDate());
        pet.setWeight(updateData.getWeight());
        pet.setGender(updateData.getGender());

        // 4. Lưu và trả về kết quả
        return mapToPetDTO(petRepository.save(pet));
    }

    @Transactional
    public void deletePet(Long petId, Long userId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thú cưng"));
        
        // Kiểm tra bảo mật: Chỉ chủ sở hữu mới được xóa pet của mình
        if (!pet.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa thú cưng này");
        }
        
        petRepository.delete(pet);
    }

    // Helper mappers
    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId()).username(user.getUsername())
                .fullName(user.getFullName()).email(user.getEmail())
                .phone(user.getPhone()).role(user.getRole())
                .isActive(user.getIsActive()).build();
    }

    private PetDTO mapToPetDTO(Pet pet) {
        return PetDTO.builder()
                .id(pet.getId()).name(pet.getName())
                .species(pet.getSpecies()).breed(pet.getBreed())
                .birthDate(pet.getBirthDate()).weight(pet.getWeight())
                .gender(pet.getGender()).build();
    }
}