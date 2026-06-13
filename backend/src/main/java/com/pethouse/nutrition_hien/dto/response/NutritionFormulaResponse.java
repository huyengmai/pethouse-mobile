package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionFormulaResponse {
    
    private Long id;
    
    private String formulaName;
    
    private String expression;
    
    private String description;
    
    // Thông tin hiển thị
    private String displayInfo;
}