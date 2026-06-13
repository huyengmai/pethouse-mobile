package com.pethouse.nutrition_hien.service;

import com.pethouse.nutrition_hien.dto.request.*;
import com.pethouse.nutrition_hien.dto.response.*;

import java.time.LocalDate;
import java.util.List;

public interface NutritionService {
    
    // ========== MEAL PLAN ==========
    
    /**
     * Tạo meal plan mới cho pet
     */
    MealPlanResponse createMealPlan(CreateMealPlanRequest request);
    
    /**
     * Lấy meal plan theo ID
     */
    MealPlanResponse getMealPlanById(Long id);
    
    /**
     * Lấy meal plan của pet theo ngày
     */
    MealPlanResponse getMealPlanByPetAndDate(Long petId, LocalDate date);
    
    /**
     * Lấy tất cả meal plans của pet
     */
    List<MealPlanResponse> getAllMealPlansByPet(Long petId);
    
    /**
     * Lấy meal plans của pet trong khoảng thời gian
     */
    List<MealPlanResponse> getMealPlansByDateRange(Long petId, LocalDate startDate, LocalDate endDate);
    
    /**
     * Cập nhật meal plan
     */
    MealPlanResponse updateMealPlan(Long id, UpdateMealPlanRequest request);
    
    /**
     * Xóa meal plan
     */
    void deleteMealPlan(Long id);
    
    // ========== MEAL ==========
    
    /**
     * Thêm meal vào meal plan
     */
    MealResponse addMeal(AddMealRequest request);
    
    /**
     * Lấy meal theo ID
     */
    MealResponse getMealById(Long id);
    
    /**
     * Cập nhật meal
     */
    MealResponse updateMeal(Long id, UpdateMealRequest request);
    
    /**
     * Đánh dấu meal đã hoàn thành
     */
    MealResponse markMealAsCompleted(Long mealId);
    
    /**
     * Xóa meal
     */
    void deleteMeal(Long id);

    /**
     * Tạo meals từ template mặc định cho meal plan
     */
    List<MealResponse> createMealsFromTemplate(Long mealPlanId);

    // ========== FOOD ITEM ==========
    
    /**
     * Thêm food item vào meal
     */
    FoodItemResponse addFoodItem(AddFoodItemRequest request);
    
    /**
     * Lấy food item theo ID
     */
    FoodItemResponse getFoodItemById(Long id);
    
    /**
     * Xóa food item
     */
    void deleteFoodItem(Long id);
    
    // ========== NUTRITION SUMMARY ==========
    
    /**
     * Lấy tổng kết dinh dưỡng hàng ngày
     */
    DailyNutritionSummaryResponse getDailySummary(
        Long userId,
        Long petId,
        LocalDate date
    );

    /**
     * Lấy tổng kết dinh dưỡng tuần
     */
    WeeklySummaryResponse getWeeklySummary(Long petId, LocalDate weekStart);
    
    // ========== RECOMMENDATION ==========
    
    /**
     * Lấy khuyến nghị dinh dưỡng cho pet
     */
    NutritionRecommendationResponse getRecommendation(GetRecommendationRequest request);
    
    /**
     * Lấy khuyến nghị cho pet theo ID
     */
    NutritionRecommendationResponse getRecommendationForPet(Long petId);
    NutritionRecommendationResponse calculateRecommendation(
            GetRecommendationRequest request
    );

    NutritionRecommendationResponse getRecommendationByPet(Long petId);
}