package com.pethouse.vetfinder_huyen.service.impl;

import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.repository.VetClinicRepository;
import com.pethouse.vetfinder_huyen.service.VetClinicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VetClinicServiceImpl implements VetClinicService {

    private final VetClinicRepository vetClinicRepository;

    @Override
    public List<VetClinic> getAllClinics() {
        return vetClinicRepository.findByIsActiveTrue();
    }

    @Override
    public Optional<VetClinic> getClinicById(Long id) {
        return vetClinicRepository.findById(id);
    }

    @Override
    public List<VetClinic> searchByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllClinics();
        }
        return vetClinicRepository.searchByKeyword(keyword.trim());
    }

    @Override
    public List<VetClinic> findNearbyClinics(BigDecimal latitude, BigDecimal longitude, double radiusKm) {
        return vetClinicRepository.findNearby(latitude, longitude, radiusKm);
    }

    @Override
    public List<VetClinic> findNearbyClinicsWithService(BigDecimal latitude, BigDecimal longitude, double radiusKm, String service) {
        return vetClinicRepository.findNearbyWithService(latitude, longitude, radiusKm, service);
    }

    @Override
    public List<VetClinic> filterByService(String service) {
        if (service == null || service.trim().isEmpty()) {
            return getAllClinics();
        }
        return vetClinicRepository.findByService(service.trim());
    }

    @Override
    public List<VetClinic> getTopRatedClinics() {
        return vetClinicRepository.findByIsActiveTrueOrderByAverageRatingDesc();
    }

    @Override
    public String getGoogleMapsDirectionUrl(BigDecimal userLat, BigDecimal userLng, Long clinicId) {
        Optional<VetClinic> clinicOpt = vetClinicRepository.findById(clinicId);
        if (clinicOpt.isEmpty()) {
            return null;
        }

        VetClinic clinic = clinicOpt.get();
        // Google Maps Search URL using clinic name and address for better accuracy
        try {
            String searchQuery = java.net.URLEncoder.encode(clinic.getName() + ", " + clinic.getAddress(), "UTF-8");
            return String.format("https://www.google.com/maps/search/?api=1&query=%s", searchQuery);
        } catch (Exception e) {
            return null;
        }
    }
}
