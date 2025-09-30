"use client";

import { HomePage } from "@/components/home/HomePage";
import { ThemeSwitcher } from "@/components/switchers/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

const Home = () => {
  const { user, loading } = useAuth();

  // if (user) redirect("/dashboard");

  return <HomePage />;
};

export default Home;
