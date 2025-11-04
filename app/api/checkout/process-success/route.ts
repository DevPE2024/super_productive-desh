import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { PLANS } from '../../../../lib/stripe-config';
import { initializeUserCredits } from '../../../../lib/credit-manager';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, planName, userId } = await request.json();

    console.log('Processando checkout success:', { sessionId, planName, userId });

    // Validar parâmetros obrigatórios
    if (!sessionId || !planName || !userId) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros obrigatórios ausentes' },
        { status: 400 }
      );
    }

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Obter planos disponíveis
    const plans = Object.values(PLANS);
    const targetPlan = plans.find((plan) => plan.name === planName);

    if (!targetPlan) {
      return NextResponse.json(
        { success: false, error: 'Plano não encontrado' },
        { status: 400 }
      );
    }

    console.log('Plano encontrado:', targetPlan);

    // Calcular datas do ciclo
    const cycleStart = new Date();
    const cycleEnd = new Date();
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    // Atualizar plano do usuário
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        planId: targetPlan?.id,
        cycleStart: cycleStart,
        cycleEnd: cycleEnd,
      }
    });

    console.log('Usuário atualizado:', {
      id: updatedUser.id,
      planId: updatedUser.planId,
      cycleStart: updatedUser.cycleStart,
      cycleEnd: updatedUser.cycleEnd
    });

    // Inicializar créditos do usuário para o novo plano
    try {
      await initializeUserCredits(userId, targetPlan?.id || 1);
      console.log('Créditos inicializados para o usuário:', userId);
    } catch (creditsError) {
      console.error('Erro ao inicializar créditos:', creditsError);
      // Não falhar a operação se os créditos não puderem ser inicializados
    }

    // Registrar evento de checkout processado
    try {
      await db.stripeEvent.create({
        data: {
          eventId: `checkout_success_${sessionId}_${Date.now()}`,
          type: 'checkout.session.completed',
          payload: {
            sessionId,
            planName,
            userId,
            processedAt: new Date().toISOString()
          }
        }
      });
    } catch (eventError) {
      console.error('Erro ao registrar evento:', eventError);
      // Não falhar a operação se o evento não puder ser registrado
    }

    return NextResponse.json({
      success: true,
      message: 'Plano atualizado com sucesso',
      data: {
        userId: updatedUser.id,
        planId: updatedUser.planId,
        planName: targetPlan?.name,
        cycleStart: updatedUser.cycleStart,
        cycleEnd: updatedUser.cycleEnd
      }
    });

  } catch (error) {
    console.error('Erro ao processar checkout success:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
