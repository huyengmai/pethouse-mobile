package com.pethouse.vetfinder_huyen.controller;

import com.pethouse.common.config.SecurityUtils;
import com.pethouse.vetfinder_huyen.dto.mapper.FavoriteMapper;
import com.pethouse.vetfinder_huyen.dto.mapper.VetClinicMapper;
import com.pethouse.vetfinder_huyen.dto.request.FavoriteRequest;
import com.pethouse.vetfinder_huyen.dto.response.FavoriteResponse;
import com.pethouse.vetfinder_huyen.dto.response.VetClinicResponse;
import com.pethouse.vetfinder_huyen.entity.Favorite;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@Tag(name = "Favorite", description = "API quản lý phòng khám yêu thích")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final FavoriteMapper favoriteMapper;
    private final VetClinicMapper vetClinicMapper;
    private final SecurityUtils securityUtils;

    @GetMapping
    @Operation(summary = "Lấy danh sách phòng khám yêu thích của user")
    public ResponseEntity<List<VetClinicResponse>> getUserFavorites() {
        Long userId = securityUtils.getCurrentUserId();
        List<VetClinic> clinics = favoriteService.getUserFavoritesClinics(userId);
        List<VetClinicResponse> responses = clinics.stream()
                .map(clinic -> vetClinicMapper.toResponseWithFavorite(clinic, true))
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    @Operation(summary = "Thêm phòng khám vào danh sách yêu thích")
    public ResponseEntity<FavoriteResponse> addFavorite(@RequestBody FavoriteRequest request) {
        Long userId = securityUtils.getCurrentUserId();
        try {
            Favorite favorite = favoriteService.addFavorite(userId, request.getVetClinicId());
            return ResponseEntity.ok(favoriteMapper.toResponse(favorite));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{vetClinicId}")
    @Operation(summary = "Xóa phòng khám khỏi danh sách yêu thích")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long vetClinicId) {
        Long userId = securityUtils.getCurrentUserId();
        favoriteService.removeFavorite(userId, vetClinicId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/toggle/{vetClinicId}")
    @Operation(summary = "Toggle yêu thích (thêm nếu chưa có, xóa nếu đã có)")
    public ResponseEntity<Map<String, Object>> toggleFavorite(@PathVariable Long vetClinicId) {
        Long userId = securityUtils.getCurrentUserId();
        boolean isFavorite = favoriteService.toggleFavorite(userId, vetClinicId);
        return ResponseEntity.ok(Map.of(
                "vetClinicId", vetClinicId,
                "isFavorite", isFavorite,
                "message", isFavorite ? "Added to favorites" : "Removed from favorites"
        ));
    }

    @GetMapping("/check/{vetClinicId}")
    @Operation(summary = "Kiểm tra phòng khám đã được yêu thích chưa")
    public ResponseEntity<Map<String, Boolean>> checkFavorite(@PathVariable Long vetClinicId) {
        Long userId = securityUtils.getCurrentUserId();
        boolean isFavorite = favoriteService.isFavorite(userId, vetClinicId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping("/count/{vetClinicId}")
    @Operation(summary = "Đếm số lượt yêu thích của phòng khám")
    public ResponseEntity<Map<String, Long>> getFavoriteCount(@PathVariable Long vetClinicId) {
        long count = favoriteService.getFavoriteCount(vetClinicId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
