-- Tabela para armazenar as indisponibilidades dos médicos
CREATE TABLE IF NOT EXISTS doctor_unavailability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctor_unavailability_updated_at
BEFORE UPDATE ON doctor_unavailability
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE doctor_unavailability ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Médicos podem gerenciar suas próprias indisponibilidades" ON doctor_unavailability
FOR ALL USING (
  auth.uid() = doctor_id
);

CREATE POLICY "Admins podem gerenciar todas as indisponibilidades" ON doctor_unavailability
FOR ALL USING (
  is_admin()
);

-- Adicionar índice para melhorar a performance das consultas
CREATE INDEX doctor_unavailability_doctor_date_idx ON doctor_unavailability(doctor_id, date);
