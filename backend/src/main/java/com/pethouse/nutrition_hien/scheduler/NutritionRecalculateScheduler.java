package com.pethouse.nutrition_hien.scheduler;

import com.pethouse.nutrition_hien.entity.MealPlan;
import com.pethouse.nutrition_hien.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduler để tự động recalculate nutrition totals
 * Chạy định kỳ để đảm bảo data consistency
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NutritionRecalculateScheduler {
    
    private final MealPlanRepository mealPlanRepository;
    

    //  * Recalculate tất cả meal plans hôm nay
    //  * Chạy mỗi 6 giờ
    //  * Cron: "0 0 */6 * * ?" = Chạy vào 00:00, 06:00, 12:00, 18:00 
    @Scheduled(cron = "0 0 */6 * * ?")
    @Transactional
    public void recalculateTodayMealPlans() {
        log.info("Starting recalculation of today's meal plans");
        
        try {
            LocalDate today = LocalDate.now();
            
            // Lấy tất cả meal plans của ngày hôm nay
            // Note: Cần thêm query method trong repository nếu chưa có
            List<MealPlan> todayPlans = mealPlanRepository.findAll().stream()
                .filter(plan -> plan.getPlanDate().equals(today))
                .toList();
            
            int recalculated = 0;
            for (MealPlan plan : todayPlans) {
                plan.calculateTotalCalories();
                mealPlanRepository.save(plan);
                recalculated++;
            }
            
            log.info("Successfully recalculated {} meal plans for today", recalculated);
            
        } catch (Exception e) {
            log.error("Error recalculating today's meal plans: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Cleanup meal plans cũ (quá 90 ngày)
     * Chạy mỗi ngày lúc 2:00 AM
     * Cron: "0 0 2 * * ?" = 02:00:00 mỗi ngày
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void cleanupOldMealPlans() {
        log.info("Starting cleanup of old meal plans");
        
        try {
            LocalDate cutoffDate = LocalDate.now().minusDays(90);
            
            // Sử dụng query method từ repository
            mealPlanRepository.deleteOldPlans(cutoffDate);
            
            log.info("Successfully cleaned up meal plans older than {}", cutoffDate);
            
        } catch (Exception e) {
            log.error("Error cleaning up old meal plans: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Recalculate meal plans của tuần này
     * Chạy mỗi Chủ Nhật lúc 23:00
     * Cron: "0 0 23 ? * SUN" = 23:00:00 mỗi Chủ Nhật
     */
    @Scheduled(cron = "0 0 23 ? * SUN")
    @Transactional
    public void recalculateWeeklyMealPlans() {
        log.info("Starting weekly recalculation of meal plans");
        
        try {
            LocalDate today = LocalDate.now();
            LocalDate weekStart = today.minusDays(6);
            
            List<MealPlan> weeklyPlans = mealPlanRepository.findAll().stream()
                .filter(plan -> !plan.getPlanDate().isBefore(weekStart) 
                             && !plan.getPlanDate().isAfter(today))
                .toList();
            
            int recalculated = 0;
            for (MealPlan plan : weeklyPlans) {
                // Recalculate meals first
                plan.getMeals().forEach(meal -> meal.calculateNutritionTotals());
                
                // Then recalculate meal plan
                plan.calculateTotalCalories();
                mealPlanRepository.save(plan);
                recalculated++;
            }
            
            log.info("Successfully recalculated {} meal plans for this week", recalculated);
            
        } catch (Exception e) {
            log.error("Error recalculating weekly meal plans: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Check và log thống kê meal plans
     * Chạy mỗi ngày lúc 8:00 AM
     * Cron: "0 0 8 * * ?" = 08:00:00 mỗi ngày
     */
    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional(readOnly = true)
    public void logDailyStatistics() {
        log.info("Generating daily meal plan statistics");
        
        try {
            LocalDate today = LocalDate.now();
            
            long totalPlans = mealPlanRepository.count();
            
            List<MealPlan> todayPlans = mealPlanRepository.findAll().stream()
                .filter(plan -> plan.getPlanDate().equals(today))
                .toList();
            
            long todayPlansCount = todayPlans.size();
            long completedMealsToday = todayPlans.stream()
                .flatMap(plan -> plan.getMeals().stream())
                .filter(meal -> Boolean.TRUE.equals(meal.getIsCompleted()))
                .count();
            
            log.info("Daily Statistics:");
            log.info("  - Total meal plans in system: {}", totalPlans);
            log.info("  - Meal plans for today: {}", todayPlansCount);
            log.info("  - Completed meals today: {}", completedMealsToday);
            
        } catch (Exception e) {
            log.error("Error generating daily statistics: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Manual trigger để recalculate tất cả meal plans
     * Dùng cho maintenance hoặc khi admin update rules
     */
    @Transactional
    public void recalculateAllMealPlans() {
        log.info("Starting manual recalculation of ALL meal plans");
        
        try {
            List<MealPlan> allPlans = mealPlanRepository.findAll();
            
            int recalculated = 0;
            for (MealPlan plan : allPlans) {
                // Recalculate meals
                plan.getMeals().forEach(meal -> meal.calculateNutritionTotals());
                
                // Recalculate meal plan
                plan.calculateTotalCalories();
                mealPlanRepository.save(plan);
                recalculated++;
            }
            
            log.info("Successfully recalculated {} meal plans", recalculated);
            
        } catch (Exception e) {
            log.error("Error recalculating all meal plans: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Validate data integrity
     * Chạy mỗi ngày lúc 3:00 AM
     * Cron: "0 0 3 * * ?" = 03:00:00 mỗi ngày
     */
    @Scheduled(cron = "0 0 3 * * ?")
    @Transactional(readOnly = true)
    public void validateDataIntegrity() {
        log.info("Starting data integrity validation");
        
        try {
            List<MealPlan> allPlans = mealPlanRepository.findAll();
            
            int inconsistentPlans = 0;
            for (MealPlan plan : allPlans) {
                // Tính tổng calories từ meals
                java.math.BigDecimal calculatedTotal = plan.getMeals().stream()
                    .map(meal -> meal.getTotalCalories())
                    .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
                
                // So sánh với total calories đã lưu
                if (plan.getTotalCalories().compareTo(calculatedTotal) != 0) {
                    log.warn("Inconsistent meal plan found: ID={}, Stored={}, Calculated={}", 
                        plan.getId(), plan.getTotalCalories(), calculatedTotal);
                    inconsistentPlans++;
                }
            }
            
            if (inconsistentPlans > 0) {
                log.warn("Found {} meal plans with inconsistent data", inconsistentPlans);
            } else {
                log.info("Data integrity check passed - all meal plans are consistent");
            }
            
        } catch (Exception e) {
            log.error("Error validating data integrity: {}", e.getMessage(), e);
        }
    }
}