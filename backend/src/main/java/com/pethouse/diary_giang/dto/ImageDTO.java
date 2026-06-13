package com.pethouse.diary_giang.dto;

import java.time.LocalDateTime;

public class ImageDTO {
    
    private Long imageId;
    private String imageUrl;
    private String caption;
    private Integer displayOrder;
    private LocalDateTime uploadedAt;
    
    // Constructors
    public ImageDTO() {
    }
    
    public ImageDTO(Long imageId, String imageUrl, Integer displayOrder) {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }
    
    // Getters and Setters
    public Long getImageId() {
        return imageId;
    }
    
    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public String getCaption() {
        return caption;
    }
    
    public void setCaption(String caption) {
        this.caption = caption;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
    
    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}