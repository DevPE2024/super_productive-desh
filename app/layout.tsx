import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prodify — Affinify",
  description: "Your ultimate productive app by Affinify. Centralize tasks, notes, pomodoro, calendar and collaboration — without friction.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Prodify — Affinify",
    description: "All-in-one productivity workspace by Affinify.",
    images: ["/logo.svg"],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}