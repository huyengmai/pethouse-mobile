package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    
    // Tìm tất cả food items của một meal
    List<FoodItem> findByMealId(Long mealId);
    
    // Tìm food items theo tên (search)
    @Query("SELECT f FROM FoodItem f WHERE f.meal.id = :mealId " +
           "AND LOWER(f.foodName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<FoodItem> searchByFoodName(
        @Param("mealId") Long mealId,
        @Param("searchTerm") String searchTerm
    );
    
    // Đếm số food items trong một meal
    long countByMealId(Long mealId);
    
    // Tính tổng calories của tất cả food items trong một meal
    @Query("SELECT COALESCE(SUM(f.calories), 0) FROM FoodItem f " +
           "WHERE f.meal.id = :mealId")
    java.math.BigDecimal sumCaloriesByMealId(@Param("mealId") Long mealId);
    
    // Tính tổng protein của tất cả food items trong một meal
    @Query("SELECT COALESCE(SUM(f.protein), 0) FROM FoodItem f " +
           "WHERE f.meal.id = :mealId")
    java.math.BigDecimal sumProteinByMealId(@Param("mealId") Long mealId);
    
    // Tính tổng fat của tất cả food items trong một meal
    @Query("SELECT COALESCE(SUM(f.fat), 0) FROM FoodItem f " +
           "WHERE f.meal.id = :mealId")
    java.math.BigDecimal sumFatByMealId(@Param("mealId") Long mealId);
    
    // Tính tổng carbs của tất cả food items trong một meal
    @Query("SELECT COALESCE(SUM(f.carbs), 0) FROM FoodItem f " +
           "WHERE f.meal.id = :mealId")
    java.math.BigDecimal sumCarbsByMealId(@Param("mealId") Long mealId);
    
    // Tìm các food items phổ biến nhất (được sử dụng nhiều lần)
    @Query("SELECT f.foodName, COUNT(f) as usage_count FROM FoodItem f " +
           "GROUP BY f.foodName ORDER BY usage_count DESC")
    List<Object[]> findMostUsedFoodItems();
    
    // Tìm food items theo meal_plan_id (qua meal)
    @Query("SELECT f FROM FoodItem f WHERE f.meal.mealPlan.id = :mealPlanId")
    List<FoodItem> findByMealPlanId(@Param("mealPlanId") Long mealPlanId);
    
    // Xóa tất cả food items của một meal
    void deleteByMealId(Long mealId);
    
    // Tìm food items có calories cao nhất trong một meal
    @Query("SELECT f FROM FoodItem f WHERE f.meal.id = :mealId " +
           "ORDER BY f.calories DESC")
    List<FoodItem> findByMealIdOrderByCaloriesDesc(@Param("mealId") Long mealId);
}