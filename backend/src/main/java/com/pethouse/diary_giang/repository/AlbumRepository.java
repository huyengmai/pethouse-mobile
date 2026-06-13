package com.pethouse.diary_giang.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pethouse.diary_giang.entity.Album;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    
    // ================== BASIC QUERIES (JPA tự sinh) ==================
    
    /**
     * Tìm tất cả album của 1 user
     */
    List<Album> findByUserId(Long userId);
    
    /**
     * Tìm album theo userId và sắp xếp theo ngày tạo mới nhất
     */
    List<Album> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Tìm album theo userId và title (tìm kiếm chính xác)
     */
    Optional<Album> findByUserIdAndTitle(Long userId, String title);
    
    /**
     * Tìm album theo title có chứa keyword (không phân biệt hoa thường)
     */
    List<Album> findByUserIdAndTitleContainingIgnoreCase(Long userId, String keyword);
    
    /**
     * Đếm số album của user
     */
    Long countByUserId(Long userId);
    
    /**
     * Kiểm tra user có album nào không
     */
    boolean existsByUserId(Long userId);
    
    /**
     * Xóa tất cả album của user
     */
    void deleteByUserId(Long userId);
    
    // ================== CUSTOM QUERIES (@Query) ==================
    
    /**
     * Tìm album được tạo trong khoảng thời gian
     */
    @Query("SELECT a FROM Album a WHERE a.userId = :userId " +
           "AND a.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY a.createdAt DESC")
    List<Album> findAlbumsByUserAndDateRange(
        @Param("userId") Long userId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    /**
     * Tìm album mới nhất của user
     */
    @Query("SELECT a FROM Album a WHERE a.userId = :userId " +
           "ORDER BY a.createdAt DESC LIMIT 1")
    Optional<Album> findLatestAlbum(@Param("userId") Long userId);
    
    /**
     * [UPDATE] Tìm kiếm album theo Keyword (Tiêu đề HOẶC Mô tả)
     * - Case-insensitive (LOWER)
     * - Dùng cho thanh tìm kiếm chung
     */
     @Query("SELECT DISTINCT a FROM Album a JOIN a.diaryEntries d WHERE a.userId = :userId")
    List<Album> findAlbumsWithDiaries(@Param("userId") Long userId);

    @Query("SELECT a FROM Album a WHERE a.userId = :userId AND a.diaryEntries IS EMPTY")
    List<Album> findEmptyAlbums(@Param("userId") Long userId);

    /**
     * [ĐÃ SỬA CHUẨN - GIỐNG DIARY]
     * 1. Bỏ CONCAT, dùng LIKE :keyword trực tiếp.
     * 2. So sánh createdAt (LocalDateTime) với khoảng thời gian đã được xử lý ở Service.
     */
        @Query("SELECT a FROM Album a WHERE a.userId = :userId " +
           "AND (" +
           "   LOWER(a.title) LIKE :keyword OR " +
           "   LOWER(a.description) LIKE :keyword" +
           ") " +
           "AND a.createdAt >= :startDate " +
           "AND a.createdAt <= :endDate " +
           "ORDER BY a.createdAt DESC")
    List<Album> searchAlbums(
        @Param("userId") Long userId,
        @Param("keyword") String keyword,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    /**
     * Đếm số diary entries trong album
     */
    @Query("SELECT COUNT(d) FROM DiaryEntry d WHERE d.album.albumId = :albumId")
    Long countDiaryEntriesByAlbumId(@Param("albumId") Long albumId);
}