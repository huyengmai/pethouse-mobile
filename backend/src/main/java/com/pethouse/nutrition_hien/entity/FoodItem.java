package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "food_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id", nullable = false)
    private Meal meal;
    
    @Column(name = "food_name", nullable = false, length = 255)
    private String foodName;
    
    @Column(name = "quantity", precision = 10, scale = 2)
    private BigDecimal quantity;
    
    @Column(name = "unit", length = 50)
    private String unit;
    
    @Column(name = "calories", precision = 10, scale = 2)
    private BigDecimal calories = BigDecimal.ZERO;
    
    @Column(name = "protein", precision = 10, scale = 2)
    private BigDecimal protein = BigDecimal.ZERO;
    
    @Column(name = "fat", precision = 10, scale = 2)
    private BigDecimal fat = BigDecimal.ZERO;
    
    @Column(name = "carbs", precision = 10, scale = 2)
    private BigDecimal carbs = BigDecimal.ZERO;
    
    // Helper method để kiểm tra xem food item có đầy đủ thông tin dinh dưỡng không
    public boolean hasCompleteNutrition() {
        return calories != null && calories.compareTo(BigDecimal.ZERO) > 0;
    }
    
    // Helper method để format thông tin hiển thị
    public String getDisplayInfo() {
        return String.format("%s - %.2f%s (%.0f cal)", 
            foodName, quantity, unit, calories);
    }
}