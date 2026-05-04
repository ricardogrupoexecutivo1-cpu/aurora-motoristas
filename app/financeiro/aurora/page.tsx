"use client";

import { useEffect, useMemo, useState } from "react";
import AuroraProtected from "../../components/AuroraProtected";
import AuroraPrintButton from "../../components/AuroraPrintButton";
import AuroraLogoutButton from "../../components/AuroraLogoutButton";

export default function FinanceiroAuroraPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);

    const response = await fetch("/api/financeiro/aurora");
    const result = await response.json();

    if (result.ok) {
      setItems(result.items || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function marcarRecebido(id: string) {
    const confirmar = window.confirm("Confirmar recebimento pela Aurora?");
    if (!confirmar) return;

    setActionLoading(id);

    const response = await fetch("/api/financeiro/receber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        payment_method: "PIX",
        payment_reference: "Confirmação manual Aurora",
        notes: "Recebimento confirmado pelo painel financeiro.",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Erro ao marcar como recebido.");
      setActionLoading(null);
      return;
    }

    await carregar();
    setActionLoading(null);
  }

  async function marcarRepassado(id: string, paymentStatus: string) {
    if (paymentStatus !== "received") {
      alert("Segurança: só é possível repassar depois que a Aurora recebeu.");
      return;
    }

    const confirmar = window.confirm("Confirmar repasse ao motorista?");
    if (!confirmar) return;

    setActionLoading(id);

    const response = await fetch("/api/financeiro/repassar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        payment_reference: "Repasse manual Aurora",
        notes: "Repasse confirmado pelo painel financeiro.",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Erro ao marcar como repassado.");
      setActionLoading(null);
      return;
    }

    await carregar();
    setActionLoading(null);
  }

  const resumo = useMemo(() => {
    const pendentes = items.filter((item) => item.payment_status !== "received");
    const recebidos = items.filter((item) => item.payment_status === "received");
    const repassados = items.filter((item) => item.repass_status === "repassed");

    return {
      total: items.length,
      totalPlataforma: items.reduce((acc, item) => acc + Number(item.platform_amount || 0), 0),
      pendente: pendentes.reduce((acc, item) => acc + Number(item.platform_amount || 0), 0),
      recebido: recebidos.reduce((acc, item) => acc + Number(item.platform_amount || 0), 0),
      aRepassar: recebidos.filter((item) => item.repass_status !== "repassed").reduce((acc, item) => acc + Number(item.driver_amount || 0), 0),
      repassado: repassados.reduce((acc, item) => acc + Number(item.driver_amount || 0), 0),
    };
  }, [items]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <AuroraProtected allowedRoles={["admin"]}>
        <main style={{ padding: 30 }}>Carregando financeiro Aurora...</main>
      </AuroraProtected>
    );
  }

  return (
    <AuroraProtected allowedRoles={["admin"]}>
      <main style={{ minHeight: "100vh", background: "#020617", padding: 24, color: "white" }}>
        <section style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#22c55e", fontWeight: 900 }}>Aurora Motoristas</p>
              <h1 style={{ fontSize: 38, marginTop: 8 }}>Financeiro da Plataforma</h1>
              <p style={{ color: "#94a3b8", marginTop: 8 }}>
                Controle seguro de recebimento PIX Aurora e repasse ao motorista.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <AuroraPrintButton />
              <AuroraLogoutButton />
            </div>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", marginTop: 24 }}>
            <Card titulo="Registros" valor={String(resumo.total)} />
            <Card titulo="Total plataforma" valor={moeda(resumo.totalPlataforma)} destaque />
            <Card titulo="Pendente Aurora" valor={moeda(resumo.pendente)} />
            <Card titulo="Recebido Aurora" valor={moeda(resumo.recebido)} />
            <Card titulo="A repassar motorista" valor={moeda(resumo.aRepassar)} />
            <Card titulo="Repassado motorista" valor={moeda(resumo.repassado)} />
          </div>

          <div style={{ marginTop: 28, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 20, overflowX: "auto" }}>
            <h2 style={{ fontSize: 24, marginBottom: 14 }}>Comissões geradas</h2>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1250 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#94a3b8" }}>
                  <th style={th}>Serviço</th>
                  <th style={th}>Tipo</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Motorista</th>
                  <th style={th}>Valor cliente</th>
                  <th style={th}>Motorista</th>
                  <th style={th}>Despesas</th>
                  <th style={th}>Comissão Aurora</th>
                  <th style={th}>Recebimento</th>
                  <th style={th}>Repasse</th>
                  <th style={th}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const recebido = item.payment_status === "received";
                  const repassado = item.repass_status === "repassed";
                  const bloqueado = actionLoading === item.id;

                  return (
                    <tr key={item.id} style={{ borderTop: "1px solid #1e293b" }}>
                      <td style={td}>
                        <strong>{item.service_code || "-"}</strong>
                        <br />
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                          {item.created_at ? new Date(item.created_at).toLocaleString("pt-BR") : "-"}
                        </span>
                      </td>
                      <td style={td}>{item.service_type || "-"}</td>
                      <td style={td}>{item.client_name || "-"}</td>
                      <td style={td}>{item.driver_name || "-"}</td>
                      <td style={td}>{moeda(Number(item.client_amount || 0))}</td>
                      <td style={td}>{moeda(Number(item.driver_amount || 0))}</td>
                      <td style={td}>{moeda(Number(item.expenses || 0))}</td>
                      <td style={td}>
                        <strong style={{ color: "#22c55e" }}>{moeda(Number(item.platform_amount || 0))}</strong>
                      </td>
                      <td style={td}>
                        <Badge texto={recebido ? "received" : "pending"} />
                        <br />
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                          {item.platform_received_at ? new Date(item.platform_received_at).toLocaleString("pt-BR") : "Aguardando"}
                        </span>
                      </td>
                      <td style={td}>
                        <Badge texto={repassado ? "repassed" : "pending"} />
                        <br />
                        <span style={{ color: "#94a3b8", fontSize: 12 }}>
                          {item.driver_repassed_at ? new Date(item.driver_repassed_at).toLocaleString("pt-BR") : "Aguardando"}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <button
                            onClick={() => marcarRecebido(item.id)}
                            disabled={recebido || bloqueado}
                            style={botao(recebido || bloqueado, "#22c55e")}
                          >
                            {recebido ? "Recebido" : "Marcar recebido"}
                          </button>

                          <button
                            onClick={() => marcarRepassado(item.id, item.payment_status)}
                            disabled={!recebido || repassado || bloqueado}
                            style={botao(!recebido || repassado || bloqueado, "#38bdf8")}
                          >
                            {repassado ? "Repassado" : "Marcar repassado"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {items.length === 0 && (
                  <tr>
                    <td style={td} colSpan={11}>
                      Nenhuma comissão registrada ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AuroraProtected>
  );
}

function Card({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div
      style={{
        background: destaque ? "#052e16" : "#0f172a",
        border: destaque ? "1px solid #22c55e" : "1px solid #1e293b",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 14 }}>{titulo}</p>
      <h2 style={{ fontSize: 22, marginTop: 8, color: destaque ? "#86efac" : "white" }}>{valor}</h2>
    </div>
  );
}

function Badge({ texto }: { texto: string }) {
  const recebido = texto === "received";
  const repassado = texto === "repassed";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 900,
        background: recebido ? "#dcfce7" : repassado ? "#dbeafe" : "#fef9c3",
        color: recebido ? "#166534" : repassado ? "#1e40af" : "#854d0e",
      }}
    >
      {recebido ? "Recebido" : repassado ? "Repassado" : "Pendente"}
    </span>
  );
}

function botao(disabled: boolean, color: string) {
  return {
    border: "none",
    borderRadius: 12,
    padding: "9px 12px",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "#334155" : color,
    color: disabled ? "#94a3b8" : "#020617",
    fontWeight: 900,
    fontSize: 12,
    whiteSpace: "nowrap" as const,
  };
}

const th = {
  padding: "12px",
  fontSize: 13,
  borderBottom: "1px solid #1e293b",
};

const td = {
  padding: "12px",
  fontSize: 14,
  verticalAlign: "top" as const,
};


