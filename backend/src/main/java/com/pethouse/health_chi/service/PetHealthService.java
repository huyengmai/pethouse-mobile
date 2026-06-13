package com.pethouse.health_chi.service;

import com.pethouse.common.config.SecurityUtils;
import com.pethouse.common.exception.ForbiddenException;
import com.pethouse.common.exception.ResourceNotFoundException;
import com.pethouse.health_chi.dto.*;
import com.pethouse.health_chi.entity.*;
import com.pethouse.health_chi.repo.*;
import com.pethouse.profile_hoa.entity.Pet;
import com.pethouse.profile_hoa.repo.PetsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetHealthService {

    private final PetWeightLogRepository weightRepo;
    private final PetHealthRecordRepository healthRepo;
    private final PetHealthAttachmentRepository attachmentRepo;
    private final PetsRepository petsRepository;
    private final SecurityUtils securityUtils;

    private void validatePetOwner(Long petId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        Pet pet = petsRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy pet"));
        if (!pet.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Bạn không có quyền truy cập pet này");
        }
    }

    private PetHealthRecord getRecordAndCheckOwner(Long recordId) {
        PetHealthRecord record = healthRepo.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ"));
        validatePetOwner(record.getPetId());
        return record;
    }

    public List<PetWeightLog> getWeightHistory(Long petId) {
        validatePetOwner(petId);
        return weightRepo.findByPetIdOrderByMeasuredAtAsc(petId);
    }

    public PetWeightLog addWeightLog(Long petId, PetWeightLogDTO dto) {
        validatePetOwner(petId);

        PetWeightLog log = new PetWeightLog();
        log.setPetId(petId);
        log.setWeight(dto.getWeight());
        log.setMeasuredAt(dto.getMeasuredAt() != null ? dto.getMeasuredAt() : LocalDate.now());
        log.setNote(dto.getNote());

        return weightRepo.save(log);
    }

    @Transactional
    public PetHealthRecord addHealthRecord(Long petId, PetHealthRecordDTO dto) {
        validatePetOwner(petId);
        PetHealthRecord record = new PetHealthRecord();
        record.setPetId(petId);
        record.setVisitDate(dto.getVisitDate());
        record.setTitle(dto.getTitle());
        record.setSymptoms(dto.getSymptoms());
        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatment(dto.getTreatment());
        record.setStatus(dto.getStatus());
        record.setFollowUpDate(dto.getFollowUpDate());
        record.setNote(dto.getNote());

        PetHealthRecord savedRecord = healthRepo.save(record);

        if (dto.getAttachmentUrls() != null && !dto.getAttachmentUrls().isEmpty()) {
            for (String url : dto.getAttachmentUrls()) {
                PetHealthAttachment attachment = new PetHealthAttachment();
                attachment.setRecordId(savedRecord.getId());
                attachment.setFileUrl(url);
                attachment.setFileName("image.jpg");
                attachment.setContentType("image/jpeg");
                attachmentRepo.save(attachment);
            }
        }
        return savedRecord;
    }

    @Transactional
    public PetHealthRecord updateHealthRecord(Long recordId, PetHealthRecordDTO dto) {
        PetHealthRecord record = getRecordAndCheckOwner(recordId);
        if (dto.getVisitDate() != null) record.setVisitDate(dto.getVisitDate());
        if (dto.getTitle() != null) record.setTitle(dto.getTitle());
        if (dto.getSymptoms() != null) record.setSymptoms(dto.getSymptoms());
        if (dto.getDiagnosis() != null) record.setDiagnosis(dto.getDiagnosis());
        if (dto.getTreatment() != null) record.setTreatment(dto.getTreatment());
        if (dto.getStatus() != null) record.setStatus(dto.getStatus());
        if (dto.getFollowUpDate() != null) record.setFollowUpDate(dto.getFollowUpDate());
        if (dto.getNote() != null) record.setNote(dto.getNote());
        return healthRepo.save(record);
    }

    public List<PetHealthRecord> getHealthRecords(Long petId) {
        validatePetOwner(petId);
        return healthRepo.findByPetIdOrderByVisitDateDesc(petId);
    }

    public List<PetHealthAttachment> getAttachments(Long recordId) {
        getRecordAndCheckOwner(recordId);
        return attachmentRepo.findByRecordId(recordId);
    }

    public PetHealthAttachment addAttachment(Long recordId, AttachmentDTO dto) {
        getRecordAndCheckOwner(recordId);
        PetHealthAttachment attachment = new PetHealthAttachment();
        attachment.setRecordId(recordId);
        attachment.setFileUrl(dto.getFileUrl());
        attachment.setFileName(dto.getFileName() != null ? dto.getFileName() : "image.jpg");
        attachment.setContentType(dto.getContentType() != null ? dto.getContentType() : "image/jpeg");
        return attachmentRepo.save(attachment);
    }

    public void deleteAttachment(Long attachmentId) {
        PetHealthAttachment attachment = attachmentRepo.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy attachment"));
        getRecordAndCheckOwner(attachment.getRecordId());
        attachmentRepo.delete(attachment);
    }

    public void deleteWeightLog(Long id) {
        PetWeightLog log = weightRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy log cân nặng"));
        validatePetOwner(log.getPetId());
        weightRepo.delete(log);
    }

    @Transactional
    public void deleteHealthRecord(Long id) {
        PetHealthRecord record = getRecordAndCheckOwner(id);
        List<PetHealthAttachment> attachments = attachmentRepo.findByRecordId(id);
        attachmentRepo.deleteAll(attachments);

        healthRepo.delete(record);
    }
}