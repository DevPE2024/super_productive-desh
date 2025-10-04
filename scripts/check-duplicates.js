const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:password@localhost:8010/super_productive?schema=public"
    }
  }
});

async function checkAndCleanDuplicates() {
  try {
    console.log('🔍 Verificando pacotes de pontos...');
    
    // Buscar todos os pacotes
    const packages = await prisma.extraPointsPackage.findMany({
      orderBy: [{ name: 'asc' }, { extraPoints: 'asc' }]
    });
    
    console.log(`📦 Total de pacotes encontrados: ${packages.length}`);
    
    // Mostrar todos os pacotes
    packages.forEach((pkg, index) => {
      console.log(`${index + 1}. ID: ${pkg.id} | Nome: ${pkg.name} | Pontos: ${pkg.extraPoints} | Preço: $${pkg.priceUsd}`);
    });
    
    // Identificar duplicatas por nome e pontos
    const uniquePackages = new Map();
    const duplicates = [];
    
    packages.forEach(pkg => {
      const key = `${pkg.name}-${pkg.extraPoints}`;
      if (uniquePackages.has(key)) {
        duplicates.push(pkg);
      } else {
        uniquePackages.set(key, pkg);
      }
    });
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  Encontradas ${duplicates.length} duplicatas:`);
      duplicates.forEach(dup => {
        console.log(`   - ID: ${dup.id} | Nome: ${dup.name} | Pontos: ${dup.extraPoints}`);
      });
      
      console.log('\n🧹 Removendo duplicatas...');
      for (const duplicate of duplicates) {
        await prisma.extraPointsPackage.delete({
          where: { id: duplicate.id }
        });
        console.log(`   ✅ Removido: ${duplicate.name} (ID: ${duplicate.id})`);
      }
    } else {
      console.log('\n✅ Nenhuma duplicata encontrada!');
    }
    
    // Verificar resultado final
    const finalPackages = await prisma.extraPointsPackage.findMany({
      orderBy: [{ name: 'asc' }, { extraPoints: 'asc' }]
    });
    
    console.log(`\n📊 Resultado final: ${finalPackages.length} pacotes únicos`);
    finalPackages.forEach((pkg, index) => {
      console.log(`${index + 1}. ${pkg.name} - ${pkg.extraPoints} pontos - $${pkg.priceUsd}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndCleanDuplicates();