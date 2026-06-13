package com.pethouse.diary_giang.config;

import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

import jakarta.servlet.MultipartConfigElement;

/**
 * Configuration for file upload limits
 * Giải quyết lỗi: MaxUploadSizeExceededException
 */
@Configuration
public class FileUploadConfig {
    
    /**
     * Set max file upload size to 10MB
     */
    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        
        // Max size for a single file (10MB)
        factory.setMaxFileSize(DataSize.ofMegabytes(10));
        
        // Max size for entire request (50MB - cho trường hợp upload nhiều file)
        factory.setMaxRequestSize(DataSize.ofMegabytes(50));
        
        System.out.println("✅ FileUploadConfig loaded: maxFileSize=10MB, maxRequestSize=50MB");
        
        return factory.createMultipartConfig();
    }
    
    /**
     * MultipartResolver bean
     */
    @Bean
    public MultipartResolver multipartResolver() {
        StandardServletMultipartResolver resolver = new StandardServletMultipartResolver();
        System.out.println("✅ MultipartResolver configured");
        return resolver;
    }
}