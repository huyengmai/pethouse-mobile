package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    
    // Tìm meal plan theo pet_id và ngày cụ thể
    Optional<MealPlan> findByUserIdAndPetIdAndPlanDate(
            Long userId,
            Long petId,
            LocalDate planDate
    );
    
    // Tìm tất cả meal plans của pet
    List<MealPlan> findByPetIdOrderByPlanDateDesc(Long petId);
    
    // Tìm meal plans của pet trong khoảng thời gian
    @Query("SELECT mp FROM MealPlan mp WHERE mp.petId = :petId " +
           "AND mp.planDate BETWEEN :startDate AND :endDate " +
           "ORDER BY mp.planDate ASC")
    List<MealPlan> findByPetIdAndDateRange(
        @Param("petId") Long petId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Tìm meal plans của pet trong tuần hiện tại
    @Query("SELECT mp FROM MealPlan mp WHERE mp.petId = :petId " +
           "AND mp.planDate >= :weekStart AND mp.planDate <= :weekEnd " +
           "ORDER BY mp.planDate ASC")
    List<MealPlan> findWeeklyPlans(
        @Param("petId") Long petId,
        @Param("weekStart") LocalDate weekStart,
        @Param("weekEnd") LocalDate weekEnd
    );
    
    // Kiểm tra xem đã có meal plan cho pet vào ngày này chưa
    boolean existsByPetIdAndPlanDate(Long petId, LocalDate planDate);
    
    // Xóa meal plans cũ (quá 90 ngày)
    @Query("DELETE FROM MealPlan mp WHERE mp.planDate < :cutoffDate")
    void deleteOldPlans(@Param("cutoffDate") LocalDate cutoffDate);
    
    // Đếm số meal plans của pet
    long countByPetId(Long petId);
    
    // Tìm meal plans với tổng calories trong khoảng
    @Query("SELECT mp FROM MealPlan mp WHERE mp.petId = :petId " +
           "AND mp.totalCalories BETWEEN :minCalories AND :maxCalories " +
           "ORDER BY mp.planDate DESC")
    List<MealPlan> findByPetIdAndCaloriesRange(
        @Param("petId") Long petId,
        @Param("minCalories") java.math.BigDecimal minCalories,
        @Param("maxCalories") java.math.BigDecimal maxCalories
    );
}