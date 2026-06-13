package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanResponse {
    
    private Long id;
    
    private Long petId;
    
    private LocalDate planDate;
    
    private String notes;
    
    private BigDecimal totalCalories;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private List<MealResponse> meals;
    
    // Thông tin thống kê
    private Integer totalMeals;
    
    private Integer completedMeals;
}