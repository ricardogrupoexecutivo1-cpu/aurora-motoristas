"use client";

import { useEffect, useMemo, useState } from "react";

export default function ServicosSupabasePage() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [msg, setMsg] = useState("Carregando...");
  const [pagandoId, setPagandoId] = useState("");

  async function carregar() {
    setMsg("Carregando serviços...");

    try {
      const res = await fetch("/api/admin-servicos", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.message || "Erro ao carregar serviços.");
        setServicos([]);
        return;
      }

      setServicos(data.servicos || []);
      setMsg("Supabase OK");
    } catch (error) {
      console.error(error);
      setMsg("Erro inesperado ao carregar serviços.");
    }
  }

  async function marcarPago(servicoId: string) {
    setMsg("");
    setPagandoId(servicoId);

    try {
      const res = await fetch("/api/servicos/pagar", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servico_id: servicoId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.message || "Erro ao marcar como pago.");
        return;
      }

      setMsg("Serviço marcado como pago.");
      await carregar();
    } catch (error) {
      console.error(error);
      setMsg("Erro inesperado ao marcar como pago.");
    } finally {
      setPagandoId("");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    const totalCliente = servicos.reduce((t, s) => t + Number(s.valor_cliente || 0), 0);
    const totalMotorista = servicos.reduce((t, s) => t + Number(s.valor_motorista || 0), 0);
    const totalDespesas = servicos.reduce((t, s) => t + Number(s.despesas_reembolsaveis || 0), 0);
    const aberto = servicos
      .filter((s) => s.status_financeiro !== "pago")
      .reduce((t, s) => t + Number(s.valor_cliente || 0), 0);
    const pago = servicos
      .filter((s) => s.status_financeiro === "pago")
      .reduce((t, s) => t + Number(s.valor_cliente || 0), 0);

    return {
      total: servicos.length,
      cliente: totalCliente,
      motorista: totalMotorista,
      despesas: totalDespesas,
      margem: totalCliente - totalMotorista - totalDespesas,
      aberto,
      pago,
    };
  }, [servicos]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 24 }}>
      <section style={{ maxWidth: 1280, margin: "0 auto" }}>
        <p style={{ color: "#22d3ee", fontWeight: 800 }}>Aurora Motoristas</p>
        <h1 style={{ fontSize: 36, marginTop: 8 }}>Serviços Supabase</h1>
        <p style={{ color: "#cbd5e1", marginTop: 8 }}>
          Leitura limpa dos serviços gerados pela aprovação das cotações.
        </p>

        <div style={navBox}>
          <a href="/admin/dashboard" style={navBtn}>Dashboard</a>
          <a href="/cliente/supabase" style={navBtn}>Painel Cliente</a>
          <a href="/motorista/supabase" style={navBtn}>Painel Motorista</a>
          <a href="/motorista/historico-supabase" style={navBtn}>Histórico Motorista</a>
          <a href="/cliente/historico-supabase" style={navBtn}>Histórico Cliente</a>
          <a href="/cliente/nota-debito-supabase" style={navBtn}>Nota de Débito</a>
          <a href="/admin/recibo-motorista-supabase" style={navBtn}>Recibo Motorista</a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 24 }}>
          <Card titulo="Serviços" valor={String(resumo.total)} />
          <Card titulo="Total cliente" valor={moeda(resumo.cliente)} />
          <Card titulo="Em aberto" valor={moeda(resumo.aberto)} />
          <Card titulo="Pago" valor={moeda(resumo.pago)} />
          <Card titulo="Motorista" valor={moeda(resumo.motorista)} />
          <Card titulo="Despesas" valor={moeda(resumo.despesas)} />
          <Card titulo="Margem" valor={moeda(resumo.margem)} />
          <Card titulo="Status" valor={msg} />
        </div>

        <button onClick={carregar} style={primaryBtn}>
          Atualizar
        </button>

        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 20, overflowX: "auto" }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Lista operacional</h2>

          {servicos.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Nenhum serviço encontrado na tabela servicos.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1250 }}>
              <thead>
                <tr>
                  <th style={th}>Serviço</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Rota</th>
                  <th style={th}>Pedido</th>
                  <th style={th}>Aprovado por</th>
                  <th style={th}>Operacional</th>
                  <th style={th}>Financeiro</th>
                  <th style={th}>Data</th>
                  <th style={th}>Valor cliente</th>
                  <th style={th}>Motorista</th>
                  <th style={th}>Despesas</th>
                  <th style={th}>Ação</th>
                </tr>
              </thead>

              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.numero_servico || s.id}</td>
                    <td style={td}>{s.cliente_nome || "—"}</td>
                    <td style={td}>{s.origem || "—"} → {s.destino || "—"}</td>
                    <td style={td}>{s.numero_pedido || "—"}</td>
                    <td style={td}>{s.aprovado_por || "—"}</td>
                    <td style={td}>{s.status_operacional || s.status || "—"}</td>
                    <td style={td}>{s.status_financeiro || "—"}</td>
                    <td style={td}>{s.data_servico || s.data_pedido || "—"}</td>
                    <td style={td}>{moeda(Number(s.valor_cliente || 0))}</td>
                    <td style={td}>{moeda(Number(s.valor_motorista || 0))}</td>
                    <td style={td}>{moeda(Number(s.despesas_reembolsaveis || 0))}</td>
                    <td style={td}>
                      {s.status_financeiro === "pago" ? (
                        <span style={{ color: "#86efac", fontWeight: 800 }}>Pago</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => marcarPago(s.id)}
                          disabled={pagandoId === s.id}
                          style={payBtn}
                        >
                          {pagandoId === s.id ? "Pagando..." : "Marcar pago"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

function Card({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div style={{ background: "#0f172a", border: "1px solid #1e293b", padding: 18, borderRadius: 18 }}>
      <p style={{ color: "#94a3b8", fontSize: 14 }}>{titulo}</p>
      <h2 style={{ fontSize: 22, marginTop: 8 }}>{valor}</h2>
    </div>
  );
}

const navBox = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 10,
  marginTop: 22,
  padding: 14,
  border: "1px solid #164e63",
  borderRadius: 18,
  background: "#082f49",
};

const navBtn = {
  display: "inline-block",
  background: "#06b6d4",
  color: "#020617",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 900,
  textDecoration: "none",
};

const primaryBtn = {
  marginTop: 24,
  background: "#06b6d4",
  color: "#020617",
  border: 0,
  borderRadius: 14,
  padding: "12px 18px",
  fontWeight: 900,
  cursor: "pointer",
};

const payBtn = {
  background: "#22c55e",
  color: "#020617",
  border: 0,
  borderRadius: 10,
  padding: "8px 12px",
  fontWeight: 900,
  cursor: "pointer",
};

const th = {
  padding: 10,
  borderBottom: "1px solid #334155",
  textAlign: "left" as const,
  color: "#67e8f9",
  fontSize: 13,
};

const td = {
  padding: 10,
  borderBottom: "1px solid #1e293b",
  color: "#e2e8f0",
  fontSize: 14,
};
