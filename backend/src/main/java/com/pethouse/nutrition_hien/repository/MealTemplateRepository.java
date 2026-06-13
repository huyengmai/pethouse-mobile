package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.MealTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealTemplateRepository extends JpaRepository<MealTemplate, Long> {
    
    // Tìm templates theo species
    List<MealTemplate> findBySpecies(String species);
    
    // Tìm templates theo meal_type
    List<MealTemplate> findByMealType(MealTemplate.MealType mealType);
    
    // Tìm templates theo species và meal_type
    List<MealTemplate> findBySpeciesAndMealType(String species, MealTemplate.MealType mealType);
    
    // Tìm templates phù hợp cho pet (species hoặc null)
    @Query("SELECT mt FROM MealTemplate mt WHERE " +
           "(mt.species IS NULL OR mt.species = '' OR mt.species = :species) " +
           "ORDER BY CASE WHEN mt.species = :species THEN 1 ELSE 2 END")
    List<MealTemplate> findTemplatesForSpecies(@Param("species") String species);
    
    // Tìm templates phù hợp cho pet và meal type
    @Query("SELECT mt FROM MealTemplate mt WHERE " +
           "(mt.species IS NULL OR mt.species = '' OR mt.species = :species) AND " +
           "(mt.mealType IS NULL OR mt.mealType = :mealType) " +
           "ORDER BY " +
           "CASE WHEN mt.species = :species THEN 1 ELSE 2 END, " +
           "CASE WHEN mt.mealType = :mealType THEN 1 ELSE 2 END")
    List<MealTemplate> findTemplatesForPetAndMealType(
        @Param("species") String species,
        @Param("mealType") MealTemplate.MealType mealType
    );
    
    // Tìm template theo tên
    Optional<MealTemplate> findByName(String name);
    
    // Tìm templates theo khoảng calories
    @Query("SELECT mt FROM MealTemplate mt WHERE " +
           "mt.defaultCalories BETWEEN :minCalories AND :maxCalories")
    List<MealTemplate> findByCaloriesRange(
        @Param("minCalories") BigDecimal minCalories,
        @Param("maxCalories") BigDecimal maxCalories
    );
    
    // Search templates theo tên hoặc description
    @Query("SELECT mt FROM MealTemplate mt WHERE " +
           "LOWER(mt.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mt.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<MealTemplate> searchTemplates(@Param("searchTerm") String searchTerm);
    
    // Tìm tất cả species có trong templates
    @Query("SELECT DISTINCT mt.species FROM MealTemplate mt " +
           "WHERE mt.species IS NOT NULL AND mt.species != ''")
    List<String> findAllDistinctSpecies();
    
    // Đếm templates theo species
    long countBySpecies(String species);
    
    // Đếm templates theo meal_type
    long countByMealType(MealTemplate.MealType mealType);
    
    // Tìm templates phổ biến nhất (có thể dùng cho thống kê)
    @Query("SELECT mt FROM MealTemplate mt ORDER BY mt.defaultCalories DESC")
    List<MealTemplate> findAllOrderByCaloriesDesc();
    
    // Kiểm tra xem template name đã tồn tại chưa
    boolean existsByName(String name);
    
    // Tìm template có calories cao nhất
    @Query("SELECT mt FROM MealTemplate mt ORDER BY mt.defaultCalories DESC LIMIT 1")
    Optional<MealTemplate> findHighestCaloriesTemplate();
    
    // Tìm template có calories thấp nhất
    @Query("SELECT mt FROM MealTemplate mt WHERE mt.defaultCalories > 0 " +
           "ORDER BY mt.defaultCalories ASC LIMIT 1")
    Optional<MealTemplate> findLowestCaloriesTemplate();
}