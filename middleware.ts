import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const locales = ["pt-BR", "en"];
const publicPages = ["/", "/sign-in", "/sign-up", "/pricing"];

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

  // Verificar autenticação local
  const useLocalAuth = process.env.USE_LOCAL_AUTH === 'true';
  
  if (useLocalAuth) {
    // Para autenticação local, verificar se há token JWT válido
    const authToken = req.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      // Redirecionar para página de login com locale correto
      const locale = req.nextUrl.pathname.match(/^\/([a-z]{2})\//)?.[1] || 'en';
      const redirectUrl = new URL(`/${locale}/sign-in`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    return intlMiddleware(req);
  } else {
    // Verificação Supabase (código original comentado para referência futura)
    const hasAuthTokens = req.cookies.get('sb-access-token') || 
                         req.cookies.get('supabase-auth-token') ||
                         req.cookies.get('sb-jmahdwisqkcbtgaavaji-auth-token');

    if (!hasAuthTokens) {
      // Redirecionar para página de login com locale correto
      const locale = req.nextUrl.pathname.match(/^\/([a-z]{2})\//)?.[1] || 'en';
      const redirectUrl = new URL(`/${locale}/sign-in`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};


