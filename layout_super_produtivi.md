
# layout_super_produtivi — Guia passo a passo para migrar o layout e a marca para **Prodify** (Affinify)

> Objetivo: trocar **nome, logo, paleta e textos da UI** sem alterar funcionalidades. Incluir **i18n (pt-BR / en)**. Cada tarefa segue o ciclo:
> **(1) Implementar código → (2) Restart Docker (app) → (3) Verificar com MCP Google Dev → (4) Marcar checkpoint**.

---

## Regras do processo

- **Nome do app**: `Prodify` (empresa: **Affinify**).
- **Restart sempre**: `docker-compose -f docker-compose.dev.yml restart app` (somente o serviço `app`).
- **Ferramentas MCP**:
  - *MCP Google Dev Tool*: checar console, network, 404 de assets, layout/contraste, i18n aplicado.
  - *MCP ShadCI*: gerar/ajustar componentes de UI (buttons, dropdown, navbar, etc.).
  - *MCP ChatCI*: varredura por strings antigas, assets órfãos, TODOs e inconsistências.

---

## Paleta, tipografia e identidade

- **Paleta base (sugestão Affinify-friendly)**
  - Primária (Brand): `#4727CD`
  - Acento: `#FAA72C`
  - Texto: `#EAEAF0`
  - Fundo (dark): `#0E0E12`
  - Superfície: `#16161D`
  - Borda/sutil: `#23232E`

- **Fontes**: `Inter` (ou `Poppins`) via CSS/Google Fonts.
- **Logo**: usar um ícone simples com o "P" (arquivo SVG abaixo).

---

## Estrutura de arquivos alvo (Next.js App Router sugerido)

```
app/
  [locale]/
    layout.tsx
    page.tsx
  components/
    language-switcher.tsx
    navbar.tsx
    footer.tsx
  globals.css
  layout.tsx
  manifest.webmanifest
lib/
  i18n/
    config.ts
messages/
  en.json
  pt-BR.json
public/
  icons/prodify.svg
  favicon.ico (gerar a partir do SVG)
  brand/
    og-image.png
tailwind.config.ts
```

> Se seu projeto usa **Pages Router**, adapte `app/**` para `pages/_app.tsx`, `pages/index.tsx` e afins. A lógica é a mesma.

---

## CHECKLIST DE TAREFAS

### 0) Criar branch de migração
- [x] ✅ **Criar branch**: `git checkout -b feat/brand-prodify`
- [ ] **Backup**: `git add -A && git commit -m "chore: snapshot before Prodify branding"`

---

### 1) Definir variáveis de tema (Tailwind + CSS)
**Arquivos**: `globals.css`, `tailwind.config.ts`

**globals.css (trecho)**
```css
:root {
  --brand: #4727CD;
  --accent: #FAA72C;
  --bg: #0E0E12;
  --surface: #16161D;
  --text: #EAEAF0;
  --border-subtle: #23232E;
}

html, body { background: var(--bg); color: var(--text); }
```

