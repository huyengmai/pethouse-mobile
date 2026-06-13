package com.pethouse.health_chi.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class PetHealthRecordDTO {
    private LocalDate visitDate;
    private String title;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String status;
    private LocalDate followUpDate;
    private String note;

    private List<String> attachmentUrls;
}