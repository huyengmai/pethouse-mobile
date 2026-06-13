package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddFoodItemRequest {
    
    @NotNull(message = "Meal ID is required")
    private Long mealId;
    
    @NotBlank(message = "Food name is required")
    private String foodName;
    
    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01", message = "Quantity must be greater than 0")
    private BigDecimal quantity;
    
    @NotBlank(message = "Unit is required")
    private String unit;
    
    @NotNull(message = "Calories is required")
    @DecimalMin(value = "0", message = "Calories must be positive")
    private BigDecimal calories;
    
    @DecimalMin(value = "0", message = "Protein must be positive")
    private BigDecimal protein = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Fat must be positive")
    private BigDecimal fat = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Carbs must be positive")
    private BigDecimal carbs = BigDecimal.ZERO;
}