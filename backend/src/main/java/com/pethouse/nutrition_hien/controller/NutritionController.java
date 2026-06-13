package com.pethouse.nutrition_hien.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pethouse.nutrition_hien.dto.request.AddFoodItemRequest;
import com.pethouse.nutrition_hien.dto.request.AddMealRequest;
import com.pethouse.nutrition_hien.dto.request.CreateMealPlanRequest;
import com.pethouse.nutrition_hien.dto.request.CreateMealsFromTemplateRequest;
import com.pethouse.nutrition_hien.dto.request.GetRecommendationRequest;
import com.pethouse.nutrition_hien.dto.request.UpdateMealPlanRequest;
import com.pethouse.nutrition_hien.dto.request.UpdateMealRequest;
import com.pethouse.nutrition_hien.dto.response.DailyNutritionSummaryResponse;
import com.pethouse.nutrition_hien.dto.response.FoodItemResponse;
import com.pethouse.nutrition_hien.dto.response.MealPlanResponse;
import com.pethouse.nutrition_hien.dto.response.MealResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionRecommendationResponse;
import com.pethouse.nutrition_hien.dto.response.WeeklySummaryResponse;
import com.pethouse.nutrition_hien.dto.response.MealTemplateResponse;
import com.pethouse.nutrition_hien.service.NutritionService;
import com.pethouse.nutrition_hien.repository.MealTemplateRepository;
import com.pethouse.nutrition_hien.entity.MealTemplate;
import com.pethouse.common.config.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class NutritionController {

    private final NutritionService nutritionService;
    private final SecurityUtils securityUtils;
    private final MealTemplateRepository mealTemplateRepository;
    
    // ========== MEAL PLAN ENDPOINTS ==========
    
    /**
     * Tạo meal plan mới
     * POST /api/nutrition/meal-plans
     */
    @PostMapping("/meal-plans")
    public ResponseEntity<MealPlanResponse> createMealPlan(
            @Valid @RequestBody CreateMealPlanRequest request) {
        MealPlanResponse response = nutritionService.createMealPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy meal plan theo ID
     * GET /api/nutrition/meal-plans/{id}
     */
    @GetMapping("/meal-plans/{id}")
    public ResponseEntity<MealPlanResponse> getMealPlanById(@PathVariable Long id) {
        MealPlanResponse response = nutritionService.getMealPlanById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy tất cả meal plans của pet
     * GET /api/nutrition/meal-plans/pet/{petId}
     */
    @GetMapping("/meal-plans/pet/{petId}")
    public ResponseEntity<List<MealPlanResponse>> getMealPlansByPet(@PathVariable Long petId) {
        List<MealPlanResponse> response = nutritionService.getAllMealPlansByPet(petId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy meal plan của pet theo ngày cụ thể
     * GET /api/nutrition/meal-plans/pet/{petId}/date/{date}
     */
    @GetMapping("/meal-plans/pet/{petId}/date/{date}")
    public ResponseEntity<MealPlanResponse> getMealPlanByPetAndDate(
            @PathVariable Long petId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        MealPlanResponse response = nutritionService.getMealPlanByPetAndDate(petId, date);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy meal plans của pet trong khoảng thời gian
     * GET /api/nutrition/meal-plans/pet/{petId}/range?start=2024-01-01&end=2024-01-31
     */
    @GetMapping("/meal-plans/pet/{petId}/range")
    public ResponseEntity<List<MealPlanResponse>> getMealPlansByDateRange(
            @PathVariable Long petId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<MealPlanResponse> response = nutritionService.getMealPlansByDateRange(petId, start, end);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật meal plan
     * PUT /api/nutrition/meal-plans/{id}
     */
    @PutMapping("/meal-plans/{id}")
    public ResponseEntity<MealPlanResponse> updateMealPlan(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMealPlanRequest request) {
        MealPlanResponse response = nutritionService.updateMealPlan(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa meal plan
     * DELETE /api/nutrition/meal-plans/{id}
     */
    @DeleteMapping("/meal-plans/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id) {
        nutritionService.deleteMealPlan(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== MEAL ENDPOINTS ==========
    
    /**
     * Thêm meal vào meal plan
     * POST /api/nutrition/meals
     */
    @PostMapping("/meals")
    public ResponseEntity<MealResponse> addMeal(@Valid @RequestBody AddMealRequest request) {
        MealResponse response = nutritionService.addMeal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy meal theo ID
     * GET /api/nutrition/meals/{id}
     */
    @GetMapping("/meals/{id}")
    public ResponseEntity<MealResponse> getMealById(@PathVariable Long id) {
        MealResponse response = nutritionService.getMealById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật meal
     * PUT /api/nutrition/meals/{id}
     */
    @PutMapping("/meals/{id}")
    public ResponseEntity<MealResponse> updateMeal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateMealRequest request) {
        MealResponse response = nutritionService.updateMeal(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Đánh dấu meal đã hoàn thành
     * PATCH /api/nutrition/meals/{id}/complete
     */
    @PatchMapping("/meals/{id}/complete")
    public ResponseEntity<MealResponse> markMealAsCompleted(@PathVariable Long id) {
        MealResponse response = nutritionService.markMealAsCompleted(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa meal
     * DELETE /api/nutrition/meals/{id}
     */
    @DeleteMapping("/meals/{id}")
    public ResponseEntity<Void> deleteMeal(@PathVariable Long id) {
        nutritionService.deleteMeal(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Tạo meals từ template mặc định cho meal plan
     * POST /api/nutrition/meals/from-template
     */
    @PostMapping("/meals/from-template")
    public ResponseEntity<List<MealResponse>> createMealsFromTemplate(
            @Valid @RequestBody CreateMealsFromTemplateRequest request) {
        List<MealResponse> response = nutritionService.createMealsFromTemplate(request.getMealPlanId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ========== FOOD ITEM ENDPOINTS ==========
    
    /**
     * Thêm food item vào meal
     * POST /api/nutrition/food-items
     */
    @PostMapping("/food-items")
    public ResponseEntity<FoodItemResponse> addFoodItem(
            @Valid @RequestBody AddFoodItemRequest request) {
        FoodItemResponse response = nutritionService.addFoodItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy food item theo ID
     * GET /api/nutrition/food-items/{id}
     */
    @GetMapping("/food-items/{id}")
    public ResponseEntity<FoodItemResponse> getFoodItemById(@PathVariable Long id) {
        FoodItemResponse response = nutritionService.getFoodItemById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa food item
     * DELETE /api/nutrition/food-items/{id}
     */
    @DeleteMapping("/food-items/{id}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable Long id) {
        nutritionService.deleteFoodItem(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== NUTRITION SUMMARY ENDPOINTS ==========
    
    /**
     * Lấy tổng kết dinh dưỡng hàng ngày
     * GET /api/nutrition/summary/daily/pet/{petId}?date=2024-01-01
     */
    @GetMapping("/summary/daily/pet/{petId}")
    public ResponseEntity<DailyNutritionSummaryResponse> getDailySummary(
        @PathVariable Long petId,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

    LocalDate targetDate = (date != null) ? date : LocalDate.now();

    Long currentUserId = securityUtils.getCurrentUserId();
    DailyNutritionSummaryResponse response =
            nutritionService.getDailySummary(currentUserId, petId, targetDate);

    return ResponseEntity.ok(response);
    }

    
    /**
     * Lấy tổng kết dinh dưỡng tuần
     * GET /api/nutrition/summary/weekly/pet/{petId}?weekStart=2024-01-01
     */
    @GetMapping("/summary/weekly/pet/{petId}")
    public ResponseEntity<WeeklySummaryResponse> getWeeklySummary(
            @PathVariable Long petId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) {
        
        LocalDate startDate = weekStart != null ? weekStart : LocalDate.now().minusDays(6);
        WeeklySummaryResponse response = nutritionService.getWeeklySummary(petId, startDate);
        return ResponseEntity.ok(response);
    }
    
    // ========== RECOMMENDATION ENDPOINTS ==========
    
    /**
     * Lấy khuyến nghị dinh dưỡng cho pet
     * POST /api/nutrition/recommendations/calculate
     */
    @PostMapping("/recommendations/calculate")
    public ResponseEntity<NutritionRecommendationResponse> getRecommendation(
            @Valid @RequestBody GetRecommendationRequest request) {
        NutritionRecommendationResponse response = nutritionService.getRecommendation(request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy khuyến nghị cho pet theo ID
     * GET /api/nutrition/recommendations/pet/{petId}
     */
    @GetMapping("/recommendations/pet/{petId}")
    public ResponseEntity<NutritionRecommendationResponse> getRecommendationForPet(
            @PathVariable Long petId) {
        NutritionRecommendationResponse response = nutritionService.getRecommendationForPet(petId);
        return ResponseEntity.ok(response);
    }
    
    // ========== TEMPLATES ENDPOINTS (User Read-Only) ==========

    /**
     * Lấy danh sách templates có sẵn
     * GET /api/nutrition/templates?species=DOG
     */
    @GetMapping("/templates")
    public ResponseEntity<List<MealTemplateResponse>> getAvailableTemplates(
            @RequestParam(required = false) String species) {
        List<MealTemplate> templates;

        if (species != null && !species.isEmpty()) {
            templates = mealTemplateRepository.findTemplatesForSpecies(species);
        } else {
            templates = mealTemplateRepository.findAll();
        }

        List<MealTemplateResponse> response = templates.stream()
                .map(this::toTemplateResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    /**
     * Lấy chi tiết template theo ID
     * GET /api/nutrition/templates/{id}
     */
    @GetMapping("/templates/{id}")
    public ResponseEntity<MealTemplateResponse> getTemplateById(@PathVariable Long id) {
        MealTemplate template = mealTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));
        return ResponseEntity.ok(toTemplateResponse(template));
    }

    private MealTemplateResponse toTemplateResponse(MealTemplate template) {
        return MealTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .species(template.getSpecies())
                .mealType(template.getMealType())
                .defaultCalories(template.getDefaultCalories())
                .description(template.getDescription())
                .displayInfo(String.format("%s - %s cal",
                        template.getName(),
                        template.getDefaultCalories()))
                .build();
    }

    // ========== HEALTH CHECK ==========

    /**
     * Health check endpoint
     * GET /api/nutrition/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Nutrition Service is running!");
    }
}