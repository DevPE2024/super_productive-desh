import { getAuthSession } from "./auth";

export const checkIfUserCompletedOnboarding = async (redirectPath?: string) => {
  try {
    const authResult = await getAuthSession();
    
    if (!authResult || !authResult.user) {
      console.log("Usuário não autenticado");
      return null;
    }

    const { user } = authResult;

    // Como estamos usando apenas Supabase Auth, assumimos que o usuário completou onboarding
    // se ele está autenticado
    console.log("Verificação de onboarding:", {
      userId: user.id,
      completedOnboarding: user.completedOnboarding || true
    });

    return { user, completedOnboarding: user.completedOnboarding || true };
  } catch (error) {
    console.error("Erro ao verificar onboarding:", error);
    return null;
  }
};


