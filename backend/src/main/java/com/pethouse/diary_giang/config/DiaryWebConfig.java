package com.pethouse.diary_giang.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class DiaryWebConfig implements WebMvcConfigurer {

    /**
     * Serve diary images from file system
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve diary images from /uploads/diary/** URLs
        registry.addResourceHandler("/uploads/diary/**")
                .addResourceLocations("file:uploads/diary/");
        
        System.out.println("📚 [Diary Module] Static resources: /uploads/diary/** → file:uploads/diary/");
    }
}