package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMealsFromTemplateRequest {

    @NotNull(message = "Meal plan ID is required")
    private Long mealPlanId;
}
