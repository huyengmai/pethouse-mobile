-- Seed guest user for VetFinder favorites (phù hợp với auth_hoa User entity)
INSERT INTO users (username, password, full_name, email, phone, role, created_at, updated_at)
VALUES ('guest_user', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Guest User', 'guest@example.com', '0000000000', 'USER', NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
