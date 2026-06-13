package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionRecommendationResponse {
    
    private Long id;
    
    private Long nutritionRuleId;
    
    private BigDecimal recommendedCalories;
    
    private BigDecimal recommendedProtein;
    
    private BigDecimal recommendedFat;
    
    private BigDecimal recommendedCarbs;
    
    private String notes;
    
    // Thông tin rule liên quan
    private String species;
    
    private String breed;
    
    private String ageRange;
    
    private String weightRange;
    
    private String activityLevel;
}