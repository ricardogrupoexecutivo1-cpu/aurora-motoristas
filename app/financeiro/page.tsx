"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [emailDigitado, setEmailDigitado] = useState("");
  const [emailValidado, setEmailValidado] = useState("");
  const [mensagem, setMensagem] = useState(
    "Área blindada. Somente usuários autorizados podem visualizar o financeiro."
  );

  const emailSessao = useMemo(() => getLocalSessionEmail(), []);
  const emailAtivo = (emailDigitado || emailValidado || emailSessao).toLowerCase();

  const autorizado = EMAILS_AUTORIZADOS.includes(emailAtivo);

  function validarAcesso() {
    const email = emailDigitado.trim().toLowerCase();

    if (!email) {
      setMensagem("Digite um e-mail autorizado para validar o acesso.");
      return;
    }

    setEmailValidado(email);

    if (EMAILS_AUTORIZADOS.includes(email)) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("aurora_session_email", email);
      }
      setMensagem(`Acesso liberado para ${email}.`);
      return;
    }

    setMensagem("Acesso negado. Este e-mail não possui permissão para o financeiro.");
  }

  if (!autorizado) {
    return (
      <main style={styles.page}>
        <section style={styles.wrapper}>
          <div style={styles.card}>
            <span style={styles.kicker}>AURORA MOTORISTAS • FINANCEIRO BLINDADO</span>
            <h1 style={styles.title}>Acesso restrito</h1>
            <p style={styles.text}>
              Esta área financeira está protegida. Mesmo que a rota seja acessada
              diretamente, o conteúdo só pode ser exibido para usuários autorizados.
            </p>

            <div style={styles.alertBox}>{mensagem}</div>

            <div style={styles.formBox}>
              <label style={styles.label}>E-mail autorizado</label>
              <input
                type="email"
                placeholder="Digite seu e-mail autorizado"
                value={emailDigitado}
                onChange={(e) => setEmailDigitado(e.target.value)}
                style={styles.input}
              />
              <button type="button" onClick={validarAcesso} style={styles.primaryButton}>
                Validar acesso
              </button>
            </div>

            <div style={styles.infoBox}>
              <strong style={styles.infoTitle}>Sessão local detectada:</strong>
              <span style={styles.infoText}>{emailSessao || "Nenhum e-mail encontrado"}</span>
            </div>

            <div style={styles.actions}>
              <Link href="/" style={styles.secondaryButton}>
                Voltar para início
              </Link>
              <Link href="/ofertas" style={styles.secondaryButton}>
                Ir para ofertas
              </Link>
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
            Acesso liberado para <strong>{emailAtivo}</strong>. Esta é uma blindagem
            emergencial da primeira versão. O próximo passo será conectar a permissão
            real por autenticação e perfil.
          </p>

          <div style={styles.successBox}>Acesso autorizado. Conteúdo financeiro visível.</div>

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
            <Link href="/operacao" style={styles.secondaryButton}>
              Operação
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
    maxWidth: 1080,
    margin: "0 auto",
    padding: "24px 12px 80px",
  },
  card: {
    background: "rgba(255,255,255,0.9)",
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
  },
  text: {
    marginTop: 14,
    marginBottom: 0,
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.75,
  },
  alertBox: {
    marginTop: 18,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    color: "#991b1b",
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
  formBox: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },
  label: {
    fontSize: 13,
    fontWeight: 800,
    color: "#475569",
  },
  input: {
    minHeight: 46,
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },
  primaryButton: {
    border: "none",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.18)",
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
  infoBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    background: "rgba(6, 182, 212, 0.08)",
    border: "1px solid rgba(6, 182, 212, 0.16)",
  },
  infoTitle: {
    fontSize: 13,
    color: "#164e63",
  },
  infoText: {
    fontSize: 14,
    color: "#0f172a",
    fontWeight: 700,
    wordBreak: "break-word",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  metricCard: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid rgba(125, 211, 252, 0.18)",
    padding: 16,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },
  metricLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },
  metricValue: {
    display: "block",
    marginTop: 8,
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  metricDetail: {
    display: "block",
    marginTop: 8,
    color: "#0891b2",
    fontSize: 13,
    fontWeight: 700,
  },
};