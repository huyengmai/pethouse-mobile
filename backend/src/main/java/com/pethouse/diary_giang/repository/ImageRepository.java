package com.pethouse.diary_giang.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.pethouse.diary_giang.entity.Image;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    
    // ================== BASIC QUERIES ==================
    
    /**
     * Tìm tất cả ảnh trong 1 diary entry
     */
    List<Image> findByDiaryEntry_EntryId(Long entryId);
    
    /**
     * Tìm ảnh và sắp xếp theo thứ tự hiển thị
     */
    List<Image> findByDiaryEntry_EntryIdOrderByDisplayOrderAsc(Long entryId);
    
    /**
     * Tìm ảnh theo URL
     */
    Optional<Image> findByImageUrl(String imageUrl);
    
    /**
     * Đếm số ảnh trong diary
     */
    Long countByDiaryEntry_EntryId(Long entryId);
    
    /**
     * Kiểm tra diary có ảnh không
     */
    boolean existsByDiaryEntry_EntryId(Long entryId);
    
    /**
     * Xóa tất cả ảnh trong diary
     */
    void deleteByDiaryEntry_EntryId(Long entryId);
    
    // ================== CUSTOM QUERIES ==================
    
    /**
     * Tìm tất cả ảnh trong album (qua DiaryEntry)
     */
    @Query("SELECT i FROM Image i " +
           "WHERE i.diaryEntry.album.albumId = :albumId " +
           "ORDER BY i.diaryEntry.entryDate DESC, i.displayOrder ASC")
    List<Image> findAllImagesByAlbumId(@Param("albumId") Long albumId);
    
    /**
     * Tìm tất cả ảnh của user
     */
    @Query("SELECT i FROM Image i " +
           "WHERE i.diaryEntry.album.userId = :userId " +
           "ORDER BY i.uploadedAt DESC")
    List<Image> findAllImagesByUserId(@Param("userId") Long userId);
    
    /**
     * Tìm ảnh đầu tiên của diary (cover image)
     */
    @Query("SELECT i FROM Image i " +
           "WHERE i.diaryEntry.entryId = :entryId " +
           "ORDER BY i.displayOrder ASC LIMIT 1")
    Optional<Image> findFirstImageByEntryId(@Param("entryId") Long entryId);
    
    /**
     * Tìm ảnh có caption
     */
    @Query("SELECT i FROM Image i " +
           "WHERE i.diaryEntry.entryId = :entryId " +
           "AND i.caption IS NOT NULL " +
           "ORDER BY i.displayOrder ASC")
    List<Image> findImagesWithCaption(@Param("entryId") Long entryId);
    
    /**
     * Đếm tổng số ảnh của user
     */
    @Query("SELECT COUNT(i) FROM Image i " +
           "WHERE i.diaryEntry.album.userId = :userId")
    Long countTotalImagesByUserId(@Param("userId") Long userId);
    
    /**
     * Lấy display order lớn nhất (để insert ảnh mới)
     */
    @Query("SELECT COALESCE(MAX(i.displayOrder), -1) FROM Image i " +
           "WHERE i.diaryEntry.entryId = :entryId")
    Integer findMaxDisplayOrder(@Param("entryId") Long entryId);
}