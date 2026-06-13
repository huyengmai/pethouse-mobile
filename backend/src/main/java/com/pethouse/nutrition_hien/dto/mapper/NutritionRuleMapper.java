package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.NutritionRuleResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionRecommendationResponse;
import com.pethouse.nutrition_hien.entity.NutritionRule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class NutritionRuleMapper {

    private final NutritionRecommendationMapper recommendationMapper;

    public NutritionRuleResponse toResponse(NutritionRule rule) {
        if (rule == null) {
            return null;
        }

        // Map recommendations
        List<NutritionRecommendationResponse> recommendationResponses = Collections.emptyList();
        if (rule.getRecommendations() != null && !rule.getRecommendations().isEmpty()) {
            recommendationResponses = rule.getRecommendations().stream()
                .map(recommendationMapper::toResponse)
                .collect(Collectors.toList());
        }

        return NutritionRuleResponse.builder()
            .id(rule.getId())
            .species(rule.getSpecies())
            .breed(rule.getBreed())
            .minAgeMonth(rule.getMinAgeMonth())
            .maxAgeMonth(rule.getMaxAgeMonth())
            .minWeight(rule.getMinWeight())
            .maxWeight(rule.getMaxWeight())
            .activityLevel(rule.getActivityLevel())
            .ageRangeDisplay(rule.getAgeRangeDisplay())
            .weightRangeDisplay(rule.getWeightRangeDisplay())
            .recommendations(recommendationResponses)
            .build();
    }
}