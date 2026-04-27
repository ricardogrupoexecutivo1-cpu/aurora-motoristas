"use client";

import { useEffect, useState } from "react";
import AuroraProtected from "../../components/AuroraProtected";
import AuroraLogoutButton from "../../components/AuroraLogoutButton";
import AuroraPrintButton from "../../components/AuroraPrintButton";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const response = await fetch("/api/admin/dashboard");
    const result = await response.json();

    if (result.ok) {
      setDashboard(result.dashboard);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function moeda(valor: number) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <AuroraProtected allowedRoles={["admin"]}>
        <main style={main}>
          <section style={box}>Carregando dashboard Aurora...</section>
        </main>
      </AuroraProtected>
    );
  }

  return (
    <AuroraProtected allowedRoles={["admin"]}>
      <main style={main}>
        <section style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={top}>
            <div>
              <p style={eyebrow}>Aurora Motoristas • Admin</p>
              <h1 style={title}>Dashboard Executivo</h1>
              <p style={subtitle}>
                Visão geral da operação, receita, comissões e regiões mais ativas da plataforma.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <AuroraPrintButton />
              <AuroraLogoutButton />
            </div>
          </div>

          <div style={grid}>
            <Card titulo="Serviços" valor={String(dashboard?.totalServices || 0)} />
            <Card titulo="Receita total" valor={moeda(dashboard?.totalRevenue)} destaque />
            <Card titulo="Comissão Aurora" valor={moeda(dashboard?.totalCommission)} />
            <Card titulo="A receber" valor={moeda(dashboard?.totalPending)} alerta />
            <Card titulo="Recebido" valor={moeda(dashboard?.totalReceived)} />
          </div>

          <div style={panel}>
            <h2 style={panelTitle}>Fluxo Supabase novo</h2>

            <p style={{ color: "#cbd5e1", marginBottom: 16 }}>
              Acessos rápidos para serviços gerados por cotação, pagamento, histórico,
              nota de débito e recibo administrativo.
            </p>

            <div style={actions}>
              <a href="/admin/servicos-supabase" style={actionBtnNovo}>
                Serviços Supabase
              </a>

              <a href="/cliente/supabase" style={actionBtnNovo}>
                Painel Cliente Supabase
              </a>

              <a href="/motorista/supabase" style={actionBtnNovo}>
                Painel Motorista Supabase
              </a>

              <a href="/motorista/historico-supabase" style={actionBtnNovo}>
                Histórico Motorista
              </a>

              <a href="/cliente/historico-supabase" style={actionBtnNovo}>
                Histórico Cliente
              </a>

              <a href="/cliente/nota-debito-supabase" style={actionBtnNovo}>
                Nota de Débito Cliente
              </a>

              <a href="/admin/recibo-motorista-supabase" style={actionBtnNovo}>
                Recibo Motorista Admin
              </a>
            </div>
          </div>

          <div style={panel}>
            <h2 style={panelTitle}>Cidades com maior uso</h2>

            <div style={{ display: "grid", gap: 12 }}>
              {(dashboard?.topCities || []).map((item: any, index: number) => (
                <div key={item.cidade} style={cityRow}>
                  <div>
                    <strong>{index + 1}. {item.cidade}</strong>
                    <p style={{ color: "#94a3b8", marginTop: 4 }}>
                      {item.total} serviço(s)
                    </p>
                  </div>

                  <div style={barWrap}>
                    <div
                      style={{
                        ...bar,
                        width: `${Math.min(100, item.total * 20)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={panel}>
            <h2 style={panelTitle}>Atalhos executivos antigos</h2>

            <div style={actions}>
              <a href="/admin/servicos" style={actionBtn}>Serviços antigos</a>
              <a href="/servicos/novo" style={actionBtn}>Novo serviço antigo</a>
              <a href="/financeiro/aurora" style={actionBtn}>Financeiro Aurora antigo</a>
              <a href="/central" style={actionBtn}>Central</a>
            </div>
          </div>
        </section>
      </main>
    </AuroraProtected>
  );
}

function Card({
  titulo,
  valor,
  destaque,
  alerta,
}: {
  titulo: string;
  valor: string;
  destaque?: boolean;
  alerta?: boolean;
}) {
  return (
    <div
      style={{
        background: destaque
          ? "linear-gradient(135deg, #064e3b, #022c22)"
          : "#020617",
        border: alerta ? "1px solid #facc15" : "1px solid #22c55e",
        borderRadius: 24,
        padding: 20,
        boxShadow: "0 0 28px rgba(34, 197, 94, 0.20)",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 13, fontWeight: 800 }}>
        {titulo}
      </p>
      <h2 style={{ color: alerta ? "#facc15" : "#22c55e", fontSize: 28, marginTop: 10 }}>
        {valor}
      </h2>
    </div>
  );
}

const main = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #064e3b 0%, #020617 38%, #000 100%)",
  color: "white",
  padding: 24,
};

const box = {
  maxWidth: 640,
  margin: "0 auto",
  background: "#020617",
  border: "1px solid #22c55e",
  borderRadius: 24,
  padding: 24,
};

const top = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  flexWrap: "wrap" as const,
};

const eyebrow = {
  color: "#22c55e",
  fontWeight: 900,
  letterSpacing: 1,
};

const title = {
  fontSize: 42,
  marginTop: 8,
};

const subtitle = {
  color: "#cbd5e1",
  marginTop: 8,
  maxWidth: 760,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 16,
  marginTop: 28,
};

const panel = {
  marginTop: 28,
  background: "rgba(2, 6, 23, 0.86)",
  border: "1px solid #22c55e",
  borderRadius: 28,
  padding: 22,
  boxShadow: "0 0 35px rgba(34, 197, 94, 0.16)",
};

const panelTitle = {
  color: "#22c55e",
  fontSize: 24,
  marginBottom: 18,
};

const cityRow = {
  display: "grid",
  gridTemplateColumns: "220px 1fr",
  gap: 14,
  alignItems: "center",
};

const barWrap = {
  height: 14,
  background: "#0f172a",
  borderRadius: 999,
  overflow: "hidden",
  border: "1px solid #14532d",
};

const bar = {
  height: "100%",
  background: "linear-gradient(90deg, #22c55e, #86efac)",
  borderRadius: 999,
};

const actions = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 12,
};

const actionBtn = {
  display: "inline-block",
  background: "#22c55e",
  color: "#020617",
  borderRadius: 16,
  padding: "12px 16px",
  fontWeight: 900,
  textDecoration: "none",
};

const actionBtnNovo = {
  display: "inline-block",
  background: "#06b6d4",
  color: "#020617",
  borderRadius: 16,
  padding: "12px 16px",
  fontWeight: 900,
  textDecoration: "none",
  boxShadow: "0 0 20px rgba(6, 182, 212, 0.24)",
};
