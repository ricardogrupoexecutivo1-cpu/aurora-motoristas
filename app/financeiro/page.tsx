"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SessionData = {
  email: string;
  role: string;
  empresa: string;
  status: string;
};

const EMAILS_FALLBACK_AUTORIZADOS = [
  "ricardogrupoexecutivo1@gmail.com",
  "finance@ges.com",
  "grupoexecutivo1@gmail.com",
];

const ROLES_AUTORIZADOS = ["admin_master", "admin", "financeiro"];

function normalize(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function getLocalSession(): SessionData {
  if (typeof window === "undefined") {
    return {
      email: "",
      role: "",
      empresa: "",
      status: "",
    };
  }

  const email =
    localStorage.getItem("aurora_session_email") ||
    localStorage.getItem("session_email") ||
    localStorage.getItem("userEmail") ||
    localStorage.getItem("email") ||
    "";

  const role =
    localStorage.getItem("aurora_session_role") ||
    localStorage.getItem("role") ||
    "";

  const empresa =
    localStorage.getItem("aurora_session_empresa") ||
    localStorage.getItem("empresa") ||
    "";

  const status =
    localStorage.getItem("aurora_session_status") ||
    localStorage.getItem("status") ||
    "";

  return {
    email: normalize(email),
    role: normalize(role),
    empresa: String(empresa || "").trim(),
    status: normalize(status),
  };
}

function isAuthorized(session: SessionData) {
  const emailAutorizado = EMAILS_FALLBACK_AUTORIZADOS.includes(session.email);
  const roleAutorizado = ROLES_AUTORIZADOS.includes(session.role);

  return emailAutorizado || roleAutorizado;
}

function getDisplayRole(role: string) {
  if (role === "admin_master") return "Admin Master";
  if (role === "admin") return "Admin";
  if (role === "financeiro") return "Financeiro";
  if (role === "operacional") return "Operacional";
  if (role === "motorista") return "Motorista";
  if (role === "visualizacao") return "Visualização";
  return role || "Não identificado";
}

export default function FinanceiroPage() {
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<SessionData>({
    email: "",
    role: "",
    empresa: "",
    status: "",
  });
  const [accessState, setAccessState] = useState<
    "checking" | "authorized" | "unauthenticated" | "forbidden"
  >("checking");

  useEffect(() => {
    setMounted(true);

    const localSession = getLocalSession();
    setSession(localSession);

    const hasAnySession = Boolean(localSession.email || localSession.role);

    if (!hasAnySession) {
      setAccessState("unauthenticated");
      window.location.href = "/login";
      return;
    }

    if (!isAuthorized(localSession)) {
      setAccessState("forbidden");
      window.location.href = "/acesso-negado";
      return;
    }

    setAccessState("authorized");
  }, []);

  const subtitulo = useMemo(() => {
    if (session.role) {
      return `${getDisplayRole(session.role)}${
        session.empresa ? ` • ${session.empresa}` : ""
      }`;
    }

    if (session.email) {
      return session.email;
    }

    return "Sessão protegida";
  }, [session]);

  if (!mounted || accessState === "checking") {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>
            <h1 style={styles.title}>Validando acesso...</h1>
            <p style={styles.text}>
              Aguarde enquanto o sistema confirma a sessão, o perfil e a
              blindagem desta área financeira.
            </p>

            <div style={styles.loadingBox}>
              Carregando proteção do financeiro...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (accessState === "unauthenticated") {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>
            <h1 style={styles.title}>Sessão não encontrada</h1>
            <p style={styles.text}>
              O sistema não encontrou uma sessão válida para esta área. Você
              está sendo redirecionado para o login.
            </p>

            <div style={styles.loadingBox}>Redirecionando para o login...</div>
          </div>
        </section>
      </main>
    );
  }

  if (accessState === "forbidden") {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>
            <h1 style={styles.title}>Acesso restrito</h1>
            <p style={styles.text}>
              Sua sessão foi identificada, mas o perfil atual não possui
              permissão para visualizar o financeiro. Você está sendo
              redirecionado para a área de acesso negado.
            </p>

            <div style={styles.loadingBox}>
              Redirecionando para acesso negado...
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <section style={styles.wrapper}>
        <div style={styles.card}>
          <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>

          <h1 style={styles.title}>Financeiro protegido</h1>

          <p style={styles.text}>
            Acesso liberado para <strong>{session.email || "usuário"}</strong>.
            Esta área está protegida por perfil e disponível apenas para usuários
            autorizados.
          </p>

          <div style={styles.successBox}>
            Acesso autorizado. Conteúdo financeiro visível.
          </div>

          <div style={styles.sessionGrid}>
            <SessionInfo
              label="Perfil da sessão"
              value={getDisplayRole(session.role)}
            />
            <SessionInfo
              label="Empresa"
              value={session.empresa || "Não informada"}
            />
            <SessionInfo
              label="Status da sessão"
              value={session.status || "Não informado"}
            />
            <SessionInfo
              label="Leitura principal"
              value={subtitulo}
            />
          </div>

          <div style={styles.grid}>
            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Receitas do período</span>
              <strong style={styles.metricValue}>R$ 12.480,00</strong>
              <span style={styles.metricDetail}>Leitura protegida</span>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Pagamentos a motoristas</span>
              <strong style={styles.metricValue}>R$ 7.960,00</strong>
              <span style={styles.metricDetail}>Acesso restrito</span>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Despesas operacionais</span>
              <strong style={styles.metricValue}>R$ 1.845,00</strong>
              <span style={styles.metricDetail}>Base interna</span>
            </article>

            <article style={styles.metricCard}>
              <span style={styles.metricLabel}>Saldo projetado</span>
              <strong style={styles.metricValue}>R$ 2.675,00</strong>
              <span style={styles.metricDetail}>Painel blindado</span>
            </article>
          </div>

          <div style={styles.actions}>
            <Link href="/" style={styles.secondaryButton}>
              Início
            </Link>

            <Link href="/servicos" style={styles.secondaryButton}>
              Operação
            </Link>

            <Link href="/guia" style={styles.secondaryButton}>
              Guia
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SessionInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.sessionCard}>
      <div style={styles.sessionLabel}>{label}</div>
      <div style={styles.sessionValue}>{value}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #eef7ff 45%, #ffffff 100%)",
    color: "#0f172a",
  },
  wrapper: {
    width: "100%",
    maxWidth: 1080,
    margin: "0 auto",
    padding: "24px 12px 80px",
    boxSizing: "border-box",
  },
  card: {
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(125, 211, 252, 0.24)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 24px 60px rgba(14, 165, 233, 0.10)",
    backdropFilter: "blur(10px)",
  },
  kicker: {
    display: "inline-block",
    marginBottom: 12,
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.7rem, 4vw, 3rem)",
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-0.04em",
    wordBreak: "break-word",
  },
  text: {
    marginTop: 14,
    marginBottom: 0,
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.75,
  },
  loadingBox: {
    marginTop: 18,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(14, 165, 233, 0.08)",
    border: "1px solid rgba(14, 165, 233, 0.18)",
    color: "#0c4a6e",
    fontWeight: 700,
    lineHeight: 1.65,
  },
  successBox: {
    marginTop: 18,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    fontWeight: 800,
    lineHeight: 1.65,
  },
  sessionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  sessionCard: {
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid rgba(125, 211, 252, 0.18)",
    padding: 14,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },
  sessionLabel: {
    fontSize: 12,
    color: "#6b7f90",
    fontWeight: 700,
    marginBottom: 6,
  },
  sessionValue: {
    fontSize: 14,
    color: "#123047",
    fontWeight: 800,
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 46,
    padding: "0 16px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 800,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.24)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  metricCard: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid rgba(125, 211, 252, 0.18)",
    padding: 16,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
  },
  metricLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
    lineHeight: 1.5,
  },
  metricValue: {
    display: "block",
    marginTop: 8,
    fontSize: "clamp(1.6rem, 5vw, 2rem)",
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    wordBreak: "break-word",
  },
  metricDetail: {
    display: "block",
    marginTop: 8,
    color: "#0891b2",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },
};