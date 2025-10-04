-- Remover duplicatas mais recentes, mantendo apenas as mais antigas
DELETE FROM extra_points_packages WHERE id IN (
  'cmgbamlp90005b316q8q7ess4',  -- Large Pack mais recente
  'cmgbamlp90004b316oqhlxhio',  -- Medium Pack mais recente  
  'cmgbamlp90003b316137xjc30'   -- Small Pack mais recente
);