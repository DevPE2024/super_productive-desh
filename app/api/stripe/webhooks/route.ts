import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { stripe, getPlanByPriceId } from "@/lib/stripe-config";
import { createSubscription, updateSubscriptionStatus } from "@/lib/subscription-manager";

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

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
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
  if (!session.metadata?.userId || !session.subscription) return;

  const userId = session.metadata.userId;
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!priceId) return;

  // Buscar configuração do plano pelo priceId
  const planConfig = getPlanByPriceId(priceId);
  if (!planConfig) {
    console.error(`Plano não encontrado para priceId: ${priceId}`);
    return;
  }

  try {
    // Criar assinatura usando o subscription manager
    await createSubscription(
      userId,
      subscription.id,
      planConfig.id,
      subscription.status,
      new Date((subscription as any).current_period_start * 1000),
      new Date((subscription as any).current_period_end * 1000)
    );

    console.log(`Checkout concluído para usuário ${userId}, plano ${planConfig.name}`);
  } catch (error) {
    console.error("Erro ao processar checkout:", error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!(invoice as any).subscription) return;

  const subscriptionId = (invoice as any).subscription as string;
  
  try {
    // Buscar subscription no Stripe para obter dados atualizados
    const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Atualizar status da assinatura
    await updateSubscriptionStatus(
      subscriptionId,
      stripeSubscription.status,
      new Date((stripeSubscription as any).current_period_start * 1000),
      new Date((stripeSubscription as any).current_period_end * 1000)
    );

    console.log(`Pagamento processado para subscription ${subscriptionId}`);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Atualizar status da assinatura
    await updateSubscriptionStatus(
      subscription.id,
      subscription.status,
      new Date((subscription as any).current_period_start * 1000),
      new Date((subscription as any).current_period_end * 1000)
    );

    console.log(`Subscription ${subscription.id} atualizada`);
  } catch (error) {
    console.error("Erro ao atualizar subscription:", error);
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    // Cancelar assinatura usando o subscription manager
    await updateSubscriptionStatus(subscription.id, "canceled");

    console.log(`Subscription ${subscription.id} cancelada`);
  } catch (error) {
    console.error("Erro ao cancelar subscription:", error);
  }
}

