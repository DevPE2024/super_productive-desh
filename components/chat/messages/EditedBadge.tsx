"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useFormatter, useTranslations } from "next-intl";

interface Props {
  updatedAt: Date;
}

export const EditedBadge = ({ updatedAt }: Props) => {
  const format = useFormatter();
  const dateTime = new Date(updatedAt);
  const now = new Date();
  const t = useTranslations("CHAT.EDIT");

  return (
    <HoverCard openDelay={250} closeDelay={250}>
      <HoverCardTrigger asChild>
        <span className="text-[0.6rem] text-muted-foreground">
          {t("BADGE")}
        </span>
      </HoverCardTrigger>
      <HoverCardContent align="center" side="top">
        <span>{format.relativeTime(dateTime, now)}</span>
      </HoverCardContent>
    </HoverCard>
  );
};


