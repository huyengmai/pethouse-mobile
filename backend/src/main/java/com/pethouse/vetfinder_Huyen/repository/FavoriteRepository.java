package com.pethouse.vetfinder_huyen.repository;

import com.pethouse.vetfinder_huyen.entity.Favorite;
import com.pethouse.auth_hoa.entity.User;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // Lấy danh sách favorite của user
    List<Favorite> findByUser(User user);

    List<Favorite> findByUserId(Long userId);

    // Lấy danh sách vet clinic mà user đã favorite
    @Query("SELECT f.vetClinic FROM Favorite f WHERE f.user.id = :userId")
    List<VetClinic> findVetClinicsByUserId(@Param("userId") Long userId);

    // Kiểm tra user đã favorite clinic này chưa
    boolean existsByUserIdAndVetClinicId(Long userId, Long vetClinicId);

    // Tìm favorite theo user và clinic
    Optional<Favorite> findByUserIdAndVetClinicId(Long userId, Long vetClinicId);

    // Xóa favorite
    void deleteByUserIdAndVetClinicId(Long userId, Long vetClinicId);

    // Đếm số lượng favorite của 1 clinic
    long countByVetClinicId(Long vetClinicId);
}
