-- Remove clerk_id column since Clerk is no longer used
ALTER TABLE users DROP COLUMN IF EXISTS clerk_id;
