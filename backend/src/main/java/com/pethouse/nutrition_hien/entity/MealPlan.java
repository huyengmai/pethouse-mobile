package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.*;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meal_plan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "pet_id", nullable = false)
    private Long petId;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;  // Thêm trường này để tracking ownership
    
    @Column(name = "plan_date", nullable = false)
    private LocalDate planDate;
    
    @Column(name = "total_calories")
    private BigDecimal totalCalories = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @OneToMany(mappedBy = "mealPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Meal> meals = new ArrayList<>();
    
    @ManyToOne
    @JoinColumn(name = "recommendation_id")
    private NutritionRecommendation recommendation;

    /**
     * Calculate total calories from all meals
     */
    public void calculateTotalCalories() {
        this.totalCalories = meals.stream()
            .map(Meal::getTotalCalories)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Add a meal to this meal plan
     */
    public void addMeal(Meal meal) {
        meals.add(meal);
        meal.setMealPlan(this);
        calculateTotalCalories();
    }
    
    /**
     * Remove a meal from this meal plan
     */
    public void removeMeal(Meal meal) {
        meals.remove(meal);
        meal.setMealPlan(null);
        calculateTotalCalories();
    }
}