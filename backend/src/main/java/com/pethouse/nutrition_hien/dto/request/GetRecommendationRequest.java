package com.pethouse.nutrition_hien.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetRecommendationRequest {
    
    @NotNull(message = "Pet ID is required")
    private Long petId;
    
    @NotBlank(message = "Species is required")
    private String species;
    
    private String breed;
    
    @NotNull(message = "Age in months is required")
    @Min(value = 0, message = "Age must be non-negative")
    private Integer ageMonth;
    
    @NotNull(message = "Weight is required")
    @DecimalMin(value = "0.1", message = "Weight must be greater than 0")
    private BigDecimal weight;
    
    private String activityLevel = "MODERATE";
}