package com.pethouse.diary_giang.dto;

import java.time.LocalDate;
import java.util.List;

public class DiaryCreateDTO {
    
    private Long albumId;
    private String title;
    private String content;
    private LocalDate entryDate;
    private List<String> imageUrls;  // Danh sách URL ảnh
    
    // Constructors
    public DiaryCreateDTO() {
    }
    
    // Getters and Setters
    public Long getAlbumId() {
        return albumId;
    }
    
    public void setAlbumId(Long albumId) {
        this.albumId = albumId;
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
    
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}