"use client";

import { WifiOff, RefreshCw, Navigation, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center shadow-lg">
            <Navigation className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black gradient-text">MOVO</span>
        </div>

        {/* Icone Offline */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
          <WifiOff className="w-12 h-12 text-muted-foreground" />
        </div>

        {/* Mensagem */}
        <h1 className="text-2xl font-bold mb-3">Voce esta offline</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Parece que voce perdeu a conexao com a internet. Verifique sua conexao e tente novamente.
        </p>

        {/* Botoes */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full py-4 px-6 gradient-premium text-white font-bold rounded-xl flex items-center justify-center gap-3 btn-premium"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>

          <Link
            href="/"
            className="w-full py-4 px-6 bg-secondary text-foreground font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-secondary/80 transition-colors"
          >
            <Home className="w-5 h-5" />
            Voltar ao Inicio
          </Link>
        </div>

        {/* Dica */}
        <div className="mt-10 p-4 bg-card rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Dica:</span> O MOVO funciona melhor com uma conexao estavel. Algumas funcoes podem estar disponiveis offline.
          </p>
        </div>
      </div>
    </main>
  );
}
