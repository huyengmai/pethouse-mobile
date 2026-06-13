package com.pethouse.diary_giang.dto;

public class AlbumCreateDTO {
    
    private String title;
    private String description;
    private String coverImageUrl;
    
    // Constructors
    public AlbumCreateDTO() {
    }
    
    public AlbumCreateDTO(String title, String description) {
        this.title = title;
        this.description = description;
    }
    
    // Getters and Setters
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
}