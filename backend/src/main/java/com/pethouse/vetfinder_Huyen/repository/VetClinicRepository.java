package com.pethouse.vetfinder_huyen.repository;

import com.pethouse.vetfinder_huyen.entity.VetClinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VetClinicRepository extends JpaRepository<VetClinic, Long> {

    // Tìm tất cả phòng khám đang hoạt động
    List<VetClinic> findByIsActiveTrue();

    // Tìm theo tên (LIKE)
    List<VetClinic> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    // Tìm theo địa chỉ (LIKE)
    List<VetClinic> findByAddressContainingIgnoreCaseAndIsActiveTrue(String address);

    // Tìm theo tên hoặc địa chỉ
    @Query("SELECT v FROM VetClinic v WHERE v.isActive = true AND " +
           "(LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(v.address) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<VetClinic> searchByKeyword(@Param("keyword") String keyword);

    // Geosearch: Tìm phòng khám trong bán kính (km) sử dụng công thức Haversine
    @Query(value = """
        SELECT * FROM (
            SELECT *, (
                6371 * acos(
                    cos(radians(:lat)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(latitude))
                )
            ) AS distance
            FROM vet_clinics
            WHERE is_active = true
        ) AS subquery
        WHERE distance <= :radius
        ORDER BY distance
        """, nativeQuery = true)
    List<VetClinic> findNearby(
        @Param("lat") BigDecimal latitude,
        @Param("lng") BigDecimal longitude,
        @Param("radius") double radiusKm
    );

    // Geosearch với filter theo service
    @Query(value = """
        SELECT * FROM (
            SELECT *, (
                6371 * acos(
                    cos(radians(:lat)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:lng)) +
                    sin(radians(:lat)) * sin(radians(latitude))
                )
            ) AS distance
            FROM vet_clinics
            WHERE is_active = true AND services LIKE CONCAT('%', :service, '%')
        ) AS subquery
        WHERE distance <= :radius
        ORDER BY distance
        """, nativeQuery = true)
    List<VetClinic> findNearbyWithService(
        @Param("lat") BigDecimal latitude,
        @Param("lng") BigDecimal longitude,
        @Param("radius") double radiusKm,
        @Param("service") String service
    );

    // Tìm theo dịch vụ
    @Query("SELECT v FROM VetClinic v WHERE v.isActive = true AND v.services LIKE CONCAT('%', :service, '%')")
    List<VetClinic> findByService(@Param("service") String service);

    // Sắp xếp theo rating
    List<VetClinic> findByIsActiveTrueOrderByAverageRatingDesc();
}
