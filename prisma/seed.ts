import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar planos
  const starterPlan = await prisma.plan.upsert({
    where: { name: 'Starter' },
    update: {},
    create: {
      name: 'Starter',
      pointsPerMonth: 10,
      priceUsd: 0
    }
  });

  const professionalPlan = await prisma.plan.upsert({
    where: { name: 'Professional' },
    update: {},
    create: {
      name: 'Professional',
      pointsPerMonth: 300,
      priceUsd: 29
    }
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'Enterprise' },
    update: {},
    create: {
      name: 'Enterprise',
      pointsPerMonth: 500,
      priceUsd: 59
    }
  });

  console.log('Planos criados:', { starterPlan, professionalPlan, enterprisePlan });

  // Criar pacotes de pontos extras - verificar se já existem primeiro
  const existingPackages = await prisma.extraPointsPackage.findMany();
  
  if (existingPackages.length === 0) {
    const packages = await prisma.extraPointsPackage.createMany({
      data: [
        {
          name: "Small Pack",
          extraPoints: 100,
          priceUsd: 10
        },
        {
          name: "Medium Pack",
          extraPoints: 250,
          priceUsd: 20
        },
        {
          name: "Large Pack",
          extraPoints: 500,
          priceUsd: 35
        }
      ],
      skipDuplicates: true
    });

    console.log('Pacotes de pontos criados:', packages);
  } else {
    console.log('Pacotes de pontos já existem, pulando criação...');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });