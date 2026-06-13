-- Seed vet clinics data - Dữ liệu thật các phòng khám thú y tại Hà Nội (25 phòng khám)
-- Chỉ insert nếu bảng trống

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM vet_clinics LIMIT 1) THEN
        INSERT INTO vet_clinics (name, address, phone, email, website, description, latitude, longitude, opening_hours, services, image_url, average_rating, total_reviews, is_active, created_at, updated_at)
        VALUES
        -- 1. Bệnh viện Thú y Tropicpet - Chi nhánh Hà Đông
        ('Bệnh viện Thú y Tropicpet Hà Đông', '175B Đường 19/5, Văn Quán, Hà Đông, Hà Nội', '0961-555-911', 'hadong@tropicpet.vn', 'https://tropicpet.vn', 'Hệ thống bệnh viện thú y uy tín dẫn đầu về chất lượng khám và điều trị bệnh cho thú cưng tại Hà Nội, đã phục vụ hơn 30.000 khách hàng.', 20.9716, 105.7790, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Nội trú", "Cấp cứu"]', NULL, 4.9, 342, true, NOW(), NOW()),

        -- 2. Bệnh viện Thú y Tropicpet - Chi nhánh Cầu Giấy
        ('Bệnh viện Thú y Tropicpet Cầu Giấy', '18 Trần Quốc Hoàn, Dịch Vọng Hậu, Cầu Giấy, Hà Nội', '0862-555-911', 'caugiay@tropicpet.vn', 'https://tropicpet.vn', 'Chi nhánh Cầu Giấy với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại.', 21.0380, 105.7850, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Grooming", "Xét nghiệm"]', NULL, 4.8, 287, true, NOW(), NOW()),

        -- 3. Bệnh viện Thú y Tropicpet - Chi nhánh Kim Mã
        ('Bệnh viện Thú y Tropicpet Kim Mã', '30 Kim Mã, Ba Đình, Hà Nội', '0368-555-911', 'kimma@tropicpet.vn', 'https://tropicpet.vn', 'Chi nhánh trung tâm Ba Đình, tiện lợi và chuyên nghiệp.', 21.0312, 105.8156, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Nội trú"]', NULL, 4.7, 198, true, NOW(), NOW()),

        -- 4. Bệnh viện Thú y Tropicpet - Chi nhánh Hai Bà Trưng
        ('Bệnh viện Thú y Tropicpet Hai Bà Trưng', '271 Minh Khai, Vĩnh Tuy, Hai Bà Trưng, Hà Nội', '0866-555-911', 'haibatrung@tropicpet.vn', 'https://tropicpet.vn', 'Chi nhánh phía Nam Hà Nội với dịch vụ chăm sóc toàn diện.', 21.0030, 105.8650, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Grooming", "Cấp cứu"]', NULL, 4.8, 256, true, NOW(), NOW()),

        -- 5. Bệnh viện Thú y PetHealth - Nguyễn Khang
        ('Bệnh viện Thú y PetHealth Cầu Giấy', '455 Nguyễn Khang, Yên Hoà, Cầu Giấy, Hà Nội', '0975-639-882', 'caugiay@pethealth.vn', 'https://pethealth.vn', 'Hệ thống PetHealth với 20 năm kinh nghiệm, 11 cơ sở tại Hà Nội. Hotline: 1900 299 982', 21.0285, 105.7900, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Grooming"]', NULL, 4.7, 312, true, NOW(), NOW()),

        -- 6. Bệnh viện Thú y PetHealth - Long Biên
        ('Bệnh viện Thú y PetHealth Long Biên', '443 Nguyễn Văn Cừ, Long Biên, Hà Nội', '0933-428-882', 'longbien@pethealth.vn', 'https://pethealth.vn', 'Chi nhánh Long Biên phục vụ khu vực phía Đông Hà Nội.', 21.0450, 105.8820, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Nội trú"]', NULL, 4.6, 189, true, NOW(), NOW()),

        -- 7. Bệnh viện Thú y PetHealth - Âu Cơ
        ('Bệnh viện Thú y PetHealth Tây Hồ', '240 Âu Cơ, Tây Hồ, Hà Nội', '024-2242-8882', 'tayho@pethealth.vn', 'https://pethealth.vn', 'Chi nhánh Tây Hồ với không gian rộng rãi, thoáng mát.', 21.0650, 105.8350, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Grooming", "Spa thú cưng"]', NULL, 4.8, 234, true, NOW(), NOW()),

        -- 8. Hệ thống Thú y 2Vet - Văn Cao
        ('Phòng khám Thú y 2Vet Văn Cao', '03 Văn Cao, Ba Đình, Hà Nội', '0967-395-618', 'vancao@2vet.vn', 'https://2vet.vn', 'Hệ thống 2Vet với 15 chi nhánh và hơn 100 cán bộ y bác sĩ chuyên nghiệp, thành lập từ 2011.', 21.0420, 105.8230, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Nội trú"]', NULL, 4.7, 267, true, NOW(), NOW()),

        -- 9. Hệ thống Thú y 2Vet - Giải Phóng
        ('Phòng khám Thú y 2Vet Giải Phóng', '1261 Giải Phóng, Hoàng Mai, Hà Nội', '0967-679-926', 'giaiphong@2vet.vn', 'https://2vet.vn', 'Chi nhánh phía Nam với đầy đủ dịch vụ khám chữa bệnh cho thú cưng.', 20.9650, 105.8450, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Cấp cứu"]', NULL, 4.6, 178, true, NOW(), NOW()),

        -- 10. Bệnh viện Thú y Mỹ Đình
        ('Bệnh viện Thú y Mỹ Đình', 'Số 3, Ngõ 25 Nguyễn Cơ Thạch, Mỹ Đình 2, Nam Từ Liêm, Hà Nội', '0969-306-909', 'contact@thuymydinh.vn', 'https://thuymydinh.vn', 'Bệnh viện thú y với trên 10 năm kinh nghiệm, áp dụng kỹ thuật hiện đại trong chẩn đoán và điều trị.', 21.0200, 105.7650, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Nội trú", "Cấp cứu"]', NULL, 4.9, 356, true, NOW(), NOW()),

        -- 11. Bệnh viện Thú y Pet5H - Hoàng Hoa Thám
        ('Bệnh viện Thú y Pet5H', '295 Hoàng Hoa Thám, Ngọc Hà, Ba Đình, Hà Nội', '0988-799-763', 'contact@pet5h.vn', 'https://pet5h.vn', 'Pet5H nổi bật với hệ thống thiết bị y tế hiện đại, sử dụng máy gây mê hơi - công nghệ an toàn nhất.', 21.0400, 105.8180, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Gây mê an toàn", "Xét nghiệm"]', NULL, 4.8, 289, true, NOW(), NOW()),

        -- 12. Phòng khám Thú y Animal Care - Thụy Khuê
        ('Phòng khám Thú y Animal Care', '20 Ngõ 424 Thụy Khuê, Tây Hồ, Hà Nội', '0978-776-099', 'contact@animalcare.vn', NULL, 'Animal Care chuyên điều trị các bệnh khó như parvo, care của chó, bệnh mèo tắc tiểu với đội ngũ bác sĩ tâm huyết.', 21.0550, 105.8280, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Điều trị nội trú", "Cấp cứu"]', NULL, 4.7, 198, true, NOW(), NOW()),

        -- 13. Bệnh viện Thú y Vetcenter
        ('Bệnh viện Thú y Vetcenter', 'Số 9 Quan Hoa, Cầu Giấy, Hà Nội', '0569-219-268', 'contact@vetcenter.vn', NULL, 'Vetcenter cung cấp dịch vụ khám chữa bệnh chất lượng cao tại khu vực Cầu Giấy.', 21.0320, 105.7920, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Grooming"]', NULL, 4.6, 156, true, NOW(), NOW()),

        -- 14. Chien Vet Clinic
        ('Chien Vet Clinic', 'Số 56 Ngõ 19 Trần Quang Diệu, Đống Đa, Hà Nội', '0977-311-712', 'chienvet@gmail.com', NULL, 'Trải qua 10 năm kinh nghiệm, Chien Vet Clinic ứng dụng các thiết bị công nghệ mới, uy tín.', 21.0150, 105.8220, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm"]', NULL, 4.7, 234, true, NOW(), NOW()),

        -- 15. VetHospital - Học viện Nông nghiệp Việt Nam
        ('Bệnh viện Thú y - Học viện Nông nghiệp Việt Nam', 'Ngõ 64 Ngô Xuân Quảng, Trâu Quỳ, Gia Lâm, Hà Nội', '0399-065-115', 'vethospital.vnua@gmail.com', NULL, 'Bệnh viện Thú y lớn nhất Việt Nam, được đánh giá uy tín và chất lượng nhất tại Hà Nội.', 21.0175, 105.9365, '07:30 - 17:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Nghiên cứu"]', NULL, 4.9, 445, true, NOW(), NOW()),

        -- 16. Bệnh viện Thú Cảnh Greenpet
        ('Bệnh viện Thú Cảnh Greenpet', '78 Trần Duy Hưng, Cầu Giấy, Hà Nội', '0933-702-702', 'contact@greenpet.vn', 'https://greenpet.vn', 'Greenpet cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho thú cưng với trang thiết bị hiện đại.', 21.0120, 105.7980, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Grooming", "Spa thú cưng"]', NULL, 4.6, 167, true, NOW(), NOW()),

        -- 17. Phòng khám Thú y 4Pet
        ('Phòng khám Thú y 4Pet', '118 Trường Chinh, Phương Mai, Đống Đa, Hà Nội', '0949-722-882', '4pet.clinic@gmail.com', NULL, 'Phòng khám thú y chuyên nghiệp tại khu vực Đống Đa với giá cả hợp lý.', 21.0050, 105.8350, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Grooming"]', NULL, 4.5, 134, true, NOW(), NOW()),

        -- 18. Phòng khám Thú y DocaVet
        ('Phòng khám Thú y DocaVet', '328 Định Công, Hoàng Mai, Hà Nội', '0392-320-115', 'docavet@gmail.com', NULL, 'DocaVet phục vụ khu vực Hoàng Mai với đội ngũ bác sĩ tận tâm.', 20.9780, 105.8380, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Nội trú"]', NULL, 4.6, 145, true, NOW(), NOW()),

        -- 19. Phòng khám Thú y Pet-Friends
        ('Phòng khám Thú y Pet-Friends', 'Ngõ 195 Quang Trung, Hà Đông, Hà Nội', '0386-965-866', 'petfriends.hd@gmail.com', NULL, 'Pet-Friends chuyên chăm sóc sức khỏe thú cưng tại khu vực Hà Đông.', 20.9680, 105.7850, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Grooming"]', NULL, 4.5, 112, true, NOW(), NOW()),

        -- 20. Phòng khám Thú y Pet 24H - Bắc Từ Liêm
        ('Phòng khám Thú y Pet 24H Bắc Từ Liêm', '38 Phúc Diễn, Cầu Diễn, Bắc Từ Liêm, Hà Nội', '0971-522-115', 'pet24h.btl@gmail.com', NULL, 'Phòng khám cấp cứu 24/7 phục vụ khu vực Bắc Từ Liêm.', 21.0550, 105.7450, '24/7', '["Khám bệnh", "Tiêm phòng", "Cấp cứu 24/7", "Phẫu thuật"]', NULL, 4.7, 189, true, NOW(), NOW()),

        -- 21. Phòng khám Thú y Pet 24H - Hà Đông
        ('Phòng khám Thú y Pet 24H Hà Đông', '331 Quang Trung, Hà Đông, Hà Nội', '0973-522-115', 'pet24h.hd@gmail.com', NULL, 'Phòng khám cấp cứu 24/7 phục vụ khu vực Hà Đông và phía Tây Hà Nội.', 20.9650, 105.7820, '24/7', '["Khám bệnh", "Tiêm phòng", "Cấp cứu 24/7", "Phẫu thuật"]', NULL, 4.6, 156, true, NOW(), NOW()),

        -- 22. Bệnh viện Samyang Animal Clinic
        ('Bệnh viện Samyang Animal Clinic', '116 Khuất Duy Tiến, Thanh Xuân, Hà Nội', '0901-111-021', 'samyang.clinic@gmail.com', NULL, 'Bệnh viện thú cưng theo tiêu chuẩn Hàn Quốc, thành lập từ năm 2015.', 21.0000, 105.8050, '09:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Grooming cao cấp", "Spa"]', NULL, 4.8, 267, true, NOW(), NOW()),

        -- 23. Bệnh viện Thú y Hải Đăng
        ('Bệnh viện Thú y Hải Đăng', '71 Trần Nhân Tông, Hai Bà Trưng, Hà Nội', '0125-611-5115', 'haidang.vet@gmail.com', NULL, 'Bệnh viện thú y Hải Đăng với kỹ thuật hiện đại, đội ngũ thạc sĩ, bác sĩ chuyên nghiệp.', 21.0106, 105.8550, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Trị liệu"]', NULL, 4.7, 212, true, NOW(), NOW()),

        -- 24. Bệnh viện Thú y Funpet
        ('Bệnh viện Thú y Funpet', '83 Giải Phóng, Hai Bà Trưng, Hà Nội', '0966-693-331', 'funpet.vet@gmail.com', NULL, 'Funpet nổi tiếng với các phương pháp phẫu thuật chuyên sâu, thực hiện những ca khó có độ phức tạp cao.', 21.0020, 105.8480, '08:00 - 21:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật chuyên sâu", "Nội trú"]', NULL, 4.8, 298, true, NOW(), NOW()),

        -- 25. Bệnh viện Thú y Hanvet - Trường Chinh
        ('Bệnh viện Thú y Hanvet', 'P108 H10, Ngõ 102 Trường Chinh, Đống Đa, Hà Nội', '024-3868-7201', 'hanvet.tc@gmail.com', 'https://hanvet.vn', 'Hanvet được thành lập năm 2001, là địa chỉ khám chữa thú cưng đáng tin cậy tại Hà Nội với nhiều chi nhánh.', 21.0080, 105.8320, '08:00 - 20:00', '["Khám bệnh", "Tiêm phòng", "Phẫu thuật", "Xét nghiệm", "Nội trú"]', NULL, 4.7, 378, true, NOW(), NOW());
    END IF;
END $$;
