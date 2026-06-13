package com.pethouse.vetfinder_huyen.dto.mapper;

import com.pethouse.vetfinder_huyen.dto.response.FavoriteResponse;
import com.pethouse.vetfinder_huyen.entity.Favorite;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class FavoriteMapper {

    private final VetClinicMapper vetClinicMapper;

    public FavoriteResponse toResponse(Favorite entity) {
        if (entity == null) return null;

        return FavoriteResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .vetClinic(vetClinicMapper.toResponse(entity.getVetClinic()))
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public List<FavoriteResponse> toResponseList(List<Favorite> entities) {
        if (entities == null) return List.of();
        return entities.stream().map(this::toResponse).toList();
    }
}
