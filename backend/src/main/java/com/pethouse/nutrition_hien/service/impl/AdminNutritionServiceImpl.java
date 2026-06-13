package com.pethouse.nutrition_hien.service.impl;

import com.pethouse.nutrition_hien.dto.mapper.*;
import com.pethouse.nutrition_hien.dto.request.*;
import com.pethouse.nutrition_hien.dto.response.*;
import com.pethouse.nutrition_hien.entity.*;
import com.pethouse.nutrition_hien.repository.*;
import com.pethouse.nutrition_hien.service.AdminNutritionService;
import com.pethouse.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Admin Nutrition Service Implementation
 * Quyền ADMIN được check ở Controller level với @PreAuthorize("hasRole('ADMIN')")
 * Giống cách booking admin hoạt động
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AdminNutritionServiceImpl implements AdminNutritionService {

    private final NutritionRuleRepository ruleRepository;
    private final NutritionRecommendationRepository recommendationRepository;
    private final MealTemplateRepository templateRepository;
    private final NutritionFormulaRepository formulaRepository;

    private final NutritionRuleMapper ruleMapper;
    private final NutritionRecommendationMapper recommendationMapper;
    private final MealTemplateMapper templateMapper;
    private final NutritionFormulaMapper formulaMapper;

    // ========== NUTRITION RULE ==========

    @Override
    public NutritionRuleResponse createNutritionRule(CreateNutritionRuleRequest request) {
        
        // Validate age range
        if (request.getMinAgeMonth() != null && request.getMaxAgeMonth() != null) {
            if (request.getMinAgeMonth() > request.getMaxAgeMonth()) {
                throw new IllegalArgumentException("Min age cannot be greater than max age");
            }
        }
        
        // Validate weight range
        if (request.getMinWeight() != null && request.getMaxWeight() != null) {
            if (request.getMinWeight().compareTo(request.getMaxWeight()) > 0) {
                throw new IllegalArgumentException("Min weight cannot be greater than max weight");
            }
        }
        
        NutritionRule rule = new NutritionRule();
        rule.setSpecies(request.getSpecies());
        rule.setBreed(request.getBreed());
        rule.setMinAgeMonth(request.getMinAgeMonth());
        rule.setMaxAgeMonth(request.getMaxAgeMonth());
        rule.setMinWeight(request.getMinWeight());
        rule.setMaxWeight(request.getMaxWeight());
        rule.setActivityLevel(request.getActivityLevel());
NutritionRule saved = ruleRepository.save(rule);
        log.info("Admin created nutrition rule with id: {}", saved.getId());
        
        return ruleMapper.toResponse(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NutritionRuleResponse> getAllNutritionRules() {
        // Public read access - no need admin check
        // Use JOIN FETCH to load recommendations eagerly
        return ruleRepository.findAllWithRecommendations().stream()
            .map(ruleMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public NutritionRuleResponse getNutritionRuleById(Long id) {
        // Public read access - no need admin check
        NutritionRule rule = ruleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Nutrition rule not found with id: " + id));
        return ruleMapper.toResponse(rule);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NutritionRuleResponse> getNutritionRulesBySpecies(String species) {
        // Public read access - no need admin check
        return ruleRepository.findBySpecies(species).stream()
            .map(ruleMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public NutritionRuleResponse updateNutritionRule(Long id, UpdateNutritionRuleRequest request) {
        
        NutritionRule rule = ruleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Nutrition rule not found with id: " + id));
        
        if (request.getSpecies() != null) {
            rule.setSpecies(request.getSpecies());
        }
        if (request.getBreed() != null) {
            rule.setBreed(request.getBreed());
        }
        if (request.getMinAgeMonth() != null) {
            rule.setMinAgeMonth(request.getMinAgeMonth());
        }
        if (request.getMaxAgeMonth() != null) {
            rule.setMaxAgeMonth(request.getMaxAgeMonth());
        }
        if (request.getMinWeight() != null) {
            rule.setMinWeight(request.getMinWeight());
        }
        if (request.getMaxWeight() != null) {
            rule.setMaxWeight(request.getMaxWeight());
        }
        if (request.getActivityLevel() != null) {
            rule.setActivityLevel(request.getActivityLevel());
        }
        
        NutritionRule updated = ruleRepository.save(rule);
        log.info("Admin updated nutrition rule {}", id);
        
        return ruleMapper.toResponse(updated);
    }
    
    @Override
    public void deleteNutritionRule(Long id) {
        
        if (!ruleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Nutrition rule not found with id: " + id);
        }
        
        // Xóa recommendations liên quan trước
        recommendationRepository.deleteByNutritionRuleId(id);
        
        ruleRepository.deleteById(id);
log.info("Admin deleted nutrition rule {}", id);
    }
    
    // ========== NUTRITION RECOMMENDATION ==========
    
    @Override
    public NutritionRecommendationResponse createRecommendation(Long ruleId,
            NutritionRecommendationRequest request) {

        NutritionRule rule = ruleRepository.findById(ruleId)
            .orElseThrow(() -> new ResourceNotFoundException("Nutrition rule not found with id: " + ruleId));

        // Cho phép tạo nhiều recommendations cho 1 rule
        // Hoặc update nếu đã tồn tại
        NutritionRecommendation recommendation = recommendationRepository
            .findByNutritionRuleId(ruleId)
            .orElse(new NutritionRecommendation());

        recommendation.setNutritionRule(rule);
        recommendation.setRecommendedCalories(request.getRecommendedCalories());
        recommendation.setRecommendedProtein(request.getRecommendedProtein());
        recommendation.setRecommendedFat(request.getRecommendedFat());
        recommendation.setRecommendedCarbs(request.getRecommendedCarbs());
        recommendation.setNotes(request.getNotes());

        NutritionRecommendation saved = recommendationRepository.save(recommendation);
        log.info("Admin created/updated recommendation for rule {}", ruleId);

        return recommendationMapper.toResponse(saved);
    }
    
    @Override
    public NutritionRecommendationResponse updateRecommendation(Long id, 
            NutritionRecommendationRequest request) {
        
        NutritionRecommendation recommendation = recommendationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Recommendation not found with id: " + id));
        
        if (request.getRecommendedCalories() != null) {
            recommendation.setRecommendedCalories(request.getRecommendedCalories());
        }
        if (request.getRecommendedProtein() != null) {
            recommendation.setRecommendedProtein(request.getRecommendedProtein());
        }
        if (request.getRecommendedFat() != null) {
            recommendation.setRecommendedFat(request.getRecommendedFat());
        }
        if (request.getRecommendedCarbs() != null) {
            recommendation.setRecommendedCarbs(request.getRecommendedCarbs());
        }
        if (request.getNotes() != null) {
            recommendation.setNotes(request.getNotes());
        }
        
        NutritionRecommendation updated = recommendationRepository.save(recommendation);
        log.info("Admin updated recommendation {}", id);
        
        return recommendationMapper.toResponse(updated);
    }
    
    @Override
    public void deleteRecommendation(Long id) {
        
        if (!recommendationRepository.existsById(id)) {
throw new ResourceNotFoundException("Recommendation not found with id: " + id);
        }
        
        recommendationRepository.deleteById(id);
        log.info("Admin deleted recommendation {}", id);
    }
    
    // ========== MEAL TEMPLATE ==========
    
    @Override
    public MealTemplateResponse createMealTemplate(CreateMealTemplateRequest request) {
        
        // Kiểm tra tên template đã tồn tại chưa
        if (templateRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Template name already exists: " + request.getName());
        }
        
        MealTemplate template = new MealTemplate();
        template.setName(request.getName());
        template.setSpecies(request.getSpecies());
        template.setMealType(request.getMealType());
        template.setDefaultCalories(request.getDefaultCalories());
        template.setDescription(request.getDescription());
        
        MealTemplate saved = templateRepository.save(template);
        log.info("Admin created meal template: {}", request.getName());
        
        return templateMapper.toResponse(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MealTemplateResponse> getAllMealTemplates() {
        // Public read access - no need admin check
        return templateRepository.findAll().stream()
            .map(templateMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public MealTemplateResponse getMealTemplateById(Long id) {
        // Public read access - no need admin check
        MealTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal template not found with id: " + id));
        return templateMapper.toResponse(template);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MealTemplateResponse> getMealTemplatesBySpecies(String species) {
        // Public read access - no need admin check
        return templateRepository.findBySpecies(species).stream()
            .map(templateMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public MealTemplateResponse updateMealTemplate(Long id, CreateMealTemplateRequest request) {
        
        MealTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal template not found with id: " + id));
        
        // Kiểm tra tên mới có trùng với template khác không
        if (!template.getName().equals(request.getName()) && 
            templateRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Template name already exists: " + request.getName());
        }
        
        template.setName(request.getName());
        template.setSpecies(request.getSpecies());
template.setMealType(request.getMealType());
        template.setDefaultCalories(request.getDefaultCalories());
        template.setDescription(request.getDescription());
        
        MealTemplate updated = templateRepository.save(template);
        log.info("Admin updated meal template {}", id);
        
        return templateMapper.toResponse(updated);
    }
    
    @Override
    public void deleteMealTemplate(Long id) {
        
        if (!templateRepository.existsById(id)) {
            throw new ResourceNotFoundException("Meal template not found with id: " + id);
        }
        
        templateRepository.deleteById(id);
        log.info("Admin deleted meal template {}", id);
    }
    
    // ========== NUTRITION FORMULA ==========
    
    @Override
    public NutritionFormulaResponse createNutritionFormula(CreateNutritionFormulaRequest request) {
        
        // Kiểm tra tên formula đã tồn tại chưa
        if (formulaRepository.existsByFormulaName(request.getFormulaName())) {
            throw new IllegalArgumentException("Formula name already exists: " + request.getFormulaName());
        }
        
        NutritionFormula formula = new NutritionFormula();
        formula.setFormulaName(request.getFormulaName());
        formula.setExpression(request.getExpression());
        formula.setDescription(request.getDescription());
        
        NutritionFormula saved = formulaRepository.save(formula);
        log.info("Admin created nutrition formula: {}", request.getFormulaName());
        
        return formulaMapper.toResponse(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<NutritionFormulaResponse> getAllNutritionFormulas() {
        // Public read access - no need admin check
        return formulaRepository.findAll().stream()
            .map(formulaMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public NutritionFormulaResponse getNutritionFormulaById(Long id) {
        // Public read access - no need admin check
        NutritionFormula formula = formulaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Nutrition formula not found with id: " + id));
        return formulaMapper.toResponse(formula);
    }
    
    @Override
    public NutritionFormulaResponse updateNutritionFormula(Long id, CreateNutritionFormulaRequest request) {
        
        NutritionFormula formula = formulaRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Nutrition formula not found with id: " + id));
        
        // Kiểm tra tên mới có trùng với formula khác không
        if (!formula.getFormulaName().equals(request.getFormulaName()) && 
            formulaRepository.existsByFormulaName(request.getFormulaName())) {
throw new IllegalArgumentException("Formula name already exists: " + request.getFormulaName());
        }
        
        formula.setFormulaName(request.getFormulaName());
        formula.setExpression(request.getExpression());
        formula.setDescription(request.getDescription());
        
        NutritionFormula updated = formulaRepository.save(formula);
        log.info("Admin updated nutrition formula {}", id);
        
        return formulaMapper.toResponse(updated);
    }
    
    @Override
    public void deleteNutritionFormula(Long id) {
        
        if (!formulaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Nutrition formula not found with id: " + id);
        }
        
        formulaRepository.deleteById(id);
        log.info("Admin deleted nutrition formula {}", id);
    }
}