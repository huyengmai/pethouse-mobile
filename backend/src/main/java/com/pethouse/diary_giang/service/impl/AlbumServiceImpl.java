package com.pethouse.diary_giang.service.impl;

import com.pethouse.diary_giang.dto.AlbumCreateDTO;
import com.pethouse.diary_giang.dto.AlbumDTO;
import com.pethouse.diary_giang.entity.Album;
import com.pethouse.diary_giang.repository.AlbumRepository;
import com.pethouse.diary_giang.service.AlbumService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AlbumServiceImpl implements AlbumService {
    
    private final AlbumRepository albumRepository;
    
    // ✅ THÊM: Inject upload directory từ application.yml
    @Value("${file.upload-dir:uploads/diary/images/}")
    private String uploadDir;
    
    public AlbumServiceImpl(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AlbumDTO> getAllAlbumsByUserId(Long userId) {
        List<Album> albums = albumRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public AlbumDTO getAlbumById(Long albumId, Long userId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to access this album");
        }
        
        return convertToDTO(album);
    }
    
    @Override
    public AlbumDTO createAlbum(Long userId, AlbumCreateDTO createDTO) {
        if (createDTO.getTitle() == null || createDTO.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Album title is required");
        }
        
        Album album = new Album();
        album.setUserId(userId);
        album.setTitle(createDTO.getTitle());
        album.setDescription(createDTO.getDescription());
        album.setCoverImageUrl(createDTO.getCoverImageUrl());
        
        Album savedAlbum = albumRepository.save(album);
        
        return convertToDTO(savedAlbum);
    }
    
    @Override
    public AlbumDTO updateAlbum(Long albumId, Long userId, AlbumCreateDTO updateDTO) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this album");
        }
        
        if (updateDTO.getTitle() != null && !updateDTO.getTitle().trim().isEmpty()) {
            album.setTitle(updateDTO.getTitle());
        }
        
        album.setDescription(updateDTO.getDescription());
        
        if (updateDTO.getCoverImageUrl() != null) {
            album.setCoverImageUrl(updateDTO.getCoverImageUrl());
        }
        
        album.setUpdatedAt(LocalDateTime.now());
        
        Album updatedAlbum = albumRepository.save(album);
        
        return convertToDTO(updatedAlbum);
    }
    
    @Override
    public void deleteAlbum(Long albumId, Long userId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to delete this album");
        }
        
        // ✅ Xóa cover image file trước khi xóa album
        if (album.getCoverImageUrl() != null) {
            deleteFileFromDisk(album.getCoverImageUrl());
        }
        
        albumRepository.delete(album);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AlbumDTO> searchAlbums(Long userId, String keyword, LocalDate startDate, LocalDate endDate) {
        
        String searchKeyword = (keyword == null || keyword.trim().isEmpty()) 
                               ? "%" 
                               : "%" + keyword.trim().toLowerCase() + "%";

        LocalDateTime finalStartDateTime = (startDate != null) 
                ? startDate.atStartOfDay() 
                : LocalDateTime.of(1900, 1, 1, 0, 0);

        LocalDateTime finalEndDateTime = (endDate != null) 
                ? endDate.atTime(23, 59, 59) 
                : LocalDateTime.of(2100, 12, 31, 23, 59);

        List<Album> albums = albumRepository.searchAlbums(
                userId, 
                searchKeyword, 
                finalStartDateTime, 
                finalEndDateTime
        );

        return albums.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AlbumDTO> getAlbumsWithDiaries(Long userId) {
        List<Album> albums = albumRepository.findAlbumsWithDiaries(userId);
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<AlbumDTO> getEmptyAlbums(Long userId) {
        List<Album> albums = albumRepository.findEmptyAlbums(userId);
        return albums.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // ==================== ✅ THÊM MỚI: COVER IMAGE METHODS ====================
    
    /**
     * Upload cover image cho album
     */
    @Override
    public AlbumDTO uploadCoverImage(Long albumId, Long userId, MultipartFile file) throws IOException {
        // Validate
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this album");
        }
        
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }
        
        // Xóa ảnh cũ nếu có
        if (album.getCoverImageUrl() != null) {
            deleteFileFromDisk(album.getCoverImageUrl());
        }
        
        // Tạo tên file unique
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = "album_" + albumId + "_" + System.currentTimeMillis() + extension;
        
        // Tạo thư mục nếu chưa tồn tại
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Lưu file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Update database
        String imageUrl = "/uploads/diary/images/" + fileName;
        album.setCoverImageUrl(imageUrl);
        album.setUpdatedAt(LocalDateTime.now());
        
        Album savedAlbum = albumRepository.save(album);
        return convertToDTO(savedAlbum);
    }
    
    /**
     * Xóa cover image của album
     */
    @Override
    public AlbumDTO deleteCoverImage(Long albumId, Long userId) {
        Album album = albumRepository.findById(albumId)
                .orElseThrow(() -> new RuntimeException("Album not found with id: " + albumId));
        
        if (!album.getUserId().equals(userId)) {
            throw new RuntimeException("You don't have permission to update this album");
        }
        
        // Xóa file trên disk
        if (album.getCoverImageUrl() != null) {
            deleteFileFromDisk(album.getCoverImageUrl());
        }
        
        // Update database
        album.setCoverImageUrl(null);
        album.setUpdatedAt(LocalDateTime.now());
        
        Album savedAlbum = albumRepository.save(album);
        return convertToDTO(savedAlbum);
    }
    
    // ==================== HELPER METHODS ====================
    
    /**
     * Convert Entity sang DTO
     */
    private AlbumDTO convertToDTO(Album album) {
        AlbumDTO dto = new AlbumDTO();
        dto.setAlbumId(album.getAlbumId());
        dto.setUserId(album.getUserId());
        dto.setTitle(album.getTitle());
        dto.setDescription(album.getDescription());
        dto.setCoverImageUrl(album.getCoverImageUrl());
        dto.setCreatedAt(album.getCreatedAt());
        dto.setUpdatedAt(album.getUpdatedAt());
        
        if (album.getDiaryEntries() != null) {
            dto.setDiaryCount(album.getDiaryEntries().size());
        } else {
            dto.setDiaryCount(0);
        }
        
        return dto;
    }
    
    /**
     * ✅ THÊM: Helper method để xóa file trên disk
     */
    private void deleteFileFromDisk(String imageUrl) {
        try {
            // imageUrl format: /uploads/diary/images/abc.jpg
            String fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error nhưng không throw exception để không ảnh hưởng flow chính
            System.err.println("Failed to delete file: " + imageUrl + " - " + e.getMessage());
        }
    }
}