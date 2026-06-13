package com.pethouse.diary_giang.service;

import com.pethouse.diary_giang.dto.DiaryCreateDTO;
import com.pethouse.diary_giang.dto.DiaryEntryDTO;
import com.pethouse.diary_giang.dto.DiaryUpdateDTO;

import java.time.LocalDate;
import java.util.List;

public interface DiaryService {
    
    /**
     * Lấy tất cả diary entries trong album
     */
    List<DiaryEntryDTO> getAllDiariesByAlbumId(Long albumId, Long userId);
    
    /**
     * Lấy chi tiết diary entry
     */
    DiaryEntryDTO getDiaryById(Long entryId, Long userId);
    
    /**
     * Tạo diary mới
     */
    DiaryEntryDTO createDiary(Long userId, DiaryCreateDTO createDTO);
    
    /**
     * Cập nhật diary
     */
    DiaryEntryDTO updateDiary(Long entryId, Long userId, DiaryUpdateDTO updateDTO);
    
    /**
     * Xóa diary
     */
    void deleteDiary(Long entryId, Long userId);
    

    List<DiaryEntryDTO> searchDiaries(Long userId, Long albumId, String keyword, LocalDate startDate, LocalDate endDate);
    
    /**
     * Lấy diary theo khoảng thời gian (Cũ - Có thể vẫn dùng hoặc thay thế bằng searchDiaries)
     */
    List<DiaryEntryDTO> getDiariesByDateRange(Long albumId, Long userId, 
                                               LocalDate startDate, LocalDate endDate);
    
    /**
     * Lấy diary gần nhất
     */
    List<DiaryEntryDTO> getRecentDiaries(Long userId, int limit);

    // ================== CÁC HÀM MỚI (CHO TÍNH NĂNG MỚI) ==================

    /**
     * [MỚI] Lấy TOÀN BỘ nhật ký của User (Dùng cho trang "Tất cả nhật ký")
     * Bao gồm cả nhật ký đã có album và chưa có album
     */
    List<DiaryEntryDTO> getAllDiariesByUser(Long userId);

    /**
     * [MỚI] Di chuyển nhiều nhật ký vào một Album (Dùng cho chức năng Chọn -> Thêm vào Album)
     * @param userId: ID người dùng (để bảo mật)
     * @param diaryIds: Danh sách ID các nhật ký được chọn
     * @param targetAlbumId: ID của album đích đến
     */
    void moveDiariesToAlbum(Long userId, List<Long> diaryIds, Long targetAlbumId);
    void deleteMultipleDiaries(Long userId, List<Long> diaryIds);
}