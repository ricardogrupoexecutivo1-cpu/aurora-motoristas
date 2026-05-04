"use client";

import { useEffect, useMemo, useState } from "react";

export default function MotoristaSupabasePage() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [msg, setMsg] = useState("Carregando...");

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

      // 🔥 REGRA: motorista não vê serviço pago
      const filtrados = (data.servicos || []).filter(
        (s: any) => s.status_financeiro !== "pago"
      );

      setServicos(filtrados);
      setMsg("Supabase OK");
    } catch (error) {
      console.error(error);
      setMsg("Erro inesperado ao carregar serviços.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    const total = servicos.length;
    const valor = servicos.reduce(
      (t, s) => t + Number(s.valor_motorista || 0),
      0
    );

    return { total, valor };
  }, [servicos]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 24 }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <p style={{ color: "#22d3ee", fontWeight: 800 }}>Aurora Motoristas</p>
        <h1 style={{ fontSize: 34, marginTop: 8 }}>Painel do Motorista Supabase</h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 24 }}>
          <Card titulo="Serviços disponíveis" valor={String(resumo.total)} />
          <Card titulo="Total motorista" valor={moeda(resumo.valor)} />
          <Card titulo="Status" valor={msg} />
        </div>

        <button
          onClick={carregar}
          style={{
            marginTop: 24,
            background: "#06b6d4",
            color: "#020617",
            border: 0,
            borderRadius: 14,
            padding: "12px 18px",
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          Atualizar
        </button>

        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 20 }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Serviços ativos</h2>

          {servicos.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Nenhum serviço disponível.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Serviço</th>
                  <th style={th}>Rota</th>
                  <th style={th}>Data</th>
                  <th style={th}>Valor</th>
                </tr>
              </thead>

              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.numero_servico}</td>
                    <td style={td}>{s.origem} → {s.destino}</td>
                    <td style={td}>{s.data_servico}</td>
                    <td style={td}>{moeda(Number(s.valor_motorista || 0))}</td>
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

function Card({ titulo, valor }: any) {
  return (
    <div style={{ background: "#0f172a", padding: 18, borderRadius: 18 }}>
      <p>{titulo}</p>
      <h2>{valor}</h2>
    </div>
  );
}

const th = { padding: 10, borderBottom: "1px solid #334155" };
const td = { padding: 10, borderBottom: "1px solid #1e293b" };
