import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:password@localhost:8010/super_productive'
    }
  }
});

async function debugUserPoints() {
  try {
    console.log('🔍 Buscando todos os usuários...');
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        planId: true,
        cycleStart: true,
        plan: {
          select: {
            id: true,
            name: true,
            priceUsd: true
          }
        }
      }
    });

    console.log(`📊 Total de usuários encontrados: ${users.length}`);
    
    for (const user of users) {
      console.log(`
👤 Usuário: ${user.id}
📧 Email: ${user.email || 'N/A'}
👤 Username: ${user.username || 'N/A'}
📋 Plano ID: ${user.planId}
📋 Plano Nome: ${user.plan?.name || 'N/A'}
💰 Preço do Plano: $${user.plan?.priceUsd || 'N/A'}
📅 Início do Ciclo: ${user.cycleStart}
---`);
    }

    // Buscar todos os planos
    console.log('\n📋 Planos disponíveis:');
    const plans = await db.plan.findMany();
    for (const plan of plans) {
      console.log(`
ID: ${plan.id}
Nome: ${plan.name}
Preço: $${plan.priceUsd}
---`);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await db.$disconnect();
  }
}

debugUserPoints();
