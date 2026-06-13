package com.pethouse.vetfinder_huyen.service;

import com.pethouse.vetfinder_huyen.entity.VetClinic;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface VetClinicService {

    // Lấy tất cả phòng khám
    List<VetClinic> getAllClinics();

    // Lấy phòng khám theo ID
    Optional<VetClinic> getClinicById(Long id);

    // Tìm kiếm theo keyword (tên hoặc địa chỉ)
    List<VetClinic> searchByKeyword(String keyword);

    // Geosearch: Tìm phòng khám gần vị trí
    List<VetClinic> findNearbyClinics(BigDecimal latitude, BigDecimal longitude, double radiusKm);

    // Geosearch + filter theo dịch vụ
    List<VetClinic> findNearbyClinicsWithService(BigDecimal latitude, BigDecimal longitude, double radiusKm, String service);

    // Lọc theo dịch vụ
    List<VetClinic> filterByService(String service);

    // Lấy danh sách theo rating cao nhất
    List<VetClinic> getTopRatedClinics();

    // Tạo Google Maps direction URL
    String getGoogleMapsDirectionUrl(BigDecimal userLat, BigDecimal userLng, Long clinicId);
}
