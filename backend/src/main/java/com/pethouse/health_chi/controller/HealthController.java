package com.pethouse.health_chi.controller;

import com.pethouse.common.constants.ApiConstants;
import com.pethouse.health_chi.dto.*;
import com.pethouse.health_chi.service.PetHealthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiConstants.HEALTH)
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class HealthController {

    private final PetHealthService service;

    @GetMapping("/pets/{petId}/weights")
    public ResponseEntity<?> getWeights(@PathVariable Long petId) {
        return ResponseEntity.ok(service.getWeightHistory(petId));
    }

    @PostMapping("/pets/{petId}/weights")
    public ResponseEntity<?> addWeight(@PathVariable Long petId, @RequestBody PetWeightLogDTO dto) {
        return ResponseEntity.ok(service.addWeightLog(petId, dto));
    }

    @GetMapping("/pets/{petId}/records")
    public ResponseEntity<?> getRecords(@PathVariable Long petId) {
        return ResponseEntity.ok(service.getHealthRecords(petId));
    }

    @PostMapping("/pets/{petId}/records")
    public ResponseEntity<?> addRecord(@PathVariable Long petId, @RequestBody PetHealthRecordDTO dto) {
        return ResponseEntity.ok(service.addHealthRecord(petId, dto));
    }

    @PutMapping("/records/{id}")
    public ResponseEntity<?> updateRecord(@PathVariable Long id, @RequestBody PetHealthRecordDTO dto) {
        return ResponseEntity.ok(service.updateHealthRecord(id, dto));
    }

    @GetMapping("/records/{recordId}/attachments")
    public ResponseEntity<?> getAttachments(@PathVariable Long recordId) {
        return ResponseEntity.ok(service.getAttachments(recordId));
    }

    @PostMapping("/records/{recordId}/attachments")
    public ResponseEntity<?> addAttachment(@PathVariable Long recordId, @RequestBody AttachmentDTO dto) {
        return ResponseEntity.ok(service.addAttachment(recordId, dto));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(@PathVariable Long attachmentId) {
        service.deleteAttachment(attachmentId);
        return ResponseEntity.ok("Deleted attachment");
    }

    @DeleteMapping("/weights/{id}")
    public ResponseEntity<?> deleteWeight(@PathVariable Long id) {
        service.deleteWeightLog(id);
        return ResponseEntity.ok("Deleted weight log");
    }

    // DELETE: Xóa hồ sơ khám
    @DeleteMapping("/records/{id}")
    public ResponseEntity<?> deleteRecord(@PathVariable Long id) {
        service.deleteHealthRecord(id);
        return ResponseEntity.ok("Deleted health record");
    }
}
