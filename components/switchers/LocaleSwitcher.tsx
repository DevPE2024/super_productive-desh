"use client";

import { startTransition, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LoadingState } from "../ui/loadingState";
import { useLocale, useTranslations } from "next-intl";
//@ts-ignore
import { usePathname, useRouter } from "@/lib/navigation";
import { HoverCard, HoverCardContent } from "../ui/hover-card";
import { useChangeLocale } from "@/hooks/useChangeLocale";

interface Props {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null;
  size?: "default" | "sm" | "lg" | "icon" | null;
  alignHover?: "center" | "start" | "end";
  alignDropdown?: "center" | "start" | "end";
  textSize?: "text-lg" | "text-base";
}

export const LocaleSwitcher = ({
  size = "default",
  variant = "default",
  alignHover = "center",
  alignDropdown = "center",
  textSize = "text-base",
}: Props) => {
  const locale = useLocale();

  const t = useTranslations("COMMON");

  const { isLoading, isPending, onSelectChange } = useChangeLocale();

  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <Button
        disabled
        variant={variant}
        size={size}
        className={textSize}
      >
        EN
        <span className="sr-only">English</span>
      </Button>
      <HoverCardContent align={alignHover}>
        <span>English</span>
      </HoverCardContent>
    </HoverCard>
  );
};


