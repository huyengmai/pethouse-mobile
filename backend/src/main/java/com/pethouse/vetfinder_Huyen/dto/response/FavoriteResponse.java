package com.pethouse.vetfinder_huyen.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteResponse {

    private Long id;
    private Long userId;
    private VetClinicResponse vetClinic;
    private LocalDateTime createdAt;
}
