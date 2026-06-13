package com.pethouse.nutrition_hien.util;

import com.pethouse.nutrition_hien.entity.NutritionRule;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Utility class để match Pet với Nutrition Rules
 * Tách logic phức tạp ra khỏi Service layer
 */
@Component
public class RuleMatcher {
    
    /**
     * Tìm rule phù hợp nhất cho pet
     * Ưu tiên: breed > activity level > generic rules
     */
    public Optional<NutritionRule> findBestMatchingRule(
            List<NutritionRule> rules,
            String species,
            String breed,
            Integer ageMonth,
            BigDecimal weight,
            String activityLevel) {
        
        if (rules == null || rules.isEmpty()) {
            return Optional.empty();
        }
        
        // Filter matching rules
        List<NutritionRule> matchingRules = rules.stream()
            .filter(rule -> matchesRule(rule, species, breed, ageMonth, weight, activityLevel))
            .collect(Collectors.toList());
        
        if (matchingRules.isEmpty()) {
            return Optional.empty();
        }
        
        // Sort by priority (breed-specific first, then activity-specific)
        matchingRules.sort((r1, r2) -> {
            int breedScore1 = calculateBreedScore(r1, breed);
            int breedScore2 = calculateBreedScore(r2, breed);
            
            if (breedScore1 != breedScore2) {
                return Integer.compare(breedScore2, breedScore1); // Descending
            }
            
            int activityScore1 = calculateActivityScore(r1, activityLevel);
            int activityScore2 = calculateActivityScore(r2, activityLevel);
            
            return Integer.compare(activityScore2, activityScore1); // Descending
        });
        
        return Optional.of(matchingRules.get(0));
    }
    
    /**
     * Kiểm tra xem pet có match với rule không
     */
    public boolean matchesRule(
            NutritionRule rule,
            String species,
            String breed,
            Integer ageMonth,
            BigDecimal weight,
            String activityLevel) {
        
        // Check species
        if (!matchesSpecies(rule, species)) {
            return false;
        }
        
        // Check breed (optional)
        if (!matchesBreed(rule, breed)) {
            return false;
        }
        
        // Check age range
        if (!matchesAgeRange(rule, ageMonth)) {
            return false;
        }
        
        // Check weight range
        if (!matchesWeightRange(rule, weight)) {
            return false;
        }
        
        // Check activity level (optional)
        if (!matchesActivityLevel(rule, activityLevel)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check species match
     */
    private boolean matchesSpecies(NutritionRule rule, String species) {
        if (rule.getSpecies() == null || rule.getSpecies().isEmpty()) {
            return true; // Generic rule for all species
        }
        return rule.getSpecies().equalsIgnoreCase(species);
    }
    
    /**
     * Check breed match
     */
    private boolean matchesBreed(NutritionRule rule, String breed) {
        if (rule.getBreed() == null || rule.getBreed().isEmpty()) {
            return true; // Generic rule for all breeds
        }
        return rule.getBreed().equalsIgnoreCase(breed);
    }
    
    /**
     * Check age range match
     */
    private boolean matchesAgeRange(NutritionRule rule, Integer ageMonth) {
        if (ageMonth == null) {
            return false;
        }
        
        // Check min age
        if (rule.getMinAgeMonth() != null && ageMonth < rule.getMinAgeMonth()) {
            return false;
        }
        
        // Check max age
        if (rule.getMaxAgeMonth() != null && ageMonth > rule.getMaxAgeMonth()) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check weight range match
     */
    private boolean matchesWeightRange(NutritionRule rule, BigDecimal weight) {
        if (weight == null) {
            return false;
        }
        
        // Check min weight
        if (rule.getMinWeight() != null && weight.compareTo(rule.getMinWeight()) < 0) {
            return false;
        }
        
        // Check max weight
        if (rule.getMaxWeight() != null && weight.compareTo(rule.getMaxWeight()) > 0) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check activity level match
     */
    private boolean matchesActivityLevel(NutritionRule rule, String activityLevel) {
        if (rule.getActivityLevel() == null || rule.getActivityLevel().isEmpty()) {
            return true; // Generic rule for all activity levels
        }
        return rule.getActivityLevel().equalsIgnoreCase(activityLevel);
    }
    
    /**
     * Calculate breed specificity score
     * Higher score = more specific
     */
    private int calculateBreedScore(NutritionRule rule, String breed) {
        if (rule.getBreed() != null && !rule.getBreed().isEmpty() 
            && rule.getBreed().equalsIgnoreCase(breed)) {
            return 10; // Exact breed match
        }
        return 0; // Generic breed
    }
    
    /**
     * Calculate activity level specificity score
     * Higher score = more specific
     */
    private int calculateActivityScore(NutritionRule rule, String activityLevel) {
        if (rule.getActivityLevel() != null && !rule.getActivityLevel().isEmpty() 
            && rule.getActivityLevel().equalsIgnoreCase(activityLevel)) {
            return 5; // Exact activity match
        }
        return 0; // Generic activity level
    }
    
    /**
     * Filter rules by species only
     */
    public List<NutritionRule> filterBySpecies(List<NutritionRule> rules, String species) {
        return rules.stream()
            .filter(rule -> matchesSpecies(rule, species))
            .collect(Collectors.toList());
    }
    
    /**
     * Filter rules by age range
     */
    public List<NutritionRule> filterByAgeRange(List<NutritionRule> rules, Integer ageMonth) {
        return rules.stream()
            .filter(rule -> matchesAgeRange(rule, ageMonth))
            .collect(Collectors.toList());
    }
    
    /**
     * Filter rules by weight range
     */
    public List<NutritionRule> filterByWeightRange(List<NutritionRule> rules, BigDecimal weight) {
        return rules.stream()
            .filter(rule -> matchesWeightRange(rule, weight))
            .collect(Collectors.toList());
    }
    
    /**
     * Get match quality score (0-100)
     * Used for debugging and logging
     */
    public int getMatchQualityScore(
            NutritionRule rule,
            String species,
            String breed,
            Integer ageMonth,
            BigDecimal weight,
            String activityLevel) {
        
        if (!matchesRule(rule, species, breed, ageMonth, weight, activityLevel)) {
            return 0;
        }
        
        int score = 50; // Base score for matching
        
        // Add points for specificity
        if (rule.getBreed() != null && rule.getBreed().equalsIgnoreCase(breed)) {
            score += 25;
        }
        
        if (rule.getActivityLevel() != null && rule.getActivityLevel().equalsIgnoreCase(activityLevel)) {
            score += 15;
        }
        
        if (rule.getMinAgeMonth() != null || rule.getMaxAgeMonth() != null) {
            score += 5;
        }
        
        if (rule.getMinWeight() != null || rule.getMaxWeight() != null) {
            score += 5;
        }
        
        return Math.min(score, 100);
    }
}