package com.pethouse.profile_hoa.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pethouse.auth_hoa.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity(name = "PetProfile")
@Table(name = "pets")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    private String species;
    private String breed;
    
    @Column(name = "birth_date")
    private java.time.LocalDate birthDate;
    
    private Double weight;
    private String gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user; // Khóa ngoại kết nối với User
}