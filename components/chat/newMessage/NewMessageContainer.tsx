"use client";

import { EmojiSelector } from "@/components/common/EmojiSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AdditionalResource, ExtendedMessage } from "@/types/extended";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Send, Smile } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { UploadFilesButton } from "./UploadFileButton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FilePreview } from "./FilePreview";
import { useAuth } from "@/hooks/useAuth";
import { useMessage } from "@/store/conversation/messages";
import { v4 as uuidv4 } from "uuid";
import { useOnKeyDown } from "@/hooks/useOnKeyDown";

interface Props {
  workspaceId: string;
  chatId: string;
}

export const NewMessageContainer = ({ chatId, workspaceId }: Props) => {
  const m = useTranslations("MESSAGES");
  const { toast } = useToast();
  const t = useTranslations("CHAT.NEW_MESSAGE");

  const [uploadedFiles, setUploadedFiles] = useState<
    null | AdditionalResource[]
  >(null);

  const [message, setMessage] = useState("");

  const onSelectEmojiHandler = (emojiCode: string) => {
    const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const onChangeUploadedFilesHandler = (files: AdditionalResource[] | null) => {
    setUploadedFiles(files);
  };

  const onRemoveFileHandler = (fileId: string) => {
    setUploadedFiles((prevFiles) => {
      return prevFiles?.filter((file) => file.id !== fileId) || null;
    });
  };

  const { user } = useAuth();
  const [lastMessageId, setLastMessageId] = useState("");
  const { addMessage, deleteMessage } = useMessage((state) => state);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate: newMessage, isPending } = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const id = uuidv4();
      setLastMessageId(id);

      const newMessage: ExtendedMessage = {
        id,
        content: message,
        additionalResources: uploadedFiles ? uploadedFiles : [],
        conversationId: chatId,
        createdAt: new Date(),
        edited: false,
        updatedAt: null,
        sender: {
          id: user.id,
          image: user.user_metadata?.avatar_url || null,
          username: user.user_metadata?.full_name || user.email!,
        },
        senderId: user.id,
      };

      addMessage(newMessage);

      setUploadedFiles(null);
      setMessage("");

      await axios.post(`/api/conversation/new_message`, newMessage);
    },
    onSuccess: async () => {
      toast({
        title: m("SUCCES.TASK_ADDED"),
      });
    },
    onError: (err: AxiosError) => {
      const error = err?.response?.data ? err.response.data : "ERRORS.DEFAULT";

      toast({
        title: m(error),
        variant: "destructive",
      });

      deleteMessage(lastMessageId);
    },
    mutationKey: ["newMessage"],
  });

  useOnKeyDown(textAreaRef, (event) => {
    if (
      textAreaRef.current?.id === "new-message-text-area" &&
      event.key === "Enter"
    ) {
      if (!event.shiftKey && message.trim().length > 0) {
        newMessage();
      }
    }
  });

  return (
    <div className="p-2 w-full flex flex-col gap-2 bg-popover rounded-b-md px-4 py-2 shadow-sm border-t border-border">
      {uploadedFiles && uploadedFiles.length > 0 && (
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4 border-b border-border">
            {uploadedFiles.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onRemoveFile={onRemoveFileHandler}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      <div className="w-full flex justify-between items-center gap-4">
        <div className="flex gap-0.5 sm:gap-1">
          <UploadFilesButton
            onChangeUploadedFiles={onChangeUploadedFilesHandler}
          />
          <EmojiSelector
            asChild
            slide="right"
            align="end"
            onSelectedEmoji={onSelectEmojiHandler}
            className="hidden sm:flex"
          >
            <Button
              className="w-8 h-8 sm:w-10 sm:h-10"
              size={"icon"}
              variant={"ghost"}
            >
              <Smile className="w-5 h-5 sm:w-auto sm:h-auto" />
            </Button>
          </EmojiSelector>
        </div>
        <TextareaAutosize
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          autoFocus
          id="new-message-text-area"
          ref={textAreaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          placeholder={t("PLACEHOLDER")}
          className="w-full flex-grow resize-none appearance-none overflow-hidden bg-transparent  placeholder:text-muted-foreground focus:outline-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background  "
        />

        <div>
          <Button
            disabled={message.trim().length === 0}
            onClick={() => {
              newMessage();
            }}
            size={"icon"}
            variant={"ghost"}
            className="w-8 h-8 sm:w-10 sm:h-10"
          >
            <Send className="w-5 h-5 sm:w-auto sm:h-auto" />
          </Button>
        </div>
      </div>
    </div>
  );
};

