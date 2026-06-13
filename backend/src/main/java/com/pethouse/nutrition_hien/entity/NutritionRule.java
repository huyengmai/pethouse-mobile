package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "nutrition_rule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "species", length = 50)
    private String species;
    
    @Column(name = "breed", length = 100)
    private String breed;
    
    @Column(name = "min_age_month")
    private Integer minAgeMonth;
    
    @Column(name = "max_age_month")
    private Integer maxAgeMonth;
    
    @Column(name = "min_weight", precision = 5, scale = 2)
    private BigDecimal minWeight;
    
    @Column(name = "max_weight", precision = 5, scale = 2)
    private BigDecimal maxWeight;
    
    @Column(name = "activity_level", length = 20)
    private String activityLevel;
    
    @OneToMany(mappedBy = "nutritionRule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NutritionRecommendation> recommendations = new ArrayList<>();
    
    // Helper method để kiểm tra xem pet có phù hợp với rule này không
    public boolean matchesPet(String petSpecies, String petBreed, Integer ageMonth, 
                             BigDecimal weight, String petActivityLevel) {
        // Kiểm tra species
        if (species != null && !species.equalsIgnoreCase(petSpecies)) {
            return false;
        }
        
        // Kiểm tra breed (nếu có)
        if (breed != null && !breed.isEmpty() && !breed.equalsIgnoreCase(petBreed)) {
            return false;
        }
        
        // Kiểm tra tuổi
        if (minAgeMonth != null && ageMonth < minAgeMonth) {
            return false;
        }
        if (maxAgeMonth != null && ageMonth > maxAgeMonth) {
            return false;
        }
        
        // Kiểm tra cân nặng
        if (minWeight != null && weight.compareTo(minWeight) < 0) {
            return false;
        }
        if (maxWeight != null && weight.compareTo(maxWeight) > 0) {
            return false;
        }
        
        // Kiểm tra activity level
        if (activityLevel != null && !activityLevel.isEmpty() 
            && !activityLevel.equalsIgnoreCase(petActivityLevel)) {
            return false;
        }
        
        return true;
    }
    
    // Helper method để format range thông tin
    public String getAgeRangeDisplay() {
        if (minAgeMonth == null && maxAgeMonth == null) {
            return "All ages";
        }
        if (minAgeMonth == null) {
            return "Up to " + maxAgeMonth + " months";
        }
        if (maxAgeMonth == null) {
            return minAgeMonth + "+ months";
        }
        return minAgeMonth + "-" + maxAgeMonth + " months";
    }
    
    public String getWeightRangeDisplay() {
        if (minWeight == null && maxWeight == null) {
            return "All weights";
        }
        if (minWeight == null) {
            return "Up to " + maxWeight + " kg";
        }
        if (maxWeight == null) {
            return minWeight + "+ kg";
        }
        return minWeight + "-" + maxWeight + " kg";
    }
}