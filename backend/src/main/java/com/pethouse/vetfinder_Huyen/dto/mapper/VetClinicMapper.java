package com.pethouse.vetfinder_huyen.dto.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pethouse.vetfinder_huyen.dto.response.VetClinicResponse;
import com.pethouse.vetfinder_huyen.entity.VetClinic;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class VetClinicMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public VetClinicResponse toResponse(VetClinic entity) {
        if (entity == null) return null;

        return VetClinicResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .website(entity.getWebsite())
                .description(entity.getDescription())
                .latitude(entity.getLatitude())
                .longitude(entity.getLongitude())
                .openingHours(entity.getOpeningHours())
                .services(parseServices(entity.getServices()))
                .imageUrl(entity.getImageUrl())
                .averageRating(entity.getAverageRating())
                .totalReviews(entity.getTotalReviews())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public VetClinicResponse toResponseWithDistance(VetClinic entity, BigDecimal userLat, BigDecimal userLng) {
        VetClinicResponse response = toResponse(entity);
        if (response != null && userLat != null && userLng != null) {
            response.setDistance(calculateDistance(userLat, userLng, entity.getLatitude(), entity.getLongitude()));
            response.setGoogleMapsUrl(buildGoogleMapsUrl(entity.getName(), entity.getAddress()));
        }
        return response;
    }

    public VetClinicResponse toResponseWithFavorite(VetClinic entity, boolean isFavorite) {
        VetClinicResponse response = toResponse(entity);
        if (response != null) {
            response.setIsFavorite(isFavorite);
        }
        return response;
    }

    public List<VetClinicResponse> toResponseList(List<VetClinic> entities) {
        if (entities == null) return new ArrayList<>();
        return entities.stream().map(this::toResponse).toList();
    }

    // Parse JSON services string to List
    private List<String> parseServices(String servicesJson) {
        if (servicesJson == null || servicesJson.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(servicesJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    // Calculate distance using Haversine formula
    private Double calculateDistance(BigDecimal lat1, BigDecimal lng1, BigDecimal lat2, BigDecimal lng2) {
        final int R = 6371; // Earth radius in km

        double latDistance = Math.toRadians(lat2.doubleValue() - lat1.doubleValue());
        double lngDistance = Math.toRadians(lng2.doubleValue() - lng1.doubleValue());

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1.doubleValue())) * Math.cos(Math.toRadians(lat2.doubleValue()))
                * Math.sin(lngDistance / 2) * Math.sin(lngDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return Math.round(R * c * 100.0) / 100.0; // Round to 2 decimal places
    }

    // Build Google Maps search URL using clinic name and address for better accuracy
    private String buildGoogleMapsUrl(String clinicName, String clinicAddress) {
        try {
            String searchQuery = java.net.URLEncoder.encode(clinicName + ", " + clinicAddress, "UTF-8");
            return String.format("https://www.google.com/maps/search/?api=1&query=%s", searchQuery);
        } catch (Exception e) {
            return null;
        }
    }
}
