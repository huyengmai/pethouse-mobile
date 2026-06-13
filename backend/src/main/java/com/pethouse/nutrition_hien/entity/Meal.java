package com.pethouse.nutrition_hien.entity;

import com.pethouse.nutrition_hien.entity.MealType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_plan_id", nullable = false)
    private MealPlan mealPlan;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type", length = 20)
    private MealType mealType;
    
    @Column(name = "meal_time")
    private LocalTime mealTime;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "total_calories", precision = 10, scale = 2)
    private BigDecimal totalCalories = BigDecimal.ZERO;
    
    @Column(name = "total_protein", precision = 10, scale = 2)
    private BigDecimal totalProtein = BigDecimal.ZERO;
    
    @Column(name = "total_fat", precision = 10, scale = 2)
    private BigDecimal totalFat = BigDecimal.ZERO;
    
    @Column(name = "total_carbs", precision = 10, scale = 2)
    private BigDecimal totalCarbs = BigDecimal.ZERO;
    
    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodItem> foodItems = new ArrayList<>();
    
    // Helper method để tính tổng dinh dưỡng từ các food items
    public void calculateNutritionTotals() {
        this.totalCalories = foodItems.stream()
            .map(FoodItem::getCalories)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        this.totalProtein = foodItems.stream()
            .map(FoodItem::getProtein)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        this.totalFat = foodItems.stream()
            .map(FoodItem::getFat)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        this.totalCarbs = foodItems.stream()
            .map(FoodItem::getCarbs)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    // Helper method để thêm food item
    public void addFoodItem(FoodItem foodItem) {
        foodItems.add(foodItem);
        foodItem.setMeal(this);
    }
    
    // Helper method để xóa food item
    public void removeFoodItem(FoodItem foodItem) {
        foodItems.remove(foodItem);
        foodItem.setMeal(null);
    }

}