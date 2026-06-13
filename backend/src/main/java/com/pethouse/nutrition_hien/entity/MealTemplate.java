package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "meal_template")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealTemplate {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", length = 100)
    private String name;
    
    @Column(name = "species", length = 50)
    private String species;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", length = 20)
    private MealType mealType;
    
    @Column(name = "default_calories", precision = 10, scale = 2)
    private BigDecimal defaultCalories;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Helper method để kiểm tra xem template có phù hợp với pet không
    public boolean isApplicableFor(String petSpecies, MealType targetMealType) {
        boolean speciesMatch = species == null || species.isEmpty() 
                             || species.equalsIgnoreCase(petSpecies);
        
        boolean mealTypeMatch = mealType == null 
                              || mealType.equals(targetMealType);
        
        return speciesMatch && mealTypeMatch;
    }
    
    // Helper method để format thông tin hiển thị
    public String getDisplayInfo() {
        return String.format("%s (%s) - %.0f cal", 
            name, mealType != null ? mealType : "Any", defaultCalories);
    }
    
    // Enum cho meal type (giống với Meal entity)
    public enum MealType {
        BREAKFAST,
        LUNCH,
        DINNER
    }
}