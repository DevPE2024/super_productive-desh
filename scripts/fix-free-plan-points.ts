import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixFreeUserPoints() {
  console.log('🔧 Iniciando correção de pontos para usuários do plano Free...');

  try {
    // Buscar o plano Free (Starter)
    const freePlan = await prisma.plan.findFirst({
      where: { 
        OR: [
          { name: 'Free' },
          { name: 'Starter' }
        ]
      }
    });

    if (!freePlan) {
      console.log('❌ Plano Free não encontrado. Criando plano Free...');
      
      const newFreePlan = await prisma.plan.create({
        data: {
          name: 'Free',
          priceUsd: 0
        }
      });
      
      console.log('✅ Plano Free criado:', newFreePlan);
    }

    // Buscar usuários com pontos incorretos (diferentes de 10) no plano Free
    const usersToFix = await prisma.user.findMany({
      where: {
        OR: [
          { planId: freePlan?.id },
          { planId: null },
          { planId: 1 } // Default planId
        ]
      },
      include: {
        plan: true
      }
    });

    console.log(`📊 Encontrados ${usersToFix.length} usuários com pontos incorretos no plano Free`);

    if (usersToFix.length === 0) {
      console.log('✅ Todos os usuários do plano Free já têm 10 pontos!');
      return;
    }

    // Corrigir pontos para 10
    const updateResult = await prisma.user.updateMany({
      where: {
        id: {
          in: usersToFix.map(user => user.id)
        }
      },
      data: {
        planId: freePlan?.id || 1
      }
    });

    console.log(`✅ Corrigidos ${updateResult.count} usuários`);

    // Mostrar detalhes dos usuários corrigidos
    for (const user of usersToFix) {
      console.log(`  - Usuário ${user.email || user.username || user.id}: plano atualizado para ${freePlan?.name || 'Free'}`);
    }

    console.log('🎉 Correção concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o script
if (require.main === module) {
  fixFreeUserPoints()
    .catch((error) => {
      console.error('Erro fatal:', error);
      process.exit(1);
    });
}

export { fixFreeUserPoints };
