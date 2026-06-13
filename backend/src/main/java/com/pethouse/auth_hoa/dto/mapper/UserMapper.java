package com.pethouse.auth_hoa.dto.mapper;

import com.pethouse.auth_hoa.dto.request.RegisterRequest;
import com.pethouse.auth_hoa.dto.response.UserResponse;
import com.pethouse.auth_hoa.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    
    UserResponse toResponse(User user);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "isActive", constant = "true")
    @Mapping(target = "password", ignore = true)
    User toEntity(RegisterRequest request);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget User user, RegisterRequest request);
}