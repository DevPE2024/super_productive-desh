import { renewMonthlyPoints } from './points-system';

// Função para executar renovação mensal de pontos
export async function runMonthlyRenewal() {
  try {
    console.log('Iniciando renovação mensal de pontos...');
    await renewMonthlyPoints();
    console.log('Renovação mensal de pontos concluída com sucesso');
  } catch (error) {
    console.error('Erro na renovação mensal de pontos:', error);
    throw error;
  }
}

// Função para verificar se é necessário executar renovação
export async function checkAndRunRenewal() {
  const now = new Date();
  const isFirstDayOfMonth = now.getDate() === 1;
  const isFirstHourOfDay = now.getHours() === 0;
  
  if (isFirstDayOfMonth && isFirstHourOfDay) {
    await runMonthlyRenewal();
  }
}

// Configuração de intervalo para verificação (executa a cada hora)
export function startRenewalScheduler() {
  // Executa imediatamente uma verificação
  checkAndRunRenewal();
  
  // Configura para executar a cada hora
  setInterval(checkAndRunRenewal, 60 * 60 * 1000); // 1 hora em millisegundos
  
  console.log('Agendador de renovação de pontos iniciado');
}

// Função para executar renovação manual (para testes)
export async function manualRenewal() {
  console.log('Executando renovação manual de pontos...');
  await runMonthlyRenewal();
}