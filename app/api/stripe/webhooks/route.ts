import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { planMapping } from "@/lib/stripe-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover"
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json(
      { error: `Webhook error: ${err.message}` },
      { status: 400 }
    );
  }

  // Check if event already processed to avoid duplication
  const existingEvent = await db.stripeEvent.findUnique({
    where: { eventId: event.id },
  });

  if (existingEvent) {
    console.log(`Event ${event.id} already processed`);
    return NextResponse.json({ received: true });
  }

  // Register event to avoid duplication
  try {
    await db.stripeEvent.create({
      data: {
        eventId: event.id,
        type: event.type,
        payload: JSON.parse(JSON.stringify(event.data)),
      },
    });
  } catch (error) {
    console.error("Error saving Stripe event:", error);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (!session.customer || !session.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  // Buscar plano pelo stripePriceId
  const plan = await db.plan.findFirst({
    where: { stripePriceId: priceId },
  });

  if (!plan) return;

  // Buscar usuário pelo stripeCustomerId
  const user = await db.user.findFirst({
    where: { stripeCustomerId: session.customer as string },
  });

  if (!user) return;

  // Atualizar usuário com novo plano
  await db.user.update({
    where: { id: user.id },
    data: {
      planId: plan.id,
      pointsBalance: plan.pointsPerMonth,
      renewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    },
  });

  console.log(`Usuário ${user.id} atualizado para plano ${plan.name}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // Verificar se o invoice tem customer e subscription
  if (!invoice.customer) return;
  
  // Para invoices, precisamos buscar a subscription através do customer
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id;
  
  // Buscar todas as subscriptions ativas do customer
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });
  
  if (subscriptions.data.length === 0) return;
  
  const subscription = subscriptions.data[0];
  const priceId = subscription.items.data[0]?.price.id;
  if (!priceId) return;

  // Buscar plano pelo stripePriceId
  const plan = await db.plan.findFirst({
    where: { stripePriceId: priceId },
  });

  if (!plan) return;

  // Buscar usuário pelo stripeCustomerId
  const user = await db.user.findFirst({
    where: { stripeCustomerId: invoice.customer as string },
  });

  if (!user) return;

  // Renovar pontos mensais
  await db.user.update({
    where: { id: user.id },
    data: {
      pointsBalance: plan.pointsPerMonth,
      renewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    },
  });

  console.log(`Pontos renovados para usuário ${user.id}`);
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Buscar usuário pelo stripeCustomerId
  const user = await db.user.findFirst({
    where: { stripeCustomerId: customerId },
  });

  if (!user) return;

  // Buscar plano Free
  const freePlan = await db.plan.findFirst({
    where: { name: "Free" },
  });

  if (!freePlan) return;

  // Reverter para plano Free
  await db.user.update({
    where: { id: user.id },
    data: {
      planId: freePlan.id,
      pointsBalance: freePlan.pointsPerMonth,
      renewDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
    },
  });

  console.log(`Usuário ${user.id} revertido para plano Free`);
}