package com.pethouse.nutrition_hien.service;

import com.pethouse.nutrition_hien.dto.request.*;
import com.pethouse.nutrition_hien.dto.response.*;

import java.util.List;

public interface AdminNutritionService {
    
    // ========== NUTRITION RULE ==========
    
    /**
     * Tạo nutrition rule mới
     */
    NutritionRuleResponse createNutritionRule(CreateNutritionRuleRequest request);
    
    /**
     * Lấy tất cả nutrition rules
     */
    List<NutritionRuleResponse> getAllNutritionRules();
    
    /**
     * Lấy nutrition rule theo ID
     */
    NutritionRuleResponse getNutritionRuleById(Long id);
    
    /**
     * Lấy nutrition rules theo species
     */
    List<NutritionRuleResponse> getNutritionRulesBySpecies(String species);
    
    /**
     * Cập nhật nutrition rule
     */
    NutritionRuleResponse updateNutritionRule(Long id, UpdateNutritionRuleRequest request);
    
    /**
     * Xóa nutrition rule
     */
    void deleteNutritionRule(Long id);
    
    // ========== NUTRITION RECOMMENDATION ==========
    
    /**
     * Tạo recommendation cho rule
     */
    NutritionRecommendationResponse createRecommendation(Long ruleId, NutritionRecommendationRequest request);
    
    /**
     * Cập nhật recommendation
     */
    NutritionRecommendationResponse updateRecommendation(Long id, NutritionRecommendationRequest request);
    
    /**
     * Xóa recommendation
     */
    void deleteRecommendation(Long id);
    
    // ========== MEAL TEMPLATE ==========
    
    /**
     * Tạo meal template mới
     */
    MealTemplateResponse createMealTemplate(CreateMealTemplateRequest request);
    
    /**
     * Lấy tất cả meal templates
     */
    List<MealTemplateResponse> getAllMealTemplates();
    
    /**
     * Lấy meal template theo ID
     */
    MealTemplateResponse getMealTemplateById(Long id);
    
    /**
     * Lấy meal templates theo species
     */
    List<MealTemplateResponse> getMealTemplatesBySpecies(String species);
    
    /**
     * Cập nhật meal template
     */
    MealTemplateResponse updateMealTemplate(Long id, CreateMealTemplateRequest request);
    
    /**
     * Xóa meal template
     */
    void deleteMealTemplate(Long id);
    
    // ========== NUTRITION FORMULA ==========
    
    /**
     * Tạo nutrition formula mới
     */
    NutritionFormulaResponse createNutritionFormula(CreateNutritionFormulaRequest request);
    
    /**
     * Lấy tất cả nutrition formulas
     */
    List<NutritionFormulaResponse> getAllNutritionFormulas();
    
    /**
     * Lấy nutrition formula theo ID
     */
    NutritionFormulaResponse getNutritionFormulaById(Long id);
    
    /**
     * Cập nhật nutrition formula
     */
    NutritionFormulaResponse updateNutritionFormula(Long id, CreateNutritionFormulaRequest request);
    
    /**
     * Xóa nutrition formula
     */
    void deleteNutritionFormula(Long id);
}