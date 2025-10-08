import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { stripe } from '@/lib/stripe-config';
import { db } from '@/lib/db';

// Pacotes de pontos disponíveis
const POINT_PACKAGES = {
  'small': {
    id: 'small',
    name: 'Small Pack',
    extraPoints: 100,
    priceUsd: 15,
    stripePriceId: 'price_1SG2eS2MKUskrPofffFwKFkH'
  },
  'medium': {
    id: 'medium', 
    name: 'Medium Pack',
    extraPoints: 250,
    priceUsd: 25,
    stripePriceId: 'price_1SG2eV2MKUskrPof46gKnJWS'
  },
  'large': {
    id: 'large',
    name: 'Large Pack', 
    extraPoints: 500,
    priceUsd: 40,
    stripePriceId: 'price_1SG2eZ2MKUskrPofnrekGE7I'
  }
};

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getAuthSession(request);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { packageId } = await request.json();

    // Validar packageId
    if (!packageId || !POINT_PACKAGES[packageId as keyof typeof POINT_PACKAGES]) {
      return NextResponse.json(
        { success: false, message: 'Pacote inválido' },
        { status: 400 }
      );
    }

    const pointPackage = POINT_PACKAGES[packageId as keyof typeof POINT_PACKAGES];

    // Modo de desenvolvimento - simular compra
    if (process.env.NODE_ENV === 'development' || process.env.STRIPE_DEV_MODE === 'true') {
      console.log('🔧 Modo de desenvolvimento: Simulando compra de pontos');
      
      // Usar a função de compra de pontos existente
      const { purchaseExtraPoints } = await import('@/lib/points-system');
      const result = await purchaseExtraPoints(session.user.id, packageId);
      
      if (result.success) {
        console.log(`✅ Pontos adicionados: ${pointPackage.extraPoints} para usuário ${session.user.id}`);
        
        return NextResponse.json({
          success: true,
          newBalance: result.newBalance,
          message: result.message
        });
      } else {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }
    }

    // Produção - criar sessão de checkout do Stripe
    if (!pointPackage.stripePriceId) {
      return NextResponse.json(
        { success: false, message: 'Price ID não configurado para este pacote' },
        { status: 500 }
      );
    }

    // Buscar ou criar customer no Stripe
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: session.user.id
        }
      });
      
      customerId = customer.id;
      
      // Atualizar o usuário com o customer ID
      await db.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Criar sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: pointPackage.stripePriceId,
          quantity: 1
        }
      ],
      mode: 'payment', // Pagamento único, não assinatura
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/points?success=true&package=${packageId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/points?canceled=true`,
      metadata: {
        userId: session.user.id,
        packageId: packageId,
        extraPoints: pointPackage.extraPoints.toString(),
        type: 'points_purchase'
      }
    });

    return NextResponse.json({
      success: true,
      url: checkoutSession.url
    });

  } catch (error) {
    console.error('Erro ao criar sessão de checkout de pontos:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
