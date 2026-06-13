package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNutritionRuleRequest {
    
    private String species;
    
    private String breed;
    
    @Min(value = 0, message = "Min age must be non-negative")
    private Integer minAgeMonth;
    
    @Min(value = 0, message = "Max age must be non-negative")
    private Integer maxAgeMonth;
    
    private BigDecimal minWeight;
    
    private BigDecimal maxWeight;
    
    private String activityLevel;
}