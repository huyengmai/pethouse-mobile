// UserRepository.java
package com.pethouse.auth_hoa.repo;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pethouse.auth_hoa.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.pets p " +
       "WHERE u.username LIKE %:kw% OR u.fullName LIKE %:kw% OR u.email LIKE %:kw% OR p.name LIKE %:kw%")
    Page<User> searchUsers(@Param("kw") String keyword, Pageable pageable);
}