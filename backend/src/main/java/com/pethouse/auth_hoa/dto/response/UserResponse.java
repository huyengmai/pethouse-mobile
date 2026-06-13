// UserResponse.java
package com.pethouse.auth_hoa.dto.response;

import java.time.LocalDateTime;

import com.pethouse.auth_hoa.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private User.Role role;
    private LocalDateTime createdAt;
    private Boolean isActive;
}
