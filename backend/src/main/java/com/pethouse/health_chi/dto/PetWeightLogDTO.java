package com.pethouse.health_chi.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PetWeightLogDTO {
    private LocalDate measuredAt;
    private BigDecimal weight;
    private String note;
}