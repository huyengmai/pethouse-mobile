package com.pethouse.nutrition_hien.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMealPlanRequest {
    
    private LocalDate planDate;
    
    private String notes;
}