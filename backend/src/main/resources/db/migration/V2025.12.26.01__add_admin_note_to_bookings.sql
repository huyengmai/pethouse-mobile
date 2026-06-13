-- Add admin_note column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_note VARCHAR(1000);
