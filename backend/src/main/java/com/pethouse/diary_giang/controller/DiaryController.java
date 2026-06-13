package com.pethouse.diary_giang.controller;

import com.pethouse.diary_giang.dto.DiaryCreateDTO;
import com.pethouse.diary_giang.dto.DiaryEntryDTO;
import com.pethouse.diary_giang.dto.DiaryUpdateDTO;
import com.pethouse.diary_giang.service.DiaryService;
import com.pethouse.auth_hoa.entity.User; // Import entity User của bạn
import org.springframework.security.core.Authentication; // Import Security Authentication
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diaries")
public class DiaryController {
    
    private final DiaryService diaryService;
    
    public DiaryController(DiaryService diaryService) {
        this.diaryService = diaryService;
    }
    
    /**
     * GET /api/diaries?albumId=1
     * Lấy userId từ Authentication
     */
    @GetMapping
    public ResponseEntity<List<DiaryEntryDTO>> getAllDiariesByAlbum(
            @RequestParam Long albumId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<DiaryEntryDTO> diaries = diaryService.getAllDiariesByAlbumId(albumId, userId);
        return ResponseEntity.ok(diaries);
    }
    
    /**
     * GET /api/diaries/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntryDTO> getDiaryById(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        DiaryEntryDTO diary = diaryService.getDiaryById(id, userId);
        return ResponseEntity.ok(diary);
    }
    
    /**
     * POST /api/diaries
     */
    @PostMapping
    public ResponseEntity<DiaryEntryDTO> createDiary(
            Authentication authentication,
            @RequestBody DiaryCreateDTO createDTO) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        DiaryEntryDTO createdDiary = diaryService.createDiary(userId, createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDiary);
    }
    
    /**
     * PUT /api/diaries/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntryDTO> updateDiary(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody DiaryUpdateDTO updateDTO) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        DiaryEntryDTO updatedDiary = diaryService.updateDiary(id, userId, updateDTO);
        return ResponseEntity.ok(updatedDiary);
    }
    
    /**
     * DELETE /api/diaries/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        diaryService.deleteDiary(id, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/diaries/search
     */
    @GetMapping("/search")
    public ResponseEntity<List<DiaryEntryDTO>> searchDiaries(
            Authentication authentication,
            @RequestParam(required = false) Long albumId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
            
        List<DiaryEntryDTO> diaries = diaryService.searchDiaries(userId, albumId, keyword, startDate, endDate);
        return ResponseEntity.ok(diaries);
    }
    
    /**
     * GET /api/diaries/date-range
     */
    @GetMapping("/date-range")
    public ResponseEntity<List<DiaryEntryDTO>> getDiariesByDateRange(
            @RequestParam Long albumId,
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<DiaryEntryDTO> diaries = diaryService.getDiariesByDateRange(albumId, userId, startDate, endDate);
        return ResponseEntity.ok(diaries);
    }
    
    /**
     * GET /api/diaries/recent?limit=5
     */
    @GetMapping("/recent")
    public ResponseEntity<List<DiaryEntryDTO>> getRecentDiaries(
            Authentication authentication,
            @RequestParam(defaultValue = "5") int limit) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<DiaryEntryDTO> diaries = diaryService.getRecentDiaries(userId, limit);
        return ResponseEntity.ok(diaries);
    }

    // ==================== [NEW] CÁC API MỚI ====================

    /**
     * [MỚI] GET /api/diaries/all
     * Lấy toàn bộ nhật ký (kể cả chưa có album)
     */
    @GetMapping("/all")
    public ResponseEntity<List<DiaryEntryDTO>> getAllDiariesByUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<DiaryEntryDTO> diaries = diaryService.getAllDiariesByUser(userId);
        return ResponseEntity.ok(diaries);
    }

    /**
     * [MỚI] POST /api/diaries/move
     * Di chuyển nhiều nhật ký vào 1 Album
     */
    @PostMapping("/move")
    public ResponseEntity<Void> moveDiariesToAlbum(
            Authentication authentication,
            @RequestBody MoveDiariesRequest request) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        diaryService.moveDiariesToAlbum(userId, request.getDiaryIds(), request.getTargetAlbumId());
        return ResponseEntity.ok().build();
    }


    /**
     * [ĐÃ FIX] Đổi sang POST để tránh lỗi 400 (Spring Boot không đọc Body của DELETE)
     * POST /api/diaries/bulk-delete
     */
    @PostMapping("/bulk-delete") 
    public ResponseEntity<Void> deleteMultipleDiaries(
            Authentication authentication,
            @RequestBody BulkDeleteRequest request) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        diaryService.deleteMultipleDiaries(userId, request.getDiaryIds());
        return ResponseEntity.noContent().build();
    }
    
    // Class DTO (Giữ nguyên)
    public static class BulkDeleteRequest {
        private List<Long> diaryIds;
        public List<Long> getDiaryIds() { return diaryIds; }
        public void setDiaryIds(List<Long> diaryIds) { this.diaryIds = diaryIds; }
    }

    // Class DTO nội bộ để hứng dữ liệu request move (đỡ phải tạo file mới)
    public static class MoveDiariesRequest {
        private List<Long> diaryIds;
        private Long targetAlbumId;

        public List<Long> getDiaryIds() { return diaryIds; }
        public void setDiaryIds(List<Long> diaryIds) { this.diaryIds = diaryIds; }
        public Long getTargetAlbumId() { return targetAlbumId; }
        public void setTargetAlbumId(Long targetAlbumId) { this.targetAlbumId = targetAlbumId; }
    }
}