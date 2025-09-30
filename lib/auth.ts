import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getAuthSession = async () => {
  const supabase = createServerComponentClient({ cookies });
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        image: user.user_metadata?.avatar_url || null,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        completedOnboarding: user.user_metadata?.completedOnboarding || false,
        surname: user.user_metadata?.surname || null,
      }
    };
  } catch (error) {
    console.error('Erro ao obter sessão:', error);
    return null;
  }
};

