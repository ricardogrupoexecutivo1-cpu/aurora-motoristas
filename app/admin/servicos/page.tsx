"use client";

import { useEffect, useMemo, useState } from "react";
import AuroraProtected from "../../components/AuroraProtected";
import AuroraLogoutButton from "../../components/AuroraLogoutButton";
import AuroraPrintButton from "../../components/AuroraPrintButton";

export default function AdminServicosPage() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function carregar() {
    setLoading(true);
    setMsg("");

    try {
      const response = await fetch("/api/admin-servicos", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setMsg(result.message || "Erro ao carregar serviços.");
        setServicos([]);
        return;
      }

      setServicos(result.servicos || []);
    } catch (error) {
      console.error("ERRO AO CARREGAR SERVIÇOS:", error);
      setMsg("Erro inesperado ao carregar serviços.");
      setServicos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    return {
      total: servicos.length,
      pendentes: servicos.filter((item) => item.status_operacional === "pendente").length,
      andamento: servicos.filter((item) => item.status_operacional === "em_andamento").length,
      aCobrar: servicos.filter((item) => item.status_financeiro === "a_cobrar").length,
      faturado: servicos.reduce((acc, item) => acc + Number(item.valor_cliente || 0), 0),
      motorista: servicos.reduce((acc, item) => acc + Number(item.valor_motorista || 0), 0),
      despesas: servicos.reduce((acc, item) => acc + Number(item.despesas_reembolsaveis || 0), 0),
    };
  }, [servicos]);

  const margem = resumo.faturado - resumo.motorista - resumo.despesas;

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <AuroraProtected allowedRoles={["admin"]}>
        <main style={{ padding: 30 }}>Carregando painel admin...</main>
      </AuroraProtected>
    );
  }

  return (
    <AuroraProtected allowedRoles={["admin"]}>
      <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
        <section style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#2563eb", fontWeight: 800 }}>Aurora Motoristas</p>
              <h1 style={{ fontSize: 36, marginTop: 8 }}>Admin • Serviços</h1>
              <p style={{ color: "#475569", marginTop: 8 }}>
                Serviços gerados pela aprovação de cotações no Supabase.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <AuroraPrintButton />
              <AuroraLogoutButton />
            </div>
          </div>

          {msg && (
            <p style={{ marginTop: 16, background: "#fee2e2", padding: 12, borderRadius: 14, fontWeight: 700 }}>
              {msg}
            </p>
          )}

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 24 }}>
            <Card titulo="Serviços" valor={String(resumo.total)} />
            <Card titulo="Pendentes" valor={String(resumo.pendentes)} />
            <Card titulo="Em andamento" valor={String(resumo.andamento)} />
            <Card titulo="A cobrar" valor={String(resumo.aCobrar)} />
            <Card titulo="Total cliente" valor={moeda(resumo.faturado)} />
            <Card titulo="Motorista" valor={moeda(resumo.motorista)} />
            <Card titulo="Despesas" valor={moeda(resumo.despesas)} />
            <Card titulo="Margem" valor={moeda(margem)} destaque />
          </div>

          <div style={{ marginTop: 28, background: "white", borderRadius: 24, padding: 20, overflowX: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 24 }}>Lista operacional</h2>

              <button
                type="button"
                onClick={carregar}
                style={{
                  padding: "10px 14px",
                  border: 0,
                  background: "#2563eb",
                  color: "#fff",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Atualizar
              </button>
            </div>

            {servicos.length === 0 ? (
              <p style={{ color: "#64748b" }}>Nenhum serviço gerado ainda.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1100 }}>
                <thead>
                  <tr>
                    <th style={th}>Código</th>
                    <th style={th}>Cliente</th>
                    <th style={th}>Rota</th>
                    <th style={th}>Pedido</th>
                    <th style={th}>Aprovado por</th>
                    <th style={th}>Operacional</th>
                    <th style={th}>Financeiro</th>
                    <th style={th}>Data</th>
                    <th style={th}>Cliente</th>
                    <th style={th}>Motorista</th>
                    <th style={th}>Despesas</th>
                  </tr>
                </thead>

                <tbody>
                  {servicos.map((item) => (
                    <tr key={item.id}>
                      <td style={td}>{item.numero_servico || item.id}</td>
                      <td style={td}>{item.cliente_nome || "Não informado"}</td>
                      <td style={td}>
                        {item.origem || "Origem"} → {item.destino || "Destino"}
                      </td>
                      <td style={td}>{item.numero_pedido || "—"}</td>
                      <td style={td}>{item.aprovado_por || "—"}</td>
                      <td style={td}>{item.status_operacional || item.status || "—"}</td>
                      <td style={td}>{item.status_financeiro || "—"}</td>
                      <td style={td}>{item.data_servico || item.data_pedido || "—"}</td>
                      <td style={td}>{moeda(Number(item.valor_cliente || 0))}</td>
                      <td style={td}>{moeda(Number(item.valor_motorista || 0))}</td>
                      <td style={td}>{moeda(Number(item.despesas_reembolsaveis || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </AuroraProtected>
  );
}

function Card({ titulo, valor, destaque }: any) {
  return (
    <div style={{ background: destaque ? "#dbeafe" : "white", padding: 16, borderRadius: 16 }}>
      <p style={{ color: "#475569", fontWeight: 700 }}>{titulo}</p>
      <h2 style={{ marginTop: 8, fontSize: 22 }}>{valor}</h2>
    </div>
  );
}

const th = {
  padding: 10,
  borderBottom: "1px solid #cbd5e1",
  textAlign: "left" as const,
  color: "#334155",
  fontSize: 13,
};

const td = {
  padding: 10,
  borderBottom: "1px solid #e2e8f0",
  color: "#0f172a",
  fontSize: 14,
};
