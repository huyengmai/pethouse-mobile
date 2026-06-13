package com.pethouse.admin_dashboard;

import com.pethouse.auth_hoa.repo.UserRepository;
import com.pethouse.profile_hoa.repo.PetsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PetsRepository petsRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        Map<String, Long> stats = new HashMap<>();
        
        // Sử dụng hàm count() có sẵn của JpaRepository
        stats.put("userCount", userRepository.count());
        stats.put("petCount", petsRepository.count());
        
        return ResponseEntity.ok(stats);
    }
}