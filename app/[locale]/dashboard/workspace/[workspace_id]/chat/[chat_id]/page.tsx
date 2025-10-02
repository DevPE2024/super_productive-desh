import { AddTaskShortcut } from "@/components/addTaskShortCut/AddTaskShortcut";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { InviteUsers } from "@/components/inviteUsers/InviteUsers";
import { LeaveWorkspace } from "@/components/workspaceMainPage/shortcuts/leaveWorkspace/LeaveWorkspace";
import { MindMap } from "@/components/mindMaps/MindMap";
import { PermissionIndicator } from "@/components/workspaceMainPage/shortcuts/permissionIndicator/Permissionindicator";
import { FilterContainer } from "@/components/workspaceMainPage/filter/FilterContainer";
import { ShortcutContainer } from "@/components/workspaceMainPage/shortcuts/ShortcutContainer";
import {
  getInitialMessages,
  getUserWorkspaceRole,
  getWorkspace,
  getWorkspaceWithChatId,
} from "@/lib/api";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";
import { FilterByUsersAndTagsInWorkspaceProvider } from "@/context/FilterByUsersAndTagsInWorkspace";
import { RecentActivityContainer } from "@/components/workspaceMainPage/recentActivity/RecentActivityContainer";
import { notFound, redirect } from "next/navigation";
import { ChatContainer } from "@/components/chat/ChatContainer";

interface Params {
  params: {
    workspace_id: string;
    chat_id: string;
  };
}

const Chat = async ({ params: { workspace_id, chat_id } }: Params) => {
  const session = await checkIfUserCompletedOnboarding(
    `/dashboard/workspace/${workspace_id}/chat/${chat_id}`
  );

  if (!session) {
    return null;
  }

  const [workspace, userRole, initialMessages] = await Promise.all([
    getWorkspaceWithChatId(workspace_id, session.user.id),
    getUserWorkspaceRole(workspace_id, session.user.id),
    getInitialMessages(session.user.id, chat_id),
  ]);

  if (!workspace) return notFound();

  const conversationId = workspace.conversation.id;

  if (conversationId !== chat_id)
    redirect("/dashboard/errors?error=no-conversation");

  return (
    <>
      <DashboardHeader
        addManualRoutes={[
          {
            name: "DASHBOARD",
            href: "/dashboard",
            useTranslate: true,
          },
          {
            name: workspace.name,
            href: `/dashboard/workspace/${workspace_id}`,
          },
          {
            name: "CHAT",
            href: `/dashboard/workspace/${workspace_id}/chat/${chat_id}`,
            useTranslate: true,
          },
        ]}
      >
        {(userRole === "ADMIN" || userRole === "OWNER") && (
          <InviteUsers workspace={workspace} />
        )}
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>
      <main className="h-full w-full max-h-fit">
        <ChatContainer
          chatId={conversationId}
          workspaceId={workspace.id}
          initialMessages={initialMessages ? initialMessages : []}
          sessionUserId={session.user.id}
          workspaceName={workspace?.name}
        />
      </main>
    </>
  );
};

export default Chat;
