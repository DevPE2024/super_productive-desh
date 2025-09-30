"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useTruncateText } from "@/hooks/useTruncateText";
import { AdditionalResource } from "@/types/extended";
import { AdditionalResourceTypes } from "@prisma/client";
import { FileText, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Props {
  file: AdditionalResource;
  onRemoveFile: (fileId: string) => void;
}

export const FilePreview = ({
  file: { name, type, url, id },
  onRemoveFile,
}: Props) => {
  const fileName = useTruncateText(name, 23);
  const t = useTranslations("CHAT.NEW_MESSAGE");
  return (
    <div className="p-2 sm:py-3 rounded-md bg-secondary shadow-sm relative flex flex-col items-center">
      <div className="w-24 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 flex justify-center items-center">
        {type === AdditionalResourceTypes.IMAGE ? (
          <Image
            className="w-full h-full rounded-sm object-cover"
            src={url}
            alt=""
            width={800}
            height={800}
          />
        ) : (
          <FileText className="w-8 h-8 sm:w-12 sm:h-12" />
        )}
      </div>

      <div className="w-full mt-2">
        <p className="break-words text-xs">{fileName}</p>
      </div>
      <div className="absolute z-30 top-0 right-0">
        <HoverCard openDelay={250} closeDelay={250}>
          <HoverCardTrigger asChild>
            <Button
              onClick={() => {
                onRemoveFile(id);
              }}
              className="w-8 h-8"
              variant={"destructive"}
              size={"icon"}
            >
              <Trash size={16} />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="center" side="top">
            <span>{t("DELETE_ATACHMENT")}</span>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
};

