// Sistema de Pontos - Constantes e Lógica
export const ACTION_COSTS = {
  image_generation: 5,
  video_generation: 10,
  ai_code_edit: 2,
  search_perplexica: 3,
  rag_query: 4,
  nextjs_project_generation: 5,
  ai_chat_message: 1,
  mind_map_ai_generation: 3,
  task_ai_suggestion: 2,
} as const;

export type ActionType = keyof typeof ACTION_COSTS;

// Tipos para o sistema de pontos
export interface PointsConsumptionResult {
  success: boolean;
  remaining?: number;
  message?: string;
}

export interface UserPointsInfo {
  pointsBalance: number;
  planName: string;
  pointsPerMonth: number;
  renewDate: Date;
}

// Função para consumir pontos
export async function consumePoints(
  userId: string, 
  actionType: ActionType
): Promise<PointsConsumptionResult> {
  const cost = ACTION_COSTS[actionType];
  
  try {
    // Importação dinâmica para evitar problemas de circular dependency
    const { db } = await import('./db');
    
    // Buscar usuário com plano
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { plan: true }
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    if (user.pointsBalance >= cost) {
      // Debitar pontos e registrar uso
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { pointsBalance: user.pointsBalance - cost }
      });

      // Registrar log de uso
      await db.usageLog.create({
        data: {
          userId,
          actionType,
          pointsUsed: cost
        }
      });

      return { 
        success: true, 
        remaining: updatedUser.pointsBalance 
      };
    } else {
      return { 
        success: false, 
        message: `Pontos insuficientes. Você precisa de ${cost} pontos, mas tem apenas ${user.pointsBalance}. Faça upgrade do seu plano ou compre pontos extras.` 
      };
    }
  } catch (error) {
    console.error('Erro ao consumir pontos:', error);
    return { 
      success: false, 
      message: "Erro interno do servidor" 
    };
  }
}

// Função para obter informações de pontos do usuário
export async function getUserPointsInfo(userId: string): Promise<UserPointsInfo | null> {
  try {
    const { db } = await import('./db');
    
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { plan: true }
    });

    if (!user || !user.plan) {
      return null;
    }

    return {
      pointsBalance: user.pointsBalance,
      planName: user.plan.name,
      pointsPerMonth: user.plan.pointsPerMonth,
      renewDate: user.renewDate
    };
  } catch (error) {
    console.error('Erro ao obter informações de pontos:', error);
    return null;
  }
}

// Função para renovação mensal automática
export async function renewMonthlyPoints(): Promise<void> {
  try {
    const { db } = await import('./db');
    
    // Buscar usuários que precisam de renovação
    const usersToRenew = await db.user.findMany({
      where: {
        renewDate: {
          lte: new Date()
        }
      },
      include: { plan: true }
    });

    for (const user of usersToRenew) {
      if (user.plan) {
        // Resetar pontos para o valor do plano
        const nextRenewDate = new Date(user.renewDate);
        nextRenewDate.setMonth(nextRenewDate.getMonth() + 1);

        await db.user.update({
          where: { id: user.id },
          data: {
            pointsBalance: user.plan.pointsPerMonth,
            renewDate: nextRenewDate
          }
        });

        console.log(`Pontos renovados para usuário ${user.id}: ${user.plan.pointsPerMonth} pontos`);
      }
    }
  } catch (error) {
    console.error('Erro na renovação mensal de pontos:', error);
  }
}

// Função para comprar pontos extras
export async function purchaseExtraPoints(
  userId: string, 
  packageId: string
): Promise<{ success: boolean; message: string; newBalance?: number }> {
  try {
    const { db } = await import('./db');
    
    // Buscar pacote de pontos
    const pointsPackage = await db.extraPointsPackage.findUnique({
      where: { id: packageId }
    });

    if (!pointsPackage) {
      return { success: false, message: "Pacote de pontos não encontrado" };
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    // Atualizar saldo do usuário
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        pointsBalance: user.pointsBalance + pointsPackage.extraPoints
      }
    });

    // Registrar compra
    await db.extraPointsPurchase.create({
      data: {
        userId,
        packageId,
        pointsAdded: pointsPackage.extraPoints,
        amountPaid: pointsPackage.priceUsd
      }
    });

    return {
      success: true,
      message: `${pointsPackage.extraPoints} pontos adicionados com sucesso!`,
      newBalance: updatedUser.pointsBalance
    };
  } catch (error) {
    console.error('Erro ao comprar pontos extras:', error);
    return { success: false, message: "Erro interno do servidor" };
  }
}