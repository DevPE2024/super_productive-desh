"use client";

import { AdditionalResource } from "@/types/extended";
import { UploadButton } from "@/lib/uploadthing";
import { LoadingState } from "@/components/ui/loadingState";
import { Upload } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { AdditionalResourceTypes } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface Props {
  onChangeUploadedFiles: (files: AdditionalResource[] | null) => void;
}

export const UploadFilesButton = ({ onChangeUploadedFiles }: Props) => {
  const t = useTranslations("CHAT.NEW_MESSAGE");
  const { toast } = useToast();
  return (
    <UploadButton
      appearance={{
        button({ isUploading }) {
          return `w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-secondary-foreground bg-transparent hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus:visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 duration-200 focus-within:ring-primary dark:focus-within:ring-primary/60 ${
            isUploading ? "custom-button-uploading" : ""
          }`;
        },
        container: "",
        allowedContent: "hidden",
      }}
      endpoint={"addToChatFile"}
      content={{
        button({ ready, isUploading }) {
          if (isUploading || !ready) return <LoadingState />;
          else return <Upload className="w-5 h-5 sm:w-auto sm:h-auto" />;
        },
        allowedContent: null,
      }}
      onClientUploadComplete={(results) => {
        const files: AdditionalResource[] | null = results
          ? results.map((result) => {
              return {
                id: uuidv4(),
                name: result.name,
                type: result.name.endsWith(".pdf")
                  ? AdditionalResourceTypes.PDF
                  : AdditionalResourceTypes.IMAGE,
                url: result.url,
              };
            })
          : null;
        onChangeUploadedFiles(files);
      }}
      onUploadError={(error: Error) => {
        let errMessage = t("ATTACHMENT_DEFAULT_ERROR");
        if (error.message === "File limit exceeded")
          errMessage = t("ATACHMENT_TO_MANY_ERROR");
        if (
          error.message ===
          "Your proposed upload exceeds the maximum allowed size"
        )
          errMessage = t("ATACHMENT_TO_BIG_ERROR");
        if (error.message === "Error invalid config.")
          errMessage = t("ATACHMENT_WRONG_FILE_ERROR");
        toast({
          title: errMessage,
          variant: "destructive",
        });
      }}
    />
  );
};


