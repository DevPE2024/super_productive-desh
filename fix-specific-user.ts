import { PrismaClient } from '@prisma/client';

const db = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres:password@localhost:8010/super_productive'
    }
  }
});

async function fixSpecificUser() {
  try {
    console.log('🔧 Corrigindo usuário específico...');
    
    // Buscar o plano Free
    const freePlan = await db.plan.findFirst({
      where: { 
        OR: [
          { name: 'Free' },
          { name: 'Starter' }
        ]
      }
    });
    
    // Corrigir o usuário test-user-id-123
    const result = await db.user.update({
      where: {
        id: 'test-user-id-123'
      },
      data: {
        planId: freePlan?.id || 1
      }
    });
    
    console.log('✅ Usuário corrigido:', result);
    console.log(`📧 Email: ${result.email}`);
    console.log(`📋 Plano atualizado para: ${freePlan?.name || 'Free'}`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir usuário:', error);
  } finally {
    await db.$disconnect();
  }
}

fixSpecificUser();
