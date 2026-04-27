"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuroraSession } from "../lib/aurora-session";

type Props = {
  children: ReactNode;
};

const rotasLivres = ["/", "/entrar", "/login", "/offline"];

const rotasAdmin = [
  "/admin",
  "/plataforma/cotacoes/nova",
  "/clientes",
  "/motoristas",
  "/financeiro",
  "/relatorios",
  "/operacao",
  "/operacoes-brasil",
  "/plataforma",
];

const rotasMotorista = ["/motoristas/painel"];
const rotasCliente = ["/clientes/painel"];

function pertence(pathname: string, rotas: string[]) {
  return rotas.some((rota) => pathname === rota || pathname.startsWith(`${rota}/`));
}

export default function AuroraRouteGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const session = getAuroraSession();

    if (!pathname) {
      setVerificado(true);
      return;
    }

    if (rotasLivres.includes(pathname)) {
      setVerificado(true);
      return;
    }

    if (pathname === "/central" || pathname === "/acesso") {
      if (!session) {
        router.replace("/entrar");
        return;
      }

      setVerificado(true);
      return;
    }

    if (pathname.startsWith("/cliente/") || pathname.startsWith("/motorista/")) {
      setVerificado(true);
      return;
    }

    if (!session) {
      router.replace("/entrar");
      return;
    }

    if (pertence(pathname, rotasAdmin) && session.role !== "admin") {
      router.replace("/central");
      return;
    }

    if (pertence(pathname, rotasMotorista) && session.role !== "motorista") {
      router.replace("/central");
      return;
    }

    if (pertence(pathname, rotasCliente) && session.role !== "cliente") {
      router.replace("/central");
      return;
    }

    setVerificado(true);
  }, [pathname, router]);

  function voltar() {
    router.back();
  }

  function irCentral() {
    router.push("/central");
  }

  const esconderBotoes =
    pathname === "/" || pathname === "/entrar" || pathname === "/login";

  if (!verificado) {
    return (
      <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
        <section
          style={{
            maxWidth: 640,
            margin: "0 auto",
            background: "white",
            padding: 24,
            borderRadius: 24,
          }}
        >
          <p style={{ fontWeight: 900 }}>Verificando acesso Aurora...</p>

          <button
            onClick={() => router.push("/entrar")}
            style={{
              marginTop: 18,
              border: 0,
              background: "#2563eb",
              color: "white",
              borderRadius: 12,
              padding: "12px 16px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Voltar para login
          </button>
        </section>
      </main>
    );
  }

  return (
    <>
      {!esconderBotoes && (
        <div
          style={{
            position: "fixed",
            left: 16,
            bottom: 16,
            zIndex: 9999,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={voltar}
            style={botaoPreto}
          >
            Voltar
          </button>

          <button
            onClick={irCentral}
            style={botaoAzul}
          >
            Central
          </button>
        </div>
      )}

      {children}
    </>
  );
}

const botaoPreto = {
  border: 0,
  background: "#0f172a",
  color: "white",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 900,
  cursor: "pointer",
};

const botaoAzul = {
  border: 0,
  background: "#2563eb",
  color: "white",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 900,
  cursor: "pointer",
};