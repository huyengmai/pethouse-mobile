package com.pethouse.nutrition_hien.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateNutritionRuleRequest {
    
    private String species;
    
    private String breed;
    
    private Integer minAgeMonth;
    
    private Integer maxAgeMonth;
    
    private BigDecimal minWeight;
    
    private BigDecimal maxWeight;
    
    private String activityLevel;
}