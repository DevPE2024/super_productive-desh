"use client";

import ActiveLink from "@/components/ui/active-link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  href: string;
  Icon: LucideIcon;
  hoverTextKey: string;
  include?: string;
  onClick?: () => void;
}

export const SidebarLink = ({ hoverTextKey, href, Icon, include, onClick }: Props) => {
  const t = useTranslations("SIDEBAR.MAIN");

  const handleClick = (e: React.MouseEvent) => {
    if (href === "#ecosystem" && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>
        <ActiveLink
          include={include}
          variant={"ghost"}
          size={"icon"}
          href={href}
          onClick={handleClick}
        >
          <Icon />
        </ActiveLink>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <span>{t(hoverTextKey)}</span>
      </HoverCardContent>
    </HoverCard>
  );
};


