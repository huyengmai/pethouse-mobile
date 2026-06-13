package com.pethouse.diary_giang.dto;

import java.time.LocalDateTime;

public class AlbumDTO {
    
    private Long albumId;
    private Long userId;
    private String title;
    private String description;
    private String coverImageUrl;
    private Integer diaryCount;  // Số lượng diary entries
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public AlbumDTO() {
    }
    
    public AlbumDTO(Long albumId, Long userId, String title, String description, 
                    String coverImageUrl, LocalDateTime createdAt) {
        this.albumId = albumId;
        this.userId = userId;
        this.title = title;
        this.description = description;
        this.coverImageUrl = coverImageUrl;
        this.createdAt = createdAt;
    }
    
    // Getters and Setters
    public Long getAlbumId() {
        return albumId;
    }
    
    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCoverImageUrl() {
        return coverImageUrl;
    }
    
    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
    
    public Integer getDiaryCount() {
        return diaryCount;
    }
    
    public void setDiaryCount(Integer diaryCount) {
        this.diaryCount = diaryCount;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}