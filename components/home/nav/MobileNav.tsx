"use client";
import { ProdifyLogo } from "@/components/svg/ProdifyLogo";
import { LocaleSwitcher } from "@/components/switchers/LocaleSwitcher";
import { ThemeSwitcher } from "@/components/switchers/ThemeSwitcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";
import { scrollToHash } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  
  return (
    <div className="md:hidden py-2 px-2 w-full flex items-center justify-between">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={"left"}
          className="h-full flex flex-col justify-between"
        >
          <SheetHeader>
            <SheetTitle asChild>
              <Link
                href="/"
                className="w-fit bg-transparent text-secondary-foreground hover:bg-transparent flex items-center gap-2 hover:scale-105 transition-transform duration-200 p-2 rounded-md"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <ProdifyLogo className="w-10 h-10" />
                <p className="text-2xl font-semibold">
                  <span className="text-brand">Prodify</span>
                </p>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="my-4 flex-grow">
            <div className="h-full flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <Button
                  key={i}
                  variant={"link"}
                  size={"sm"}
                  onClick={() => {
                    setOpen(false);
                    scrollToHash(link.href);
                  }}
                  className="w-fit text-base text-secondary-foreground font-semibold"
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="w-full flex flex-col gap-2">
            <Link
              onClick={() => {
                setOpen(false);
              }}
              href={"/"}
              className={`${buttonVariants({ variant: "default" })}`}
            >
              {t("sign_up")}
            </Link>
            <Link
              href="http://localhost:3020"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setOpen(false);
              }}
              className={`${buttonVariants({ variant: "outline" })}`}
            >
              Community
            </Link>
            <Link
              href={"/"}
              onClick={() => {
                setOpen(false);
              }}
              className={`${buttonVariants({ variant: "outline" })}`}
            >
              {t("log_in")}
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <LocaleSwitcher
          alignHover="end"
          alignDropdown="end"
          size={"icon"}
          variant={"outline"}
        />
        <Link
          href="/pricing"
          className={`${buttonVariants({ variant: "outline", size: "sm" })} text-sm`}
        >
          {t("price")}
        </Link>
        <ThemeSwitcher
          alignHover="end"
          alignDropdown="end"
          size={"icon"}
          variant={"outline"}
        />
      </div>
    </div>
  );
};


