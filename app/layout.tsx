import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AuroraNav from "./components/AuroraNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Aurora Motoristas - Mobilidade do Futuro | Taxa de apenas 5%",
    template: "%s | Aurora Motoristas",
  },
  description:
    "Plataforma completa de mobilidade urbana, transporte de passageiros e entregas em todo Brasil com a menor taxa do mercado (apenas 5%).",
  metadataBase: new URL("https://www.appmotoristas.com.br"),
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#818cf8" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} bg-background`}>
      <head>
        <meta name="application-name" content="Aurora Motoristas" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Aurora Motoristas" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body className="font-sans antialiased">
        {children}
        <AuroraNav />
        <Analytics />
      </body>
    </html>
  );
}