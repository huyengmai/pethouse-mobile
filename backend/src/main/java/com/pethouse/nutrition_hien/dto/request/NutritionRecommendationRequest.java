package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionRecommendationRequest {
    
    @NotNull(message = "Recommended calories is required")
    @DecimalMin(value = "0", message = "Calories must be positive")
    private BigDecimal recommendedCalories;
    
    @DecimalMin(value = "0", message = "Protein must be positive")
    private BigDecimal recommendedProtein = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Fat must be positive")
    private BigDecimal recommendedFat = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Carbs must be positive")
    private BigDecimal recommendedCarbs = BigDecimal.ZERO;
    
    private String notes;
}