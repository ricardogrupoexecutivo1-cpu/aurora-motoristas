import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f9fc] text-gray-900">
        {children}

        {/* 🔥 Analytics Vercel */}
        <Analytics />

        {/* ⚠️ Aviso padrão Aurora */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">
          Sistema em constante atualização • podem ocorrer instabilidades momentâneas
        </div>
      </body>
    </html>
  );
}