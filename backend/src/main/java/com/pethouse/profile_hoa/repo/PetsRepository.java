package com.pethouse.profile_hoa.repo;

import com.pethouse.profile_hoa.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetsRepository extends JpaRepository<Pet, Long> {
    List<Pet> findByUserId(Long userId); // Lấy danh sách pet theo chủ sở hữu
}