import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-config';
import { purchaseExtraPoints } from '@/lib/points-system';
import { db } from '@/lib/db';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  // Verificar se é uma compra de pontos
  if (session.metadata?.type === 'points_purchase') {
    const userId = session.metadata.userId;
    const packageId = session.metadata.packageId;
    const extraPoints = parseInt(session.metadata.extraPoints);

    if (!userId || !packageId) {
      console.error('Missing metadata in checkout session:', session.metadata);
      return;
    }

    try {
      // Adicionar pontos extras ao usuário
      const result = await purchaseExtraPoints(userId, packageId);
      
      if (result.success) {
        console.log(`Points added successfully for user ${userId}: ${extraPoints} points`);
        
        // Registrar a compra no banco (opcional)
        await db.usageLog.create({
          data: {
            userId,
            appId: 4, // PRODIFY app ID
            actionType: 'points_purchase',
            pointsUsed: -extraPoints // Negativo porque são pontos adicionados
          }
        });
      } else {
        console.error('Failed to add points:', result.message);
      }
    } catch (error) {
      console.error('Error processing points purchase:', error);
    }
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  // Log do pagamento bem-sucedido
  console.log('Payment succeeded:', paymentIntent.id);
}
