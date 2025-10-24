const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({
            take: 10,
            select: {
                id: true,
                email: true,
                name: true,
                hashedPassword: true
            }
        });
        
        console.log('\n=== USUARIOS DO PRODIFY ===\n');
        users.forEach(user => {
            console.log(`ID: ${user.id}`);
            console.log(`Email: ${user.email}`);
            console.log(`Name: ${user.name}`);
            console.log(`Password Hash: ${user.hashedPassword ? user.hashedPassword.substring(0, 30) + '...' : 'NO PASSWORD'}`);
            console.log('---');
        });
        
        console.log(`\nTotal: ${users.length} usuarios\n`);
    } catch (error) {
        console.error('Erro:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();

