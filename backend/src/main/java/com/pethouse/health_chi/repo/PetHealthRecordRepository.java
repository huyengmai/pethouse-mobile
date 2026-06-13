package com.pethouse.health_chi.repo;

import com.pethouse.health_chi.entity.PetHealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetHealthRecordRepository extends JpaRepository<PetHealthRecord, Long> {
    List<PetHealthRecord> findByPetIdOrderByVisitDateDesc(Long petId);
}