"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuroraLogoutButton from "../components/AuroraLogoutButton";
import AuroraPrintButton from "../components/AuroraPrintButton";
import { getAuroraSession } from "../lib/aurora-session";

type Role = "admin" | "motorista" | "cliente";

type Atalho = {
  titulo: string;
  descricao: string;
  rota: string;
  roles: Role[];
};

const atalhos: Atalho[] = [
  {
    titulo: "Criar novo serviço",
    descricao: "Cadastrar serviço com cliente, motorista, valores e rota.",
    rota: "/servicos/novo",
    roles: ["admin"],
  },
  {
    titulo: "Painel Admin",
    descricao: "Ver todos os serviços, faturamento, custos e lucro.",
    rota: "/admin/servicos",
    roles: ["admin"],
  },
  {
    titulo: "Painel Motorista",
    descricao: "Área onde o motorista vê somente os serviços dele.",
    rota: "/motoristas/painel",
    roles: ["motorista"],
  },
  {
    titulo: "Painel Cliente",
    descricao: "Área onde o cliente vê somente seus serviços.",
    rota: "/clientes/painel",
    roles: ["cliente"],
  },
  {
    titulo: "Financeiro",
    descricao: "Resumo financeiro geral da operação.",
    rota: "/financeiro",
    roles: ["admin"],
  },
  {
    titulo: "Motoristas",
    descricao: "Gestão e cadastro de motoristas.",
    rota: "/motoristas",
    roles: ["admin"],
  },
  {
    titulo: "Clientes",
    descricao: "Gestão e cadastro de clientes.",
    rota: "/clientes",
    roles: ["admin"],
  },
  {
    titulo: "Relatórios",
    descricao: "Acompanhamento operacional e financeiro.",
    rota: "/relatorios",
    roles: ["admin"],
  },
  {
    titulo: "Acesso seguro",
    descricao: "Entrada central por perfil.",
    rota: "/acesso",
    roles: ["admin", "motorista", "cliente"],
  },
];

export default function CentralPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getAuroraSession();

    if (!session) {
      router.push("/entrar");
      return;
    }

    setRole(session.role);
    setLoading(false);
  }, [router]);

  function abrir(rota: string) {
    router.push(rota);
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
        <section style={{ maxWidth: 720, margin: "0 auto", background: "white", padding: 24, borderRadius: 24 }}>
          <p style={{ fontWeight: 900 }}>Carregando Central Aurora...</p>
        </section>
      </main>
    );
  }

  const atalhosFiltrados = atalhos.filter((item) =>
    role ? item.roles.includes(role) : false
  );

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#2563eb", fontWeight: 900 }}>Aurora Motoristas</p>
            <h1 style={{ fontSize: 38, marginTop: 8 }}>Central de Funções</h1>
            <p style={{ color: "#475569", marginTop: 8 }}>
              Funções disponíveis para seu perfil: <strong>{role}</strong>
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <AuroraPrintButton />
            <AuroraLogoutButton />
          </div>
        </div>

        <div
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {atalhosFiltrados.map((item) => (
            <button
              key={item.rota}
              type="button"
              onClick={() => abrir(item.rota)}
              style={{
                textAlign: "left",
                background: "white",
                border: "1px solid #dbeafe",
                borderRadius: 22,
                padding: 20,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 900 }}>{item.titulo}</h2>
              <p style={{ marginTop: 8, color: "#64748b", lineHeight: 1.5 }}>
                {item.descricao}
              </p>
              <p style={{ marginTop: 14, color: "#2563eb", fontWeight: 900 }}>
                Abrir →
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}