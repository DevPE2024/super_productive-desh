import { db } from './db';
import { initializeUserCredits } from './credit-manager';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover'
});

// Função para criar uma nova assinatura
export async function createSubscription(
  userId: string,
  stripeSubscriptionId: string,
  planId: number,
  status: string,
  currentPeriodStart: Date,
  currentPeriodEnd: Date
) {
  try {
    const subscription = await db.subscription.create({
      data: {
        userId,
        stripeSubscriptionId,
        planId,
        status,
        currentPeriodStart,
        currentPeriodEnd
      }
    });

    // Inicializar créditos do usuário baseado no novo plano
    await initializeUserCredits(userId, planId);

    return subscription;
  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    throw error;
  }
}

// Função para atualizar o status de uma assinatura
export async function updateSubscriptionStatus(
  subscriptionId: string,
  status: string,
  currentPeriodStart?: Date,
  currentPeriodEnd?: Date
) {
  try {
    const updateData: {
      status: string;
      currentPeriodStart?: Date;
      currentPeriodEnd?: Date;
    } = { status };
    
    if (currentPeriodStart) {
      updateData.currentPeriodStart = currentPeriodStart;
    }
    if (currentPeriodEnd) {
      updateData.currentPeriodEnd = currentPeriodEnd;
    }

    const subscription = await db.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: updateData
    });

    return subscription;
  } catch (error) {
    console.error('Erro ao atualizar status da assinatura:', error);
    throw error;
  }
}

// Função para cancelar uma assinatura
export async function cancelSubscription(userId: string) {
  try {
    const subscription = await db.subscription.findFirst({
      where: { userId }
    });

    if (!subscription) {
      return { success: false, error: 'Assinatura não encontrada' };
    }

    // Cancelar no Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Atualizar status no banco
    await db.subscription.update({
      where: { id: subscription.id },
      data: { status: 'canceled' }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
}

// Função para obter a assinatura ativa de um usuário
export async function getUserActiveSubscription(userId: string) {
  try {
    const subscription = await db.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing', 'past_due']
        }
      },
      include: {
        plan: true
      }
    });

    return subscription;
  } catch (error) {
    console.error('Erro ao buscar assinatura ativa:', error);
    throw error;
  }
}

// Função para verificar assinaturas expirando
export async function checkExpiringSubscriptions() {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringSubscriptions = await db.subscription.findMany({
      where: {
        currentPeriodEnd: {
          lte: threeDaysFromNow
        },
        status: 'active'
      },
      include: {
        user: true,
        plan: true
      }
    });

    return expiringSubscriptions;
  } catch (error) {
    console.error('Erro ao verificar assinaturas expirando:', error);
    throw error;
  }
}

// Função para processar renovação de assinatura
export async function processSubscriptionRenewal(
  stripeSubscriptionId: string,
  newPeriodStart: Date,
  newPeriodEnd: Date
) {
  try {
    const subscription = await db.subscription.update({
      where: { stripeSubscriptionId },
      data: {
        currentPeriodStart: newPeriodStart,
        currentPeriodEnd: newPeriodEnd
      },
      include: {
        user: true
      }
    });

    // Resetar créditos mensais do usuário
    if (subscription.user) {
      await initializeUserCredits(subscription.user.id, subscription.planId);
    }

    return subscription;
  } catch (error) {
    console.error('Erro ao processar renovação de assinatura:', error);
    throw error;
  }
}

// Função para obter estatísticas de assinaturas
export async function getSubscriptionStats() {
  try {
    const stats = await db.subscription.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const totalSubscriptions = await db.subscription.count();

    return {
      total: totalSubscriptions,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas de assinaturas:', error);
    throw error;
  }
}

