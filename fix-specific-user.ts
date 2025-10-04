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
    console.log('🔧 Corrigindo usuário específico com 600 pontos...');
    
    // Corrigir o usuário test-user-id-123 que tem 600 pontos
    const result = await db.user.update({
      where: {
        id: 'test-user-id-123'
      },
      data: {
        pointsBalance: 10
      }
    });
    
    console.log('✅ Usuário corrigido:', result);
    console.log(`📧 Email: ${result.email}`);
    console.log(`💰 Pontos atualizados para: ${result.pointsBalance}`);
    
  } catch (error) {
    console.error('❌ Erro ao corrigir usuário:', error);
  } finally {
    await db.$disconnect();
  }
}

fixSpecificUser();