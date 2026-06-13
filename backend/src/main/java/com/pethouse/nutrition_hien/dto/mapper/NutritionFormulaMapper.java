package com.pethouse.nutrition_hien.dto.mapper;

import com.pethouse.nutrition_hien.dto.response.NutritionFormulaResponse;
import com.pethouse.nutrition_hien.entity.NutritionFormula;
import org.springframework.stereotype.Component;

@Component
public class NutritionFormulaMapper {
    
    public NutritionFormulaResponse toResponse(NutritionFormula formula) {
        if (formula == null) {
            return null;
        }
        
        return NutritionFormulaResponse.builder()
            .id(formula.getId())
            .formulaName(formula.getFormulaName())
            .expression(formula.getExpression())
            .description(formula.getDescription())
            .displayInfo(formula.getDisplayInfo())
            .build();
    }
}