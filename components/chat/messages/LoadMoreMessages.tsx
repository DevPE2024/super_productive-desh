"use client";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loadingState";
import { useToast } from "@/hooks/use-toast";
import { domain } from "@/lib/api";
import { useMessage } from "@/store/conversation/messages";
import { ExtendedMessage } from "@/types/extended";
import axios from "axios";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Props {
  chatId: string;
  sessionUserId: string;
}

export const LoadMoreMessages = ({ chatId, sessionUserId }: Props) => {
  const m = useTranslations("MESSAGES");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("CHAT");

  const { toast } = useToast();

  const { nextPage, amountOfNewMessages, setMessages } = useMessage(
    (state) => state
  );

  const getMoreMessages = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<ExtendedMessage[]>(
        `${domain}/api/conversation/get/initial_messages?userId=${sessionUserId}&chatId=${chatId}&page=${nextPage}&amountOfNewMessages=${amountOfNewMessages}`
      );

      if (data) setMessages(data.reverse());
    } catch (err) {
      toast({
        title: m("CANT_LOAD_MORE"),
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full flex justify-center my-2">
      <Button
        className="flex justify-center items-center"
        onClick={() => {
          getMoreMessages();
        }}
        disabled={isLoading}
        size={"sm"}
        variant={"ghost"}
      >
        {isLoading ? <LoadingState /> : t("LOAD_MORE")}
      </Button>
    </div>
  );
};

