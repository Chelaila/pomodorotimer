CREATE TABLE IF NOT EXISTS timer_configs (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  pomodoro_time INT DEFAULT 25 COMMENT 'tiempo de trabajo en minutos',
  short_break_time INT DEFAULT 5 COMMENT 'tiempo de descanso corto en minutos',
  long_break_time INT DEFAULT 15 COMMENT 'tiempo de descanso largo en minutos',
  long_break_interval INT DEFAULT 4 COMMENT 'número de pomodoros antes del descanso largo',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar configuración por defecto
INSERT INTO timer_configs (id, name, pomodoro_time, short_break_time, long_break_time, long_break_interval, is_active)
VALUES (UUID(), 'Configuración por Defecto', 25, 5, 15, 4, TRUE); 