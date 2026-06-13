package com.pethouse.health_chi.repo;

import com.pethouse.health_chi.entity.PetHealthAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PetHealthAttachmentRepository extends JpaRepository<PetHealthAttachment, Long> {
    List<PetHealthAttachment> findByRecordId(Long recordId);
}