"use client";

import { useState } from "react";

type ClienteForm = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function ClientesPage() {
  const [form, setForm] = useState<ClienteForm>({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  function update(field: keyof ClienteForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function cadastrar() {
    setErro("");
    setMsg("");

    if (!form.nome || !form.email) {
      setErro("Preencha nome e e-mail.");
      return;
    }

    if (form.senha.length < 6) {
      setErro("Senha mínima de 6 caracteres.");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
        }),
      });

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          role: "cliente",
          captchaOk: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setMsg("Cadastro realizado com sucesso. Você já pode entrar.");
      setForm({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
      });
    } catch (e: any) {
      setErro(e.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#020617,#020617 40%,#020617)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 0 60px rgba(0,0,0,0.6)",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: 26,
            marginBottom: 10,
            fontWeight: 900,
          }}
        >
          Cadastro Aurora
        </h1>

        <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>
          Crie seu acesso e entre na plataforma
        </p>

        <input
          placeholder="Nome"
          value={form.nome}
          onChange={(e) => update("nome", e.target.value)}
          style={input}
        />

        <input
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={form.senha}
          onChange={(e) => update("senha", e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={form.confirmarSenha}
          onChange={(e) => update("confirmarSenha", e.target.value)}
          style={input}
        />

        <button
          onClick={cadastrar}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 14,
            borderRadius: 12,
            background: "linear-gradient(90deg,#0ea5e9,#2563eb)",
            color: "#fff",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        {erro && (
          <div style={{ color: "#ef4444", marginTop: 12 }}>{erro}</div>
        )}

        {msg && (
          <div style={{ color: "#22c55e", marginTop: 12 }}>{msg}</div>
        )}
      </div>
    </main>
  );
}

const input: React.CSSProperties = {
  width: "100%",
  marginBottom: 10,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "#fff",
};