package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.NutritionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionRuleRepository extends JpaRepository<NutritionRule, Long> {

    // Lấy tất cả rules với recommendations (JOIN FETCH để tránh lazy loading issue)
    @Query("SELECT DISTINCT nr FROM NutritionRule nr LEFT JOIN FETCH nr.recommendations")
    List<NutritionRule> findAllWithRecommendations();

    // Tìm rules theo species
    List<NutritionRule> findBySpecies(String species);
    
    // Tìm rules theo species và breed
    List<NutritionRule> findBySpeciesAndBreed(String species, String breed);
    
    // Tìm rule phù hợp nhất cho pet
    @Query("SELECT nr FROM NutritionRule nr WHERE " +
           "(nr.species IS NULL OR nr.species = :species) AND " +
           "(nr.breed IS NULL OR nr.breed = '' OR nr.breed = :breed) AND " +
           "(nr.minAgeMonth IS NULL OR nr.minAgeMonth <= :ageMonth) AND " +
           "(nr.maxAgeMonth IS NULL OR nr.maxAgeMonth >= :ageMonth) AND " +
           "(nr.minWeight IS NULL OR nr.minWeight <= :weight) AND " +
           "(nr.maxWeight IS NULL OR nr.maxWeight >= :weight) AND " +
           "(nr.activityLevel IS NULL OR nr.activityLevel = '' OR nr.activityLevel = :activityLevel) " +
           "ORDER BY " +
           "CASE WHEN nr.breed IS NOT NULL AND nr.breed = :breed THEN 1 ELSE 2 END, " +
           "CASE WHEN nr.activityLevel IS NOT NULL AND nr.activityLevel = :activityLevel THEN 1 ELSE 2 END")
    List<NutritionRule> findMatchingRules(
        @Param("species") String species,
        @Param("breed") String breed,
        @Param("ageMonth") Integer ageMonth,
        @Param("weight") BigDecimal weight,
        @Param("activityLevel") String activityLevel
    );
    
    // Tìm rule phù hợp nhất (trả về 1 kết quả)
    @Query("SELECT nr FROM NutritionRule nr WHERE " +
           "(nr.species IS NULL OR nr.species = :species) AND " +
           "(nr.breed IS NULL OR nr.breed = '' OR nr.breed = :breed) AND " +
           "(nr.minAgeMonth IS NULL OR nr.minAgeMonth <= :ageMonth) AND " +
           "(nr.maxAgeMonth IS NULL OR nr.maxAgeMonth >= :ageMonth) AND " +
           "(nr.minWeight IS NULL OR nr.minWeight <= :weight) AND " +
           "(nr.maxWeight IS NULL OR nr.maxWeight >= :weight) AND " +
           "(nr.activityLevel IS NULL OR nr.activityLevel = '' OR nr.activityLevel = :activityLevel) " +
           "ORDER BY " +
           "CASE WHEN nr.breed IS NOT NULL AND nr.breed = :breed THEN 1 ELSE 2 END, " +
           "CASE WHEN nr.activityLevel IS NOT NULL AND nr.activityLevel = :activityLevel THEN 1 ELSE 2 END " +
           "LIMIT 1")
    Optional<NutritionRule> findBestMatchingRule(
        @Param("species") String species,
        @Param("breed") String breed,
        @Param("ageMonth") Integer ageMonth,
        @Param("weight") BigDecimal weight,
        @Param("activityLevel") String activityLevel
    );
    
    // Tìm rules theo activity level
    List<NutritionRule> findByActivityLevel(String activityLevel);
    
    // Tìm rules theo khoảng tuổi
    @Query("SELECT nr FROM NutritionRule nr WHERE " +
           "(nr.minAgeMonth IS NULL OR nr.minAgeMonth <= :ageMonth) AND " +
           "(nr.maxAgeMonth IS NULL OR nr.maxAgeMonth >= :ageMonth)")
    List<NutritionRule> findByAgeRange(@Param("ageMonth") Integer ageMonth);
    
    // Tìm rules theo khoảng cân nặng
    @Query("SELECT nr FROM NutritionRule nr WHERE " +
           "(nr.minWeight IS NULL OR nr.minWeight <= :weight) AND " +
           "(nr.maxWeight IS NULL OR nr.maxWeight >= :weight)")
    List<NutritionRule> findByWeightRange(@Param("weight") BigDecimal weight);
    
    // Kiểm tra xem có rule nào cho species và breed không
    boolean existsBySpeciesAndBreed(String species, String breed);
    
    // Đếm số rules theo species
    long countBySpecies(String species);
    
    // Tìm tất cả các species có trong rules
    @Query("SELECT DISTINCT nr.species FROM NutritionRule nr WHERE nr.species IS NOT NULL")
    List<String> findAllDistinctSpecies();
    
    // Tìm tất cả các breeds của một species
    @Query("SELECT DISTINCT nr.breed FROM NutritionRule nr " +
           "WHERE nr.species = :species AND nr.breed IS NOT NULL AND nr.breed != ''")
    List<String> findBreedsBySpecies(@Param("species") String species);
}