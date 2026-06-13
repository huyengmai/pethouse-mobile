package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionRuleResponse {

    private Long id;

    private String species;

    private String breed;

    private Integer minAgeMonth;

    private Integer maxAgeMonth;

    private BigDecimal minWeight;

    private BigDecimal maxWeight;

    private String activityLevel;

    // Thông tin hiển thị
    private String ageRangeDisplay;

    private String weightRangeDisplay;

    // Recommendations của rule này
    private List<NutritionRecommendationResponse> recommendations;
}