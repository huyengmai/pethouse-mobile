package com.pethouse.diary_giang.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pethouse.diary_giang.entity.DiaryEntry;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {
    
    // ================== CODE CŨ (GIỮ NGUYÊN 100%) ==================
    
    List<DiaryEntry> findByAlbum_AlbumId(Long albumId);
    
    List<DiaryEntry> findByAlbum_AlbumIdOrderByEntryDateDesc(Long albumId);
    
    Optional<DiaryEntry> findByAlbum_AlbumIdAndEntryDate(Long albumId, LocalDate entryDate);
    
    List<DiaryEntry> findByAlbum_AlbumIdAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
        Long albumId, 
        String titleKeyword, 
        String contentKeyword
    );
    
    Long countByAlbum_AlbumId(Long albumId);
    
    boolean existsByAlbum_AlbumId(Long albumId);
    
    void deleteByAlbum_AlbumId(Long albumId);
    
    @Query("SELECT d FROM DiaryEntry d WHERE d.album.albumId = :albumId " +
           "AND d.entryDate BETWEEN :startDate AND :endDate " +
           "ORDER BY d.entryDate DESC")
    List<DiaryEntry> findDiariesByDateRange(
        @Param("albumId") Long albumId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // [FIX] Sửa d.album.userId -> d.userId để lấy cả nhật ký lẻ
    @Query("SELECT d FROM DiaryEntry d " +
           "WHERE d.userId = :userId " +
           "ORDER BY d.entryDate DESC")
    List<DiaryEntry> findAllByUserId(@Param("userId") Long userId);
    
    // [FIX] Sửa d.album.userId -> d.userId
    @Query("SELECT d FROM DiaryEntry d " +
           "WHERE d.userId = :userId " +
           "ORDER BY d.entryDate DESC, d.createdAt DESC LIMIT 1")
    Optional<DiaryEntry> findLatestDiaryByUserId(@Param("userId") Long userId);
    
    @Query("SELECT DISTINCT d FROM DiaryEntry d " +
           "JOIN d.images i " +
           "WHERE d.album.albumId = :albumId")
    List<DiaryEntry> findDiariesWithImages(@Param("albumId") Long albumId);
    
    @Query("SELECT d FROM DiaryEntry d " +
           "WHERE d.album.albumId = :albumId " +
           "AND d.images IS EMPTY")
    List<DiaryEntry> findDiariesWithoutImages(@Param("albumId") Long albumId);
    
    // [FIX] Sửa d.album.userId -> d.userId
    @Query("SELECT d FROM DiaryEntry d WHERE d.userId = :userId " +
           "AND (LOWER(d.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(d.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<DiaryEntry> searchDiariesByKeyword(
        @Param("userId") Long userId,
        @Param("keyword") String keyword
    );
    
    @Query("SELECT COUNT(i) FROM Image i WHERE i.diaryEntry.entryId = :entryId")
    Long countImagesByEntryId(@Param("entryId") Long entryId);
    
    // [FIX] Sửa d.album.userId -> d.userId để dashboard hiện cả nhật ký lẻ mới nhất
    @Query("SELECT d FROM DiaryEntry d WHERE d.userId = :userId ORDER BY d.entryDate DESC LIMIT 5")
    List<DiaryEntry> findTop5RecentDiaries(@Param("userId") Long userId);

    /**
     * [FIX QUAN TRỌNG] 
     * Sửa d.album.userId -> d.userId
     * Điều này cho phép tìm kiếm cả những nhật ký có album = null (Nhật ký lẻ)
     */
    @Query("SELECT d FROM DiaryEntry d WHERE d.userId = :userId " +
           "AND (:albumId IS NULL OR d.album.albumId = :albumId) " +
           "AND (" + 
           "   :keyword IS NULL OR " +
           "   LOWER(d.title) LIKE :keyword OR " +
           "   LOWER(d.content) LIKE :keyword" +
           ") " +
           "AND d.entryDate >= :startDate " +
           "AND d.entryDate <= :endDate " +
           "ORDER BY d.entryDate DESC")
    List<DiaryEntry> searchDiaries(
            @Param("userId") Long userId,
            @Param("albumId") Long albumId,
            @Param("keyword") String keyword,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ================== PHẦN THÊM MỚI (CHO CHỨC NĂNG MỚI) ==================

    @Query("SELECT d FROM DiaryEntry d WHERE d.userId = :userId ORDER BY d.entryDate DESC")
    List<DiaryEntry> findAllByUserRaw(@Param("userId") Long userId);

    @Query("SELECT d FROM DiaryEntry d WHERE d.entryId IN :ids AND d.userId = :userId")
    List<DiaryEntry> findByIdsAndUser(@Param("ids") List<Long> ids, @Param("userId") Long userId);
}