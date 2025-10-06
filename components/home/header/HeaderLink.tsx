import { Button } from "@/components/ui/button";
import { scrollToHash } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
  Icon: LucideIcon;
  titleKey: string;
  href: string;
}

export const HeaderLink = ({ Icon, href, titleKey }: Props) => {
  const t = useTranslations("sections");
  
  return (
    <Button
      onClick={() => {
        scrollToHash(href);
      }}
      className="text-secondary-foreground p-4 h-24 w-40 rounded-md gap-4 hover:bg-accent/50 flex flex-col justify-center items-center bg-transparent transition-colors duration-200"
    >
      <Icon />
      <p>{t(titleKey)}</p>
    </Button>
  );
};

