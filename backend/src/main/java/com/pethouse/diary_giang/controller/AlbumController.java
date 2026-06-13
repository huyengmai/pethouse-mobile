package com.pethouse.diary_giang.controller;

import com.pethouse.diary_giang.dto.AlbumCreateDTO;
import com.pethouse.diary_giang.dto.AlbumDTO;
import com.pethouse.diary_giang.service.AlbumService;
import com.pethouse.auth_hoa.entity.User; // Import entity User của bạn
import org.springframework.security.core.Authentication; // Thêm import Security
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/albums")
public class AlbumController {
    
    private final AlbumService albumService;

    public AlbumController(AlbumService albumService) {
        this.albumService = albumService;
    }
    
    @GetMapping
    public ResponseEntity<List<AlbumDTO>> getAllAlbums(Authentication authentication) {
        // Lấy User từ principal đã được lưu vào SecurityContext bởi JwtAuthenticationFilter
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.ok(albumService.getAllAlbumsByUserId(userId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AlbumDTO> getAlbumById(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.ok(albumService.getAlbumById(id, userId));
    }

    @PostMapping
    public ResponseEntity<AlbumDTO> createAlbum(Authentication authentication, @RequestBody AlbumCreateDTO createDTO) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.status(HttpStatus.CREATED).body(albumService.createAlbum(userId, createDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumDTO> updateAlbum(@PathVariable Long id, Authentication authentication, @RequestBody AlbumCreateDTO updateDTO) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.ok(albumService.updateAlbum(id, userId, updateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        albumService.deleteAlbum(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<AlbumDTO>> searchAlbums(
            Authentication authentication,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        List<AlbumDTO> albums = albumService.searchAlbums(userId, keyword, startDate, endDate);
        return ResponseEntity.ok(albums);
    }
    
    @GetMapping("/with-diaries")
    public ResponseEntity<List<AlbumDTO>> getAlbumsWithDiaries(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.ok(albumService.getAlbumsWithDiaries(userId));
    }
    
    @GetMapping("/empty")
    public ResponseEntity<List<AlbumDTO>> getEmptyAlbums(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        return ResponseEntity.ok(albumService.getEmptyAlbums(userId));
    }
    
    // ==================== ✅ THÊM MỚI: COVER IMAGE ENDPOINTS ====================
    
    /**
     * Upload cover image cho album
     * POST /api/albums/{albumId}/cover
     */
    @PostMapping("/{albumId}/cover")
    public ResponseEntity<AlbumDTO> uploadCoverImage(
            @PathVariable Long albumId,
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        try {
            AlbumDTO updatedAlbum = albumService.uploadCoverImage(albumId, userId, file);
            return ResponseEntity.ok(updatedAlbum);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Xóa cover image của album
     * DELETE /api/albums/{albumId}/cover
     */
    @DeleteMapping("/{albumId}/cover")
    public ResponseEntity<AlbumDTO> deleteCoverImage(
            @PathVariable Long albumId,
            Authentication authentication) {
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        AlbumDTO updatedAlbum = albumService.deleteCoverImage(albumId, userId);
        return ResponseEntity.ok(updatedAlbum);
    }
}