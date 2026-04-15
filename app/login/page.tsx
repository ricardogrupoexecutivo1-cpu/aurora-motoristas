"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState("");

  async function entrar() {
    setStatus("Entrando...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setStatus("Erro: " + error.message);
      return;
    }

    setStatus("Login realizado com sucesso!");
    window.location.href = "/servicos";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 24,
          padding: 24,
          border: "1px solid #e7eef6",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            width: "fit-content",
            background: "#e0f2fe",
            color: "#075985",
            borderRadius: 999,
            padding: "6px 12px",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Aurora Motoristas
        </span>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.1,
            color: "#0f172a",
          }}
        >
          Entrar no sistema
        </h1>

        <p
          style={{
            margin: 0,
            color: "#4b6478",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          Entre com e-mail e senha para acessar o sistema. Não é necessário usar
          código por e-mail neste fluxo.
        </p>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: "#5b7488",
              fontWeight: 700,
            }}
          >
            E-mail
          </span>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex.: grupoexecutivoservice1@gmail.com"
            style={{
              borderRadius: 14,
              border: "1px solid #d8e3ee",
              padding: "14px 16px",
              fontSize: 15,
              outline: "none",
              background: "#f8fbff",
              color: "#123047",
            }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              color: "#5b7488",
              fontWeight: 700,
            }}
          >
            Senha
          </span>

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            style={{
              borderRadius: 14,
              border: "1px solid #d8e3ee",
              padding: "14px 16px",
              fontSize: 15,
              outline: "none",
              background: "#f8fbff",
              color: "#123047",
            }}
          />
        </label>

        <button
          type="button"
          onClick={entrar}
          style={{
            border: "none",
            background: "#0ea5e9",
            color: "#ffffff",
            borderRadius: 14,
            padding: "14px 18px",
            fontWeight: 800,
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
          }}
        >
          Entrar
        </button>

        <div
          style={{
            borderRadius: 14,
            background: "#f8fbff",
            border: "1px solid #e5edf5",
            padding: "12px 14px",
            color: "#435b6e",
            fontSize: 13,
            lineHeight: 1.6,
            minHeight: 22,
          }}
        >
          {status || "Aguardando login..."}
        </div>
      </div>
    </main>
  );
}