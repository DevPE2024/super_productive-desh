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

interface Props {
  workspace: ExtendedWorkspace;
  userRole: UserPermission | null;
}

export const ShortcutContainer = ({ workspace, userRole }: Props) => {
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
          title="Group chat"
          href={`/dashboard/workspace/${workspace.id}/chat/${workspace.conversation.id}`}
        />
        <ShortcutContainerBtnItem
          userRole={userRole}
          Icon={PencilRuler}
          title="New task"
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

