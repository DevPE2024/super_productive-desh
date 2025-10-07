"use client";
import { ProdifyLogo } from "@/components/svg/ProdifyLogo";
import { LocaleSwitcher } from "@/components/switchers/LocaleSwitcher";

import { ThemeSwitcher } from "@/components/switchers/ThemeSwitcher";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navLinks } from "@/lib/constants";
import { scrollToHash } from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const LargeNav = () => {
  const t = useTranslations("nav");
  
  return (
    <div className="container md:flex py-4 max-w-screen-2xl items-center justify-between hidden">
      <div className="flex items-center">
        <Link
          href="/"
          className="w-fit bg-transparent text-secondary-foreground hover:bg-transparent flex items-center gap-2 hover:scale-105 transition-transform duration-200 p-2 rounded-md"
        >
          <ProdifyLogo className="w-10 h-10" />
          <p className="text-2xl font-semibold">
            <span className="text-brand">Prodify</span>
          </p>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-lg">
                {t("product")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                  {navLinks.map((link, i) => (
                    <div key={i}>
                      <Button
                        onClick={() => {
                          scrollToHash(link.href);
                        }}
                        className="w-full text-left bg-transparent text-secondary-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {link.title}
                      </Button>
                    </div>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            className="border-b inline-block border-transparent hover:border-primary duration-200 transition-colors"
            href={"/sign-in"}
          >
            {t("log_in")}
          </Link>
          <Link
            className={`${buttonVariants({ variant: "default" })}`}
            href={"/sign-up"}
          >
            {t("sign_up")}
          </Link>
        </div>
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
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};


