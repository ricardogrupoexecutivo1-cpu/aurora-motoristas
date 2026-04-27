"use client";

import { useState } from "react";

export default function PlataformaEntrarPage() {
  const [email, setEmail] = useState("ricardogrupoexecutivo1@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function entrar() {
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      alert(result.error || "Login inválido");
      setLoading(false);
      return;
    }

    const sessao = {
      perfil: "admin",
      empresa: result.empresa || "Base Interna Aurora",
      atualizadoEm: new Date().toISOString(),
    };

    localStorage.setItem("aurora_motoristas_plataforma_sessao_local", JSON.stringify(sessao));
    localStorage.setItem("aurora_role", "admin");
    localStorage.setItem("aurora_user_role", "admin");
    localStorage.setItem("aurora_logged_in", "true");
    localStorage.setItem("aurora_auth", "true");

    window.location.href = "/plataforma";
  }

  return (
    <main style={{ minHeight: "100vh", background: "#020617", color: "white", padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <section style={{ width: "100%", maxWidth: 460, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 24, padding: 28 }}>
        <p style={{ color: "#22c55e", fontWeight: 900 }}>Aurora Motoristas</p>
        <h1 style={{ fontSize: 34, marginTop: 8 }}>Entrada Admin</h1>
        <p style={{ color: "#94a3b8", marginTop: 8 }}>
          Acesso seguro para gestão da plataforma.
        </p>

        <div style={{ marginTop: 24 }}>
          <label style={{ fontSize: 13, color: "#cbd5e1" }}>E-mail</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 13, borderRadius: 14, border: "1px solid #334155", background: "#020617", color: "white" }}
          />
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, color: "#cbd5e1" }}>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") entrar();
            }}
            style={{ width: "100%", marginTop: 6, padding: 13, borderRadius: 14, border: "1px solid #334155", background: "#020617", color: "white" }}
          />
        </div>

        <button
          onClick={entrar}
          disabled={loading}
          style={{ width: "100%", marginTop: 22, padding: 14, borderRadius: 14, border: "none", background: "#22c55e", color: "#020617", fontWeight: 900, cursor: "pointer" }}
        >
          {loading ? "Entrando..." : "Entrar como Admin"}
        </button>

        <a href="/" style={{ display: "block", marginTop: 18, color: "#94a3b8", textAlign: "center" }}>
          Voltar para a home
        </a>
      </section>
    </main>
  );
}
