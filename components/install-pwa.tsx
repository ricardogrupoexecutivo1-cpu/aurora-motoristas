"use client";

import { useState, useEffect } from "react";
import {
  Download,
  X,
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  Check,
  ChevronDown,
  Apple,
  Navigation,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Detectar dispositivo
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Verificar se ja esta instalado
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    const isInWebAppiOS = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listener para evento de instalacao
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostrar banner apos 3 segundos
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listener para instalacao concluida
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setShowInstallModal(false);
      setDeferredPrompt(null);
    });

    // Registrar Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[Aurora Motoristas] Service Worker registrado:", registration.scope);
        })
        .catch((error) => {
          console.error("[Aurora Motoristas] Falha ao registrar Service Worker:", error);
        });
    }

    // Mostrar banner para iOS apos 3 segundos se nao estiver instalado
    if (isIOSDevice && !isStandalone && !isInWebAppiOS) {
      setTimeout(() => setShowBanner(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      setShowInstallModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallModal(true);
    }
  };

  const closeBanner = () => {
    setShowBanner(false);
    // Salvar preferencia
    localStorage.setItem("Aurora Motoristas-install-dismissed", Date.now().toString());
  };

  // Nao mostrar se ja instalado
  if (isInstalled) return null;

  return (
    <>
      {/* Banner flutuante de instalacao */}
      {showBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up md:left-auto md:right-4 md:max-w-sm">
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-premium flex items-center justify-center flex-shrink-0">
                <Navigation className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-foreground mb-1">Instalar Aurora Motoristas</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Acesso rapido na sua tela inicial. Sem ocupar espaco!
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-2.5 px-4 gradient-premium text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 btn-premium"
                  >
                    <Download className="w-4 h-4" />
                    Instalar
                  </button>
                  <button
                    onClick={closeBanner}
                    className="p-2.5 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de instalacao */}
      {showInstallModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInstallModal(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="p-6 pb-4 text-center border-b border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-premium flex items-center justify-center">
                <Navigation className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-1">Instalar Aurora Motoristas</h2>
              <p className="text-muted-foreground text-sm">
                Adicione a sua tela inicial para acesso rapido
              </p>
            </div>

            {/* Conteudo */}
            <div className="p-6">
              {isIOS || showIOSInstructions ? (
                // Instrucoes para iOS
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                    <Apple className="w-5 h-5" />
                    <span>Instrucoes para iPhone/iPad</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">1</span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Toque no botao Compartilhar</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Share className="w-5 h-5 text-primary" />
                          <span>Na barra inferior do Safari</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">2</span>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Adicionar a Tela de Inicio</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <PlusSquare className="w-5 h-5 text-primary" />
                          <span>Role para baixo e toque</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium mb-1">Pronto!</p>
                        <p className="text-sm text-muted-foreground">
                          O Aurora Motoristas estara na sua tela inicial
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Instrucoes para Android/Desktop
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-xl">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Sem ocupar espaco</p>
                      <p className="text-xs text-muted-foreground">
                        Funciona direto do navegador
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Smartphone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Acesso rapido</p>
                      <p className="text-xs text-muted-foreground">
                        Icone na sua tela inicial
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                    <Monitor className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Funciona offline</p>
                      <p className="text-xs text-muted-foreground">
                        Algumas funcoes disponiveis sem internet
                      </p>
                    </div>
                  </div>

                  {deferredPrompt && (
                    <button
                      onClick={handleInstallClick}
                      className="w-full py-4 gradient-premium text-white font-bold rounded-xl flex items-center justify-center gap-3 btn-premium mt-4"
                    >
                      <Download className="w-5 h-5" />
                      Instalar Agora
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <button
                onClick={() => setShowInstallModal(false)}
                className="w-full py-3 bg-secondary text-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botao fixo de instalacao (aparece se o banner foi fechado) */}
      {!showBanner && !isInstalled && (deferredPrompt || isIOS) && (
        <button
          onClick={handleInstallClick}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full gradient-premium shadow-xl flex items-center justify-center btn-premium animate-bounce-slow"
          title="Instalar Aurora Motoristas"
        >
          <Download className="w-6 h-6 text-white" />
        </button>
      )}
    </>
  );
}

