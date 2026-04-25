"use client";

import { useEffect, useMemo, useState } from "react";
import AuroraProtected from "../../components/AuroraProtected";
import AuroraLogoutButton from "../../components/AuroraLogoutButton";
import AuroraPrintButton from "../../components/AuroraPrintButton";
import { getAuroraSession } from "../../lib/aurora-session";

export default function MotoristaPainelPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const session = getAuroraSession();
    const driverId = session?.driver_id;

    const response = await fetch("/api/services");
    const result = await response.json();

    if (result.ok) {
      const lista = result.services || [];
      setServices(lista.filter((item: any) => item.driver_id === driverId));
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  const resumo = useMemo(() => {
    return {
      total: services.length,
      pendentes: services.filter((item) => item.driver_status !== "aceito").length,
      aceitos: services.filter((item) => item.driver_status === "aceito").length,
      valorMotorista: services.reduce((acc, item) => acc + Number(item.driver_amount || 0), 0),
    };
  }, [services]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return (
      <AuroraProtected allowedRoles={["motorista"]}>
        <main style={{ padding: 30 }}>Carregando painel do motorista...</main>
      </AuroraProtected>
    );
  }

  return (
    <AuroraProtected allowedRoles={["motorista"]}>
      <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
        <section style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <p style={{ color: "#2563eb", fontWeight: 800 }}>Aurora Motoristas</p>
              <h1 style={{ fontSize: 36, marginTop: 8 }}>Painel do Motorista</h1>
              <p style={{ color: "#475569", marginTop: 8 }}>
                Aqui o motorista visualiza somente os serviços vinculados ao seu driver_id.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
              <AuroraPrintButton />
              <AuroraLogoutButton />
            </div>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 24 }}>
            <Card titulo="Meus serviços" valor={String(resumo.total)} />
            <Card titulo="Pendentes" valor={String(resumo.pendentes)} />
            <Card titulo="Aceitos" valor={String(resumo.aceitos)} />
            <Card titulo="Valor motorista" valor={moeda(resumo.valorMotorista)} destaque />
          </div>

          <div style={{ marginTop: 28, background: "white", borderRadius: 24, padding: 20, overflowX: "auto" }}>
            <h2 style={{ fontSize: 24, marginBottom: 14 }}>Meus serviços</h2>

            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 950 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#475569" }}>
                  <th style={th}>Código</th>
                  <th style={th}>Status</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Rota</th>
                  <th style={th}>Data</th>
                  <th style={th}>Valor motorista</th>
                </tr>
              </thead>

              <tbody>
                {services.map((item) => (
                  <tr key={item.id} style={{ borderTop: "1px solid #e2e8f0" }}>
                    <td style={td}>
                      <strong>{item.service_code}</strong>
                    </td>

                    <td style={td}>
                      <Badge texto={item.driver_status || "pendente"} />
                    </td>

                    <td style={td}>{item.client_name || "-"}</td>

                    <td style={td}>
                      <strong>{item.origin || "-"}</strong>
                      <br />
                      <span style={{ color: "#64748b" }}>→ {item.destination || "-"}</span>
                    </td>

                    <td style={td}>
                      {item.service_date || "-"} {item.service_time || ""}
                    </td>

                    <td style={td}>
                      <strong>{moeda(Number(item.driver_amount || 0))}</strong>
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td style={td} colSpan={6}>
                      Nenhum serviço vinculado ao seu motorista ainda.
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
        background: destaque ? "#dbeafe" : "white",
        border: "1px solid #dbeafe",
        borderRadius: 22,
        padding: 18,
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <p style={{ color: "#64748b", fontSize: 14 }}>{titulo}</p>
      <h2 style={{ fontSize: 22, marginTop: 8 }}>{valor}</h2>
    </div>
  );
}

function Badge({ texto }: { texto: string }) {
  const ok = texto === "aceito";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        background: ok ? "#dcfce7" : "#fef9c3",
        color: ok ? "#166534" : "#854d0e",
      }}
    >
      {texto}
    </span>
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
  verticalAlign: "top" as const,
};