**tailwind.config.ts (trecho)** — extender a paleta
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4727CD",
          50: "#EFEAFD",
          100: "#DCD2FB",
          200: "#B9A7F7",
          300: "#977BF2",
          400: "#7450EE",
          500: "#5126E9",
          600: "#4727CD",
          700: "#3A1FA7",
          800: "#2C1780",
          900: "#1E105A",
        },
        accent: "#FAA72C",
        surface: "#16161D",
        ink: "#EAEAF0",
        line: "#23232E",
        bg: "#0E0E12",
      },
      borderColor: {
        DEFAULT: "#23232E",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [x] ✅ Implementar paleta no `globals.css`
- [x] ✅ Implementar paleta no `tailwind.config.ts`
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: inspecionar CSS vars e classes Tailwind
- [x] ✅ **Checkpoint** ✅

---

### 2) Logo, favicon e metadados
**Arquivos**: `public/icons/prodify.svg`, `public/favicon.ico`, `app/layout.tsx`, `app/manifest.webmanifest`

**`public/icons/prodify.svg`** (logo simples)
```svg
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <rect rx="56" ry="56" width="256" height="256" fill="#4727CD"/>
  <circle cx="88" cy="88" r="18" fill="#FAA72C"/>
  <path d="M76 176h52c30 0 54-24 54-54s-24-54-54-54H76v108z" fill="white" opacity="0.92"/>
</svg>
```

**`app/layout.tsx` (trecho para metadata + favicon)**

```tsx
export const metadata = {
  title: "Prodify — Affinify",
  description: "Your ultimate productive app by Affinify.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/prodify.svg",
  },
  openGraph: {
    title: "Prodify — Affinify",
    description: "All-in-one productivity workspace.",
    images: ["/brand/og-image.png"],
  },
};
```

**`app/manifest.webmanifest` (trecho)**
```json
{
  "name": "Prodify",
  "short_name": "Prodify",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0E0E12",
  "theme_color": "#4727CD",
  "icons": [
    { "src": "/icons/prodify.svg", "sizes": "256x256", "type": "image/svg+xml" }
  ]
}
```

- [x] ✅ Substituir logo original e atualizar metadados
- [x] ✅ Gerar `favicon.ico` (a partir do SVG) — qualquer gerador online/local
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: checar <head>, manifest e redes sociais/OG
- [x] ✅ **Checkpoint** ✅

---

### 3) Navbar e rodapé com sua marca
**Arquivos**: `app/components/navbar.tsx`, `app/components/footer.tsx`  
*(se não existirem, criar — pode ser com MCP ShadCI)*

**`components/navbar.tsx` (exemplo minimalista)**
```tsx
"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icons/prodify.svg" alt="Prodify" className="h-6 w-6" />
          <span className="font-semibold tracking-tight">Prodify</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/features" className="text-sm hover:text-ink/80">Features</Link>
          <Link href="/pricing" className="text-sm hover:text-ink/80">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}
```

**`components/footer.tsx`**
```tsx
export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg py-8 text-sm">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Affinify • Prodify</p>
        <div className="opacity-60">All rights reserved.</div>
      </div>
    </footer>
  );
}
```

- [x] ✅ Implementar
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: checar header/footer e links
- [x] ✅ **Checkpoint** ✅

---

### 4) Página principal (Hero + seções) — sem mudar funcionalidades
**Arquivo**: `app/[locale]/page.tsx` (ou `app/page.tsx` caso sem i18n ainda)

**Hero de exemplo** (texto será traduzido via i18n depois):
```tsx
export default function HomePage() {
  return (
    <main>
      <section className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-accent inline-block" /> Affinify presents
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Your Ultimate <span className="text-brand">Productive</span> App
        </h1>
        <p className="mt-4 max-w-2xl text-ink/80">
          Prodify centraliza tarefas, notas, pomodoro, calendário e colaboração — sem fricção.
        </p>
        <div className="mt-8 flex gap-3">
          <a className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90" href="/app">
            Launch App
          </a>
          <a className="rounded-md border border-line px-4 py-2 text-sm hover:bg-surface/60" href="/pricing">
            See Pricing
          </a>
        </div>
      </section>

      {/* Suas seções (Tasks, Pomodoro, Roles, Calendar...) mantidas */}
    </main>
  );
}
```

- [x] ✅ Implementar estrutura visual (sem alterar lógica)
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: verificar layout/CLS/sem erros
- [x] ✅ **Checkpoint** ✅

---

### 5) i18n (pt-BR / en) com **next-intl**
**Instalar**:
```
npm i next-intl
```

**`lib/i18n/config.ts`**
```ts
export const locales = ["en", "pt-BR"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

**`messages/en.json`**
```json
{
  "nav.features": "Features",
  "nav.pricing": "Pricing",
  "hero.badge": "Affinify presents",
  "hero.title_1": "Your Ultimate",
  "hero.title_2": "Productive",
  "hero.title_3": "App",
  "hero.subtitle": "Prodify centralizes tasks, notes, pomodoro, calendar and collaboration — without friction.",
  "cta.launch": "Launch App",
  "cta.pricing": "See Pricing",
  "footer.rights": "All rights reserved."
}
```

**`messages/pt-BR.json`**
```json
{
  "nav.features": "Recursos",
  "nav.pricing": "Preços",
  "hero.badge": "Apresentado por Affinify",
  "hero.title_1": "Seu App",
  "hero.title_2": "de Produtividade",
  "hero.title_3": "Definitivo",
  "hero.subtitle": "O Prodify centraliza tarefas, notas, pomodoro, calendário e colaboração — sem fricção.",
  "cta.launch": "Abrir App",
  "cta.pricing": "Ver Preços",
  "footer.rights": "Todos os direitos reservados."
}
```

**Estrutura com pastas por locale**
```
app/
  [locale]/layout.tsx
  [locale]/page.tsx
middleware.ts
```

**`app/[locale]/layout.tsx`**
```tsx
import {NextIntlClientProvider} from "next-intl";
import {getMessages, getLocale} from "next-intl/server";
import "./globals.css";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

export default async function RootLayout({
  children, params
}: {children: React.ReactNode; params: {locale: string}}) {
  const locale = params.locale;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <Navbar />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Footer />
      </body>
    </html>
  );
}
```

**`app/[locale]/page.tsx` (com t)** — adaptar o Hero acima para usar `useTranslations`
```tsx
"use client";
import {useTranslations} from "next-intl";

