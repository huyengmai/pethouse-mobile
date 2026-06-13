-- =========================================================
-- FLYWAY MIGRATION V10
-- Description: Update time_slots and bookings tables to match Entity structure
-- =========================================================

-- ============================
-- PART 1: UPDATE time_slots
-- ============================

-- 1. Add vet_clinic_id column
ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS vet_clinic_id BIGINT;

-- 2. Set default vet_clinic_id to first clinic
UPDATE time_slots SET vet_clinic_id = (SELECT id FROM vet_clinics LIMIT 1) WHERE vet_clinic_id IS NULL;

-- 3. Add max_capacity column
ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 1;

-- 4. Add current_bookings column
ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS current_bookings INTEGER DEFAULT 0;

-- 5. Add note column
ALTER TABLE time_slots ADD COLUMN IF NOT EXISTS note TEXT;

-- 6. Change start_time and end_time from TIMESTAMP to TIME (if needed)
DO $$
BEGIN
    -- Check if column is TIMESTAMP and convert to TIME
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'time_slots' AND column_name = 'start_time'
        AND data_type = 'timestamp without time zone'
    ) THEN
        ALTER TABLE time_slots
            ALTER COLUMN start_time TYPE TIME USING start_time::TIME,
            ALTER COLUMN end_time TYPE TIME USING end_time::TIME;
    END IF;
END $$;

-- 7. Drop old unique constraint and create new one
ALTER TABLE time_slots DROP CONSTRAINT IF EXISTS uq_time_slot;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_time_slot_clinic'
    ) THEN
        ALTER TABLE time_slots ADD CONSTRAINT uq_time_slot_clinic
            UNIQUE (vet_clinic_id, date, start_time, service_type);
    END IF;
END $$;

-- 8. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_slots_clinic_date_service
    ON time_slots(vet_clinic_id, date, service_type);

-- ============================
-- PART 2: UPDATE bookings
-- ============================

-- 1. Add vet_clinic_id to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vet_clinic_id BIGINT;

-- 2. Add service_type to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_type VARCHAR(50);

-- 3. Add booking_date to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_date TIMESTAMP;

-- 4. Add updated_at to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 5. Update existing bookings with data from time_slots if possible
UPDATE bookings b
SET vet_clinic_id = ts.vet_clinic_id,
    service_type = ts.service_type,
    booking_date = COALESCE(b.booking_date, (ts.date || ' ' || ts.start_time)::TIMESTAMP)
FROM time_slots ts
WHERE b.slot_id = ts.id AND b.vet_clinic_id IS NULL;

-- ============================
-- PART 3: SEED SAMPLE TIME SLOTS
-- ============================

-- Insert sample time slots for today and next 7 days if not exists
-- Only if there are vet_clinics
DO $$
DECLARE
    clinic_id BIGINT;
    day_offset INT;
    target_date DATE;
BEGIN
    -- Get first clinic
    SELECT id INTO clinic_id FROM vet_clinics LIMIT 1;

    IF clinic_id IS NOT NULL THEN
        -- Create slots for next 7 days
        FOR day_offset IN 0..6 LOOP
            target_date := CURRENT_DATE + day_offset;

            -- Morning slots (8:00 - 12:00) for VACCINE
            INSERT INTO time_slots (vet_clinic_id, date, start_time, end_time, service_type, max_capacity, current_bookings, available)
            VALUES
                (clinic_id, target_date, '08:00', '09:00', 'VACCINE', 3, 0, true),
                (clinic_id, target_date, '09:00', '10:00', 'VACCINE', 3, 0, true),
                (clinic_id, target_date, '10:00', '11:00', 'VACCINE', 3, 0, true),
                (clinic_id, target_date, '11:00', '12:00', 'VACCINE', 3, 0, true)
            ON CONFLICT DO NOTHING;

            -- Afternoon slots (14:00 - 17:00) for GROOMING
            INSERT INTO time_slots (vet_clinic_id, date, start_time, end_time, service_type, max_capacity, current_bookings, available)
            VALUES
                (clinic_id, target_date, '14:00', '15:00', 'GROOMING', 2, 0, true),
                (clinic_id, target_date, '15:00', '16:00', 'GROOMING', 2, 0, true),
                (clinic_id, target_date, '16:00', '17:00', 'GROOMING', 2, 0, true)
            ON CONFLICT DO NOTHING;
        END LOOP;

        RAISE NOTICE 'Created sample time slots for clinic %', clinic_id;
    END IF;
END $$;
