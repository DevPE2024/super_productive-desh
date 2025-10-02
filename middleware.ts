import createMiddleware from "next-intl/middleware";
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from "next/server";

const locales = ["te", "en"];
const publicPages = ["/", "/sign-in", "/sign-up"];

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: "en",
});

export default async function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join("|")}))?(${publicPages.join("|")})?/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // Verificar autenticação com Supabase
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return req.cookies.get(name)?.value;
          } catch (error) {
            console.warn(`Erro ao ler cookie ${name}:`, error);
            return undefined;
          }
        },
        set(name: string, value: string, options: any) {
          try {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          } catch (error) {
            console.warn(`Erro ao definir cookie ${name}:`, error);
          }
        },
        remove(name: string, options: any) {
          try {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          } catch (error) {
            console.warn(`Erro ao remover cookie ${name}:`, error);
          }
        },
      },
    }
  );

  // Verificação simplificada - apenas verificar se há tokens de sessão
  const hasAuthTokens = req.cookies.get('sb-access-token') || 
                       req.cookies.get('supabase-auth-token') ||
                       req.cookies.get('sb-jmahdwisqkcbtgaavaji-auth-token');

  if (!hasAuthTokens) {
    // Redirecionar para página de login com locale correto
    const locale = req.nextUrl.pathname.match(/^\/([a-z]{2})\//)?.[1] || 'en';
    const redirectUrl = new URL(`/${locale}/sign-in`, req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

