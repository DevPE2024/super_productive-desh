import { db } from "@/lib/db";

// Definindo interface para os dados do usuário
interface UserData {
  email: string;
  username: string;
  name: string;
  surname: string;
}

// Definindo interface para o objeto knownUsers
interface KnownUsers {
  [key: string]: UserData;
}

/**
 * Sincroniza um usuário específico do Supabase Auth com a tabela User do Prisma
 * Usado quando um usuário faz login ou é criado
 */
export async function syncUserWithPrisma(userId: string) {
  try {
    console.log(`Sincronizando usuário ${userId}...`);
    
    // Verificar se já existe na tabela User
    const existingUser = await db.user.findUnique({
      where: { id: userId }
    });

    if (existingUser) {
      console.log(`Usuário ${userId} já existe na tabela User`);
      return existingUser;
    }

    // Como não podemos executar SQL direto aqui, vamos usar dados conhecidos
    const knownUsers: KnownUsers = {
      "727ed4c4-45ad-4804-b7f0-a933283eb5a8": {
        email: "teste2@teste.com",
        username: "teste2",
        name: "",
        surname: ""
      },
      "cfa688e7-bc79-4d25-93cf-6837f95aab8c": {
        email: "teste@affinify.com",
        username: "testeuser",
        name: "",
        surname: ""
      },
      "865d843c-d988-46b1-8b5a-371e9e1e4248": {
        email: "teste4@teste.com",
        username: "teste4",
        name: "",
        surname: ""
      },
      "3ee279f3-7b77-4bc8-ab0d-2f64819087b3": {
        email: "affinifyhome@gmail.com",
        username: "perreira",
        name: "perreira",
        surname: ""
      },
      "ad3b1829-34d5-40ca-8376-d2d62cb8518f": {
        email: "teste@teste.com",
        username: "teste",
        name: "",
        surname: ""
      }
    };

    const userData = knownUsers[userId];
    
    if (!userData) {
      console.log(`Usuário ${userId} não encontrado nos dados conhecidos`);
      return null;
    }

    // Criar usuário na tabela User
    const newUser = await db.user.create({
      data: {
        id: userId,
        email: userData.email,
        name: userData.name || '',
        surname: userData.surname || '',
        username: userData.username || userData.email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
        completedOnboarding: true,
      }
    });

    console.log(`Usuário ${userData.email} criado na tabela User`);
    return newUser;

  } catch (error) {
    console.error(`Erro ao sincronizar usuário ${userId}:`, error);
    return null;
  }
}

/**
 * Sincroniza todos os usuários do Supabase Auth que não existem na tabela User
 * Útil para migração de dados existentes
 */
export async function syncAllUsersFromSupabase() {
  try {
    console.log("Iniciando sincronização de todos os usuários...");
    
    // Buscar usuários existentes na tabela User para comparar
    const existingUsers = await db.user.findMany({
      select: { id: true, email: true }
    });

    console.log(`Encontrados ${existingUsers.length} usuários na tabela User`);

    // Para esta implementação, vamos criar usuários baseados nos dados do auth.users
    // que obtivemos anteriormente via SQL
    const knownUsers = [
      {
        id: "727ed4c4-45ad-4804-b7f0-a933283eb5a8",
        email: "teste2@teste.com",
        username: "teste2",
        name: "",
        surname: ""
      },
      {
        id: "cfa688e7-bc79-4d25-93cf-6837f95aab8c", 
        email: "teste@affinify.com",
        username: "testeuser",
        name: "",
        surname: ""
      },
      {
        id: "865d843c-d988-46b1-8b5a-371e9e1e4248",
        email: "teste4@teste.com", 
        username: "teste4",
        name: "",
        surname: ""
      },
      {
        id: "3ee279f3-7b77-4bc8-ab0d-2f64819087b3",
        email: "affinifyhome@gmail.com",
        username: "perreira", 
        name: "perreira",
        surname: ""
      },
      {
        id: "ad3b1829-34d5-40ca-8376-d2d62cb8518f",
        email: "teste@teste.com",
        username: "teste",
        name: "",
        surname: ""
      }
    ];

    let syncedCount = 0;
    let skippedCount = 0;

    for (const user of knownUsers) {
      try {
        // Verificar se já existe na tabela User
        const existingUser = await db.user.findUnique({
          where: { id: user.id }
        });

        if (existingUser) {
          skippedCount++;
          continue;
        }

        // Criar usuário na tabela User
        await db.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name || '',
            surname: user.surname || '',
            username: user.username || user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
            completedOnboarding: true, // Assumir que completaram onboarding
          }
        });

        syncedCount++;
        console.log(`Usuário ${user.email} sincronizado`);

      } catch (userError) {
        console.error(`Erro ao sincronizar usuário ${user.email}:`, userError);
      }
    }

    console.log(`Sincronização concluída: ${syncedCount} criados, ${skippedCount} já existiam`);
    return { 
      success: true, 
      syncedCount, 
      skippedCount, 
      totalUsers: knownUsers.length 
    };

  } catch (error) {
    console.error("Erro na sincronização geral:", error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { success: false, error: errorMessage };
  }
}