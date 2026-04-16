"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const EMAILS_AUTORIZADOS = [
  "ricardogrupoexecutivo1@gmail.com",
  "finance@ges.com",
  "grupoexecutivo1@gmail.com",
];

function getLocalSessionEmail() {
  if (typeof window === "undefined") return "";

  const keys = [
    "aurora_session_email",
    "session_email",
    "userEmail",
    "email",
  ];

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim()) return value.trim().toLowerCase();
  }

  return "";
}

export default function FinanceiroPage() {
  const [mounted, setMounted] = useState(false);
  const [emailSessao, setEmailSessao] = useState("");

  useEffect(() => {
    setMounted(true);

    const email = getLocalSessionEmail();
    setEmailSessao(email);

    if (!EMAILS_AUTORIZADOS.includes(email)) {
      window.location.href = "/acesso-negado";
    }
  }, []);

  const autorizado = EMAILS_AUTORIZADOS.includes(emailSessao);

  if (!mounted) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>
            <h1 style={styles.title}>Validando acesso...</h1>
            <p style={styles.text}>
              Aguarde enquanto o sistema confirma a sessão e aplica a blindagem
              desta área.
            </p>

            <div style={styles.loadingBox}>
              Carregando proteção do financeiro...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!autorizado) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO</span>
            <h1 style={styles.title}>Redirecionando...</h1>
            <p style={styles.text}>
              Você não possui permissão para esta área. O sistema está
              redirecionando para a página de acesso restrito.
            </p>

            <div style={styles.loadingBox}>Redirecionando para acesso negado...</div>
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
            Acesso liberado para <strong>{emailSessao}</strong>. Esta área está
            protegida e disponível apenas para usuários autorizados.
          </p>

          <div style={styles.successBox}>
            Acesso autorizado. Conteúdo financeiro visível.
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
    boxSizing: "border-box",
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