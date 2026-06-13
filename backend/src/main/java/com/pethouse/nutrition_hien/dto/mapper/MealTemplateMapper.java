package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.MealTemplateResponse;
import com.pethouse.nutrition_hien.entity.MealTemplate;
import org.springframework.stereotype.Component;

@Component
public class MealTemplateMapper {
    
    public MealTemplateResponse toResponse(MealTemplate template) {
        if (template == null) {
            return null;
        }
        
        return MealTemplateResponse.builder()
            .id(template.getId())
            .name(template.getName())
            .species(template.getSpecies())
            .mealType(template.getMealType())
            .defaultCalories(template.getDefaultCalories())
            .description(template.getDescription())
            .displayInfo(template.getDisplayInfo())
            .build();
    }
}