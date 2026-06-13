package com.pethouse.vetfinder_huyen.controller;

import com.pethouse.vetfinder_huyen.dto.mapper.VetClinicMapper;
import com.pethouse.vetfinder_huyen.dto.request.NearbySearchRequest;
import com.pethouse.vetfinder_huyen.dto.response.VetClinicResponse;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import com.pethouse.vetfinder_huyen.service.VetClinicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/vet-clinics")
@RequiredArgsConstructor
@Tag(name = "Vet Clinic", description = "API tìm kiếm phòng khám thú y")
public class VetClinicController {

    private final VetClinicService vetClinicService;
    private final VetClinicMapper vetClinicMapper;

    @GetMapping
    @Operation(summary = "Lấy tất cả phòng khám")
    public ResponseEntity<List<VetClinicResponse>> getAllClinics() {
        List<VetClinic> clinics = vetClinicService.getAllClinics();
        return ResponseEntity.ok(vetClinicMapper.toResponseList(clinics));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin phòng khám theo ID")
    public ResponseEntity<VetClinicResponse> getClinicById(@PathVariable Long id) {
        return vetClinicService.getClinicById(id)
                .map(clinic -> ResponseEntity.ok(vetClinicMapper.toResponse(clinic)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @Operation(summary = "Tìm kiếm phòng khám theo từ khóa (tên, địa chỉ)")
    public ResponseEntity<List<VetClinicResponse>> searchByKeyword(@RequestParam String keyword) {
        List<VetClinic> clinics = vetClinicService.searchByKeyword(keyword);
        return ResponseEntity.ok(vetClinicMapper.toResponseList(clinics));
    }

    @GetMapping("/nearby")
    @Operation(summary = "Tìm phòng khám gần vị trí (Geosearch)")
    public ResponseEntity<List<VetClinicResponse>> findNearby(
            @RequestParam BigDecimal lat,
            @RequestParam BigDecimal lng,
            @RequestParam(defaultValue = "10") Double radius,
            @RequestParam(required = false) String service) {

        List<VetClinic> clinics;
        if (service != null && !service.isEmpty()) {
            clinics = vetClinicService.findNearbyClinicsWithService(lat, lng, radius, service);
        } else {
            clinics = vetClinicService.findNearbyClinics(lat, lng, radius);
        }

        // Map với distance và Google Maps URL
        List<VetClinicResponse> responses = clinics.stream()
                .map(clinic -> vetClinicMapper.toResponseWithDistance(clinic, lat, lng))
                .toList();

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/nearby")
    @Operation(summary = "Tìm phòng khám gần vị trí (POST request)")
    public ResponseEntity<List<VetClinicResponse>> findNearbyPost(@RequestBody NearbySearchRequest request) {
        List<VetClinic> clinics;
        if (request.getService() != null && !request.getService().isEmpty()) {
            clinics = vetClinicService.findNearbyClinicsWithService(
                    request.getLatitude(),
                    request.getLongitude(),
                    request.getRadiusKm(),
                    request.getService());
        } else {
            clinics = vetClinicService.findNearbyClinics(
                    request.getLatitude(),
                    request.getLongitude(),
                    request.getRadiusKm());
        }

        List<VetClinicResponse> responses = clinics.stream()
                .map(clinic -> vetClinicMapper.toResponseWithDistance(
                        clinic,
                        request.getLatitude(),
                        request.getLongitude()))
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/filter")
    @Operation(summary = "Lọc phòng khám theo dịch vụ")
    public ResponseEntity<List<VetClinicResponse>> filterByService(@RequestParam String service) {
        List<VetClinic> clinics = vetClinicService.filterByService(service);
        return ResponseEntity.ok(vetClinicMapper.toResponseList(clinics));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Lấy danh sách phòng khám theo rating cao nhất")
    public ResponseEntity<List<VetClinicResponse>> getTopRated() {
        List<VetClinic> clinics = vetClinicService.getTopRatedClinics();
        return ResponseEntity.ok(vetClinicMapper.toResponseList(clinics));
    }

    @GetMapping("/{id}/directions")
    @Operation(summary = "Lấy link Google Maps chỉ đường đến phòng khám")
    public ResponseEntity<String> getDirections(
            @PathVariable Long id,
            @RequestParam BigDecimal lat,
            @RequestParam BigDecimal lng) {
        String url = vetClinicService.getGoogleMapsDirectionUrl(lat, lng, id);
        if (url == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(url);
    }
}
