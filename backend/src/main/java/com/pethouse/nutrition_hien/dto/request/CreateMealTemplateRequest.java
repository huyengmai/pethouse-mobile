package com.pethouse.nutrition_hien.dto.request;

import com.pethouse.nutrition_hien.entity.MealTemplate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMealTemplateRequest {
    
    @NotBlank(message = "Template name is required")
    private String name;
    
    private String species;
    
    private MealTemplate.MealType mealType;
    
    @NotNull(message = "Default calories is required")
    @DecimalMin(value = "0", message = "Calories must be positive")
    private BigDecimal defaultCalories;
    
    private String description;
}