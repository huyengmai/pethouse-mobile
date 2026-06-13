package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "nutrition_recommendation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionRecommendation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nutrition_rule_id")
    private NutritionRule nutritionRule;
    
    @Column(name = "recommended_calories", precision = 10, scale = 2)
    private BigDecimal recommendedCalories;
    
    @Column(name = "recommended_protein", precision = 10, scale = 2)
    private BigDecimal recommendedProtein;
    
    @Column(name = "recommended_fat", precision = 10, scale = 2)
    private BigDecimal recommendedFat;
    
    @Column(name = "recommended_carbs", precision = 10, scale = 2)
    private BigDecimal recommendedCarbs;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Helper method để kiểm tra xem meal plan có đáp ứng recommendation không
    public boolean isMetBy(BigDecimal actualCalories, BigDecimal actualProtein, 
                          BigDecimal actualFat, BigDecimal actualCarbs) {
        
        // Cho phép sai số 10%
        BigDecimal tolerance = new BigDecimal("0.10");
        
        return isWithinRange(actualCalories, recommendedCalories, tolerance) &&
               isWithinRange(actualProtein, recommendedProtein, tolerance) &&
               isWithinRange(actualFat, recommendedFat, tolerance) &&
               isWithinRange(actualCarbs, recommendedCarbs, tolerance);
    }
    
    private boolean isWithinRange(BigDecimal actual, BigDecimal recommended, BigDecimal tolerance) {
        if (recommended == null || actual == null) {
            return true;
        }
        
        BigDecimal lowerBound = recommended.multiply(BigDecimal.ONE.subtract(tolerance));
        BigDecimal upperBound = recommended.multiply(BigDecimal.ONE.add(tolerance));
        
        return actual.compareTo(lowerBound) >= 0 && actual.compareTo(upperBound) <= 0;
    }
    
    // Helper method để tính phần trăm đạt được
    public BigDecimal getCaloriesPercentage(BigDecimal actualCalories) {
        if (recommendedCalories == null || recommendedCalories.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return actualCalories.divide(recommendedCalories, 4, BigDecimal.ROUND_HALF_UP)
                           .multiply(new BigDecimal("100"));
    }
    
    // Helper method để format thông tin hiển thị
    public String getSummary() {
        return String.format("Cal: %.0f | Protein: %.0fg | Fat: %.0fg | Carbs: %.0fg",
            recommendedCalories, recommendedProtein, recommendedFat, recommendedCarbs);
    }
}