package com.pethouse.vetfinder_huyen.service.impl;

import com.pethouse.vetfinder_huyen.entity.Favorite;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.repository.FavoriteRepository;
import com.pethouse.auth_hoa.repo.UserRepository;
import com.pethouse.vetfinder_huyen.repository.VetClinicRepository;
import com.pethouse.vetfinder_huyen.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private static final String GUEST_USERNAME = "guest_user";

    private final FavoriteRepository favoriteRepository;
    private final VetClinicRepository vetClinicRepository;
    private final UserRepository userRepository;

    // Lấy guest user (đã được seed sẵn trong data.sql)
    private User getGuestUser() {
        return userRepository.findByUsername(GUEST_USERNAME).orElse(null);
    }

    @Override
    @Transactional
    public Favorite addFavorite(Long userId, Long vetClinicId) {
        User user = getGuestUser();
        if (user == null) {
            throw new IllegalStateException("Guest user not found. Please restart backend to seed data.");
        }

        // Kiểm tra đã favorite chưa
        if (favoriteRepository.existsByUserIdAndVetClinicId(user.getId(), vetClinicId)) {
            throw new IllegalStateException("Already added to favorites");
        }

        // Kiểm tra clinic có tồn tại không
        VetClinic vetClinic = vetClinicRepository.findById(vetClinicId)
                .orElseThrow(() -> new IllegalArgumentException("Vet clinic not found"));

        Favorite favorite = Favorite.builder()
                .user(user)
                .vetClinic(vetClinic)
                .build();

        return favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long vetClinicId) {
        User user = getGuestUser();
        if (user != null) {
            favoriteRepository.deleteByUserIdAndVetClinicId(user.getId(), vetClinicId);
        }
    }

    @Override
    @Transactional
    public boolean toggleFavorite(Long userId, Long vetClinicId) {
        User user = getGuestUser();
        if (user == null) {
            throw new IllegalStateException("Guest user not found. Please restart backend to seed data.");
        }

        if (favoriteRepository.existsByUserIdAndVetClinicId(user.getId(), vetClinicId)) {
            favoriteRepository.deleteByUserIdAndVetClinicId(user.getId(), vetClinicId);
            return false; // Đã xóa khỏi favorites
        } else {
            // Kiểm tra clinic có tồn tại không
            VetClinic vetClinic = vetClinicRepository.findById(vetClinicId)
                    .orElseThrow(() -> new IllegalArgumentException("Vet clinic not found"));

            Favorite favorite = Favorite.builder()
                    .user(user)
                    .vetClinic(vetClinic)
                    .build();
            favoriteRepository.save(favorite);
            return true; // Đã thêm vào favorites
        }
    }

    @Override
    public List<Favorite> getUserFavorites(Long userId) {
        User user = getGuestUser();
        if (user == null) return Collections.emptyList();
        return favoriteRepository.findByUserId(user.getId());
    }

    @Override
    public List<VetClinic> getUserFavoritesClinics(Long userId) {
        User user = getGuestUser();
        if (user == null) return Collections.emptyList();
        return favoriteRepository.findVetClinicsByUserId(user.getId());
    }

    @Override
    public boolean isFavorite(Long userId, Long vetClinicId) {
        User user = getGuestUser();
        if (user == null) return false;
        return favoriteRepository.existsByUserIdAndVetClinicId(user.getId(), vetClinicId);
    }

    @Override
    public long getFavoriteCount(Long vetClinicId) {
        return favoriteRepository.countByVetClinicId(vetClinicId);
    }
}
