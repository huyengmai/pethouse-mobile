package com.pethouse.diary_giang.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DiaryEntryDTO {
    
    private Long entryId;
    private Long albumId;
    private String albumTitle;
    private String title;
    private String content;
    private LocalDate entryDate;
    private List<ImageDTO> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public DiaryEntryDTO() {
    }
    
    // Getters and Setters
    public Long getEntryId() {
        return entryId;
    }
    
    public void setEntryId(Long entryId) {
        this.entryId = entryId;
    }
    
    public Long getAlbumId() {
        return albumId;
    }
    
    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
    }
    
    public String getAlbumTitle() {
        return albumTitle;
    }
    
    public void setAlbumTitle(String albumTitle) {
        this.albumTitle = albumTitle;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDate getEntryDate() {
        return entryDate;
    }
    
    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }
    
    public List<ImageDTO> getImages() {
        return images;
    }
    
    public void setImages(List<ImageDTO> images) {
        this.images = images;
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