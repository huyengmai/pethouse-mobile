-- Add completed_at column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;
