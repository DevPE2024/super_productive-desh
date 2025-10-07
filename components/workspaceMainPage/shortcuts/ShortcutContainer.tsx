"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPermission, Workspace } from "@prisma/client";
import { ShortcutContainerBtnItem } from "./ShortcutContainerBtnItem";
import {
  MessageSquare,
  MessagesSquare,
  PencilRuler,
  Workflow,
} from "lucide-react";
import { LeaveWorkspace } from "@/components/workspaceMainPage/shortcuts/leaveWorkspace/LeaveWorkspace";
import { ShortcutContainerItemPrivateMessageDialog } from "./privateMessagesDialog/ShortcutContainerItemPrivateMessageDialog";
import { useNewTask } from "@/hooks/useNewTask";
import { useNewMindMap } from "@/hooks/useNewMindMap";
import { PermissionIndicator } from "@/components/workspaceMainPage/shortcuts/permissionIndicator/Permissionindicator";
import { ShortcutContainerLinkItem } from "./ShortcutContainerLinkItem";
import { ExtendedWorkspace } from "@/types/extended";
import { useTranslations } from "next-intl";

interface Props {
  workspace: ExtendedWorkspace;
  userRole: UserPermission | null;
}

export const ShortcutContainer = ({ workspace, userRole }: Props) => {
  const t = useTranslations("WORKSPACE_MAIN_PAGE.SHORTCUT_CONTAINER");
  const { newTask, isPending: isNewTaskLoading } = useNewTask(workspace.id);
  const { newMindMap, isPending: isNewMindMapLoading } = useNewMindMap(
    workspace.id
  );
  return (
    <ScrollArea className="w-full">
      <div className="flex w-max space-x-4 pb-4 mt-4">
        <PermissionIndicator
          userRole={userRole}
          workspaceName={workspace.name}
        />
        <ShortcutContainerLinkItem
          userRole={userRole}
          Icon={MessagesSquare}
          title={t("GROUP_CHAT")}
          href={`/dashboard/workspace/${workspace.id}/chat/${workspace.conversation.id}`}
        />
        <ShortcutContainerBtnItem
          userRole={userRole}
          Icon={PencilRuler}
          title={t("NEW_TASK")}
          isLoading={isNewTaskLoading}
          onClick={newTask}
        />
        <ShortcutContainerBtnItem
          userRole={userRole}
          Icon={Workflow}
          title="New mind map"
          isLoading={isNewMindMapLoading}
          onClick={newMindMap}
        />
        {userRole !== "OWNER" && <LeaveWorkspace workspace={workspace} />}
      </div>
    </ScrollArea>
  );
};


