-- Inserir especialidades
INSERT INTO specialties (name, description)
VALUES
  ('Clínica Geral', 'Atendimento médico para diagnóstico e tratamento de doenças comuns.'),
  ('Cardiologia', 'Especialidade médica que trata das doenças relacionadas ao coração e ao sistema circulatório.'),
  ('Dermatologia', 'Especialidade médica que trata das doenças relacionadas à pele, cabelos e unhas.'),
  ('Ortopedia', 'Especialidade médica que trata das doenças e lesões nos ossos, músculos, articulações e ligamentos.'),
  ('Pediatria', 'Especialidade médica dedicada à assistência à criança e ao adolescente.'),
  ('Ginecologia', 'Especialidade médica que trata da saúde do sistema reprodutor feminino.');

-- Inserir médicos
INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dr. Carlos Silva', 
  'carlos.silva@healthclinic.com.br', 
  '(11) 98765-4321', 
  id, 
  'Cardiologista com mais de 20 anos de experiência, formado pela USP com especialização em Harvard.', 
  true
FROM specialties WHERE name = 'Cardiologia';

INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dra. Ana Oliveira', 
  'ana.oliveira@healthclinic.com.br', 
  '(11) 98765-4322', 
  id, 
  'Clínica geral com especialização em gestão de saúde, responsável pela qualidade dos serviços médicos.', 
  true
FROM specialties WHERE name = 'Clínica Geral';

INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dr. Roberto Santos', 
  'roberto.santos@healthclinic.com.br', 
  '(11) 98765-4323', 
  id, 
  'Ortopedista com vasta experiência em gestão de equipes médicas multidisciplinares.', 
  true
FROM specialties WHERE name = 'Ortopedia';

INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dra. Juliana Costa', 
  'juliana.costa@healthclinic.com.br', 
  '(11) 98765-4324', 
  id, 
  'Dermatologista especializada em tratamentos estéticos e doenças de pele.', 
  true
FROM specialties WHERE name = 'Dermatologia';

INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dr. Marcos Pereira', 
  'marcos.pereira@healthclinic.com.br', 
  '(11) 98765-4325', 
  id, 
  'Pediatra com foco em desenvolvimento infantil e adolescente.', 
  true
FROM specialties WHERE name = 'Pediatria';

INSERT INTO doctors (name, email, phone, specialty_id, bio, available)
SELECT 
  'Dra. Fernanda Lima', 
  'fernanda.lima@healthclinic.com.br', 
  '(11) 98765-4326', 
  id, 
  'Ginecologista especializada em saúde da mulher e reprodução humana.', 
  true
FROM specialties WHERE name = 'Ginecologia';

-- Inserir disponibilidade dos médicos
-- Para cada médico, inserir disponibilidade para os dias da semana (1 = Segunda, 5 = Sexta)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 1, '08:00', '12:00' FROM doctors WHERE name = 'Dr. Carlos Silva';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 3, '13:00', '18:00' FROM doctors WHERE name = 'Dr. Carlos Silva';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 5, '08:00', '12:00' FROM doctors WHERE name = 'Dr. Carlos Silva';

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 1, '08:00', '18:00' FROM doctors WHERE name = 'Dra. Ana Oliveira';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 2, '08:00', '18:00' FROM doctors WHERE name = 'Dra. Ana Oliveira';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 4, '08:00', '18:00' FROM doctors WHERE name = 'Dra. Ana Oliveira';

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 2, '08:00', '12:00' FROM doctors WHERE name = 'Dr. Roberto Santos';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 4, '13:00', '18:00' FROM doctors WHERE name = 'Dr. Roberto Santos';

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 1, '13:00', '18:00' FROM doctors WHERE name = 'Dra. Juliana Costa';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 3, '08:00', '12:00' FROM doctors WHERE name = 'Dra. Juliana Costa';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 5, '13:00', '18:00' FROM doctors WHERE name = 'Dra. Juliana Costa';

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 2, '13:00', '18:00' FROM doctors WHERE name = 'Dr. Marcos Pereira';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 4, '08:00', '12:00' FROM doctors WHERE name = 'Dr. Marcos Pereira';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 6, '09:00', '14:00' FROM doctors WHERE name = 'Dr. Marcos Pereira';

INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 1, '08:00', '12:00' FROM doctors WHERE name = 'Dra. Fernanda Lima';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 3, '13:00', '18:00' FROM doctors WHERE name = 'Dra. Fernanda Lima';
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT id, 5, '08:00', '12:00' FROM doctors WHERE name = 'Dra. Fernanda Lima';
