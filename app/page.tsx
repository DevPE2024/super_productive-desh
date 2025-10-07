import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

export default async function Home() {
  console.log('=== PÁGINA INICIAL EXECUTADA ===');
  
  const session = await getAuthSession();
  console.log('Sessão obtida:', session);
  
  // Se o usuário está logado
  if (session) {
    console.log('Usuário logado, completedOnboarding:', session.user.completedOnboarding);
    
    // Se completou o onboarding, redirecionar para dashboard
    if (session.user.completedOnboarding) {
      console.log('Redirecionando para /en/dashboard');
      redirect("/en/dashboard");
    } else {
      // Se não completou o onboarding, redirecionar para onboarding
      console.log('Redirecionando para /en/onboarding');
      redirect("/en/onboarding");
    }
  }
  
  // Se não está logado, redirecionar para sign-in
  console.log('Usuário não logado, redirecionando para /en/sign-in');
  redirect("/en/sign-in");
}


