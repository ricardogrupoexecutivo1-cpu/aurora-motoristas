"use client";

import { useEffect, useMemo, useState } from "react";

export default function ReciboMotoristaSupabasePage() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [msg, setMsg] = useState("Carregando...");

  async function carregar() {
    setMsg("Carregando recibo...");

    try {
      const res = await fetch("/api/admin-servicos", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMsg(data.message || "Erro ao carregar recibo.");
        setServicos([]);
        return;
      }

      const pagos = (data.servicos || []).filter(
        (s: any) => s.status_financeiro === "pago"
      );

      setServicos(pagos);
      setMsg("Supabase OK");
    } catch (error) {
      console.error(error);
      setMsg("Erro inesperado ao carregar recibo.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    const totalMotorista = servicos.reduce(
      (t, s) => t + Number(s.valor_motorista || 0),
      0
    );

    return {
      quantidade: servicos.length,
      totalMotorista,
      numeroRecibo: `REC-${new Date().getFullYear()}-${String(servicos.length).padStart(4, "0")}`,
      dataEmissao: new Date().toISOString().slice(0, 10),
    };
  }, [servicos]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function imprimir() {
    window.print();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 24 }}>
      <section style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#22d3ee", fontWeight: 800 }}>Aurora Motoristas</p>
            <h1 style={{ fontSize: 34, marginTop: 8 }}>Recibo do Motorista</h1>
            <p style={{ color: "#cbd5e1", marginTop: 8 }}>
              Comprovante de pagamento pelos serviços realizados.
            </p>
          </div>

          <button
            onClick={imprimir}
            style={{
              height: 44,
              background: "#22c55e",
              color: "#020617",
              border: 0,
              borderRadius: 14,
              padding: "0 18px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Imprimir
          </button>
        </div>

        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 22 }}>
          <h2 style={{ fontSize: 24 }}>Recibo</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginTop: 18 }}>
            <Card titulo="Número do recibo" valor={resumo.numeroRecibo} />
            <Card titulo="Data emissão" valor={resumo.dataEmissao} />
            <Card titulo="Serviços pagos" valor={String(resumo.quantidade)} />
            <Card titulo="Total recebido" valor={moeda(resumo.totalMotorista)} />
            <Card titulo="Status" valor={msg} />
          </div>
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

        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 20, overflowX: "auto" }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Serviços pagos</h2>

          {servicos.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Nenhum serviço pago para recibo.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={th}>Serviço</th>
                  <th style={th}>Pedido</th>
                  <th style={th}>Rota</th>
                  <th style={th}>Data</th>
                  <th style={th}>Valor motorista</th>
                </tr>
              </thead>

              <tbody>
                {servicos.map((s) => (
                  <tr key={s.id}>
                    <td style={td}>{s.numero_servico || s.id}</td>
                    <td style={td}>{s.numero_pedido || "—"}</td>
                    <td style={td}>{s.origem || "—"} → {s.destino || "—"}</td>
                    <td style={td}>{s.data_servico || s.data_pedido || "—"}</td>
                    <td style={td}>{moeda(Number(s.valor_motorista || 0))}</td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  <td style={tdTotal} colSpan={4}>Total recebido</td>
                  <td style={tdTotal}>{moeda(resumo.totalMotorista)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}

function Card({ titulo, valor }: any) {
  return (
    <div style={{ background: "#020617", border: "1px solid #1e293b", padding: 18, borderRadius: 18 }}>
      <p style={{ color: "#94a3b8", fontSize: 14 }}>{titulo}</p>
      <h2 style={{ fontSize: 22, marginTop: 8 }}>{valor}</h2>
    </div>
  );
}

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

const tdTotal = {
  padding: 12,
  borderTop: "1px solid #67e8f9",
  color: "#67e8f9",
  fontSize: 16,
  fontWeight: 900,
};
