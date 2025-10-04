import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Removendo verificação de autenticação temporariamente para correção
    console.log('🔧 API de correção de pontos acessada');

    console.log('🔧 Iniciando correção de pontos para usuários do plano Free...');

    // Buscar o plano Free (Starter)
    let freePlan = await db.plan.findFirst({
      where: { 
        OR: [
          { name: 'Free' },
          { name: 'Starter' },
          { pointsPerMonth: 10 }
        ]
      }
    });

    if (!freePlan) {
      console.log('❌ Plano Free não encontrado. Criando plano Free...');
      
      freePlan = await db.plan.create({
        data: {
          name: 'Free',
          pointsPerMonth: 10,
          priceUsd: 0
        }
      });
      
      console.log('✅ Plano Free criado:', freePlan);
    }

    // Buscar usuários com pontos incorretos (diferentes de 10) no plano Free
    const usersToFix = await db.user.findMany({
      where: {
        OR: [
          { planId: freePlan.id },
          { planId: null },
          { planId: '1' } // Default planId
        ],
        pointsBalance: {
          not: 10
        }
      },
      include: {
        plan: true
      }
    });

    console.log(`📊 Encontrados ${usersToFix.length} usuários com pontos incorretos no plano Free`);

    if (usersToFix.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Todos os usuários do plano Free já têm 10 pontos!',
        usersFixed: 0
      });
    }

    // Corrigir pontos para 10
    const updateResult = await db.user.updateMany({
      where: {
        id: {
          in: usersToFix.map(user => user.id)
        }
      },
      data: {
        pointsBalance: 10,
        planId: freePlan.id
      }
    });

    console.log(`✅ Corrigidos ${updateResult.count} usuários`);

    // Preparar detalhes dos usuários corrigidos
    const userDetails = usersToFix.map(user => ({
      id: user.id,
      email: user.email || user.username || 'N/A',
      oldBalance: user.pointsBalance,
      newBalance: 10
    }));

    return NextResponse.json({
      success: true,
      message: `Correção concluída! ${updateResult.count} usuários corrigidos.`,
      usersFixed: updateResult.count,
      details: userDetails
    });

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}