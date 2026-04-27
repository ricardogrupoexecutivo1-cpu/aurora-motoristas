"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuroraPrintButton from "../../components/AuroraPrintButton";

export default function MotoristaTokenPage() {
  const params = useParams();
  const token = String(params.token || "");

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const response = await fetch("/api/services");
    const result = await response.json();

    if (result.ok) {
      const encontrado = (result.services || []).find(
        (item: any) => String(item.driver_token) === token
      );

      setService(encontrado || null);
    }

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [token]);

  function moeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  if (loading) {
    return <main style={{ padding: 30 }}>Carregando serviço do motorista...</main>;
  }

  if (!service) {
    return <main style={{ padding: 30 }}>Serviço não encontrado ou link inválido.</main>;
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 820, margin: "0 auto", background: "white", padding: 24, borderRadius: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ color: "#2563eb", fontWeight: 900 }}>Aurora Motoristas</p>
            <h1 style={{ fontSize: 34, marginTop: 8 }}>Serviço do motorista</h1>
          </div>

          <AuroraPrintButton />
        </div>

        <div style={{ marginTop: 24, display: "grid", gap: 14 }}>
          <Info titulo="Código" valor={service.service_code || "-"} />
          <Info titulo="Motorista" valor={service.driver_name || "-"} />
          <Info titulo="Cliente" valor={service.client_name || "-"} />
          <Info titulo="Origem" valor={service.origin || "-"} />
          <Info titulo="Destino" valor={service.destination || "-"} />
          <Info titulo="Data e hora" valor={`${service.service_date || "-"} ${service.service_time || ""}`} />
          <Info titulo="Valor motorista" valor={moeda(Number(service.driver_amount || 0))} destaque />
          <Info titulo="Status motorista" valor={service.driver_status || "pendente"} />
        </div>
      </section>
    </main>
  );
}

function Info({ titulo, valor, destaque }: { titulo: string; valor: string; destaque?: boolean }) {
  return (
    <div
      style={{
        background: destaque ? "#dbeafe" : "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 14,
      }}
    >
      <p style={{ color: "#64748b", fontSize: 13, fontWeight: 800 }}>{titulo}</p>
      <p style={{ marginTop: 6, fontSize: 18, fontWeight: 900 }}>{valor}</p>
    </div>
  );
}