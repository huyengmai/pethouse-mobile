package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyNutritionSummaryResponse {
    
    private LocalDate date;
    
    private Long petId;
    
    // Tổng dinh dưỡng thực tế
    private BigDecimal actualCalories;
    
    private BigDecimal actualProtein;
    
    private BigDecimal actualFat;
    
    private BigDecimal actualCarbs;
    
    // Dinh dưỡng được khuyến nghị
    private BigDecimal recommendedCalories;
    
    private BigDecimal recommendedProtein;
    
    private BigDecimal recommendedFat;
    
    private BigDecimal recommendedCarbs;
    
    // Phần trăm đạt được
    private BigDecimal caloriesPercentage;
    
    private BigDecimal proteinPercentage;
    
    private BigDecimal fatPercentage;
    
    private BigDecimal carbsPercentage;
    
    // Số bữa ăn
    private Integer totalMeals;
    
    private Integer completedMeals;
    
    // Đánh giá
    private String status; // "GOOD", "LOW", "HIGH", "NO_DATA"
    
    private String message;
}