-- =========================================================
-- FLYWAY MIGRATION - INITIAL SCHEMA
-- Version: V1
-- Description: Create all 20 tables for Pet Management System
-- =========================================================

-- =========================
-- 1. USERS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER',
    clerk_id VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. PETS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS pets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    birth_date DATE,
    weight DECIMAL(5,2),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. TIME_SLOTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS time_slots (
    id BIGSERIAL PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('VACCINE', 'GROOMING')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT uq_time_slot UNIQUE (start_time, end_time, service_type)
);

CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_time_slots_date_service ON time_slots(date, service_type);

-- =========================
-- 4. BOOKINGS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS bookings (
    id BIGSERIAL PRIMARY KEY,
    slot_id BIGINT NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'BOOKED', 'COMPLETED', 'CANCELLED')),
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pet_id ON bookings(pet_id);

COMMENT ON COLUMN bookings.user_id IS 'Chủ sở hữu đặt lịch';
COMMENT ON COLUMN bookings.pet_id IS 'Thú cưng được đặt dịch vụ';

-- =========================
-- 5. NOTIFICATIONS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT REFERENCES bookings(id),
    notify_time TIMESTAMP,
    sent BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_notifications_sent ON notifications(sent);
CREATE INDEX IF NOT EXISTS idx_notifications_notify_time ON notifications(notify_time);

-- =========================
-- 6. NUTRITION_FORMULA TABLE
-- =========================
CREATE TABLE IF NOT EXISTS nutrition_formula (
    id BIGSERIAL PRIMARY KEY,
    formula_name VARCHAR(100) NOT NULL,
    expression TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 7. NUTRITION_RULE TABLE
-- =========================
CREATE TABLE IF NOT EXISTS nutrition_rule (
    id BIGSERIAL PRIMARY KEY,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    min_age_month INT,
    max_age_month INT,
    min_weight DECIMAL(5,2),
    max_weight DECIMAL(5,2),
    activity_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 8. NUTRITION_RECOMMENDATION TABLE
-- =========================
CREATE TABLE IF NOT EXISTS nutrition_recommendation (
    id BIGSERIAL PRIMARY KEY,
    nutrition_rule_id BIGINT REFERENCES nutrition_rule(id) ON DELETE CASCADE,
    formula_id BIGINT REFERENCES nutrition_formula(id) ON DELETE SET NULL,
    recommended_calories DECIMAL(10,2),
    recommended_protein DECIMAL(10,2),
    recommended_fat DECIMAL(10,2),
    recommended_carbs DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_recommendation_formula ON nutrition_recommendation(formula_id);

-- =========================
-- 9. MEAL_PLAN TABLE
-- =========================
CREATE TABLE IF NOT EXISTS meal_plan (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    recommendation_id BIGINT REFERENCES nutrition_recommendation(id) ON DELETE SET NULL,
    plan_date DATE NOT NULL,
    notes TEXT,
    total_calories DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (pet_id, plan_date)
);

CREATE INDEX IF NOT EXISTS idx_meal_plan_pet_date ON meal_plan(pet_id, plan_date);
CREATE INDEX IF NOT EXISTS idx_meal_plan_recommendation ON meal_plan(recommendation_id);

-- =========================
-- 10. MEAL_TEMPLATE TABLE
-- =========================
CREATE TABLE IF NOT EXISTS meal_template (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    meal_type VARCHAR(20),
    default_calories DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 11. MEAL TABLE
-- =========================
CREATE TABLE IF NOT EXISTS meal (
    id BIGSERIAL PRIMARY KEY,
    meal_plan_id BIGINT NOT NULL REFERENCES meal_plan(id) ON DELETE CASCADE,
    meal_template_id BIGINT REFERENCES meal_template(id) ON DELETE SET NULL,
    meal_type VARCHAR(20) CHECK (meal_type IN ('BREAKFAST', 'LUNCH', 'DINNER')),
    meal_time TIME,
    is_completed BOOLEAN DEFAULT FALSE,
    total_calories DECIMAL(10,2) DEFAULT 0,
    total_protein DECIMAL(10,2) DEFAULT 0,
    total_fat DECIMAL(10,2) DEFAULT 0,
    total_carbs DECIMAL(10,2) DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_meal_meal_plan ON meal(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_meal_template ON meal(meal_template_id);

-- =========================
-- 12. FOOD_ITEM TABLE
-- =========================
CREATE TABLE IF NOT EXISTS food_item (
    id BIGSERIAL PRIMARY KEY,
    meal_id BIGINT NOT NULL REFERENCES meal(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(10,2),
    unit VARCHAR(50),
    calories DECIMAL(10,2),
    protein DECIMAL(10,2),
    fat DECIMAL(10,2),
    carbs DECIMAL(10,2)
);

CREATE INDEX IF NOT EXISTS idx_food_item_meal ON food_item(meal_id);

-- =========================
-- 13. REFRESH_TOKENS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expiry_date ON refresh_tokens(expiry_date);

COMMENT ON TABLE refresh_tokens IS 'Table to store JWT refresh tokens for users';

-- =========================
-- 14. VET_CLINICS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS vet_clinics (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    opening_hours TEXT,
    services TEXT,
    image_url TEXT,
    average_rating DECIMAL(2, 1) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vet_clinics_location ON vet_clinics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_vet_clinics_name ON vet_clinics(name);
CREATE INDEX IF NOT EXISTS idx_vet_clinics_active ON vet_clinics(is_active);

-- =========================
-- 15. PET_WEIGHT_LOGS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS pet_weight_logs (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    measured_at DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    note TEXT
);

CREATE INDEX IF NOT EXISTS idx_pet_weight_logs_pet_date ON pet_weight_logs(pet_id, measured_at);

-- =========================
-- 16. PET_HEALTH_RECORDS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS pet_health_records (
    id BIGSERIAL PRIMARY KEY,
    pet_id BIGINT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    title VARCHAR(255),
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    status VARCHAR(20) CHECK (status IN ('ONGOING', 'CURED')),
    follow_up_date DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pet_health_records_pet_date ON pet_health_records(pet_id, visit_date);

-- =========================
-- 17. PET_HEALTH_ATTACHMENTS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS pet_health_attachments (
    id BIGSERIAL PRIMARY KEY,
    record_id BIGINT NOT NULL REFERENCES pet_health_records(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    content_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pet_health_attachments_record ON pet_health_attachments(record_id);

-- =========================
-- 18. ALBUMS TABLE
-- =========================
CREATE TABLE IF NOT EXISTS albums (
    album_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 19. DIARY_ENTRIES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS diary_entries (
    entry_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    entry_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    album_id BIGINT REFERENCES albums(album_id) ON DELETE SET NULL
);

-- =========================
-- 20. IMAGES TABLE
-- =========================
CREATE TABLE IF NOT EXISTS images (
    image_id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entry_id BIGINT NOT NULL REFERENCES diary_entries(entry_id) ON DELETE CASCADE
);