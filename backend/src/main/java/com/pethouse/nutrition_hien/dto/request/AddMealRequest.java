package com.pethouse.nutrition_hien.dto.request;

import com.pethouse.nutrition_hien.entity.MealType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddMealRequest {
    
    @NotNull(message = "Meal plan ID is required")
    private Long mealPlanId;
    
    @NotNull(message = "Meal type is required")
    private MealType mealType;
    
    private LocalTime mealTime;
    
    private Boolean isCompleted = false;
}