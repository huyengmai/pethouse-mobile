package com.pethouse.vetfinder_huyen.service;

import com.pethouse.vetfinder_huyen.entity.Favorite;
import com.pethouse.vetfinder_huyen.entity.VetClinic;

import java.util.List;

public interface FavoriteService {

    // Thêm vào favorites
    Favorite addFavorite(Long userId, Long vetClinicId);

    // Xóa khỏi favorites
    void removeFavorite(Long userId, Long vetClinicId);

    // Toggle favorite (thêm nếu chưa có, xóa nếu đã có)
    boolean toggleFavorite(Long userId, Long vetClinicId);

    // Lấy danh sách favorites của user
    List<Favorite> getUserFavorites(Long userId);

    // Lấy danh sách vet clinics mà user đã favorite
    List<VetClinic> getUserFavoritesClinics(Long userId);

    // Kiểm tra đã favorite chưa
    boolean isFavorite(Long userId, Long vetClinicId);

    // Đếm số lượt favorite của 1 clinic
    long getFavoriteCount(Long vetClinicId);
}
