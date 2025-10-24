const { PrismaClient, AppKey } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const userEmail = 'testeagora@affinify.com';
    const creditsToAdd = 50;
    
    console.log(`\n🔧 Adicionando créditos para ${userEmail}...`);
    
    try {
        // 1. Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });
        
        if (!user) {
            console.log(`❌ Usuário ${userEmail} não encontrado!`);
            return;
        }
        
        console.log(`✅ Usuário encontrado: ${user.name}`);
        
        // 2. Buscar app OpenUIX
        let openuixApp = await prisma.app.findFirst({
            where: { key: AppKey.OPENUIX }
        });
        
        if (!openuixApp) {
            console.log(`📝 Criando app OpenUIX...`);
            openuixApp = await prisma.app.create({
                data: {
                    name: 'OpenUIX',
                    key: AppKey.OPENUIX,
                    description: 'AI Interface Platform'
                }
            });
        }
        
        console.log(`✅ App OpenUIX: ${openuixApp.name}`);
        
        // 3. Verificar se já tem saldo
        let balance = await prisma.userAppBalance.findUnique({
            where: {
                userId_appId: {
                    userId: user.id,
                    appId: openuixApp.id
                }
            }
        });
        
        if (balance) {
            // Atualizar saldo existente
            balance = await prisma.userAppBalance.update({
                where: {
                    userId_appId: {
                        userId: user.id,
                        appId: openuixApp.id
                    }
                },
                data: {
                    remaining: balance.remaining + creditsToAdd
                }
            });
            
            console.log(`✅ Créditos atualizados: ${balance.remaining} (adicionou +${creditsToAdd})`);
        } else {
            // Criar novo saldo
            balance = await prisma.userAppBalance.create({
                data: {
                    userId: user.id,
                    appId: openuixApp.id,
                    remaining: creditsToAdd
                }
            });
            
            console.log(`✅ Saldo criado: ${balance.remaining} créditos`);
        }
        
        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ SUCESSO!`);
        console.log(`${'='.repeat(60)}`);
        console.log(`   Usuário: ${userEmail}`);
        console.log(`   Créditos OpenUIX: ${balance.remaining}`);
        console.log(`${'='.repeat(60)}\n`);
        
    } catch (error) {
        console.error(`❌ Erro:`, error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();

