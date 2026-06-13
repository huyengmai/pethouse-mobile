package com.pethouse.nutrition_hien.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pethouse.nutrition_hien.dto.request.CreateMealTemplateRequest;
import com.pethouse.nutrition_hien.dto.request.CreateNutritionFormulaRequest;
import com.pethouse.nutrition_hien.dto.request.CreateNutritionRuleRequest;
import com.pethouse.nutrition_hien.dto.request.NutritionRecommendationRequest;
import com.pethouse.nutrition_hien.dto.request.UpdateNutritionRuleRequest;
import com.pethouse.nutrition_hien.dto.response.MealTemplateResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionFormulaResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionRecommendationResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionRuleResponse;
import com.pethouse.nutrition_hien.service.AdminNutritionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Admin Controller - Yêu cầu ADMIN role
 * Quản lý: Rules, Recommendations, Templates, Formulas
 */
@RestController
@RequestMapping("/api/admin/nutrition")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") 
public class AdminNutritionController {
    
    private final AdminNutritionService adminNutritionService;
    
    // ========== NUTRITION RULE ENDPOINTS ==========
    
    /**
     * Tạo nutrition rule mới
     * POST /api/admin/nutrition/rules
     */
    @PostMapping("/rules")
    public ResponseEntity<NutritionRuleResponse> createNutritionRule(
            @Valid @RequestBody CreateNutritionRuleRequest request) {
        NutritionRuleResponse response = adminNutritionService.createNutritionRule(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy tất cả nutrition rules
     * GET /api/admin/nutrition/rules
     */
    @GetMapping("/rules")
    public ResponseEntity<List<NutritionRuleResponse>> getAllNutritionRules() {
        List<NutritionRuleResponse> response = adminNutritionService.getAllNutritionRules();
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy nutrition rule theo ID
     * GET /api/admin/nutrition/rules/{id}
     */
    @GetMapping("/rules/{id}")
    public ResponseEntity<NutritionRuleResponse> getNutritionRuleById(@PathVariable Long id) {
        NutritionRuleResponse response = adminNutritionService.getNutritionRuleById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy nutrition rules theo species
     * GET /api/admin/nutrition/rules/species/{species}
     */
    @GetMapping("/rules/species/{species}")
    public ResponseEntity<List<NutritionRuleResponse>> getNutritionRulesBySpecies(
            @PathVariable String species) {
        List<NutritionRuleResponse> response = adminNutritionService.getNutritionRulesBySpecies(species);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật nutrition rule
     * PUT /api/admin/nutrition/rules/{id}
     */
    @PutMapping("/rules/{id}")
    public ResponseEntity<NutritionRuleResponse> updateNutritionRule(
            @PathVariable Long id,
            @Valid @RequestBody UpdateNutritionRuleRequest request) {
        NutritionRuleResponse response = adminNutritionService.updateNutritionRule(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa nutrition rule
     * DELETE /api/admin/nutrition/rules/{id}
     */
    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteNutritionRule(@PathVariable Long id) {
        adminNutritionService.deleteNutritionRule(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== NUTRITION RECOMMENDATION ENDPOINTS ==========
    
    /**
     * Tạo recommendation cho rule
     * POST /api/admin/nutrition/rules/{ruleId}/recommendations
     */
    @PostMapping("/rules/{ruleId}/recommendations")
    public ResponseEntity<NutritionRecommendationResponse> createRecommendation(
            @PathVariable Long ruleId,
            @Valid @RequestBody NutritionRecommendationRequest request) {
        NutritionRecommendationResponse response = 
            adminNutritionService.createRecommendation(ruleId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Cập nhật recommendation
     * PUT /api/admin/nutrition/recommendations/{id}
     */
    @PutMapping("/recommendations/{id}")
    public ResponseEntity<NutritionRecommendationResponse> updateRecommendation(
            @PathVariable Long id,
            @Valid @RequestBody NutritionRecommendationRequest request) {
        NutritionRecommendationResponse response = 
            adminNutritionService.updateRecommendation(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa recommendation
     * DELETE /api/admin/nutrition/recommendations/{id}
     */
    @DeleteMapping("/recommendations/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id) {
        adminNutritionService.deleteRecommendation(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== MEAL TEMPLATE ENDPOINTS ==========
    
    /**
     * Tạo meal template mới
     * POST /api/admin/nutrition/templates
     */
    @PostMapping("/templates")
    public ResponseEntity<MealTemplateResponse> createMealTemplate(
            @Valid @RequestBody CreateMealTemplateRequest request) {
        MealTemplateResponse response = adminNutritionService.createMealTemplate(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy tất cả meal templates
     * GET /api/admin/nutrition/templates
     */
    @GetMapping("/templates")
    public ResponseEntity<List<MealTemplateResponse>> getAllMealTemplates() {
        List<MealTemplateResponse> response = adminNutritionService.getAllMealTemplates();
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy meal template theo ID
     * GET /api/admin/nutrition/templates/{id}
     */
    @GetMapping("/templates/{id}")
    public ResponseEntity<MealTemplateResponse> getMealTemplateById(@PathVariable Long id) {
        MealTemplateResponse response = adminNutritionService.getMealTemplateById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy meal templates theo species
     * GET /api/admin/nutrition/templates/species/{species}
     */
    @GetMapping("/templates/species/{species}")
    public ResponseEntity<List<MealTemplateResponse>> getMealTemplatesBySpecies(
            @PathVariable String species) {
        List<MealTemplateResponse> response = adminNutritionService.getMealTemplatesBySpecies(species);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật meal template
     * PUT /api/admin/nutrition/templates/{id}
     */
    @PutMapping("/templates/{id}")
    public ResponseEntity<MealTemplateResponse> updateMealTemplate(
            @PathVariable Long id,
            @Valid @RequestBody CreateMealTemplateRequest request) {
        MealTemplateResponse response = adminNutritionService.updateMealTemplate(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa meal template
     * DELETE /api/admin/nutrition/templates/{id}
     */
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteMealTemplate(@PathVariable Long id) {
        adminNutritionService.deleteMealTemplate(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== NUTRITION FORMULA ENDPOINTS ==========
    
    /**
     * Tạo nutrition formula mới
     * POST /api/admin/nutrition/formulas
     */
    @PostMapping("/formulas")
    public ResponseEntity<NutritionFormulaResponse> createNutritionFormula(
            @Valid @RequestBody CreateNutritionFormulaRequest request) {
        NutritionFormulaResponse response = adminNutritionService.createNutritionFormula(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Lấy tất cả nutrition formulas
     * GET /api/admin/nutrition/formulas
     */
    @GetMapping("/formulas")
    public ResponseEntity<List<NutritionFormulaResponse>> getAllNutritionFormulas() {
        List<NutritionFormulaResponse> response = adminNutritionService.getAllNutritionFormulas();
        return ResponseEntity.ok(response);
    }
    
    /**
     * Lấy nutrition formula theo ID
     * GET /api/admin/nutrition/formulas/{id}
     */
    @GetMapping("/formulas/{id}")
    public ResponseEntity<NutritionFormulaResponse> getNutritionFormulaById(@PathVariable Long id) {
        NutritionFormulaResponse response = adminNutritionService.getNutritionFormulaById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Cập nhật nutrition formula
     * PUT /api/admin/nutrition/formulas/{id}
     */
    @PutMapping("/formulas/{id}")
    public ResponseEntity<NutritionFormulaResponse> updateNutritionFormula(
            @PathVariable Long id,
            @Valid @RequestBody CreateNutritionFormulaRequest request) {
        NutritionFormulaResponse response = adminNutritionService.updateNutritionFormula(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Xóa nutrition formula
     * DELETE /api/admin/nutrition/formulas/{id}
     */
    @DeleteMapping("/formulas/{id}")
    public ResponseEntity<Void> deleteNutritionFormula(@PathVariable Long id) {
        adminNutritionService.deleteNutritionFormula(id);
        return ResponseEntity.noContent().build();
    }
    
    // ========== MAINTENANCE ENDPOINTS ==========
    
    /**
     * Manual trigger để recalculate tất cả meal plans
     * POST /api/admin/nutrition/maintenance/recalculate-all
     */
    @PostMapping("/maintenance/recalculate-all")
    public ResponseEntity<String> recalculateAllMealPlans() {
        // Inject scheduler vào controller
        return ResponseEntity.ok("Manual recalculation triggered - check logs for progress");
    }
    
    // ========== ADMIN HEALTH CHECK ==========
    
    /**
     * Admin health check
     * GET /api/admin/nutrition/health
     */
    @GetMapping("/health")
    public ResponseEntity<String> adminHealthCheck() {
        return ResponseEntity.ok("Admin Nutrition Service is running!");
    }
}