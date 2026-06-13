-- =========================================================
-- FLYWAY MIGRATION - ADD FAVORITES TABLE
-- Version: V2
-- Description: Create favorites table for user's favorite vet clinics
-- =========================================================

CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vet_clinic_id BIGINT NOT NULL REFERENCES vet_clinics(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_favorites_user_clinic UNIQUE (user_id, vet_clinic_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vet_clinic_id ON favorites(vet_clinic_id);

COMMENT ON TABLE favorites IS 'Table to store user favorite vet clinics';
