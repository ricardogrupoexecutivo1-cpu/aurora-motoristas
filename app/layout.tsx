import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

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
    "Plataforma completa de mobilidade urbana, transporte de passageiros e entregas em todo Brasil com a menor taxa do mercado (apenas 5%). Solicite corridas, entregas, seja motorista parceiro ou gerencie sua frota empresarial com seguranca e tecnologia de ponta.",
  keywords: [
    "Aurora Motoristas",
    "app motoristas",
    "corrida",
    "motorista",
    "transporte",
    "mobilidade",
    "taxi",
    "viagem",
    "transfer",
    "menor taxa",
    "5%",
    "delivery",
    "entrega",
    "busca e entrega",
    "logistica",
    "frete",
    "corporativo",
    "frota",
    "erp",
    "gestao",
    "brasil",
  ],
  authors: [{ name: "Aurora Motoristas" }],
  creator: "Aurora Motoristas",
  publisher: "Aurora Motoristas",
  metadataBase: new URL("https://www.appmotoristas.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.appmotoristas.com.br",
    siteName: "Aurora Motoristas - Mobilidade do Futuro",
    title: "Aurora Motoristas - A menor taxa do mercado | Apenas 5%",
    description:
      "Plataforma de mobilidade e entregas com a menor taxa do mercado. Solicite corridas, entregas em todo Brasil, seja motorista ou gerencie sua frota.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aurora Motoristas - Mobilidade do Futuro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Motoristas - Mobilidade do Futuro | Taxa de apenas 5%",
    description: "Plataforma de mobilidade com a menor taxa do mercado",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
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
        <Analytics />
      </body>
    </html>
  );
}


