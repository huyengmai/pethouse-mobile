package com.pethouse.diary_giang.controller;

import com.pethouse.diary_giang.dto.ImageDTO;
import com.pethouse.diary_giang.service.ImageService;
import com.pethouse.auth_hoa.entity.User; // Import entity User của bạn
import org.springframework.security.core.Authentication; // Import Security Authentication
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    
    private final ImageService imageService;
    
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }
    
    /**
     * GET /api/images?entryId=1
     * Lấy tất cả ảnh trong diary entry
     */
    @GetMapping
    public ResponseEntity<List<ImageDTO>> getImagesByEntry(
            @RequestParam Long entryId) {
        List<ImageDTO> images = imageService.getImagesByEntryId(entryId);
        return ResponseEntity.ok(images);
    }
    
    /**
     * POST /api/images/upload?entryId=1
     * Form-data: file=<image file>
     * Lấy userId từ Authentication
     */
    @PostMapping("/upload")
    public ResponseEntity<ImageDTO> uploadImage(
            @RequestParam Long entryId,
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        ImageDTO image = imageService.uploadImage(entryId, userId, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(image);
    }
    
    /**
     * POST /api/images/from-url?entryId=1
     * Body: {
     *   "imageUrl": "https://example.com/image.jpg",
     *   "caption": "Mô tả ảnh"
     * }
     */
    @PostMapping("/from-url")
    public ResponseEntity<ImageDTO> addImageFromUrl(
            @RequestParam Long entryId,
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        String imageUrl = request.get("imageUrl");
        String caption = request.get("caption");
        
        ImageDTO image = imageService.addImageFromUrl(entryId, userId, imageUrl, caption);
        return ResponseEntity.status(HttpStatus.CREATED).body(image);
    }
    
    /**
     * DELETE /api/images/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long id,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        imageService.deleteImage(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * PATCH /api/images/{id}/order
     * Body: { "displayOrder": 5 }
     */
    @PatchMapping("/{id}/order")
    public ResponseEntity<Void> updateDisplayOrder(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody Map<String, Integer> request) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        Integer newOrder = request.get("displayOrder");
        imageService.updateDisplayOrder(id, userId, newOrder);
        return ResponseEntity.ok().build();
    }
    
    /**
     * PATCH /api/images/{id}/caption
     * Body: { "caption": "Caption mới" }
     */
    @PatchMapping("/{id}/caption")
    public ResponseEntity<ImageDTO> updateCaption(
            @PathVariable Long id,
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        
        String caption = request.get("caption");
        ImageDTO updatedImage = imageService.updateCaption(id, userId, caption);
        return ResponseEntity.ok(updatedImage);
    }
}