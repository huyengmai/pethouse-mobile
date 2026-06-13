package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.Meal;
import com.pethouse.nutrition_hien.entity.MealType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    
    // Tìm tất cả meals theo meal_plan_id
    List<Meal> findByMealPlanId(Long mealPlanId);
    
    // Tìm meals theo meal_plan_id và sắp xếp theo meal_time
    List<Meal> findByMealPlanIdOrderByMealTimeAsc(Long mealPlanId);
    
    // Tìm meal theo meal_plan_id và meal_type
    Optional<Meal> findByMealPlanIdAndMealType(Long mealPlanId, MealType mealType);
    
    // Tìm tất cả meals chưa hoàn thành của một meal plan
    @Query("SELECT m FROM Meal m WHERE m.mealPlan.id = :mealPlanId " +
           "AND m.isCompleted = false ORDER BY m.mealTime ASC")
    List<Meal> findIncompleteMeals(@Param("mealPlanId") Long mealPlanId);
    
    // Tìm tất cả meals đã hoàn thành của một meal plan
    @Query("SELECT m FROM Meal m WHERE m.mealPlan.id = :mealPlanId " +
           "AND m.isCompleted = true ORDER BY m.mealTime ASC")
    List<Meal> findCompletedMeals(@Param("mealPlanId") Long mealPlanId);
    
    // Đếm số meals của một meal plan
    long countByMealPlanId(Long mealPlanId);
    
    // Đếm số meals đã hoàn thành
    @Query("SELECT COUNT(m) FROM Meal m WHERE m.mealPlan.id = :mealPlanId " +
           "AND m.isCompleted = true")
    long countCompletedMeals(@Param("mealPlanId") Long mealPlanId);
    
    // Tính tổng calories của tất cả meals trong một meal plan
    @Query("SELECT COALESCE(SUM(m.totalCalories), 0) FROM Meal m " +
           "WHERE m.mealPlan.id = :mealPlanId")
    java.math.BigDecimal sumTotalCaloriesByMealPlanId(@Param("mealPlanId") Long mealPlanId);
    
    // Tìm meals theo meal_type trong nhiều meal plans
    @Query("SELECT m FROM Meal m WHERE m.mealPlan.petId = :petId " +
           "AND m.mealType = :mealType ORDER BY m.mealPlan.planDate DESC")
    List<Meal> findByPetIdAndMealType(
        @Param("petId") Long petId,
        @Param("mealType") MealType mealType
    );
    
    // Xóa tất cả meals của một meal plan
    void deleteByMealPlanId(Long mealPlanId);
}