-- Fix consultations table schema
-- Add missing columns to the consultations table

-- Add missing columns to consultations table
ALTER TABLE consultations 
ADD COLUMN IF NOT EXISTS issue_description TEXT,
ADD COLUMN IF NOT EXISTS emergency_service BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS on_site_service BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS mechanic_assigned TEXT;

-- Update existing rows to have default values
UPDATE consultations 
SET issue_description = 'No description provided' 
WHERE issue_description IS NULL;

UPDATE consultations 
SET emergency_service = FALSE 
WHERE emergency_service IS NULL;

UPDATE consultations 
SET on_site_service = FALSE 
WHERE on_site_service IS NULL;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'consultations' 
ORDER BY ordinal_position; 