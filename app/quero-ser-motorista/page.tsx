"use client";

import Link from "next/link";

export default function QueroSerMotoristaPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4f8fc 0%, #eef4fb 50%, #f6f8fb 100%)",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* TOPO */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            color: "#0ea5e9",
          }}
        >
          ← Voltar para a home
        </Link>

        {/* CARD PRINCIPAL */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 28,
            border: "1px solid #e7eef6",
            boxShadow: "0 25px 60px rgba(15, 23, 42, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <span
            style={{
              background: "#e0f2fe",
              color: "#075985",
              borderRadius: 999,
              padding: "6px 12px",
              fontWeight: 700,
              fontSize: 13,
              width: "fit-content",
            }}
          >
            Aurora Motoristas
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.1,
              color: "#0f172a",
            }}
          >
            Trabalhe como motorista parceiro
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: 16,
              color: "#4b6478",
              lineHeight: 1.7,
            }}
          >
            Receba chamados de serviços de empresas e locadoras, escolha quando
            trabalhar e aumente sua renda com total liberdade.
          </p>

          {/* BENEFÍCIOS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <Box text="✔ Escolha aceitar ou recusar serviços" />
            <Box text="✔ Receba pelo que executar" />
            <Box text="✔ Sem obrigação de volume mínimo" />
            <Box text="✔ Chamados via WhatsApp" />
            <Box text="✔ Trabalho flexível" />
            <Box text="✔ Plataforma profissional" />
          </div>

          {/* BOTÃO PRINCIPAL */}
          <Link
            href="/motoristas/novo"
            style={{
              textDecoration: "none",
              textAlign: "center",
              background: "#0ea5e9",
              color: "#ffffff",
              padding: "18px",
              borderRadius: 16,
              fontWeight: 800,
              fontSize: 18,
              boxShadow: "0 20px 40px rgba(14, 165, 233, 0.25)",
            }}
          >
            🚀 Quero me cadastrar como motorista
          </Link>

          {/* INFO EXTRA */}
          <div
            style={{
              borderRadius: 16,
              background: "#f8fbff",
              border: "1px solid #e5edf5",
              padding: 16,
              fontSize: 14,
              color: "#435b6e",
              lineHeight: 1.6,
            }}
          >
            Após o cadastro, sua solicitação será analisada. Você poderá começar
            a receber chamados conforme a demanda das empresas.
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#64748b",
            }}
          >
            Sistema em constante atualização • podem ocorrer instabilidades
            momentâneas
          </div>
        </section>
      </div>
    </main>
  );
}

function Box({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 12,
        fontSize: 14,
        fontWeight: 700,
        color: "#334155",
      }}
    >
      {text}
    </div>
  );
}