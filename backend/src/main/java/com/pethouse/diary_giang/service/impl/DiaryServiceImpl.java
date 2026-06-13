package com.pethouse.diary_giang.service.impl;

import com.pethouse.diary_giang.dto.DiaryCreateDTO;
import com.pethouse.diary_giang.dto.DiaryEntryDTO;
import com.pethouse.diary_giang.dto.DiaryUpdateDTO;
import com.pethouse.diary_giang.dto.ImageDTO;
import com.pethouse.diary_giang.entity.Album;
import com.pethouse.diary_giang.entity.DiaryEntry;
import com.pethouse.diary_giang.entity.Image;
import com.pethouse.diary_giang.repository.AlbumRepository;
import com.pethouse.diary_giang.repository.DiaryEntryRepository;
import com.pethouse.diary_giang.repository.ImageRepository;
import com.pethouse.diary_giang.service.DiaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DiaryServiceImpl implements DiaryService {
    
    private final DiaryEntryRepository diaryEntryRepository;
    private final AlbumRepository albumRepository;
    private final ImageRepository imageRepository;
    
    public DiaryServiceImpl(DiaryEntryRepository diaryEntryRepository,
                            AlbumRepository albumRepository,
                            ImageRepository imageRepository) {
        this.diaryEntryRepository = diaryEntryRepository;
        this.albumRepository = albumRepository;
        this.imageRepository = imageRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryDTO> getAllDiariesByAlbumId(Long albumId, Long userId) {
        // Kiểm tra quyền truy cập album
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to access this album");
        }
        
        List<DiaryEntry> diaries = diaryEntryRepository.findByAlbum_AlbumIdOrderByEntryDateDesc(albumId);
        return diaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public DiaryEntryDTO getDiaryById(Long entryId, Long userId) {
        DiaryEntry diary = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found with id: " + entryId));
        
        // ✅ Dùng helper method thay vì lặp code
        if (!hasPermissionToAccessDiary(diary, userId)) {
            throw new RuntimeException("You don't have permission to access this diary");
        }
        
        return convertToDTO(diary);
    }
    
    @Override
    public DiaryEntryDTO createDiary(Long userId, DiaryCreateDTO createDTO) {
        // Validate cơ bản
        if (createDTO.getEntryDate() == null) {
            throw new RuntimeException("Entry date is required");
        }
        
        // Tạo diary entry
        DiaryEntry diary = new DiaryEntry();
        diary.setUserId(userId); // [IMPORTANT] Luôn set UserId
        diary.setTitle(createDTO.getTitle());
        diary.setContent(createDTO.getContent());
        diary.setEntryDate(createDTO.getEntryDate());
        
        // [MODIFIED] Xử lý Album (Cho phép null)
        if (createDTO.getAlbumId() != null) {
            Album album = albumRepository.findById(createDTO.getAlbumId())
                    .orElseThrow(() -> new RuntimeException("Album not found with id: " + createDTO.getAlbumId()));
            
            if (!album.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to add diary to this album");
            }
            diary.setAlbum(album);
        } else {
            diary.setAlbum(null); // Nhật ký lẻ
        }
        
        // Lưu diary
        DiaryEntry savedDiary = diaryEntryRepository.save(diary);
        
        // Thêm ảnh nếu có
        if (createDTO.getImageUrls() != null && !createDTO.getImageUrls().isEmpty()) {
            int order = 0;
            for (String imageUrl : createDTO.getImageUrls()) {
                Image image = new Image();
                image.setDiaryEntry(savedDiary);
                image.setImageUrl(imageUrl);
                image.setDisplayOrder(order++);
                imageRepository.save(image);
            }
        }
        
        return convertToDTO(savedDiary);
    }
    
    @Override
    public DiaryEntryDTO updateDiary(Long entryId, Long userId, DiaryUpdateDTO updateDTO) {
        DiaryEntry diary = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found with id: " + entryId));
        
        // ✅ Dùng helper method
        if (!hasPermissionToAccessDiary(diary, userId)) {
            throw new RuntimeException("You don't have permission to update this diary");
        }
        
        // Cập nhật
        if (updateDTO.getTitle() != null) diary.setTitle(updateDTO.getTitle());
        if (updateDTO.getContent() != null) diary.setContent(updateDTO.getContent());
        if (updateDTO.getEntryDate() != null) diary.setEntryDate(updateDTO.getEntryDate());
        
        DiaryEntry updatedDiary = diaryEntryRepository.save(diary);
        return convertToDTO(updatedDiary);
    }
    
   // ============================================
// CHỈ CẦN THAY METHOD deleteDiary() TRONG DiaryServiceImpl.java
// ============================================

    @Override
    public void deleteDiary(Long entryId, Long userId) {
        DiaryEntry diary = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found with id: " + entryId));
        
        // ✅ Dùng helper method
        if (!hasPermissionToAccessDiary(diary, userId)) {
            throw new RuntimeException("You don't have permission to delete this diary");
        }
        
        // Xóa
        diaryEntryRepository.delete(diary);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryDTO> searchDiaries(Long userId, Long albumId, String keyword, LocalDate startDate, LocalDate endDate) {
        String searchKeyword = null;
        if (keyword != null && !keyword.trim().isEmpty()) {
            searchKeyword = "%" + keyword.trim().toLowerCase() + "%";
        }
        
        LocalDate finalStartDate = (startDate != null) ? startDate : LocalDate.of(1900, 1, 1);
        LocalDate finalEndDate = (endDate != null) ? endDate : LocalDate.of(2100, 12, 31);
        
        List<DiaryEntry> entries = diaryEntryRepository.searchDiaries(
            userId, albumId, searchKeyword, finalStartDate, finalEndDate
        );
        
        return entries.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryDTO> getDiariesByDateRange(Long albumId, Long userId, LocalDate startDate, LocalDate endDate) {
        // Giữ logic cũ: vẫn check album
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found"));
        if (!album.getUserId().equals(userId)) throw new RuntimeException("No permission");
        
        List<DiaryEntry> diaries = diaryEntryRepository.findDiariesByDateRange(albumId, startDate, endDate);
        return diaries.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryDTO> getRecentDiaries(Long userId, int limit) {
        List<DiaryEntry> diaries = diaryEntryRepository.findTop5RecentDiaries(userId);
        return diaries.stream()
                .limit(limit)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ==================== [NEW] CÁC HÀM MỚI ====================

    @Override
    @Transactional(readOnly = true)
    public List<DiaryEntryDTO> getAllDiariesByUser(Long userId) {
        // Gọi hàm repository mới để lấy tất cả nhật ký (có hoặc không album)
        List<DiaryEntry> diaries = diaryEntryRepository.findAllByUserRaw(userId);
        return diaries.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void moveDiariesToAlbum(Long userId, List<Long> diaryIds, Long targetAlbumId) {
        // 1. Kiểm tra Album đích
        Album targetAlbum = albumRepository.findById(targetAlbumId)
                .orElseThrow(() -> new RuntimeException("Target album not found"));
        
        if (!targetAlbum.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to access this album");
        }

        // 2. Lấy danh sách nhật ký cần chuyển (chỉ lấy những cái thuộc user này)
        List<DiaryEntry> diaries = diaryEntryRepository.findByIdsAndUser(diaryIds, userId);
        
        if (diaries.isEmpty()) {
            throw new RuntimeException("No valid diaries found to move");
        }

        // 3. Cập nhật Album mới cho từng nhật ký
        for (DiaryEntry diary : diaries) {
            diary.setAlbum(targetAlbum);
            // JPA tự động detect thay đổi và save khi kết thúc Transaction
        }
        diaryEntryRepository.saveAll(diaries);
    }
    @Override
    public void deleteMultipleDiaries(Long userId, List<Long> diaryIds) {
        // 1. Lấy danh sách nhật ký cần xóa (chỉ lấy những cái thuộc user này để đảm bảo bảo mật)
        // Hàm findByIdsAndUser đã được dùng ở moveDiariesToAlbum nên chắc chắn Repository đã có.
        List<DiaryEntry> diaries = diaryEntryRepository.findByIdsAndUser(diaryIds, userId);
        
        if (diaries.isEmpty()) {
            // Nếu không tìm thấy nhật ký nào hợp lệ hoặc user không có quyền, ta có thể throw lỗi hoặc return
             throw new RuntimeException("No valid diaries found to delete or you don't have permission");
        }

        // 2. Xóa tất cả danh sách này
        diaryEntryRepository.deleteAll(diaries);
    }
    
    // ==================== HELPER METHODS ====================
    
    private DiaryEntryDTO convertToDTO(DiaryEntry diary) {
        DiaryEntryDTO dto = new DiaryEntryDTO();
        dto.setEntryId(diary.getEntryId());
        
        // [MODIFIED] Check null Album để tránh NullPointerException
        if (diary.getAlbum() != null) {
            dto.setAlbumId(diary.getAlbum().getAlbumId());
            dto.setAlbumTitle(diary.getAlbum().getTitle());
        } else {
            dto.setAlbumId(null);
            dto.setAlbumTitle(null);
        }
        
        dto.setTitle(diary.getTitle());
        dto.setContent(diary.getContent());
        dto.setEntryDate(diary.getEntryDate());
        dto.setCreatedAt(diary.getCreatedAt());
        dto.setUpdatedAt(diary.getUpdatedAt());
        
        if (diary.getImages() != null) {
            List<ImageDTO> imageDTOs = diary.getImages().stream()
                    .map(this::convertImageToDTO)
                    .collect(Collectors.toList());
            dto.setImages(imageDTOs);
        }
        
        return dto;
    }
    
    private ImageDTO convertImageToDTO(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setImageId(image.getImageId());
        dto.setImageUrl(image.getImageUrl());
        dto.setCaption(image.getCaption());
        dto.setDisplayOrder(image.getDisplayOrder());
        dto.setUploadedAt(image.getUploadedAt());
        return dto;
    }

    /**
 * Helper: Kiểm tra quyền truy cập diary
 */
    private boolean hasPermissionToAccessDiary(DiaryEntry diary, Long userId) {
        if (diary.getUserId() != null) {
            return diary.getUserId().equals(userId);
        } else if (diary.getAlbum() != null && diary.getAlbum().getUserId() != null) {
            return diary.getAlbum().getUserId().equals(userId);
        } else {
            return true; // Dữ liệu cũ không có userId và album
        }
    }
}