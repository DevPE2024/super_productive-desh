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
      console.log('Redirecionando para /dashboard');
      redirect("/dashboard");
    } else {
      // Se não completou o onboarding, redirecionar para onboarding
      console.log('Redirecionando para /onboarding');
      redirect("/onboarding");
    }
  }
  
  // Se não está logado, redirecionar para sign-in
  console.log('Usuário não logado, redirecionando para /sign-in');
  redirect("/sign-in");
}

