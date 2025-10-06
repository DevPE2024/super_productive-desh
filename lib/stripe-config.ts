import Stripe from "stripe";

// Configuração do Stripe
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  successUrl: `${process.env.NEXTAUTH_URL}/pricing?success=true`,
  cancelUrl: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
  priceIds: {
    pro: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    },
    enterprise: {
      monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!,
      yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID!,
    },
  },
};

// Mapeamento de preços para planos
export const planMapping: Record<string, { name: string; pointsPerMonth: number; billingCycle: 'monthly' | 'yearly' }> = {
  [stripeConfig.priceIds.pro.monthly]: {
    name: "Pro",
    pointsPerMonth: 300,
    billingCycle: "monthly",
  },
  [stripeConfig.priceIds.pro.yearly]: {
    name: "Pro",
    pointsPerMonth: 300,
    billingCycle: "yearly",
  },
  [stripeConfig.priceIds.enterprise.monthly]: {
    name: "Enterprise",
    pointsPerMonth: 500,
    billingCycle: "monthly",
  },
  [stripeConfig.priceIds.enterprise.yearly]: {
    name: "Enterprise",
    pointsPerMonth: 500,
    billingCycle: "yearly",
  },
};

// Função para obter configuração do plano por price ID
export function getPlanByPriceId(priceId: string) {
  return planMapping[priceId] || null;
}

// Função para validar se um price ID é válido
export function isValidPriceId(priceId: string): boolean {
  return priceId in planMapping;
}