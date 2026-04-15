import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurora Motoristas",
  description:
    "Aurora Motoristas - operação inteligente com serviços, histórico protegido e uso rápido no celular ou PC.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0ea5e9",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="application-name" content="Aurora Motoristas" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aurora Motoristas" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>

      <body>{children}</body>
    </html>
  );
}