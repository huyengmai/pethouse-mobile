package com.pethouse.diary_giang.dto;

import java.time.LocalDate;

public class DiaryUpdateDTO {
    
    private String title;
    private String content;
    private LocalDate entryDate;
    
    // Constructors
    public DiaryUpdateDTO() {
    }
    
    // Getters and Setters
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
}