-- Add price column to specialties table if it doesn't exist
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 100.00;

-- Update prices for existing specialties
UPDATE specialties SET price = 150.00 WHERE name = 'Cardiologia';
UPDATE specialties SET price = 120.00 WHERE name = 'Clínica Geral';
UPDATE specialties SET price = 180.00 WHERE name = 'Dermatologia';
UPDATE specialties SET price = 160.00 WHERE name = 'Ortopedia';
UPDATE specialties SET price = 140.00 WHERE name = 'Pediatria';
UPDATE specialties SET price = 170.00 WHERE name = 'Ginecologia';
