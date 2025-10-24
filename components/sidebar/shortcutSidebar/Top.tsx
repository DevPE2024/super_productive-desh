"use client";

import { topSidebarLinks } from "@/lib/utils";
import { SidebarLink } from "./SidebarLink";

interface Props {
  onEcosystemClick?: () => void;
}

export const Top = ({ onEcosystemClick }: Props) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {topSidebarLinks.map((link, i) => (
        <SidebarLink
          key={`link_${i}`}
          Icon={link.Icon}
          hoverTextKey={link.hoverTextKey}
          href={link.href}
          include={link?.include}
          onClick={link.href === "#ecosystem" ? onEcosystemClick : undefined}
        />
      ))}
    </div>
  );
};


