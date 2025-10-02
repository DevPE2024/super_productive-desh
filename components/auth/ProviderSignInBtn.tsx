"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useLocale } from "next-intl";
import { useProviderLoginError } from "@/hooks/useProviderLoginError";
import { useAuth } from "@/hooks/useAuth";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  providerName: "google";
  onLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProviderSignInBtn = ({
  children,
  providerName,
  onLoading,
  ...props
}: Props) => {
  const [showLoggedInfo, setShowLoggedInfo] = useState(false);
  const locale = useLocale();
  const { signInWithProvider } = useAuth();
  useProviderLoginError(showLoggedInfo);

  const signInHandler = async () => {
    onLoading(true);
    setShowLoggedInfo(true);
    try {
      await signInWithProvider(providerName);
    } catch (err) {
      console.error('Erro no login com provedor:', err);
    }
    onLoading(false);
  };

  return (
    <Button
      onClick={signInHandler}
      {...props}
      variant={"secondary"}
      type="button"
    >
      {children}
    </Button>
  );
};

