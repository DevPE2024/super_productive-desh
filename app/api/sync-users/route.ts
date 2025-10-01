import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase para acessar dados de autenticação
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    console.log("Iniciando sincronização de usuários do Supabase Auth...");
    
    // Buscar todos os usuários do Supabase Auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Erro ao buscar usuários do Supabase Auth:", authError);
      throw new Error(`Erro no Supabase Auth: ${authError.message}`);
    }

    console.log(`Encontrados ${authUsers.users.length} usuários no Supabase Auth`);

    let syncedCount = 0;
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Sincronizar cada usuário
    for (const authUser of authUsers.users) {
      try {
        console.log(`Processando usuário: ${authUser.id} - ${authUser.email}`);
        
        // Verificar se o usuário já existe na tabela User
        const existingUser = await db.user.findUnique({
          where: { id: authUser.id }
        });

        // Preparar dados do usuário com validações mais robustas
        const email = authUser.email || '';
        const fullName = authUser.user_metadata?.full_name || '';
        const nameParts = fullName.split(' ');
        
        const userData = {
          id: authUser.id,
          email: email,
          name: authUser.user_metadata?.name || nameParts[0] || 'Usuário',
          surname: authUser.user_metadata?.surname || nameParts.slice(1).join(' ') || '',
          username: authUser.user_metadata?.username || email.split('@')[0] || `user_${authUser.id.slice(0, 8)}`,
          completedOnboarding: Boolean(authUser.user_metadata?.completed_onboarding),
          image: authUser.user_metadata?.avatar_url || null
        };

        console.log(`Dados preparados para usuário ${authUser.id}:`, {
          email: userData.email,
          name: userData.name,
          username: userData.username
        });

        if (existingUser) {
          // Atualizar usuário existente
          await db.user.update({
            where: { id: authUser.id },
            data: userData
          });
          updatedCount++;
          console.log(`✅ Usuário atualizado: ${userData.email}`);
        } else {
          // Criar novo usuário
          await db.user.create({
            data: userData
          });
          createdCount++;
          console.log(`✅ Usuário criado: ${userData.email}`);
        }

        syncedCount++;
      } catch (userError) {
        errorCount++;
        const errorMsg = `Erro ao sincronizar usuário ${authUser.id} (${authUser.email}): ${userError instanceof Error ? userError.message : 'Erro desconhecido'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        // Continuar com o próximo usuário mesmo se houver erro
      }
    }

    const totalUsers = await db.user.count();

    console.log(`Sincronização concluída: ${syncedCount} usuários processados`);
    console.log(`Criados: ${createdCount}, Atualizados: ${updatedCount}, Erros: ${errorCount}`);

    return NextResponse.json({ 
      success: true, 
      message: "Sincronização de usuários concluída com sucesso",
      stats: {
        totalAuthUsers: authUsers.users.length,
        syncedUsers: syncedCount,
        createdUsers: createdCount,
        updatedUsers: updatedCount,
        errorCount: errorCount,
        totalUsersInDb: totalUsers
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error("Erro na sincronização:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}