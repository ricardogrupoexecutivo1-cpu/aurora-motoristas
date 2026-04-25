"use client";

import { useEffect, useMemo, useState } from "react";
import AuroraProtected from "../../components/AuroraProtected";
import AuroraLogoutButton from "../../components/AuroraLogoutButton";
import AuroraPrintButton from "../../components/AuroraPrintButton";

export default function AdminServicosPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");

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
    return {
      total: services.length,
      pendentes: services.filter((item) => item.driver_status !== "aceito").length,
      aceitos: services.filter((item) => item.driver_status === "aceito").length,
      confirmados: services.filter((item) => item.status === "cliente_confirmou").length,
      faturado: services.reduce((acc, item) => acc + Number(item.client_amount || 0), 0),
      lucro: services.reduce((acc, item) => acc + Number(item.operational_profit || 0), 0),
    };
  }, [services]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function copiar(texto: string, label: string) {
    await navigator.clipboard.writeText(texto);
    setCopied(label);
    setTimeout(() => setCopied(""), 1800);
  }

  // 🔥 CORREÇÃO REAL
  function linkMotorista(item: any) {
    if (!item.driver_token) return "TOKEN_NAO_GERADO";
    return `${window.location.origin}/motorista/${item.driver_token}`;
  }

  function linkCliente(item: any) {
    if (!item.client_token) return "TOKEN_NAO_GERADO";
    return `${window.location.origin}/cliente/${item.client_token}`;
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
                Central operacional para acompanhar serviços, motorista, cliente e financeiro.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <AuroraPrintButton />
              <AuroraLogoutButton />
            </div>
          </div>

          {copied && (
            <p style={{ marginTop: 16, background: "#dcfce7", padding: 12, borderRadius: 14, fontWeight: 700 }}>
              Link copiado: {copied}
            </p>
          )}

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 24 }}>
            <Card titulo="Serviços" valor={String(resumo.total)} />
            <Card titulo="Pendentes" valor={String(resumo.pendentes)} />
            <Card titulo="Aceitos" valor={String(resumo.aceitos)} />
            <Card titulo="Confirmados" valor={String(resumo.confirmados)} />
            <Card titulo="Faturado" valor={moeda(resumo.faturado)} />
            <Card titulo="Lucro" valor={moeda(resumo.lucro)} destaque />
          </div>

          <div style={{ marginTop: 28, background: "white", borderRadius: 24, padding: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 14 }}>Lista operacional</h2>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Código</th>
                  <th style={th}>Status</th>
                  <th style={th}>Motorista</th>
                  <th style={th}>Cliente</th>
                  <th style={th}>Rota</th>
                  <th style={th}>Valor</th>
                  <th style={th}>Lucro</th>
                  <th style={th}>Links</th>
                </tr>
              </thead>

              <tbody>
                {services.map((item) => {
                  const clienteLink = linkCliente(item);
                  const motoristaLink = linkMotorista(item);

                  return (
                    <tr key={item.id}>
                      <td style={td}>{item.service_code}</td>
                      <td style={td}>{item.status}</td>
                      <td style={td}>{item.driver_name}</td>
                      <td style={td}>{item.client_name}</td>
                      <td style={td}>{item.origin} → {item.destination}</td>
                      <td style={td}>{moeda(Number(item.client_amount || 0))}</td>
                      <td style={td}>{moeda(Number(item.operational_profit || 0))}</td>

                      <td style={td}>
                        <button
                          style={btn}
                          onClick={() => copiar(motoristaLink, "motorista")}
                        >
                          Copiar motorista
                        </button>

                        <button
                          style={btn}
                          onClick={() => copiar(clienteLink, "cliente")}
                        >
                          Copiar cliente
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </AuroraProtected>
  );
}

function Card({ titulo, valor, destaque }: any) {
  return (
    <div style={{ background: destaque ? "#dbeafe" : "white", padding: 16, borderRadius: 16 }}>
      <p>{titulo}</p>
      <h2>{valor}</h2>
    </div>
  );
}

const th = { padding: 10, borderBottom: "1px solid #ccc" };
const td = { padding: 10 };

const btn = {
  marginRight: 6,
  padding: "6px 10px",
  border: 0,
  background: "#2563eb",
  color: "#fff",
  borderRadius: 8,
  cursor: "pointer",
};