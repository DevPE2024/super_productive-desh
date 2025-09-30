"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessage } from "@/store/conversation/messages";
import { ExtendedMessage } from "@/types/extended";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  onChangeEdit: (editing: boolean) => void;
  message: ExtendedMessage;
}

export const Options = ({ onChangeEdit, message }: Props) => {
  const { setMessageToDelete } = useMessage((state) => state);
  const t = useTranslations("CHAT.OPTIONS");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            onChangeEdit(true);
          }}
          className="cursor-pointer"
        >
          {t("EDIT")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setMessageToDelete(message);
            document.getElementById("trigger-delete")?.click();
          }}
          className="text-destructive focus:bg-destructive focus:text-white cursor-pointer"
        >
          {t("DELETE")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

