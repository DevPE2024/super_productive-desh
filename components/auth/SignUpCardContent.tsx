"use client";

import { useForm } from "react-hook-form";
import { CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, SignUpSchema } from "@/schema/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProviderSignInBtns } from "./ProviderSignInBtns";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingState } from "../ui/loadingState";

export const SignUpCardContent = () => {
  const t = useTranslations("AUTH");
  const m = useTranslations("MESSAGES");
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { signUp } = useAuth();

  const onSubmit = async (data: SignUpSchema) => {
    setIsLoading(true);

    try {
      // Usar API local para cadastro
      const response = await fetch('/api/auth/signup-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o login...",
        });
        // Redirecionar para login após cadastro bem-sucedido
        router.push("/en/sign-in");
      } else {
        toast({
          title: result.error || "Erro ao criar conta",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      toast({
        title: "Erro interno do servidor",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <ProviderSignInBtns disabled={isLoading} onLoading={setIsLoading} />
          <div className="space-y-1.5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t("EMAIL")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder={t("USERNAME")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("PASSWORD")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <Button
              disabled={isLoading}
              className="w-full font-bold text-white"
              type="submit"
            >
              {isLoading ? (
                <LoadingState loadingText={m("PENDING.LOADING")} />
              ) : (
                t("SIGN_UP.SUBMIT_BTN")
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t("SIGN_UP.TERMS.FIRST")}{" "}
              <span className="font-bold">{t("SIGN_UP.TERMS.SECOND")}</span>
            </p>
          </div>
        </form>
      </Form>
    </CardContent>
  );
};


