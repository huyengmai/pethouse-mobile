package com.pethouse.nutrition_hien.repository;

import com.pethouse.nutrition_hien.entity.NutritionFormula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionFormulaRepository extends JpaRepository<NutritionFormula, Long> {
    
    // Tìm formula theo tên
    Optional<NutritionFormula> findByFormulaName(String formulaName);
    
    // Tìm formulas theo tên (like search)
    @Query("SELECT nf FROM NutritionFormula nf WHERE " +
           "LOWER(nf.formulaName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<NutritionFormula> searchByFormulaName(@Param("searchTerm") String searchTerm);
    
    // Search formulas theo description
    @Query("SELECT nf FROM NutritionFormula nf WHERE " +
           "LOWER(nf.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<NutritionFormula> searchByDescription(@Param("searchTerm") String searchTerm);
    
    // Search formulas theo tên hoặc description
    @Query("SELECT nf FROM NutritionFormula nf WHERE " +
           "LOWER(nf.formulaName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(nf.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<NutritionFormula> searchFormulas(@Param("searchTerm") String searchTerm);
    
    // Kiểm tra xem formula name đã tồn tại chưa
    boolean existsByFormulaName(String formulaName);
    
    // Đếm tất cả formulas
    @Query("SELECT COUNT(nf) FROM NutritionFormula nf")
    long countAllFormulas();
    
    // Tìm tất cả formulas có expression hợp lệ (không null và không rỗng)
    @Query("SELECT nf FROM NutritionFormula nf WHERE " +
           "nf.expression IS NOT NULL AND nf.expression != ''")
    List<NutritionFormula> findAllValidFormulas();
    
    // Tìm formulas được tạo gần đây nhất (nếu có timestamp - có thể thêm field sau)
    @Query("SELECT nf FROM NutritionFormula nf ORDER BY nf.id DESC")
    List<NutritionFormula> findRecentFormulas();
    
    // Tìm tất cả formula names (để validate hoặc dropdown)
    @Query("SELECT nf.formulaName FROM NutritionFormula nf ORDER BY nf.formulaName")
    List<String> findAllFormulaNames();
}