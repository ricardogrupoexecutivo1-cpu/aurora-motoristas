"use client";

import { useState } from "react";

export default function NovoServicoPage() {
  const [form, setForm] = useState({
    title: "Transfer Executivo",
    service_type: "transfer",
    status: "agendado",
    client_name: "",
    client_phone: "",
    company_name: "",
    driver_name: "",
    driver_phone: "",
    origin: "",
    destination: "",
    service_date: "",
    service_time: "",
    passenger_name: "",
    passenger_phone: "",
    client_amount: "",
    driver_amount: "",
    expenses: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<any>(null);
  const [message, setMessage] = useState("");

  function update(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSaved(null);

    const response = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (result.ok) {
      setSaved(result.service);
      setMessage("Serviço salvo com sucesso.");
    } else {
      setMessage(result.error || result.message || "Erro ao salvar serviço.");
    }

    setLoading(false);
  }

  async function copiar(texto: string) {
    await navigator.clipboard.writeText(`${window.location.origin}${texto}`);
    setMessage("Link copiado.");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 980, margin: "0 auto" }}>
        <p style={{ color: "#2563eb", fontWeight: 800 }}>Aurora Motoristas</p>
        <h1 style={{ fontSize: 36, marginTop: 8 }}>Novo serviço</h1>
        <p style={{ color: "#475569", marginTop: 8 }}>
          Cadastro real integrado ao Supabase, com comissão de 5%, lucro automático e links para motorista/cliente.
        </p>

        <form onSubmit={salvar} style={{ marginTop: 24, background: "white", borderRadius: 24, padding: 22 }}>
          <div style={grid}>
            <Campo label="Título" name="title" value={form.title} onChange={update} />
            <Campo label="Tipo" name="service_type" value={form.service_type} onChange={update} />
            <Campo label="Cliente" name="client_name" value={form.client_name} onChange={update} />
            <Campo label="Telefone cliente" name="client_phone" value={form.client_phone} onChange={update} />
            <Campo label="Empresa / contratante" name="company_name" value={form.company_name} onChange={update} />
            <Campo label="Motorista" name="driver_name" value={form.driver_name} onChange={update} />
            <Campo label="Telefone motorista" name="driver_phone" value={form.driver_phone} onChange={update} />
            <Campo label="Origem" name="origin" value={form.origin} onChange={update} />
            <Campo label="Destino" name="destination" value={form.destination} onChange={update} />
            <Campo label="Data" name="service_date" value={form.service_date} onChange={update} type="date" />
            <Campo label="Horário" name="service_time" value={form.service_time} onChange={update} type="time" />
            <Campo label="Passageiro" name="passenger_name" value={form.passenger_name} onChange={update} />
            <Campo label="Telefone passageiro" name="passenger_phone" value={form.passenger_phone} onChange={update} />
            <Campo label="Cliente paga" name="client_amount" value={form.client_amount} onChange={update} />
            <Campo label="Motorista recebe" name="driver_amount" value={form.driver_amount} onChange={update} />
            <Campo label="Despesas" name="expenses" value={form.expenses} onChange={update} />
          </div>

          <label style={{ display: "block", marginTop: 16 }}>
            <span style={label}>Observações</span>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              style={input}
              placeholder="Detalhes do serviço, combinado, instruções..."
            />
          </label>

          <button
            disabled={loading}
            style={{
              marginTop: 22,
              background: loading ? "#94a3b8" : "#2563eb",
              color: "white",
              border: 0,
              borderRadius: 16,
              padding: "14px 22px",
              fontWeight: 900,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Salvando..." : "Salvar serviço"}
          </button>

          {message && (
            <p style={{ marginTop: 16, background: "#dbeafe", padding: 14, borderRadius: 14, fontWeight: 800 }}>
              {message}
            </p>
          )}
        </form>

        {saved && (
          <div style={{ marginTop: 24, background: "white", borderRadius: 24, padding: 22 }}>
            <h2 style={{ fontSize: 26 }}>Serviço criado</h2>

            <div style={grid}>
              <Resumo titulo="Código" valor={saved.service_code} />
              <Resumo titulo="Comissão 5%" valor={moeda(saved.commission)} />
              <Resumo titulo="Lucro operacional" valor={moeda(saved.operational_profit)} />
              <Resumo titulo="Despesas" valor={moeda(saved.expenses)} />
              <Resumo titulo="Status" valor={saved.status} />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
              <button style={btn} onClick={() => copiar(saved.driver_link)}>
                Copiar link motorista
              </button>

              <button style={btn} onClick={() => copiar(saved.client_link)}>
                Copiar link cliente
              </button>

              <a href="/admin/servicos" style={linkBtn}>
                Ver painel admin
              </a>

              <a href="/financeiro/aurora" style={linkBtn}>
                Ver financeiro Aurora
              </a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function Campo({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) {
  return (
    <label>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        style={input}
      />
    </label>
  );
}

function Resumo({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 16 }}>
      <p style={{ color: "#64748b", fontSize: 14 }}>{titulo}</p>
      <strong>{valor || "-"}</strong>
    </div>
  );
}

function moeda(valor: any) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

const grid = {
  display: "grid",
  gap: 14,
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
};

const labelStyle = {
  display: "block",
  fontSize: 13,
  color: "#475569",
  fontWeight: 700,
  marginBottom: 6,
};

const label = labelStyle;

const input = {
  width: "100%",
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: "12px 14px",
  fontSize: 15,
  outline: "none",
};

const btn = {
  border: 0,
  background: "#2563eb",
  color: "white",
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 900,
  cursor: "pointer",
};

const linkBtn = {
  display: "inline-block",
  background: "#0f172a",
  color: "white",
  borderRadius: 14,
  padding: "12px 14px",
  fontWeight: 900,
  textDecoration: "none",
};