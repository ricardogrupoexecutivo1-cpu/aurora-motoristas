"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  cnh?: string | null;
  telefone?: string | null;
  email?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  observacoes?: string | null;
  foto_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  motorista?: Motorista | null;
};

function formatarCPF(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "").slice(0, 11);

  if (!digits) return "—";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");

  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
}

function formatarTelefone(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "").slice(0, 11);

  if (!digits) return "—";
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");

  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function formatarData(valor?: string | null) {
  if (!valor) return "—";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

function limparTelefoneWhatsApp(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("55")) return digits;

  return `55${digits}`;
}

function usarIdDaUrl() {
  const [id, setId] = useState("");

  useEffect(() => {
    const partes = window.location.pathname.split("/").filter(Boolean);
    const ultimo = partes[partes.length - 1] || "";
    setId(decodeURIComponent(ultimo));
  }, []);

  return id;
}

export default function MotoristaDetalhePage() {
  const id = usarIdDaUrl();

  const [motorista, setMotorista] = useState<Motorista | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function carregar() {
      if (!id) return;

      try {
        setCarregando(true);
        setErro("");

        const response = await fetch(`/api/motoristas/${id}`, {
          method: "GET",
          cache: "no-store",
        });

        const rawText = await response.text();
        let data: ApiResponse | null = null;

        try {
          data = rawText ? (JSON.parse(rawText) as ApiResponse) : null;
        } catch {
          data = null;
        }

        if (!response.ok) {
          setErro(
            data?.error ||
              data?.message ||
              rawText ||
              `Falha ao carregar motorista. HTTP ${response.status} ${response.statusText}`,
          );
          return;
        }

        setMotorista(data?.motorista || null);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar motorista.");
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  const endereco = useMemo(() => {
    if (!motorista) return "—";

    const partes = [
      motorista.logradouro,
      motorista.numero,
      motorista.complemento,
      motorista.bairro,
      motorista.cidade,
      motorista.estado,
      motorista.cep,
    ].filter(Boolean);

    return partes.length ? partes.join(" • ") : "—";
  }, [motorista]);

  const telefoneWhatsApp = useMemo(() => {
    return limparTelefoneWhatsApp(motorista?.telefone);
  }, [motorista?.telefone]);

  return (
    <main style={pageStyle}>
      <div style={ambientGlowTop} />
      <div style={ambientGlowBottom} />

      <div style={containerStyle}>
        <header style={heroStyle}>
          <div style={heroBadge}>Aurora Motoristas • Detalhe premium</div>

          <div
            style={{
              ...heroGrid,
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1.5fr) minmax(260px, 0.8fr)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <h1 style={heroTitle}>Detalhe do motorista</h1>

              <p style={heroText}>
                Visualização completa do cadastro do motorista, com leitura premium, organizada e pronta
                para evolução futura com edição, vínculo com empresas e operação.
              </p>

              <div style={heroPills}>
                <span style={pillStyle}>Cadastro completo</span>
                <span style={pillStyle}>Leitura real</span>
                <span style={pillStyle}>Visual premium</span>
              </div>
            </div>

            <div style={heroSideCard}>
              <div style={heroSideNumber}>01</div>
              <div style={heroSideLabel}>Motorista</div>
              <div style={heroSideText}>
                Área individual do profissional, pronta para expansão sem misturar com o projeto grandão.
              </div>
            </div>
          </div>
        </header>

        <section style={cardStyle}>
          <div
            style={{
              ...toolbarStyle,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <div>
              <div style={sectionEyebrow}>Base operacional</div>
              <h2 style={sectionTitle}>Dados completos</h2>
              <p style={sectionText}>
                Veja as informações principais do motorista salvo na base.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Link href="/motoristas" style={ghostButtonStyle}>
                Voltar para lista
              </Link>

              <Link href="/motoristas/cadastrar" style={primaryButtonStyle}>
                Novo motorista
              </Link>

              <Link href={`/motoristas/${id}/editar`} style={editButtonStyle}>
                Editar motorista
              </Link>

              {telefoneWhatsApp ? (
                <a
                  href={`https://wa.me/${telefoneWhatsApp}`}
                  target="_blank"
                  rel="noreferrer"
                  style={whatsAppButtonStyle}
                >
                  Chamar no WhatsApp
                </a>
              ) : null}
            </div>
          </div>

          {erro ? <div style={errorStyle}>{erro}</div> : null}

          {carregando ? (
            <div style={loadingCardStyle}>Carregando motorista...</div>
          ) : !motorista ? (
            <div style={emptyCardStyle}>Motorista não encontrado.</div>
          ) : (
            <div style={listStyle}>
              <article style={itemCardStyle}>
                <div
                  style={{
                    ...itemHeaderStyle,
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={itemNameStyle}>{motorista.nome || "Sem nome"}</div>
                    <div style={itemMetaLineStyle}>
                      CPF: {formatarCPF(motorista.cpf)} • Telefone: {formatarTelefone(motorista.telefone)}
                    </div>
                  </div>

                  <div style={statusPillStyle}>Ativo na base</div>
                </div>

                <div
                  style={{
                    ...detailsGridStyle,
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <Detail label="Nome" value={motorista.nome || "—"} />
                  <Detail label="CPF" value={formatarCPF(motorista.cpf)} />
                  <Detail label="CNH" value={motorista.cnh || "—"} />
                  <Detail label="Telefone" value={formatarTelefone(motorista.telefone)} />
                  <Detail label="E-mail" value={motorista.email || "—"} />
                  <Detail label="CEP" value={motorista.cep || "—"} />
                  <Detail label="Endereço completo" value={endereco} />
                  <Detail label="Foto URL" value={motorista.foto_url || "—"} />
                  <Detail label="Observações" value={motorista.observacoes || "—"} />
                  <Detail label="Criado em" value={formatarData(motorista.created_at)} />
                  <Detail label="Atualizado em" value={formatarData(motorista.updated_at)} />
                  <Detail label="ID" value={motorista.id || "—"} />
                </div>
              </article>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={detailCardStyle}>
      <div style={detailLabelStyle}>{label}</div>
      <div style={detailValueStyle}>{value}</div>
    </div>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 28%), linear-gradient(180deg, #eef6ff 0%, #f8fbff 46%, #f4f7fb 100%)",
  padding: "24px 16px 40px",
  position: "relative",
  overflow: "hidden",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1180,
  margin: "0 auto",
  position: "relative",
  zIndex: 2,
};

const ambientGlowTop: CSSProperties = {
  position: "absolute",
  top: -120,
  right: -80,
  width: 280,
  height: 280,
  borderRadius: "50%",
  background: "rgba(6,182,212,0.14)",
  filter: "blur(40px)",
};

const ambientGlowBottom: CSSProperties = {
  position: "absolute",
  bottom: -100,
  left: -60,
  width: 260,
  height: 260,
  borderRadius: "50%",
  background: "rgba(37,99,235,0.12)",
  filter: "blur(42px)",
};

const heroStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(241,248,255,0.96) 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 32,
  padding: 24,
  boxShadow: "0 24px 80px rgba(15,23,42,0.10)",
  backdropFilter: "blur(12px)",
  marginBottom: 18,
};

const heroBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  minHeight: 34,
  padding: "8px 14px",
  borderRadius: 999,
  background: "rgba(8,145,178,0.10)",
  color: "#0f766e",
  border: "1px solid rgba(6,182,212,0.18)",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.4,
  textTransform: "uppercase",
};

const heroGrid: CSSProperties = {
  display: "grid",
  gap: 18,
  marginTop: 18,
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 5vw, 46px)",
  lineHeight: 1.02,
  color: "#0f172a",
  fontWeight: 900,
  letterSpacing: -1.2,
};

const heroText: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
  maxWidth: 720,
};

const heroPills: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const pillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "8px 12px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.20)",
  color: "#0f172a",
  fontSize: 13,
  fontWeight: 700,
  boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
};

const heroSideCard: CSSProperties = {
  background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
  color: "#ffffff",
  borderRadius: 28,
  padding: 22,
  minHeight: 220,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 20px 40px rgba(15,23,42,0.18)",
};

const heroSideNumber: CSSProperties = {
  fontSize: 38,
  fontWeight: 900,
  color: "#67e8f9",
  letterSpacing: 1,
};

const heroSideLabel: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  lineHeight: 1.1,
};

const heroSideText: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 30,
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
  padding: 24,
  backdropFilter: "blur(12px)",
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 22,
};

const sectionEyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  color: "#0891b2",
  marginBottom: 8,
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.08,
};

const sectionText: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.7,
  color: "#64748b",
  maxWidth: 760,
};

const errorStyle: CSSProperties = {
  marginBottom: 18,
  background: "linear-gradient(135deg, #fff1f2 0%, #fef2f2 100%)",
  color: "#991b1b",
  border: "1px solid rgba(248,113,113,0.28)",
  padding: 14,
  borderRadius: 18,
  fontSize: 14,
  fontWeight: 700,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const loadingCardStyle: CSSProperties = {
  minHeight: 120,
  borderRadius: 24,
  border: "1px dashed rgba(148,163,184,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 15,
  fontWeight: 700,
  background: "rgba(248,250,252,0.72)",
};

const emptyCardStyle: CSSProperties = {
  minHeight: 120,
  borderRadius: 24,
  border: "1px dashed rgba(148,163,184,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 15,
  fontWeight: 700,
  background: "rgba(248,250,252,0.72)",
  textAlign: "center",
  padding: 20,
};

const listStyle: CSSProperties = {
  display: "grid",
  gap: 16,
};

const itemCardStyle: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(148,163,184,0.16)",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  padding: 18,
  boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
};

const itemHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 16,
};

const itemNameStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.1,
};

const itemMetaLineStyle: CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(6,182,212,0.10)",
  color: "#0f766e",
  border: "1px solid rgba(6,182,212,0.18)",
  fontSize: 12,
  fontWeight: 800,
  whiteSpace: "nowrap",
};

const detailsGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const detailCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.14)",
  background: "#ffffff",
  padding: 14,
};

const detailLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#0891b2",
  marginBottom: 6,
};

const detailValueStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#0f172a",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "none",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(37,99,235,0.20)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const ghostButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 800,
  cursor: "pointer",
  background: "rgba(255,255,255,0.86)",
  color: "#0f172a",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const editButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "none",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(245,158,11,0.22)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

const whatsAppButtonStyle: CSSProperties = {
  minHeight: 48,
  borderRadius: 18,
  border: "none",
  padding: "12px 18px",
  fontSize: 15,
  fontWeight: 900,
  cursor: "pointer",
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  color: "#ffffff",
  boxShadow: "0 18px 32px rgba(34,197,94,0.22)",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};