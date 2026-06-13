package com.pethouse.nutrition_hien.dto.request;

import com.pethouse.nutrition_hien.entity.MealType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMealRequest {
    
    private MealType mealType;
    
    private LocalTime mealTime;
    
    private Boolean isCompleted;
}