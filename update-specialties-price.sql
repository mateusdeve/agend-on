-- Verificar se a coluna price já existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'specialties' AND column_name = 'price'
    ) THEN
        -- Adicionar a coluna price se não existir
        ALTER TABLE specialties ADD COLUMN price DECIMAL(10, 2) DEFAULT 100.00;
    END IF;
END $$;

-- Atualizar preços das especialidades existentes
UPDATE specialties SET price = 150.00 WHERE name = 'Cardiologia';
UPDATE specialties SET price = 120.00 WHERE name = 'Clínica Geral';
UPDATE specialties SET price = 180.00 WHERE name = 'Dermatologia';
UPDATE specialties SET price = 160.00 WHERE name = 'Ortopedia';
UPDATE specialties SET price = 140.00 WHERE name = 'Pediatria';
UPDATE specialties SET price = 170.00 WHERE name = 'Ginecologia';
