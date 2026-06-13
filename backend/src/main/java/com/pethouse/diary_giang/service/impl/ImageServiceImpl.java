package com.pethouse.diary_giang.service;

import com.pethouse.diary_giang.dto.ImageDTO;
import com.pethouse.diary_giang.entity.DiaryEntry;
import com.pethouse.diary_giang.entity.Image;
import com.pethouse.diary_giang.repository.DiaryEntryRepository;
import com.pethouse.diary_giang.repository.ImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImageServiceImpl implements ImageService {
    
    private final ImageRepository imageRepository;
    private final DiaryEntryRepository diaryEntryRepository;
    
    public ImageServiceImpl(ImageRepository imageRepository,
                            DiaryEntryRepository diaryEntryRepository) {
        this.imageRepository = imageRepository;
        this.diaryEntryRepository = diaryEntryRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ImageDTO> getImagesByEntryId(Long entryId) {
        List<Image> images = imageRepository.findByDiaryEntry_EntryIdOrderByDisplayOrderAsc(entryId);
        return images.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public ImageDTO uploadImage(Long entryId, Long userId, MultipartFile file) {
        // Kiểm tra diary có tồn tại không
        DiaryEntry diary = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found with id: " + entryId));
        
        // ✅ FIX: Kiểm tra quyền - Xử lý cả trường hợp có và không có album
        if (diary.getAlbum() != null) {
            // Diary có album → check quyền qua album
            if (!diary.getAlbum().getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to add image to this diary");
            }
        } else {
            // Diary không có album → check quyền trực tiếp qua userId của diary
            if (!diary.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to add image to this diary");
            }
        }
        
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("File must be an image");
        }
        
        try {
            // Tạo tên file unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String filename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + extension;
            
            // Thư mục riêng cho diary module
            String uploadDir = "uploads/diary/images/";
            Path uploadPath = Paths.get(uploadDir);
            
            // Tạo thư mục nếu chưa có
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("📁 Created directory: " + uploadPath.toAbsolutePath());
            }
            
            // Lưu file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("✅ Saved image: " + filePath.toAbsolutePath());
            
            // URL phải match với DiaryWebConfig
            String imageUrl = "/uploads/diary/images/" + filename;
            
            // Lấy display order tiếp theo
            Integer maxOrder = imageRepository.findMaxDisplayOrder(entryId);
            int nextOrder = (maxOrder == null || maxOrder == -1) ? 0 : maxOrder + 1;
            
            // Tạo image entity
            Image image = new Image();
            image.setDiaryEntry(diary);
            image.setImageUrl(imageUrl);
            image.setDisplayOrder(nextOrder);
            
            Image savedImage = imageRepository.save(image);
            
            System.out.println("💾 Saved to database: " + imageUrl);
            
            return convertToDTO(savedImage);
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
    
    @Override
    public ImageDTO addImageFromUrl(Long entryId, Long userId, String imageUrl, String caption) {
        // Kiểm tra diary có tồn tại không
        DiaryEntry diary = diaryEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diary entry not found with id: " + entryId));
        
        // ✅ FIX: Kiểm tra quyền - Xử lý cả trường hợp có và không có album
        if (diary.getAlbum() != null) {
            // Diary có album → check quyền qua album
            if (!diary.getAlbum().getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to add image to this diary");
            }
        } else {
            // Diary không có album → check quyền trực tiếp qua userId của diary
            if (!diary.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to add image to this diary");
            }
        }
        
        // Validate URL
        if (imageUrl == null || imageUrl.trim().isEmpty()) {
            throw new RuntimeException("Image URL is required");
        }
        
        // Lấy display order tiếp theo
        Integer maxOrder = imageRepository.findMaxDisplayOrder(entryId);
        int nextOrder = (maxOrder == null || maxOrder == -1) ? 0 : maxOrder + 1;
        
        // Tạo image
        Image image = new Image();
        image.setDiaryEntry(diary);
        image.setImageUrl(imageUrl);
        image.setCaption(caption);
        image.setDisplayOrder(nextOrder);
        
        Image savedImage = imageRepository.save(image);
        
        return convertToDTO(savedImage);
    }
    
    @Override
    public void deleteImage(Long imageId, Long userId) {
        // Tìm image
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
        
        // ✅ FIX: Kiểm tra quyền - Xử lý cả trường hợp có và không có album
        DiaryEntry diary = image.getDiaryEntry();
        if (diary.getAlbum() != null) {
            // Diary có album → check quyền qua album
            if (!diary.getAlbum().getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to delete this image");
            }
        } else {
            // Diary không có album → check quyền trực tiếp qua userId của diary
            if (!diary.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to delete this image");
            }
        }
        
        // Xóa
        imageRepository.delete(image);
    }
    
    @Override
    public void updateDisplayOrder(Long imageId, Long userId, Integer newOrder) {
        // Tìm image
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
        
        // ✅ FIX: Kiểm tra quyền - Xử lý cả trường hợp có và không có album
        DiaryEntry diary = image.getDiaryEntry();
        if (diary.getAlbum() != null) {
            // Diary có album → check quyền qua album
            if (!diary.getAlbum().getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to update this image");
            }
        } else {
            // Diary không có album → check quyền trực tiếp qua userId của diary
            if (!diary.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to update this image");
            }
        }
        
        // Cập nhật
        image.setDisplayOrder(newOrder);
        imageRepository.save(image);
    }
    
    @Override
    public ImageDTO updateCaption(Long imageId, Long userId, String caption) {
        // Tìm image
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));
        
        // ✅ FIX: Kiểm tra quyền - Xử lý cả trường hợp có và không có album
        DiaryEntry diary = image.getDiaryEntry();
        if (diary.getAlbum() != null) {
            // Diary có album → check quyền qua album
            if (!diary.getAlbum().getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to update this image");
            }
        } else {
            // Diary không có album → check quyền trực tiếp qua userId của diary
            if (!diary.getUserId().equals(userId)) {
                throw new RuntimeException("You don't have permission to update this image");
            }
        }
        
        // Cập nhật
        image.setCaption(caption);
        Image updatedImage = imageRepository.save(image);
        
        return convertToDTO(updatedImage);
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Convert Entity sang DTO
     */
    private ImageDTO convertToDTO(Image image) {
        ImageDTO dto = new ImageDTO();
        dto.setImageId(image.getImageId());
        dto.setImageUrl(image.getImageUrl());
        dto.setCaption(image.getCaption());
        dto.setDisplayOrder(image.getDisplayOrder());
        dto.setUploadedAt(image.getUploadedAt());
        return dto;
    }
}