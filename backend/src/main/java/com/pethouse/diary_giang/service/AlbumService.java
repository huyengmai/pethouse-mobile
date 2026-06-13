package com.pethouse.diary_giang.service;

import com.pethouse.diary_giang.dto.AlbumCreateDTO;
import com.pethouse.diary_giang.dto.AlbumDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface AlbumService {
    
    /**
     * Lấy tất cả albums của user
     */
    List<AlbumDTO> getAllAlbumsByUserId(Long userId);
    
    /**
     * Lấy chi tiết album theo ID
     */
    AlbumDTO getAlbumById(Long albumId, Long userId);
    
    /**
     * Tạo album mới
     */
    AlbumDTO createAlbum(Long userId, AlbumCreateDTO createDTO);
    
    /**
     * Cập nhật album
     */
    AlbumDTO updateAlbum(Long albumId, Long userId, AlbumCreateDTO updateDTO);
    
    /**
     * Xóa album
     */
    void deleteAlbum(Long albumId, Long userId);
    
    /**
     * [UPDATED] Tìm kiếm album theo Keyword (Title hoặc Description)
     * Đổi tên từ searchAlbumsByTitle -> searchAlbums để khớp với Controller
     */
    List<AlbumDTO> searchAlbums(Long userId, String keyword, LocalDate startDate, LocalDate endDate);
    
    /**
     * Lấy albums có diary entries
     */
    List<AlbumDTO> getAlbumsWithDiaries(Long userId);
    
    /**
     * Lấy albums trống (chưa có diary)
     */
    List<AlbumDTO> getEmptyAlbums(Long userId);
    
    // ==================== ✅ THÊM MỚI: COVER IMAGE METHODS ====================
    
    /**
     * Upload cover image cho album
     */
    AlbumDTO uploadCoverImage(Long albumId, Long userId, MultipartFile file) throws IOException;
    
    /**
     * Xóa cover image của album
     */
    AlbumDTO deleteCoverImage(Long albumId, Long userId);
}