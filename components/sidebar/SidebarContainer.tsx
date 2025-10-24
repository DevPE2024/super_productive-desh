"use client";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { OptionsSidebar } from "./optionsSidebar/OptionsSidebar";
import { ShortcutSidebar } from "./shortcutSidebar/ShortcutSidebar";
import { CloseSidebar } from "./CloseSidebar";
import { Workspace } from "@prisma/client";
import { useState } from "react";
import { EcosystemPopup } from "@/components/dashboard/EcosystemPopup";

interface Props {
  userWorkspaces: Workspace[];
  userId: string;
  userAdminWorkspaces: Workspace[];
}

export const SidebarContainer = ({
  userWorkspaces,
  userId,
  userAdminWorkspaces,
}: Props) => {
  const { isOpen, setIsOpen } = useToggleSidebar();
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  
  const createdWorkspaces = userWorkspaces.filter(
    (workspace) => workspace.creatorId == userId
  );

  const handleEcosystemClick = () => {
    setIsEcosystemOpen(true);
  };

  return (
    <>
      <aside
        className={`fixed z-50 top-0 h-full left-0 lg:static bg-background border-r flex lg:translate-x-0 transition-all duration-300 ${
          isOpen ? "translate-x-0 shadow-sm" : "translate-x-[-100%]"
        }`}
      >
        <ShortcutSidebar
          userWorkspaces={userWorkspaces ? userWorkspaces : []}
          createdWorkspaces={createdWorkspaces.length}
          onEcosystemClick={handleEcosystemClick}
        />
        <OptionsSidebar
          createdWorkspaces={createdWorkspaces.length}
          userAdminWorkspaces={userAdminWorkspaces}
          userWorkspaces={userWorkspaces}
        />
        <CloseSidebar />
      </aside>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className={`fixed h-screen w-full top-0 left-0 bg-black/80 z-40 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      ></div>
      
      {/* Popup renderizado no nível mais alto */}
      <EcosystemPopup 
        isOpen={isEcosystemOpen} 
        onClose={() => setIsEcosystemOpen(false)} 
      />
    </>
  );
};


