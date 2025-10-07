import { PrismaClient, AppKey, App } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar aplicativos
  const apps = await Promise.all([
    prisma.app.upsert({
      where: { key: AppKey.PRODIFY },
      update: {},
      create: { key: AppKey.PRODIFY, name: 'Prodify Hub' }
    }),
    prisma.app.upsert({
      where: { key: AppKey.ONSCOPE },
      update: {},
      create: { key: AppKey.ONSCOPE, name: 'OnScope' }
    }),
    prisma.app.upsert({
      where: { key: AppKey.JAZZUP },
      update: {},
      create: { key: AppKey.JAZZUP, name: 'JazzUp' }
    }),
    prisma.app.upsert({
      where: { key: AppKey.DEEPQUEST },
      update: {},
      create: { key: AppKey.DEEPQUEST, name: 'DeepQuest' }
    }),
    prisma.app.upsert({
      where: { key: AppKey.OPENUIX },
      update: {},
      create: { key: AppKey.OPENUIX, name: 'OpenUIX' }
    }),
    prisma.app.upsert({
      where: { key: AppKey.TESTPATH },
      update: {},
      create: { key: AppKey.TESTPATH, name: 'TestPath' }
    })
  ]);

  console.log('Aplicativos criados:', apps);

  // Criar planos
  const freePlan = await prisma.plan.upsert({
    where: { name: 'Free' },
    update: {},
    create: {
      name: 'Free',
      priceUsd: 0,
      stripePriceId: null
    }
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: 'Pro' },
    update: {},
    create: {
      name: 'Pro',
      priceUsd: 25,
      stripePriceId: null // Será preenchido quando configurar o Stripe
    }
  });

  const maxPlan = await prisma.plan.upsert({
    where: { name: 'Max' },
    update: {},
    create: {
      name: 'Max',
      priceUsd: 60,
      stripePriceId: null // Será preenchido quando configurar o Stripe
    }
  });

  console.log('Planos criados:', { freePlan, proPlan, maxPlan });

  // Criar alocações de créditos por plano e app
  const allocations = [
    // Free Plan
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.PRODIFY)!.id, monthlyPoints: null }, // Ilimitado
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.ONSCOPE)!.id, monthlyPoints: 10 },
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.JAZZUP)!.id, monthlyPoints: 10 },
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.DEEPQUEST)!.id, monthlyPoints: 10 },
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.OPENUIX)!.id, monthlyPoints: 10 },
    { planId: freePlan.id, appId: apps.find((a: App) => a.key === AppKey.TESTPATH)!.id, monthlyPoints: null }, // Ilimitado

    // Pro Plan
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.PRODIFY)!.id, monthlyPoints: null }, // Ilimitado
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.ONSCOPE)!.id, monthlyPoints: 100 },
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.JAZZUP)!.id, monthlyPoints: 100 },
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.DEEPQUEST)!.id, monthlyPoints: 100 },
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.OPENUIX)!.id, monthlyPoints: 100 },
    { planId: proPlan.id, appId: apps.find((a: App) => a.key === AppKey.TESTPATH)!.id, monthlyPoints: null }, // Ilimitado

    // Max Plan
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.PRODIFY)!.id, monthlyPoints: null }, // Ilimitado
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.ONSCOPE)!.id, monthlyPoints: 200 },
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.JAZZUP)!.id, monthlyPoints: 200 },
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.DEEPQUEST)!.id, monthlyPoints: 200 },
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.OPENUIX)!.id, monthlyPoints: 200 },
    { planId: maxPlan.id, appId: apps.find((a: App) => a.key === AppKey.TESTPATH)!.id, monthlyPoints: null }, // Ilimitado
  ];

  for (const allocation of allocations) {
    await prisma.planAppAllocation.upsert({
      where: {
        planId_appId: {
          planId: allocation.planId,
          appId: allocation.appId
        }
      },
      update: { monthlyPoints: allocation.monthlyPoints },
      create: allocation
    });
  }

  console.log('Alocações de créditos criadas');
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
