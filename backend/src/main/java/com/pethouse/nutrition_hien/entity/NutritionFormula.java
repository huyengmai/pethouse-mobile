package com.pethouse.nutrition_hien.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nutrition_formula")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionFormula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "formula_name", length = 100)
    private String formulaName;
    
    @Column(name = "expression", columnDefinition = "TEXT")
    private String expression;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    // Helper method để kiểm tra xem formula có hợp lệ không
    public boolean isValid() {
        return formulaName != null && !formulaName.isEmpty() 
            && expression != null && !expression.isEmpty();
    }
    
    // Helper method để format thông tin hiển thị
    public String getDisplayInfo() {
        return String.format("%s: %s", formulaName, 
            description != null ? description : "No description");
    }
    
    /**
     * Ví dụ expression có thể là:
     * - "weight * 30 + 70" (Công thức RER cho chó)
     * - "weight * 40" (Công thức cho mèo)
     * - "RER * activityFactor" (Công thức MER)
     * 
     * Lưu ý: Cần implement parser để evaluate expression này
     * trong NutritionServiceImpl
     */
}