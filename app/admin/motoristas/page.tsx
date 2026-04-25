"use client";

import { useEffect, useState } from "react";

export default function AdminMotoristasPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");

  async function carregar() {
    const res = await fetch("/api/drivers");
    const data = await res.json();
    if (data.ok) setDrivers(data.drivers);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function atualizar(id: string, status: string) {
    const res = await fetch("/api/drivers/approve", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        admin: "admin_master",
        notes: notes[id] || "Análise manual realizada pelo admin.",
      }),
    });

    const data = await res.json();
    setMsg(data.ok ? "Decisão registrada com sucesso." : data.message);
    carregar();
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef4ff", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1>Admin • Segurança Motoristas</h1>
        <p>Consulta assistida + decisão humana registrada.</p>

        {msg && <p style={msgStyle}>{msg}</p>}

        {drivers.map((d) => (
          <div key={d.id} style={card}>
            <h2>{d.full_name || d.company_name || d.trade_name || "Cadastro sem nome"}</h2>

            <p><strong>Tipo:</strong> {d.provider_type}</p>
            <p><strong>CPF:</strong> {d.cpf || "-"}</p>
            <p><strong>CNPJ:</strong> {d.cnpj_clean || "-"}</p>
            <p><strong>Telefone:</strong> {d.phone || "-"}</p>
            <p><strong>Cidade/UF:</strong> {d.city || "-"} / {d.state || "-"}</p>
            <p><strong>Status cadastro:</strong> {d.status}</p>
            <p><strong>Status segurança:</strong> {d.security_status}</p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button style={btnDark} onClick={() => window.open("https://portalbnmp.cnj.jus.br/#/pesquisa-peca", "_blank")}>
                Verificar CNJ
              </button>

              <button style={btnDark} onClick={() => window.open("https://www.gov.br/mj/pt-br/assuntos/sua-seguranca/procurados", "_blank")}>
                Ver procurados
              </button>

              <button style={btnDark} onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent((d.full_name || d.company_name || "") + " mandado prisão processo")}`, "_blank")}>
                Pesquisa aberta
              </button>
            </div>

            <textarea
              placeholder="Observação da análise humana: fonte consultada, data, resultado e decisão..."
              value={notes[d.id] || d.security_notes || ""}
              onChange={(e) => setNotes((prev) => ({ ...prev, [d.id]: e.target.value }))}
              style={textarea}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button style={ok} onClick={() => atualizar(d.id, "aprovado")}>Aprovar</button>
              <button style={warn} onClick={() => atualizar(d.id, "reprovado")}>Reprovar</button>
              <button style={danger} onClick={() => atualizar(d.id, "bloqueado")}>Bloquear</button>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

const card = {
  background: "white",
  borderRadius: 22,
  padding: 20,
  marginTop: 16,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
};

const msgStyle = {
  background: "#dbeafe",
  padding: 14,
  borderRadius: 14,
  fontWeight: 800,
};

const textarea = {
  width: "100%",
  minHeight: 90,
  marginTop: 14,
  border: "1px solid #cbd5e1",
  borderRadius: 14,
  padding: 12,
};

const btnDark = {
  border: 0,
  background: "#0f172a",
  color: "white",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const ok = { ...btnDark, background: "#16a34a" };
const warn = { ...btnDark, background: "#f59e0b" };
const danger = { ...btnDark, background: "#dc2626" };