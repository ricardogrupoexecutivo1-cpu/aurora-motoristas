import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import TopBar from "./components/top-bar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora Motoristas • Operação Inteligente",
  description:
    "Sistema profissional de gestão de motoristas, ofertas, operações e pagamentos com IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <TopBar />

        <div className="min-h-screen px-3 pb-16 pt-24 sm:px-4 sm:pt-24">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>

        <div className="fixed bottom-2 left-1/2 z-40 w-[calc(100%-16px)] max-w-fit -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-center text-[10px] text-slate-500 shadow-sm backdrop-blur sm:text-xs">
          Sistema em constante atualização • podem ocorrer instabilidades momentâneas
        </div>

        <Analytics />
      </body>
    </html>
  );
}