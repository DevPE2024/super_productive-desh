import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Productive",
  description: "A productivity application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}