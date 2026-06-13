package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateNutritionFormulaRequest {
    
    @NotBlank(message = "Formula name is required")
    private String formulaName;
    
    @NotBlank(message = "Expression is required")
    private String expression;
    
    private String description;
}