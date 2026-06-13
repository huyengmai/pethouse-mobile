package com.pethouse.common.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {

    private int status;
    private String message;
    private Object errors;
    private LocalDateTime timestamp;

    // Constructor KHỚP với GlobalExceptionHandler
    public ErrorResponse(String message, Object errors) {
        this.status = 400;
        this.message = message;
        this.errors = errors;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor đầy đủ (phòng khi dùng chỗ khác)
    public ErrorResponse(int status, String message, Object errors, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.errors = errors;
        this.timestamp = timestamp;
    }
}
