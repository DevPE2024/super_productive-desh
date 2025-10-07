import { AppKey } from '@prisma/client';
import { db } from './db';

// Função para consumir créditos de uma aplicação específica
export async function consumeCredits(
  userId: string,
  appKey: AppKey,
  creditsToConsume: number
): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
  try {
    // Primeiro, buscar o app pelo appKey
    const app = await db.app.findUnique({
      where: { key: appKey }
    });

    if (!app) {
      return {
        success: false,
        error: "Aplicação não encontrada",
      };
    }

    // Buscar o saldo atual do usuário para a aplicação
    const userAppBalance = await db.userAppBalance.findUnique({
      where: {
        userId_appId: {
          userId,
          appId: app.id,
        },
      },
    });

    if (!userAppBalance) {
      return {
        success: false,
        error: "Saldo não encontrado para esta aplicação",
      };
    }

    // Verificar se há créditos suficientes
    if (userAppBalance.remaining < creditsToConsume) {
      return {
        success: false,
        error: "Créditos insuficientes",
        remainingCredits: userAppBalance.remaining,
      };
    }

    // Consumir os créditos
    const updatedBalance = await db.userAppBalance.update({
      where: {
        userId_appId: {
          userId,
          appId: app.id,
        },
      },
      data: {
        remaining: userAppBalance.remaining - creditsToConsume,
      },
    });

    // Registrar o uso
    await db.usageLog.create({
      data: {
        userId,
        appId: app.id,
        actionType: "credit_consumption",
        pointsUsed: creditsToConsume,
      },
    });

    return {
      success: true,
      remainingCredits: updatedBalance.remaining,
    };
  } catch (error) {
    console.error("Erro ao consumir créditos:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

// Função para obter o saldo de créditos de todas as aplicações do usuário
export async function getUserCreditsBalance(userId: string) {
  try {
    const balances = await db.userAppBalance.findMany({
      where: { userId },
      include: {
        app: true,
      },
    });

    return balances.map((balance) => ({
      appKey: balance.app.key,
      remaining: balance.remaining,
      total: balance.remaining, // Assumindo que total é igual ao remaining por enquanto
      used: 0, // Calculado como total - remaining
    }));
  } catch (error) {
    console.error("Erro ao buscar saldo de créditos:", error);
    return [];
  }
}

// Função para resetar créditos mensais (executada por cron job)
export async function resetMonthlyCredits() {
  try {
    // Removendo a variável não utilizada firstDayOfMonth e now

    // Buscar todos os usuários que precisam de reset
    const usersToReset = await db.userAppBalance.findMany({
      include: {
        user: {
          include: {
            subscriptions: {
              where: {
                status: 'active'
              },
              include: {
                plan: {
                  include: {
                    allocations: true
                  }
                }
              }
            }
          }
        }
      }
    });

    for (const userBalance of usersToReset) {
      // Encontrar a assinatura ativa do usuário
      const activeSubscription = userBalance.user.subscriptions.find(
        (sub) => sub.status === 'active'
      );

      if (activeSubscription) {
        // Encontrar a alocação correspondente para esta aplicação
        const allocation = activeSubscription.plan.allocations.find(
          (alloc) => alloc.appId === userBalance.appId
        );

        if (allocation) {
          await db.userAppBalance.update({
            where: {
              id: userBalance.id
            },
            data: {
              remaining: allocation.monthlyPoints || 0
            }
          });
        }
      }
    }

    console.log('✅ Créditos mensais resetados com sucesso');
  } catch (error) {
    console.error('❌ Erro ao resetar créditos mensais:', error);
    throw error;
  }
}

// Função para verificar se o usuário pode usar uma funcionalidade
export async function canUseFeature(
  userId: string,
  appKey: AppKey,
  requiredCredits: number
): Promise<boolean> {
  try {
    // Primeiro, encontrar a aplicação pelo appKey
    const app = await db.app.findUnique({
      where: { key: appKey },
    });

    if (!app) {
      return false;
    }

    const userAppBalance = await db.userAppBalance.findUnique({
      where: {
        userId_appId: {
          userId,
          appId: app.id,
        },
      },
    });

    return userAppBalance ? userAppBalance.remaining >= requiredCredits : false;
  } catch (error) {
    console.error("Erro ao verificar disponibilidade de funcionalidade:", error);
    return false;
  }
}

// Função para obter histórico de uso
export async function getUsageHistory(
  userId: string,
  appKey?: AppKey,
  limit: number = 50
) {
  try {
    const whereClause: { userId: string; appId?: number } = { userId };
    
    if (appKey) {
      // Encontrar a aplicação pelo appKey
      const app = await db.app.findUnique({
        where: { key: appKey },
      });
      
      if (app) {
        whereClause.appId = app.id;
      }
    }

    const usageHistory = await db.usageLog.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        app: true,
      },
    });

    return usageHistory.map((log) => ({
      id: log.id,
      appKey: log.app.key,
      appName: log.app.name,
      pointsUsed: log.pointsUsed,
      actionType: log.actionType,
      timestamp: log.createdAt,
    }));
  } catch (error) {
    console.error("Erro ao buscar histórico de uso:", error);
    return [];
  }
}

// Função para inicializar créditos quando usuário muda de plano
export async function initializeUserCredits(userId: string, planId: number) {
  try {
    // Buscar o plano e suas alocações
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: {
        allocations: {
          include: {
            app: true,
          },
        },
      },
    });

    if (!plan) {
      throw new Error("Plano não encontrado");
    }

    // Criar ou atualizar saldos para cada aplicação
    for (const allocation of plan.allocations) {
      await db.userAppBalance.upsert({
        where: {
          userId_appId: {
            userId,
            appId: allocation.appId,
          },
        },
        update: {
          remaining: allocation.monthlyPoints || 0,
        },
        create: {
          userId,
          appId: allocation.appId,
          remaining: allocation.monthlyPoints || 0,
        },
      });
    }

    console.log(`Créditos inicializados para usuário ${userId} no plano ${plan.name}`);
  } catch (error) {
    console.error("Erro ao inicializar créditos do usuário:", error);
    throw error;
  }
}

