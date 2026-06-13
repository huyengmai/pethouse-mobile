package com.pethouse.nutrition_hien.dto.response;

import com.pethouse.nutrition_hien.entity.MealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealResponse {
    
    private Long id;
    
    private Long mealPlanId;
    
    private MealType mealType;
    
    private LocalTime mealTime;
    
    private Boolean isCompleted;
    
    private BigDecimal totalCalories;
    
    private BigDecimal totalProtein;
    
    private BigDecimal totalFat;
    
    private BigDecimal totalCarbs;
    
    private List<FoodItemResponse> foodItems;
    
    // Thông tin thống kê
    private Integer totalFoodItems;
}