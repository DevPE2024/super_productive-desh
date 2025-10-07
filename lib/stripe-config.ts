import Stripe from 'stripe';
import { db } from './db';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover'
});

// Configuração dos planos
export const PLANS = {
  FREE: {
    id: 1,
    name: 'Free',
    priceId: null,
    price: 0,
    credits: {
      MINDMAP_GENERATOR: 5,
      TASK_MANAGER: 10,
      WORKSPACE_MANAGER: 3,
      NOTIFICATION_SYSTEM: 20,
      CONVERSATION_MANAGER: 15
    }
  },
  PRO: {
    id: 2,
    name: 'Pro',
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 25,
    credits: {
      MINDMAP_GENERATOR: 100,
      TASK_MANAGER: 200,
      WORKSPACE_MANAGER: 50,
      NOTIFICATION_SYSTEM: 500,
      CONVERSATION_MANAGER: 300
    }
  },
  MAX: {
    id: 3,
    name: 'Max',
    priceId: process.env.STRIPE_MAX_PRICE_ID!,
    price: 60,
    credits: {
      MINDMAP_GENERATOR: 500,
      TASK_MANAGER: 1000,
      WORKSPACE_MANAGER: 200,
      NOTIFICATION_SYSTEM: 2000,
      CONVERSATION_MANAGER: 1500
    }
  }
};

// Função para obter plano por priceId
export function getPlanByPriceId(priceId: string) {
  return Object.values(PLANS).find(plan => plan.priceId === priceId);
}

// Função para validar priceId
export function isValidPriceId(priceId: string): boolean {
  return Object.values(PLANS).some(plan => plan.priceId === priceId);
}

// Função para criar sessão de checkout
export async function createCheckoutSession(
  priceId: string,
  userId: string,
  successUrl: string,
  cancelUrl: string
) {
  try {
    // Verificar se o priceId é válido
    if (!isValidPriceId(priceId)) {
      throw new Error('Price ID inválido');
    }

    // Buscar ou criar customer no Stripe
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: userId
        }
      });
      
      customerId = customer.id;
      
      // Atualizar o usuário com o customer ID
      await db.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId,
        priceId: priceId
      }
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
}

// Função para obter informações do customer
export async function getCustomerInfo(customerId: string) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    console.error('Erro ao buscar informações do customer:', error);
    throw error;
  }
}

// Função para obter assinaturas do customer
export async function getCustomerSubscriptions(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all'
    });
    return subscriptions;
  } catch (error) {
    console.error('Erro ao buscar assinaturas do customer:', error);
    throw error;
  }
}

// Função para cancelar assinatura no Stripe
export async function cancelStripeSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Erro ao cancelar assinatura no Stripe:', error);
    throw error;
  }
}

// Função para atualizar assinatura
export async function updateStripeSubscription(
  subscriptionId: string,
  priceId: string
) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId
      }]
    });
    
    return updatedSubscription;
  } catch (error) {
    console.error('Erro ao atualizar assinatura no Stripe:', error);
    throw error;
  }
}

