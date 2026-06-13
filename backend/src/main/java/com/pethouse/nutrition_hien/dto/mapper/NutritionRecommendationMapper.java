package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.NutritionRecommendationResponse;
import com.pethouse.nutrition_hien.entity.NutritionRecommendation;
import com.pethouse.nutrition_hien.entity.NutritionRule;
import org.springframework.stereotype.Component;

@Component
public class NutritionRecommendationMapper {
    
    public NutritionRecommendationResponse toResponse(NutritionRecommendation recommendation) {
        if (recommendation == null) {
            return null;
        }
        
        NutritionRule rule = recommendation.getNutritionRule();
        
        return NutritionRecommendationResponse.builder()
            .id(recommendation.getId())
            .nutritionRuleId(rule != null ? rule.getId() : null)
            .recommendedCalories(recommendation.getRecommendedCalories())
            .recommendedProtein(recommendation.getRecommendedProtein())
            .recommendedFat(recommendation.getRecommendedFat())
            .recommendedCarbs(recommendation.getRecommendedCarbs())
            .notes(recommendation.getNotes())
            .species(rule != null ? rule.getSpecies() : null)
            .breed(rule != null ? rule.getBreed() : null)
            .ageRange(rule != null ? rule.getAgeRangeDisplay() : null)
            .weightRange(rule != null ? rule.getWeightRangeDisplay() : null)
            .activityLevel(rule != null ? rule.getActivityLevel() : null)
            .build();
    }
}