package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.MealPlanResponse;
import com.pethouse.nutrition_hien.entity.MealPlan;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class MealPlanMapper {
    
    private final MealMapper mealMapper;
    
    public MealPlanMapper(MealMapper mealMapper) {
        this.mealMapper = mealMapper;
    }
    
    public MealPlanResponse toResponse(MealPlan mealPlan) {
        if (mealPlan == null) {
            return null;
        }
        
        long completedCount = mealPlan.getMeals().stream()
            .filter(meal -> Boolean.TRUE.equals(meal.getIsCompleted()))
            .count();
        
        return MealPlanResponse.builder()
            .id(mealPlan.getId())
            .petId(mealPlan.getPetId())
            .planDate(mealPlan.getPlanDate())
            .notes(mealPlan.getNotes())
            .totalCalories(mealPlan.getTotalCalories())
            .createdAt(mealPlan.getCreatedAt())
            .updatedAt(mealPlan.getUpdatedAt())
            .meals(mealPlan.getMeals().stream()
                .map(mealMapper::toResponse)
                .collect(Collectors.toList()))
            .totalMeals(mealPlan.getMeals().size())
            .completedMeals((int) completedCount)
            .build();
    }
    
    public MealPlanResponse toResponseWithoutMeals(MealPlan mealPlan) {
        if (mealPlan == null) {
            return null;
        }
        
        long completedCount = mealPlan.getMeals().stream()
            .filter(meal -> Boolean.TRUE.equals(meal.getIsCompleted()))
            .count();
        
        return MealPlanResponse.builder()
            .id(mealPlan.getId())
            .petId(mealPlan.getPetId())
            .planDate(mealPlan.getPlanDate())
            .notes(mealPlan.getNotes())
            .totalCalories(mealPlan.getTotalCalories())
            .createdAt(mealPlan.getCreatedAt())
            .updatedAt(mealPlan.getUpdatedAt())
            .totalMeals(mealPlan.getMeals().size())
            .completedMeals((int) completedCount)
            .build();
    }
}