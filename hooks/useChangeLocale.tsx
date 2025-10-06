"use client";

import { usePathname, useRouter } from "@/lib/navigation";
import { useState, useTransition, useEffect } from "react";

export const useChangeLocale = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  // Reset loading state when transition is complete
  useEffect(() => {
    if (!isPending && isLoading) {
      setIsLoading(false);
    }
  }, [isPending, isLoading]);

  const onSelectChange = (nextLocale: "pt-BR" | "en") => {
    setIsLoading(true);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return { isLoading, isPending, onSelectChange };
};

