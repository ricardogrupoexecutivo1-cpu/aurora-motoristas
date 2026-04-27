"use client";

import { useEffect, useMemo, useState } from "react";

export default function FinanceiroPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    const response = await fetch("/api/services");
    const result = await response.json();

    if (result.ok) {
      setServices(result.services || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    const totalCliente = services.reduce((acc, item) => acc + Number(item.client_amount || 0), 0);
    const totalMotorista = services.reduce((acc, item) => acc + Number(item.driver_amount || 0), 0);
    const totalDespesas = services.reduce((acc, item) => acc + Number(item.expenses_amount || 0), 0);
    const totalComissao = services.reduce((acc, item) => acc + Number(item.platform_commission_amount || 0), 0);
    const lucro = services.reduce((acc, item) => acc + Number(item.operational_profit || 0), 0);

    const confirmados = services.filter((item) => item.status === "cliente_confirmou").length;
    const aceitos = services.filter((item) => item.driver_status === "aceito").length;
    const pendentes = services.filter((item) => item.status !== "cliente_confirmou").length;

    return {
      totalCliente,
      totalMotorista,
      totalDespesas,
      totalComissao,
      lucro,
      confirmados,
      aceitos,
      pendentes,
      total: services.length,
    };
  }, [services]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Carregando financeiro...</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 800 }}>Aurora Motoristas</p>
        <h1 style={{ fontSize: 36, marginTop: 8 }}>Financeiro operacional</h1>
        <p style={{ color: "#475569", marginTop: 8 }}>
          Painel real calculado com base nos serviços salvos no Supabase.
        </p>

        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", marginTop: 24 }}>
          <Card titulo="Total cobrado" valor={moeda(resumo.totalCliente)} />
          <Card titulo="Pago a motoristas" valor={moeda(resumo.totalMotorista)} />
          <Card titulo="Despesas" valor={moeda(resumo.totalDespesas)} />
          <Card titulo="Comissão plataforma 5%" valor={moeda(resumo.totalComissao)} />
          <Card titulo="Lucro operacional" valor={moeda(resumo.lucro)} destaque />
          <Card titulo="Serviços" valor={String(resumo.total)} />
          <Card titulo="Aceitos" valor={String(resumo.aceitos)} />
          <Card titulo="Confirmados" valor={String(resumo.confirmados)} />
        </div>

        <div style={{ marginTop: 28, background: "white", borderRadius: 24, padding: 20, overflowX: "auto" }}>
          <h2 style={{ fontSize: 24, marginBottom: 14 }}>Serviços financeiros</h2>

          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "#475569" }}>
                <th style={th}>Código</th>
                <th style={th}>Status</th>
                <th style={th}>Cliente</th>
                <th style={th}>Motorista</th>
                <th style={th}>Cliente paga</th>
                <th style={th}>Motorista recebe</th>
                <th style={th}>Despesas</th>
                <th style={th}>Comissão</th>
                <th style={th}>Lucro</th>
              </tr>
            </thead>

            <tbody>
              {services.map((item) => (
                <tr key={item.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                  <td style={td}>{item.service_code}</td>
                  <td style={td}>{item.status}</td>
                  <td style={td}>{item.client_name || "-"}</td>
                  <td style={td}>{item.driver_name || "-"}</td>
                  <td style={td}>{moeda(Number(item.client_amount || 0))}</td>
                  <td style={td}>{moeda(Number(item.driver_amount || 0))}</td>
                  <td style={td}>{moeda(Number(item.expenses_amount || 0))}</td>
                  <td style={td}>{moeda(Number(item.platform_commission_amount || 0))}</td>
                  <td style={td}><strong>{moeda(Number(item.operational_profit || 0))}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Card({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div
      style={{
        background: destaque ? "#dbeafe" : "white",
        border: "1px solid #dbeafe",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <p style={{ color: "#64748b", fontSize: 14 }}>{titulo}</p>
      <h2 style={{ fontSize: 24, marginTop: 8 }}>{valor}</h2>
    </div>
  );
}

const th = {
  padding: "12px",
  fontSize: 13,
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: "12px",
  fontSize: 14,
};
