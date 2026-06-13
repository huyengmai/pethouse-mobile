package com.pethouse.vetfinder_huyen.dto.request;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NearbySearchRequest {

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Builder.Default
    private Double radiusKm = 10.0; // Mặc định 10km

    private String service; // Filter theo dịch vụ (optional)
}
