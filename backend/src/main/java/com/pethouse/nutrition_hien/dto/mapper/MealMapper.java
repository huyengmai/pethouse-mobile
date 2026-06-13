package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.MealResponse;
import com.pethouse.nutrition_hien.entity.Meal;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MealMapper {
    
    private final FoodItemMapper foodItemMapper;
    
    public MealMapper(FoodItemMapper foodItemMapper) {
        this.foodItemMapper = foodItemMapper;
    }
    
    public MealResponse toResponse(Meal meal) {
        if (meal == null) {
            return null;
        }
        
        return MealResponse.builder()
            .id(meal.getId())
            .mealPlanId(meal.getMealPlan() != null ? meal.getMealPlan().getId() : null)
            .mealType(meal.getMealType())
            .mealTime(meal.getMealTime())
            .isCompleted(meal.getIsCompleted())
            .totalCalories(meal.getTotalCalories())
            .totalProtein(meal.getTotalProtein())
            .totalFat(meal.getTotalFat())
            .totalCarbs(meal.getTotalCarbs())
            .foodItems(meal.getFoodItems().stream()
                .map(foodItemMapper::toResponse)
                .collect(Collectors.toList()))
            .totalFoodItems(meal.getFoodItems().size())
            .build();
    }
    
    public MealResponse toResponseWithoutFoodItems(Meal meal) {
        if (meal == null) {
            return null;
        }
        
        return MealResponse.builder()
            .id(meal.getId())
            .mealPlanId(meal.getMealPlan() != null ? meal.getMealPlan().getId() : null)
            .mealType(meal.getMealType())
            .mealTime(meal.getMealTime())
            .isCompleted(meal.getIsCompleted())
            .totalCalories(meal.getTotalCalories())
            .totalProtein(meal.getTotalProtein())
            .totalFat(meal.getTotalFat())
            .totalCarbs(meal.getTotalCarbs())
            .totalFoodItems(meal.getFoodItems().size())
            .build();
    }
}