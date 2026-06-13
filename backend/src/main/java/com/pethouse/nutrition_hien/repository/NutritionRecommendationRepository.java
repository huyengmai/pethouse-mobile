package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.NutritionRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionRecommendationRepository extends JpaRepository<NutritionRecommendation, Long> {
    
    // Tìm recommendation theo nutrition_rule_id
    Optional<NutritionRecommendation> findByNutritionRuleId(Long nutritionRuleId);
    
    // Tìm tất cả recommendations của một nutrition rule
    List<NutritionRecommendation> findAllByNutritionRuleId(Long nutritionRuleId);
    
    // Tìm recommendation cho pet cụ thể (thông qua rule)
    @Query("SELECT nr FROM NutritionRecommendation nr " +
           "WHERE nr.nutritionRule.id IN " +
           "(SELECT r.id FROM NutritionRule r WHERE " +
           "(r.species IS NULL OR r.species = :species) AND " +
           "(r.breed IS NULL OR r.breed = '' OR r.breed = :breed) AND " +
           "(r.minAgeMonth IS NULL OR r.minAgeMonth <= :ageMonth) AND " +
           "(r.maxAgeMonth IS NULL OR r.maxAgeMonth >= :ageMonth) AND " +
           "(r.minWeight IS NULL OR r.minWeight <= :weight) AND " +
           "(r.maxWeight IS NULL OR r.maxWeight >= :weight) AND " +
           "(r.activityLevel IS NULL OR r.activityLevel = '' OR r.activityLevel = :activityLevel)) " +
           "ORDER BY " +
           "CASE WHEN nr.nutritionRule.breed IS NOT NULL AND nr.nutritionRule.breed = :breed THEN 1 ELSE 2 END")
    List<NutritionRecommendation> findRecommendationsForPet(
        @Param("species") String species,
        @Param("breed") String breed,
        @Param("ageMonth") Integer ageMonth,
        @Param("weight") BigDecimal weight,
        @Param("activityLevel") String activityLevel
    );
    
    // Tìm recommendation tốt nhất cho pet
    @Query("SELECT nr FROM NutritionRecommendation nr " +
           "WHERE nr.nutritionRule.id IN " +
           "(SELECT r.id FROM NutritionRule r WHERE " +
           "(r.species IS NULL OR r.species = :species) AND " +
           "(r.breed IS NULL OR r.breed = '' OR r.breed = :breed) AND " +
           "(r.minAgeMonth IS NULL OR r.minAgeMonth <= :ageMonth) AND " +
           "(r.maxAgeMonth IS NULL OR r.maxAgeMonth >= :ageMonth) AND " +
           "(r.minWeight IS NULL OR r.minWeight <= :weight) AND " +
           "(r.maxWeight IS NULL OR r.maxWeight >= :weight) AND " +
           "(r.activityLevel IS NULL OR r.activityLevel = '' OR r.activityLevel = :activityLevel)) " +
           "ORDER BY " +
           "CASE WHEN nr.nutritionRule.breed IS NOT NULL AND nr.nutritionRule.breed = :breed THEN 1 ELSE 2 END " +
           "LIMIT 1")
    Optional<NutritionRecommendation> findBestRecommendationForPet(
        @Param("species") String species,
        @Param("breed") String breed,
        @Param("ageMonth") Integer ageMonth,
        @Param("weight") BigDecimal weight,
        @Param("activityLevel") String activityLevel
    );
    
    // Tìm recommendations theo khoảng calories
    @Query("SELECT nr FROM NutritionRecommendation nr WHERE " +
           "nr.recommendedCalories BETWEEN :minCalories AND :maxCalories")
    List<NutritionRecommendation> findByCaloriesRange(
        @Param("minCalories") BigDecimal minCalories,
        @Param("maxCalories") BigDecimal maxCalories
    );
    
    // Kiểm tra xem rule đã có recommendation chưa
    boolean existsByNutritionRuleId(Long nutritionRuleId);
    
    // Xóa recommendation theo rule_id
    void deleteByNutritionRuleId(Long nutritionRuleId);
    
    // Tính trung bình calories được recommend
    @Query("SELECT AVG(nr.recommendedCalories) FROM NutritionRecommendation nr")
    BigDecimal findAverageRecommendedCalories();
    
    // Tìm recommendation có calories cao nhất
    @Query("SELECT nr FROM NutritionRecommendation nr " +
           "ORDER BY nr.recommendedCalories DESC LIMIT 1")
    Optional<NutritionRecommendation> findHighestCaloriesRecommendation();
    
    // Tìm recommendation có calories thấp nhất
    @Query("SELECT nr FROM NutritionRecommendation nr " +
           "WHERE nr.recommendedCalories > 0 " +
           "ORDER BY nr.recommendedCalories ASC LIMIT 1")
    Optional<NutritionRecommendation> findLowestCaloriesRecommendation();
    
    // Đếm số recommendations
    @Query("SELECT COUNT(nr) FROM NutritionRecommendation nr")
    long countAllRecommendations();
}