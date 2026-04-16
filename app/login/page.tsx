"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SessionFallback = {
  role: string;
  empresa: string;
  status: string;
};

const SESSION_FALLBACK_BY_EMAIL: Record<string, SessionFallback> = {
  "ricardogrupoexecutivo1@gmail.com": {
    role: "admin_master",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "grupoexecutivoservice1@gmail.com": {
    role: "operacional",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "grupoexecutivo1@gmail.com": {
    role: "operacional",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "finance@ges.com": {
    role: "financeiro",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function getFallbackSession(email: string): SessionFallback {
  return (
    SESSION_FALLBACK_BY_EMAIL[email] || {
      role: "",
      empresa: "",
      status: "ativo",
    }
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const emailNormalizado = useMemo(() => normalizeEmail(email), [email]);

  async function entrar() {
    const emailFinal = normalizeEmail(email);
    const senhaFinal = senha;

    if (!emailFinal) {
      setStatus("Informe seu e-mail.");
      return;
    }

    if (!senhaFinal) {
      setStatus("Informe sua senha.");
      return;
    }

    try {
      setSaving(true);
      setStatus("Entrando...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailFinal,
        password: senhaFinal,
      });

      if (error) {
        setStatus("Erro: " + error.message);
        return;
      }

      try {
        if (typeof window !== "undefined") {
          const roleAuth =
            normalizeText(data?.user?.app_metadata?.role) ||
            normalizeText(data?.user?.user_metadata?.role);

          const empresaAuth =
            normalizeText(data?.user?.app_metadata?.empresa) ||
            normalizeText(data?.user?.user_metadata?.empresa);

          const statusAuth =
            normalizeText(data?.user?.app_metadata?.status) ||
            normalizeText(data?.user?.user_metadata?.status);

          const fallback = getFallbackSession(emailFinal);

          const roleFinal = normalizeText(roleAuth || fallback.role).toLowerCase();
          const empresaFinal = normalizeText(empresaAuth || fallback.empresa);
          const statusFinal = normalizeText(statusAuth || fallback.status).toLowerCase();

          window.localStorage.setItem("aurora_session_email", emailFinal);

          if (roleFinal) {
            window.localStorage.setItem("aurora_session_role", roleFinal);
          } else {
            window.localStorage.removeItem("aurora_session_role");
          }

          if (empresaFinal) {
            window.localStorage.setItem("aurora_session_empresa", empresaFinal);
          } else {
            window.localStorage.removeItem("aurora_session_empresa");
          }

          if (statusFinal) {
            window.localStorage.setItem("aurora_session_status", statusFinal);
          } else {
            window.localStorage.removeItem("aurora_session_status");
          }
        }
      } catch {
        // mantém o login principal funcionando mesmo se localStorage falhar
      }

      setStatus("Login realizado com sucesso!");
      window.location.href = "/servicos";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro inesperado ao entrar.";
      setStatus("Erro: " + message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
          alignItems: "stretch",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                background: "#e0f2fe",
                color: "#075985",
                borderRadius: 999,
                padding: "7px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Aurora Motoristas
            </span>

            <Link href="/" style={topLinkStyle}>
              Voltar para a home
            </Link>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.05,
              color: "#0f172a",
              wordBreak: "break-word",
            }}
          >
            Entrar no sistema
          </h1>

          <p
            style={{
              margin: 0,
              color: "#4b6478",
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 700,
            }}
          >
            Entre com e-mail e senha para acessar o sistema. Não é necessário
            usar código por e-mail neste fluxo. O acesso foi preparado para uso
            empresarial com login controlado pelo administrador.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={miniChip}>Login com senha</span>
            <span style={miniChip}>Acesso controlado</span>
            <span style={miniChip}>Uso em celular e PC</span>
          </div>

          <div
            style={{
              borderRadius: 20,
              background: "#f8fbff",
              border: "1px solid #e5edf5",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Orientação de acesso
            </div>

            <div
              style={{
                color: "#4b6478",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Use o e-mail e a senha fornecidos pelo administrador. Depois do
              login, o sistema direciona para a área operacional.
            </div>

            <div
              style={{
                borderRadius: 16,
                background: "#ffffff",
                border: "1px solid #e7eef6",
                padding: 14,
                color: "#435b6e",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Sistema em constante atualização e podem ocorrer instabilidades
              momentâneas durante melhorias.
            </div>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Acesso direto
          </div>

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
              autoComplete="email"
              style={fieldStyle}
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
              autoComplete="current-password"
              style={fieldStyle}
            />
          </label>

          <button
            type="button"
            onClick={entrar}
            disabled={saving}
            style={{
              border: "none",
              background: "#0ea5e9",
              color: "#ffffff",
              borderRadius: 14,
              padding: "14px 18px",
              fontWeight: 800,
              fontSize: 15,
              cursor: saving ? "not-allowed" : "pointer",
              boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
              opacity: saving ? 0.85 : 1,
            }}
          >
            {saving ? "Entrando..." : "Entrar"}
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
              wordBreak: "break-word",
            }}
          >
            {status ||
              `Aguardando login${
                emailNormalizado ? ` para ${emailNormalizado}` : "..."
              }`}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <InfoCard
              title="Entrar"
              text="Acesso com e-mail e senha, sem precisar de código por e-mail."
            />
            <InfoCard
              title="Destino"
              text="Após login válido, o sistema direciona para a área de serviços."
            />
            <InfoCard
              title="Sessão"
              text="O sistema preserva e-mail, perfil, empresa e status para continuidade do uso."
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <Link href="/guia" style={secondaryButton}>
              Ver guia completo
            </Link>

            <Link href="/servicos" style={secondaryButton}>
              Ir para operação
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#fcfdff",
        border: "1px solid #e7eef6",
        borderRadius: 18,
        padding: 14,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#123047",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#4b6478",
          fontSize: 13,
          lineHeight: 1.65,
        }}
      >
        {text}
      </div>
    </div>
  );
}

const fieldStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid #d8e3ee",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  background: "#f8fbff",
  color: "#123047",
  boxSizing: "border-box",
  width: "100%",
};

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const miniChip: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
};