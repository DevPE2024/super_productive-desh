import { Sidebar } from "@/components/sidebar/Sidebar";
import { ToggleSidebarProvider } from "@/context/ToggleSidebar";
import { UserActivityStatusProvider } from "@/context/UserActivityStatus";
import { UserEditableWorkspacesProvider } from "@/context/UserEditableWorkspaces";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  // Verificar se o usuário completou o onboarding
  const session = await checkIfUserCompletedOnboarding();
  
  if (!session) {
    redirect("/en/sign-in");
  }
  
  // Se não completou onboarding, redireciona
  if (!session.completedOnboarding) {
    redirect("/en/onboarding");
  }

  return (
    <UserActivityStatusProvider>
      {" "}
      <UserEditableWorkspacesProvider>
        <ToggleSidebarProvider>
          <div className="flex h-0 min-h-screen w-full overflow-hidden">
            <Sidebar />
            <div className="relative p-4 md:p-6 lg:px-10 flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background">
              {children}
            </div>
          </div>
        </ToggleSidebarProvider>
      </UserEditableWorkspacesProvider>
    </UserActivityStatusProvider>
  );
};

export default DashboardLayout;
