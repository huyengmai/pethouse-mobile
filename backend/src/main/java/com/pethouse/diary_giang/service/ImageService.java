package com.pethouse.diary_giang.service;

import com.pethouse.diary_giang.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    
    /**
     * Lấy tất cả ảnh trong diary entry
     */
    List<ImageDTO> getImagesByEntryId(Long entryId);
    
    /**
     * Upload ảnh mới
     */
    ImageDTO uploadImage(Long entryId, Long userId, MultipartFile file);
    
    /**
     * Thêm ảnh từ URL
     */
    ImageDTO addImageFromUrl(Long entryId, Long userId, String imageUrl, String caption);
    
    /**
     * Xóa ảnh
     */
    void deleteImage(Long imageId, Long userId);
    
    /**
     * Cập nhật thứ tự hiển thị
     */
    void updateDisplayOrder(Long imageId, Long userId, Integer newOrder);
    
    /**
     * Cập nhật caption
     */
    ImageDTO updateCaption(Long imageId, Long userId, String caption);
}