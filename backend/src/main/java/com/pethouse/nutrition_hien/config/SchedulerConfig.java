package com.pethouse.nutrition_hien.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration để enable Spring Scheduling
 * Cần có annotation này để @Scheduled hoạt động
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    
    // Spring sẽ tự động detect và chạy các method có @Scheduled
    // Không cần config thêm gì nếu dùng default settings
    
    /**
     * Nếu muốn customize thread pool:
     * 
     * @Bean
     * public TaskScheduler taskScheduler() {
     *     ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
     *     scheduler.setPoolSize(10);
     *     scheduler.setThreadNamePrefix("nutrition-scheduler-");
     *     scheduler.initialize();
     *     return scheduler;
     * }
     */
}