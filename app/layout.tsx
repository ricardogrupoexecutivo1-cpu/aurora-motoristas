import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "App Motoristas - A menor taxa do mercado | 5%",
    template: "%s | App Motoristas",
  },
  description:
    "Plataforma de mobilidade com a menor taxa do mercado (5%). Solicite corridas, seja motorista parceiro ou gerencie sua frota empresarial com segurança e tecnologia de ponta.",
  keywords: [
    "app motoristas",
    "corrida",
    "uber",
    "99",
    "motorista",
    "transporte",
    "mobilidade",
    "táxi",
    "viagem",
    "transfer",
  ],
  authors: [{ name: "App Motoristas" }],
  creator: "App Motoristas",
  publisher: "App Motoristas",
  metadataBase: new URL("https://www.appmotoristas.com.br"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.appmotoristas.com.br",
    siteName: "App Motoristas",
    title: "App Motoristas - A menor taxa do mercado | 5%",
    description:
      "Plataforma de mobilidade com a menor taxa do mercado. Solicite corridas, seja motorista ou gerencie sua frota.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "App Motoristas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Motoristas - A menor taxa do mercado",
    description: "Plataforma de mobilidade com taxa de apenas 5%",
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
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0ea5e9" },
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
    <html lang="pt-BR" className="bg-background">
      <head>
        <meta name="application-name" content="App Motoristas" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="App Motoristas" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>

      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
