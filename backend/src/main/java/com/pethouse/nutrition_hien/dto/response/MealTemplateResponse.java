package com.pethouse.nutrition_hien.dto.response;

import com.pethouse.nutrition_hien.entity.MealTemplate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealTemplateResponse {
    
    private Long id;
    
    private String name;
    
    private String species;
    
    private MealTemplate.MealType mealType;
    
    private BigDecimal defaultCalories;
    
    private String description;
    
    // Thông tin hiển thị
    private String displayInfo;
}