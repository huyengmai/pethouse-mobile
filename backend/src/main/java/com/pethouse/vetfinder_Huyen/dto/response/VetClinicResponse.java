package com.pethouse.vetfinder_huyen.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetClinicResponse {

    private Long id;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String website;
    private String description;

    // Location
    private BigDecimal latitude;
    private BigDecimal longitude;

    // Parsed data
    private String openingHours;
    private List<String> services;

    private String imageUrl;
    private BigDecimal averageRating;
    private Integer totalReviews;

    // Calculated fields
    private Double distance; // km từ vị trí user (nếu có)
    private Boolean isFavorite; // user đã favorite chưa
    private String googleMapsUrl; // URL chỉ đường

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
