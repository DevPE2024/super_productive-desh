// Sistema de Pontos - Constantes e Lógica baseado no arquivo preco.txt
export const ACTION_COSTS = {
  // Prodify - Gratuito
  task_basic: 0,
  mindmap_simple: 0,
  pomodoro: 0,
  analytics_basic: 0,
  
  // Prodify - Premium
  mindmap_collab: 1,
  analytics_advanced: 1,
  
  // Onlook - Desenvolvimento
  ai_code_edit: 2,
  nextjs_project_generation: 5,
  
  // Jaaz - Criação de Conteúdo
  image_generation: 5,
  image_advanced: 8,
  video_short: 10,
  video_long: 20, // Apenas no Enterprise
  
  // Perplexica - Pesquisa
  search_basic: 2,
  search_advanced: 3,
  
  // Open WebUI - IA
  ai_chat_message: 1,
  rag_query: 4,
  
  // Hoppscotch - API Testing
  api_test_basic: 0,
  api_test_collab: 1,
  
  // Ações legadas (manter compatibilidade)
  video_generation: 10,
  search_perplexica: 3,
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

// Função para consumir pontos com verificação de plano
export async function consumePoints(
  userId: string, 
  actionType: ActionType
): Promise<PointsConsumptionResult> {
  const cost = ACTION_COSTS[actionType];
  
  try {
    // Importação dinâmica para evitar problemas de circular dependency
    const { db } = await import('./db');
    
    // Buscar usuário com assinatura ativa
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { 
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    // Obter plano ativo (se houver)
    const activeSubscription = user.subscriptions[0];
    const planName = activeSubscription?.plan?.name || "Free";

    // Verificar se a ação é permitida no plano do usuário
    const planRestrictions = getPlanRestrictions(planName);
    if (!planRestrictions.allowedActions.includes(actionType)) {
      return {
        success: false,
        message: `Ação não permitida no plano ${planName}. Faça upgrade para acessar esta funcionalidade.`
      };
    }

    // Se a ação é gratuita, não precisa debitar pontos
    if (cost === 0) {
      // Registrar log de uso mesmo para ações gratuitas
      await db.usageLog.create({
        data: {
          userId,
          appId: 1, // Assumindo app ID 1 para sistema de pontos
          actionType,
          pointsUsed: 0
        }
      });

      return { 
        success: true, 
        remaining: 0 // Placeholder - pointsBalance não existe
      };
    }

    // Placeholder - sistema de pontos não implementado completamente
    // Registrar log de uso
    await db.usageLog.create({
      data: {
        userId,
        appId: 1, // Assumindo app ID 1 para sistema de pontos
        actionType,
        pointsUsed: cost
      }
    });

    return { 
      success: true, 
      remaining: 0 // Placeholder - pointsBalance não existe
    };
  } catch (error) {
    console.error('Erro ao consumir pontos:', error);
    return { 
      success: false, 
      message: "Erro interno do servidor" 
    };
  }
}

// Obter restrições por plano baseado no arquivo preco.txt
export function getPlanRestrictions(planName: string) {
  const restrictions = {
    Free: {
      allowedActions: [
        "task_basic", "mindmap_simple", "pomodoro", "analytics_basic",
        "search_basic", "ai_chat_message", "api_test_basic", "image_generation"
      ] as ActionType[],
      maxWorkspaces: 3,
      features: ["basic_tasks", "simple_mindmaps", "basic_api_testing"]
    },
    Pro: {
      allowedActions: [
        "task_basic", "mindmap_simple", "pomodoro", "analytics_basic",
        "mindmap_collab", "analytics_advanced", "ai_code_edit", "nextjs_project_generation",
        "image_generation", "image_advanced", "video_short", "search_basic", "search_advanced",
        "ai_chat_message", "rag_query", "api_test_basic", "api_test_collab",
        // Ações legadas
        "video_generation", "search_perplexica", "mind_map_ai_generation", "task_ai_suggestion"
      ] as ActionType[],
      maxWorkspaces: -1, // Ilimitado
      features: ["all_prodify", "onlook_ai", "jaaz_images_videos", "perplexica_all", "openwebui_rag", "hoppscotch_collab"]
    },
    Enterprise: {
      allowedActions: Object.keys(ACTION_COSTS) as ActionType[], // Todas as ações
      maxWorkspaces: -1, // Ilimitado
      features: ["everything", "long_videos", "external_models", "advanced_permissions", "custom_branding", "integrations"]
    }
  };
  
  return restrictions[planName as keyof typeof restrictions] || restrictions.Free;
}

// Função para obter informações de pontos do usuário
export async function getUserPointsInfo(userId: string): Promise<UserPointsInfo | null> {
  try {
    const { db } = await import('./db');
    
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { 
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });

    if (!user) {
      return null;
    }

    // Obter plano ativo (se houver)
    const activeSubscription = user.subscriptions[0];
    const plan = activeSubscription?.plan;

    return {
      pointsBalance: 0, // Placeholder - campo não existe no schema
      planName: plan?.name || "Free",
      pointsPerMonth: 0, // Placeholder - campo não existe no schema
      renewDate: activeSubscription?.currentPeriodEnd || new Date()
    };
  } catch (error) {
    console.error('Erro ao buscar informações de pontos:', error);
    return null;
  }
}

// Função para renovação mensal automática
export async function renewMonthlyPoints(): Promise<void> {
  try {
    const { db } = await import('./db');
    
    // Buscar usuários com assinaturas ativas que precisam de renovação
    const usersToRenew = await db.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'active',
            currentPeriodEnd: {
              lte: new Date()
            }
          }
        }
      },
      include: { 
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true }
        }
      }
    });

    for (const user of usersToRenew) {
      const activeSubscription = user.subscriptions[0];
      if (activeSubscription?.plan) {
        // Resetar pontos para o valor do plano
        const nextRenewDate = new Date(activeSubscription.currentPeriodEnd);
        nextRenewDate.setMonth(nextRenewDate.getMonth() + 1);

        // Atualizar ciclo do usuário (removendo pointsBalance que não existe)
        await db.user.update({
          where: { id: user.id },
          data: {
            cycleStart: new Date(),
            cycleEnd: nextRenewDate
          }
        });

        // Atualizar a data de renovação da assinatura
        await db.subscription.update({
          where: { id: activeSubscription.id },
          data: {
            currentPeriodEnd: nextRenewDate
          }
        });
      }
    }

    console.log(`Renovação de pontos concluída para ${usersToRenew.length} usuários`);
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
    
    // Buscar pacote de pontos (assumindo que não existe na schema atual)
    // const pointsPackage = await db.extraPointsPackage.findUnique({
    //   where: { id: packageId }
    // });

    // if (!pointsPackage) {
    //   return { success: false, message: "Pacote de pontos não encontrado" };
    // }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    // Placeholder - sistema de pontos não implementado completamente
    // Atualizar saldo do usuário (removendo pointsBalance que não existe)
    // const updatedUser = await db.user.update({
    //   where: { id: userId },
    //   data: {
    //     pointsBalance: user.pointsBalance + pointsPackage.points
    //   }
    // });

    // Registrar a compra (assumindo que não existe na schema atual)
    // await db.pointsPurchase.create({
    //   data: {
    //     userId,
    //     packageId,
    //     pointsAdded: pointsPackage.points,
    //     amountPaid: pointsPackage.price
    //   }
    // });

    return {
      success: false,
      message: "Sistema de pontos não implementado completamente",
      newBalance: 0
    };
  } catch (error) {
    console.error('Erro ao comprar pontos extras:', error);
    return { success: false, message: "Erro interno do servidor" };
  }
}

