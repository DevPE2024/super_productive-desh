import { getAuthSession } from "./auth";

export const checkIfUserCompletedOnboarding = async (redirectPath?: string) => {
  try {
    const authResult = await getAuthSession();
    
    if (!authResult || !authResult.user) {
      console.log("Usuário não autenticado");
      return null;
    }

    const { user } = authResult;

    const hasCompletedOnboarding = user.completedOnboarding === true;

    console.log("Verificação de onboarding:", {
      userId: user.id,
      completedOnboarding: user.completedOnboarding,
      hasCompletedOnboarding
    });

    return { user, completedOnboarding: hasCompletedOnboarding };
  } catch (error) {
    console.error("Erro ao verificar onboarding:", error);
    return null;
  }
};


