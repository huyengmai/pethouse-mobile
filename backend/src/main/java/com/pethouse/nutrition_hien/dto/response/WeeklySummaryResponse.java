package com.pethouse.nutrition_hien.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklySummaryResponse {
    
    private Long petId;
    
    private LocalDate weekStart;
    
    private LocalDate weekEnd;
    
    // Trung bình hàng ngày
    private BigDecimal avgDailyCalories;
    
    private BigDecimal avgDailyProtein;
    
    private BigDecimal avgDailyFat;
    
    private BigDecimal avgDailyCarbs;
    
    // Tổng cả tuần
    private BigDecimal totalWeeklyCalories;
    
    private BigDecimal totalWeeklyProtein;
    
    private BigDecimal totalWeeklyFat;
    
    private BigDecimal totalWeeklyCarbs;
    
    // Thống kê
    private Integer totalMealsInWeek;
    
    private Integer completedMealsInWeek;
    
    private Integer daysWithData;
    
    // Chi tiết từng ngày
    private List<DailyNutritionSummaryResponse> dailySummaries;
    
    // Đánh giá chung
    private String weeklyStatus;
    
    private String weeklyMessage;
}