export default function HomePage() {
  const t = useTranslations();
  return (
    <main>
      <section className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs">
          <span className="h-2 w-2 rounded-full bg-accent inline-block" /> {t("hero.badge")}
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          {t("hero.title_1")} <span className="text-brand">{t("hero.title_2")}</span> {t("hero.title_3")}
        </h1>
        <p className="mt-4 max-w-2xl text-ink/80">{t("hero.subtitle")}</p>
        <div className="mt-8 flex gap-3">
          <a className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90" href="/app">
            {t("cta.launch")}
          </a>
          <a className="rounded-md border border-line px-4 py-2 text-sm hover:bg-surface/60" href="/pricing">
            {t("cta.pricing")}
          </a>
        </div>
      </section>
    </main>
  );
}
```

**`middleware.ts`**
```ts
import createMiddleware from "next-intl/middleware";
import {locales, defaultLocale} from "./lib/i18n/config";

export default createMiddleware({
  locales: Array.from(locales),
  defaultLocale
});

export const config = {
  matcher: ["/", "/(en|pt-BR)/:path*"]
};
```

- [x] ✅ Instalar pacote e criar arquivos
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: navegar /en e /pt-BR; verificar textos traduzidos
- [x] ✅ **Checkpoint** ✅

---

### 6) Componente de troca de idioma
**Arquivo**: `app/components/language-switcher.tsx`

```tsx
"use client";
import {usePathname} from "next/navigation";
import Link from "next/link";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const target = pathname?.startsWith("/pt-BR") ? pathname.replace("/pt-BR", "/en") : `/pt-BR${pathname || ""}`;
  const label = pathname?.startsWith("/pt-BR") ? "EN" : "PT-BR";

  return (
    <Link href={target} className="rounded-md border border-line px-2 py-1 text-xs hover:bg-surface/60">
      {label}
    </Link>
  );
}
```

> Incluir o `LanguageSwitcher` na `Navbar` à direita.

- [x] ✅ Implementar e plugar na Navbar
- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: alternar idiomas e conferir rotas
- [x] ✅ **Checkpoint** ✅

---

### 7) Remover outros idiomas/conteúdos legados
- [x] ✅ Usar MCP ChatCI para localizar: `i18n`, `locales`, `lang`, chaves não usadas
- [x] ✅ Remover arquivos de traduções que **não** sejam `en` e `pt-BR`
- [x] ✅ Varredura por menções a marcas antigas (nomes, logos)

- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: console limpo, sem 404 de mensagens
- [x] ✅ **Checkpoint** ✅

---

### 8) Varredura de marca/asset (legal & UX)
- [x] ✅ Substituir todas as instâncias textuais de nome antigo (SuperProductive, etc.) por `Prodify`
- [x] ✅ Conferir `robots.txt`, `sitemap`, `manifest`, `meta og:*`
- [x] ✅ Substituir screenshots/og-image por versões com sua marca (mesmo layout, novo logo)

- [x] ✅ Restart Docker
- [x] ✅ MCP Google Dev: testar `/` e páginas principais
- [x] ✅ **Checkpoint** ✅

---

### 9) QA visual e acessibilidade
- [x] ✅ Contraste AA (texto x fundo) — especialmente brand/accent
- [x] ✅ Estados hover/focus, foco de teclado visível
- [x] ✅ Lighthouse (mobile/desktop) — performance e SEO

- [x] ✅ Restart Docker (se ajustes)
- [x] ✅ MCP Google Dev: Lighthouse/Accessibility ok
- [x] ✅ **Checkpoint** ✅

---

### 10) Encerramento e merge
- [ ] Commit: `git add -A && git commit -m "feat(brand): Prodify branding + i18n en/pt-BR"`
- [ ] Merge PR: `feat/brand-prodify` → `main`
- [ ] Tag opcional: `git tag v1.0.0-prodify && git push --tags`

---

## Dicas rápidas (sem alterar funcionalidades)
- O **layout pode permanecer** idêntico (hierarquia, grids, cards). Foque em **texto, logo, cores e i18n**.
- Evite reaproveitar **ícones exclusivos/mascotes** do projeto original; use bibliotecas abertas (Lucide, etc.).
- Mantenha os créditos de licença no código (se houver arquivo original `LICENSE`/`NOTICE`).

---

## Próximos passos sugeridos
1. Executar **Tarefa 1** (tema Tailwind) e me confirmar com o checkbox marcado.
2. Enviar logs de console (se houver erro) do MCP Google Dev para correção rápida.
3. Avançar para **Logo & Metadados**, i18n e Navbar.

---

Made with ❤️ for Affinify.
