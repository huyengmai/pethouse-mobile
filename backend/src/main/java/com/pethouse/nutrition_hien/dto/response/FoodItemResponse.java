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
public class FoodItemResponse {
    
    private Long id;
    
    private Long mealId;
    
    private String foodName;
    
    private BigDecimal quantity;
    
    private String unit;
    
    private BigDecimal calories;
    
    private BigDecimal protein;
    
    private BigDecimal fat;
    
    private BigDecimal carbs;
}