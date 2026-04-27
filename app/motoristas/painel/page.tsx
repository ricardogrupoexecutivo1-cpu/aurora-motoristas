"use client";

import { useEffect, useState } from "react";

type Convite = {
  id: string;
  motorista_id: string;
  status: string;
  created_at: string;
  service_id: string | null;
};

export default function PainelMotoristaPage() {
  const [cpf, setCpf] = useState("");
  const [motoristaId, setMotoristaId] = useState<string | null>(null);
  const [statusMotorista, setStatusMotorista] = useState("");
  const [ativo, setAtivo] = useState(false);
  const [convites, setConvites] = useState<Convite[]>([]);
  const [msg, setMsg] = useState("");

  async function buscarMotorista() {
    setMsg("");

    try {
      const res = await fetch(`/api/motoristas?scope=admin`);
      const data = await res.json();

      const encontrado = (data.motoristas || []).find(
        (m: any) => m.cpf === cpf
      );

      if (!encontrado) {
        setMsg("Motorista não encontrado.");
        return;
      }

      setMotoristaId(encontrado.id);
      setStatusMotorista(encontrado.status);
      setAtivo(encontrado.ativo);

      if (!encontrado.ativo) {
        setMsg("Seu cadastro ainda não foi aprovado.");
        return;
      }

      carregarConvites(encontrado.id);
    } catch (error: any) {
      setMsg("Erro ao buscar motorista.");
    }
  }

  async function carregarConvites(id: string) {
    try {
      const res = await fetch(`/api/convites?motorista_id=${id}`);
      const data = await res.json();

      setConvites(data.convites || []);
    } catch {
      setConvites([]);
    }
  }

  async function responder(id: string, acao: "aceitar" | "recusar") {
    await fetch("/api/convites/responder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, acao }),
    });

    if (motoristaId) carregarConvites(motoristaId);
  }

  return (
    <main style={{ padding: 24, background: "#020617", minHeight: "100vh", color: "white" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>Painel do Motorista</h1>

      {!motoristaId && (
        <div style={{ marginTop: 20 }}>
          <input
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 10,
              width: 300,
              marginRight: 10,
            }}
          />

          <button onClick={buscarMotorista} style={btn("#38bdf8")}>
            Entrar
          </button>
        </div>
      )}

      {msg && <p style={{ marginTop: 10, color: "#fca5a5" }}>{msg}</p>}

      {motoristaId && ativo && (
        <div style={{ marginTop: 30 }}>
          <h2>Convites disponíveis</h2>

          {convites.length === 0 && (
            <p style={{ color: "#94a3b8" }}>
              Nenhum convite no momento.
            </p>
          )}

          {convites.map((c) => (
            <div
              key={c.id}
              style={{
                marginTop: 12,
                padding: 14,
                borderRadius: 14,
                background: "#0f172a",
                border: "1px solid #1e293b",
              }}
            >
              <p>Serviço: {c.service_id || "Não informado"}</p>
              <p>Status: {c.status}</p>

              {c.status === "enviado" && (
                <div style={{ marginTop: 10 }}>
                  <button onClick={() => responder(c.id, "aceitar")} style={btn("#22c55e")}>
                    Aceitar
                  </button>

                  <button onClick={() => responder(c.id, "recusar")} style={btn("#ef4444")}>
                    Recusar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function btn(cor: string): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    background: cor,
    color: "#020617",
    fontWeight: 800,
    cursor: "pointer",
    marginRight: 8,
  };
}