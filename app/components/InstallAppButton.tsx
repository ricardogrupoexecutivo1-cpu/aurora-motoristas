"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [statusText, setStatusText] = useState(
    "Instale o app no celular ou PC para acesso rápido."
  );

  useEffect(() => {
    const isStandalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

    if (isStandalone) {
      setIsInstalled(true);
      setStatusText("App já instalado neste dispositivo.");
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setStatusText("Instalação disponível para este dispositivo.");
    }

    function handleAppInstalled() {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setStatusText("App instalado com sucesso neste dispositivo.");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function instalar() {
    if (isInstalled) {
      setStatusText("O app já está instalado neste dispositivo.");
      return;
    }

    if (!deferredPrompt) {
      setStatusText(
        "Se o botão não abrir a instalação automaticamente, use o menu do navegador e escolha â€œInstalar appâ€ ou â€œAdicionar Ã  tela inicialâ€."
      );
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setStatusText("Instalação aceita. Finalizando no dispositivo...");
      } else {
        setStatusText("Instalação cancelada pelo usuário.");
      }

      setDeferredPrompt(null);
    } catch {
      setStatusText(
        "Não foi possível abrir a instalação automática agora. Tente pelo menu do navegador."
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
      }}
    >
      <button
        type="button"
        onClick={instalar}
        style={{
          border: "none",
          background: "#0ea5e9",
          color: "#ffffff",
          borderRadius: 14,
          padding: "14px 18px",
          fontWeight: 800,
          fontSize: 15,
          cursor: "pointer",
          boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
          width: "100%",
        }}
      >
        {isInstalled ? "App instalado" : "Baixar app / Instalar app"}
      </button>

      <div
        style={{
          borderRadius: 14,
          background: "#f8fbff",
          border: "1px solid #dbeafe",
          padding: "12px 14px",
          color: "#435b6e",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {statusText}
      </div>
    </div>
  );
}

