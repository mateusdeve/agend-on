-- Tabela de pagamentos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'pix'
  status VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected', 'refunded'
  external_id VARCHAR(255), -- ID do pagamento no Mercado Pago
  payment_data JSONB, -- Dados adicionais do pagamento
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar o timestamp de updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments
FOR SELECT USING (
  auth.uid() IN (
    SELECT patient_id FROM appointments WHERE id = appointment_id
  )
);

CREATE POLICY "Admins podem gerenciar pagamentos" ON payments
FOR ALL USING (is_admin());

-- Adicionar coluna de preço na tabela de especialidades
ALTER TABLE specialties ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 100.00;

-- Atualizar preços das especialidades existentes
UPDATE specialties SET price = 150.00 WHERE name = 'Cardiologia';
UPDATE specialties SET price = 120.00 WHERE name = 'Clínica Geral';
UPDATE specialties SET price = 180.00 WHERE name = 'Dermatologia';
UPDATE specialties SET price = 160.00 WHERE name = 'Ortopedia';
UPDATE specialties SET price = 140.00 WHERE name = 'Pediatria';
UPDATE specialties SET price = 170.00 WHERE name = 'Ginecologia';
