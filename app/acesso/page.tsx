"use client";

import { useRouter } from "next/navigation";
import { getAuroraSession } from "../lib/aurora-session";

export default function AcessoPage() {
  const router = useRouter();

  function continuar() {
    const session = getAuroraSession();

    if (!session) {
      router.push("/entrar");
      return;
    }

    if (session.role === "admin") router.push("/admin/servicos-supabase");
    if (session.role === "motorista") router.push("/motoristas/painel");
    if (session.role === "cliente") router.push("/clientes/painel");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section
        style={{
          maxWidth: 720,
          margin: "0 auto",
          background: "white",
          padding: 28,
          borderRadius: 28,
        }}
      >
        <p style={{ color: "#2563eb", fontWeight: 900 }}>
          Aurora Motoristas
        </p>

        <h1 style={{ fontSize: 38, marginTop: 10 }}>
          Acesso seguro da plataforma
        </h1>

        <p style={{ color: "#475569", marginTop: 12, lineHeight: 1.6 }}>
          Entrada central inteligente. O sistema identifica automaticamente o perfil
          do usuÃ¡rio e direciona para a Ã¡rea correta sem necessidade de escolha manual.
        </p>

        <div style={{ marginTop: 28 }}>
          <button
            onClick={continuar}
            style={{
              width: "100%",
              border: 0,
              background: "#2563eb",
              color: "white",
              borderRadius: 16,
              padding: "16px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Continuar para minha Ã¡rea
          </button>

          <button
            onClick={() => router.push("/entrar")}
            style={{
              width: "100%",
              marginTop: 12,
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#334155",
              borderRadius: 16,
              padding: "16px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Fazer login novamente
          </button>
        </div>

        <div
          style={{
            marginTop: 20,
            background: "#f1f5f9",
            padding: 16,
            borderRadius: 16,
            fontSize: 13,
            color: "#475569",
          }}
        >
          âœ” Sem limite artificial de usuÃ¡rios por empresa  
          âœ” Controle real por perfil (admin / motorista / cliente)  
          âœ” Estrutura preparada para escala operacional  
        </div>
      </section>
    </main>
  );
}
