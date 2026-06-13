-- =========================================================
-- FLYWAY MIGRATION - ADD MISSING COLUMNS TO USERS TABLE
-- Version: V3
-- Description: Add is_active and updated_at columns to users table
-- =========================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
