package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.FoodItemResponse;
import com.pethouse.nutrition_hien.entity.FoodItem;
import org.springframework.stereotype.Component;

@Component
public class FoodItemMapper {
    
    public FoodItemResponse toResponse(FoodItem foodItem) {
        if (foodItem == null) {
            return null;
        }
        
        return FoodItemResponse.builder()
            .id(foodItem.getId())
            .mealId(foodItem.getMeal() != null ? foodItem.getMeal().getId() : null)
            .foodName(foodItem.getFoodName())
            .quantity(foodItem.getQuantity())
            .unit(foodItem.getUnit())
            .calories(foodItem.getCalories())
            .protein(foodItem.getProtein())
            .fat(foodItem.getFat())
            .carbs(foodItem.getCarbs())
            .build();
    }
}