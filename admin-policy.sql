-- Criar uma função para verificar se um usuário é administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário atual tem a role 'admin' nos metadados
  RETURN (
    auth.role() = 'service_role' OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar políticas para permitir que administradores gerenciem todas as tabelas
-- Especialidades
CREATE POLICY "Admins podem gerenciar especialidades" ON specialties
FOR ALL USING (is_admin());

-- Médicos
CREATE POLICY "Admins podem gerenciar médicos" ON doctors
FOR ALL USING (is_admin());

-- Disponibilidade dos médicos
CREATE POLICY "Admins podem gerenciar disponibilidade" ON doctor_availability
FOR ALL USING (is_admin());

-- Pacientes
CREATE POLICY "Admins podem gerenciar pacientes" ON patients
FOR ALL USING (is_admin());

-- Agendamentos
CREATE POLICY "Admins podem gerenciar agendamentos" ON appointments
FOR ALL USING (is_admin());
