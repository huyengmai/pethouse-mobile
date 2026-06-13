package com.pethouse.health_chi.repo;

import com.pethouse.health_chi.entity.PetWeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetWeightLogRepository extends JpaRepository<PetWeightLog, Long> {
    List<PetWeightLog> findByPetIdOrderByMeasuredAtAsc(Long petId);
}