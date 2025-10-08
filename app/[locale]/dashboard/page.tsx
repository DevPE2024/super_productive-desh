import Welcoming from "@/components/common/Welcoming";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { HomeRecentActivityContainer } from "@/components/homeRecentActivity/HomeRecentActivityContainer";
import { CheckoutSuccessHandler } from "@/components/checkout/CheckoutSuccessHandler";
import { CreditsOverview } from "@/components/dashboard/CreditsOverview";
import { getInitialHomeRecentActivity } from "@/lib/api";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";

const Dashboard = async () => {
  const session = await checkIfUserCompletedOnboarding("/dashboard");

  if (!session) {
    return null;
  }

  const initialRecentActivity = await getInitialHomeRecentActivity(
    session.user.id
  );

  return (
    <>
      <DashboardHeader />
      <main className="h-full w-full">
        <CheckoutSuccessHandler userId={session.user.id} />
        <Welcoming
          hideOnDesktop
          className="px-4 py-2"
          username={session.user.username!}
          name={session.user.name}
          surname={session.user.surname}
        />
        
        {/* Seção de Créditos - Sempre visível */}
        <div className="px-4 py-4">
          <CreditsOverview />
        </div>
        
        <HomeRecentActivityContainer
          userId={session.user.id}
          initialData={initialRecentActivity ? initialRecentActivity : []}
        />
      </main>
    </>
  );
};

export default Dashboard;
