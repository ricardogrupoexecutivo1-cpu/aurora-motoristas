"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  cnh?: string | null;
  telefone?: string | null;
  email?: string | null;
  cep?: string | null;
  endereco?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  observacoes?: string | null;
  foto_url?: string | null;
  ativo?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  motoristas?: Motorista[];
  total?: number;
};

type FiltroStatus = "todos" | "pendentes" | "ativos" | "inativos";

function formatarCPF(valor?: string | null) {
  const digits = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (!digits) return "â€”";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) {
    return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  }

  return digits.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/,
    "$1.$2.$3-$4",
  );
}

function formatarTelefone(valor?: string | null) {
  const digits = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (!digits) return "â€”";
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) {
    return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  }

  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function formatarData(valor?: string | null) {
  if (!valor) return "â€”";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "â€”";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(data);
}

function inferirOrigemPublica(observacoes?: string | null) {
  return String(observacoes || "")
    .toLowerCase()
    .includes("cadastro_motorista_publico");
}

function obterStatusMotorista(motorista: Motorista) {
  if (motorista.ativo === true) {
    return {
      chave: "ativos" as const,
      rotulo: "Ativo na base",
      cor: "#0f766e",
      fundo: "rgba(6,182,212,0.10)",
      borda: "1px solid rgba(6,182,212,0.18)",
    };
  }

  if (motorista.ativo === false && inferirOrigemPublica(motorista.observacoes)) {
    return {
      chave: "pendentes" as const,
      rotulo: "Pendente para análise",
      cor: "#9a3412",
      fundo: "rgba(251,146,60,0.12)",
      borda: "1px solid rgba(251,146,60,0.22)",
    };
  }

  return {
    chave: "inativos" as const,
    rotulo: "Inativo / interno",
    cor: "#475569",
    fundo: "rgba(148,163,184,0.12)",
    borda: "1px solid rgba(148,163,184,0.22)",
  };
}

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");
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
    async function carregarMotoristas() {
      try {
        setCarregando(true);
        setErro("");

        const response = await fetch("/api/motoristas", {
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
              `Falha ao carregar motoristas. HTTP ${response.status} ${response.statusText}`,
          );
          return;
        }

        setMotoristas(Array.isArray(data?.motoristas) ? data.motoristas : []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar motoristas.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarMotoristas();
  }, []);

  const totais = useMemo(() => {
    let ativos = 0;
    let pendentes = 0;
    let inativos = 0;

    for (const motorista of motoristas) {
      const status = obterStatusMotorista(motorista);

      if (status.chave === "ativos") ativos += 1;
      if (status.chave === "pendentes") pendentes += 1;
      if (status.chave === "inativos") inativos += 1;
    }

    return {
      total: motoristas.length,
      ativos,
      pendentes,
      inativos,
    };
  }, [motoristas]);

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return motoristas.filter((motorista) => {
      const status = obterStatusMotorista(motorista);

      if (filtroStatus !== "todos" && status.chave !== filtroStatus) {
        return false;
      }

      if (!termo) return true;

      const base = [
        motorista.nome,
        motorista.cpf,
        motorista.telefone,
        motorista.email,
        motorista.cidade,
        motorista.estado,
        motorista.observacoes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return base.includes(termo);
    });
  }, [busca, filtroStatus, motoristas]);

  return (
    <main style={pageStyle}>
      <div style={ambientGlowTop} />
      <div style={ambientGlowBottom} />

      <div style={containerStyle}>
        <header style={heroStyle}>
          <div
            style={{
              ...heroTopRow,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <div style={heroBadge}>Aurora Motoristas â€¢ Base premium</div>

            <div
              style={{
                ...heroTopButtons,
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Link
                href="/"
                style={{
                  ...topButtonStyle,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Home
              </Link>

              <Link
                href="/motoristas/cadastrar"
                style={{
                  ...topButtonStyle,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Novo motorista interno
              </Link>

              <Link
                href="/quero-ser-motorista"
                style={{
                  ...topButtonStyle,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Fluxo público
              </Link>
            </div>
          </div>

          <div
            style={{
              ...heroGrid,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(0, 1.5fr) minmax(260px, 0.8fr)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
              <h1 style={heroTitle}>Motoristas cadastrados</h1>

              <p style={heroText}>
                Visualize a base real de motoristas já salvos no Aurora
                Motoristas, com separação clara entre <strong>pendentes</strong>,{" "}
                <strong>ativos</strong> e <strong>inativos</strong>, facilitando a
                validação final antes de liberar testes sérios com sua equipe.
              </p>

              <div style={heroPills}>
                <span style={pillStyle}>Base real</span>
                <span style={pillStyle}>Triagem pronta</span>
                <span style={pillStyle}>Visual premium</span>
                <span style={pillStyle}>Leitura clara</span>
              </div>
            </div>

            <div style={heroSideCard}>
              <div style={heroSideNumber}>
                {carregando
                  ? "..."
                  : String(motoristasFiltrados.length).padStart(2, "0")}
              </div>
              <div style={heroSideLabel}>Motoristas</div>
              <div style={heroSideText}>
                Total filtrado da base operacional para conferência final antes da
                versão de testes com sua equipe.
              </div>
            </div>
          </div>
        </header>

        <section
          style={{
            ...summaryGridStyle,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, minmax(0, 1fr))",
          }}
        >
          <SummaryCard
            title="Base total"
            value={carregando ? "..." : String(totais.total)}
            note="Todos os motoristas lidos da base real."
          />
          <SummaryCard
            title="Pendentes"
            value={carregando ? "..." : String(totais.pendentes)}
            note="Cadastros públicos aguardando análise."
          />
          <SummaryCard
            title="Ativos"
            value={carregando ? "..." : String(totais.ativos)}
            note="Prontos para operação na base."
          />
          <SummaryCard
            title="Inativos"
            value={carregando ? "..." : String(totais.inativos)}
            note="Internos ou não liberados na operação."
          />
        </section>

        <section
          style={{
            ...cardStyle,
            padding: isMobile ? 16 : 24,
          }}
        >
          <div
            style={{
              ...toolbarStyle,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={sectionEyebrow}>Base operacional</div>
              <h2 style={sectionTitle}>Lista de motoristas</h2>
              <p style={sectionText}>
                Consulte por nome, CPF, telefone, e-mail, cidade ou estado e
                filtre a leitura para homologação final.
              </p>
            </div>

            <div style={{ width: isMobile ? "100%" : 360, minWidth: 0 }}>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar motorista..."
                style={inputStyle}
              />
            </div>
          </div>

          <div style={filterRowStyle}>
            <FilterButton
              active={filtroStatus === "todos"}
              onClick={() => setFiltroStatus("todos")}
              label={`Todos (${totais.total})`}
            />
            <FilterButton
              active={filtroStatus === "pendentes"}
              onClick={() => setFiltroStatus("pendentes")}
              label={`Pendentes (${totais.pendentes})`}
            />
            <FilterButton
              active={filtroStatus === "ativos"}
              onClick={() => setFiltroStatus("ativos")}
              label={`Ativos (${totais.ativos})`}
            />
            <FilterButton
              active={filtroStatus === "inativos"}
              onClick={() => setFiltroStatus("inativos")}
              label={`Inativos (${totais.inativos})`}
            />
          </div>

          {erro ? <div style={errorStyle}>{erro}</div> : null}

          {carregando ? (
            <div style={loadingCardStyle}>Carregando motoristas...</div>
          ) : motoristasFiltrados.length === 0 ? (
            <div style={emptyCardStyle}>
              {busca.trim()
                ? "Nenhum motorista encontrado para essa busca."
                : "Nenhum motorista cadastrado ainda."}
            </div>
          ) : (
            <div style={listStyle}>
              {motoristasFiltrados.map((motorista) => {
                const endereco = [
                  motorista.endereco,
                  motorista.logradouro,
                  motorista.numero,
                  motorista.bairro,
                  motorista.cidade,
                  motorista.estado,
                ]
                  .filter(Boolean)
                  .join(" â€¢ ");

                const status = obterStatusMotorista(motorista);
                const origemPublica = inferirOrigemPublica(motorista.observacoes);

                return (
                  <Link
                    key={motorista.id}
                    href={`/motoristas/${motorista.id}`}
                    style={linkCardStyle}
                  >
                    <article style={itemCardStyle}>
                      <div
                        style={{
                          ...itemHeaderStyle,
                          flexDirection: isMobile ? "column" : "row",
                          alignItems: isMobile ? "flex-start" : "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            minWidth: 0,
                            width: "100%",
                          }}
                        >
                          <div style={itemNameStyle}>
                            {motorista.nome || "Sem nome"}
                          </div>
                          <div style={itemMetaLineStyle}>
                            CPF: {formatarCPF(motorista.cpf)} â€¢ Telefone:{" "}
                            {formatarTelefone(motorista.telefone)}
                          </div>
                        </div>

                        <div
                          style={{
                            ...statusPillStyle,
                            color: status.cor,
                            background: status.fundo,
                            border: status.borda,
                            whiteSpace: isMobile ? "normal" : "nowrap",
                            width: isMobile ? "100%" : "auto",
                            textAlign: "center",
                          }}
                        >
                          {status.rotulo}
                        </div>
                      </div>

                      <div
                        style={{
                          ...detailsGridStyle,
                          gridTemplateColumns: isMobile
                            ? "1fr"
                            : "repeat(2, minmax(0, 1fr))",
                        }}
                      >
                        <Detail
                          label="Origem"
                          value={
                            origemPublica
                              ? "Cadastro público"
                              : "Cadastro interno / base"
                          }
                        />
                        <Detail label="CNH" value={motorista.cnh || "â€”"} />
                        <Detail label="E-mail" value={motorista.email || "â€”"} />
                        <Detail label="CEP" value={motorista.cep || "â€”"} />
                        <Detail label="Endereço" value={endereco || "â€”"} />
                        <Detail
                          label="Complemento"
                          value={motorista.complemento || "â€”"}
                        />
                        <Detail
                          label="Observações"
                          value={motorista.observacoes || "â€”"}
                        />
                        <Detail
                          label="Criado em"
                          value={formatarData(motorista.created_at)}
                        />
                      </div>
                    </article>
                  </Link>
                );
              })}
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

function SummaryCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <article style={summaryCardStyle}>
      <div style={summaryCardTitleStyle}>{title}</div>
      <div style={summaryCardValueStyle}>{value}</div>
      <div style={summaryCardNoteStyle}>{note}</div>
    </article>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...filterButtonStyle,
        background: active ? "#0f172a" : "#ffffff",
        color: active ? "#ffffff" : "#123047",
        border: active
          ? "1px solid #0f172a"
          : "1px solid rgba(148,163,184,0.22)",
        width: "auto",
        maxWidth: "100%",
      }}
    >
      {label}
    </button>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, rgba(34,211,238,0.18), transparent 28%), linear-gradient(180deg, #eef6ff 0%, #f8fbff 46%, #f4f7fb 100%)",
  padding: "24px 16px 40px",
  position: "relative",
  overflowX: "hidden",
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
  pointerEvents: "none",
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
  pointerEvents: "none",
};

const heroStyle: CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.94) 0%, rgba(241,248,255,0.96) 100%)",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 32,
  padding: 24,
  boxShadow: "0 24px 80px rgba(15,23,42,0.10)",
  backdropFilter: "blur(12px)",
  marginBottom: 18,
};

const heroTopRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const heroTopButtons: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const topButtonStyle: CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 14px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.20)",
  color: "#123047",
  fontSize: 13,
  fontWeight: 800,
  boxSizing: "border-box",
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
  maxWidth: "100%",
};

const heroGrid: CSSProperties = {
  display: "grid",
  gap: 18,
  marginTop: 18,
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 5vw, 46px)",
  lineHeight: 1.08,
  color: "#0f172a",
  fontWeight: 900,
  letterSpacing: -1.2,
  wordBreak: "break-word",
};

const heroText: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.7,
  color: "#475569",
  maxWidth: 760,
  wordBreak: "break-word",
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
  maxWidth: "100%",
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
  minWidth: 0,
};

const heroSideNumber: CSSProperties = {
  fontSize: 38,
  fontWeight: 900,
  color: "#67e8f9",
  letterSpacing: 1,
  lineHeight: 1,
};

const heroSideLabel: CSSProperties = {
  fontSize: 26,
  fontWeight: 900,
  lineHeight: 1.1,
  wordBreak: "break-word",
};

const heroSideText: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
  wordBreak: "break-word",
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  marginBottom: 18,
};

const summaryCardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 24,
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 20px 48px rgba(15,23,42,0.07)",
  padding: 18,
  backdropFilter: "blur(10px)",
  minWidth: 0,
};

const summaryCardTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#0891b2",
  marginBottom: 10,
  wordBreak: "break-word",
};

const summaryCardValueStyle: CSSProperties = {
  fontSize: 34,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1,
  marginBottom: 8,
};

const summaryCardNoteStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.7,
  color: "#64748b",
  wordBreak: "break-word",
};

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 30,
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 24px 60px rgba(15,23,42,0.08)",
  padding: 24,
  backdropFilter: "blur(12px)",
  minWidth: 0,
};

const toolbarStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 18,
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
  wordBreak: "break-word",
};

const sectionText: CSSProperties = {
  margin: "10px 0 0",
  fontSize: 14,
  lineHeight: 1.7,
  color: "#64748b",
  maxWidth: 760,
  wordBreak: "break-word",
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 54,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  padding: "14px 16px",
  fontSize: 15,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
};

const filterRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginBottom: 18,
};

const filterButtonStyle: CSSProperties = {
  minHeight: 38,
  padding: "9px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
  background: "#ffffff",
  boxSizing: "border-box",
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
  textAlign: "center",
  padding: 20,
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

const linkCardStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
  minWidth: 0,
};

const itemCardStyle: CSSProperties = {
  borderRadius: 24,
  border: "1px solid rgba(148,163,184,0.16)",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  padding: 18,
  boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
  cursor: "pointer",
  minWidth: 0,
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
  wordBreak: "break-word",
};

const itemMetaLineStyle: CSSProperties = {
  fontSize: 13,
  color: "#64748b",
  lineHeight: 1.6,
  wordBreak: "break-word",
};

const statusPillStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "8px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  boxSizing: "border-box",
};

const detailsGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  minWidth: 0,
};

const detailCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.14)",
  background: "#ffffff",
  padding: 14,
  minWidth: 0,
};

const detailLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#0891b2",
  marginBottom: 6,
  wordBreak: "break-word",
};

const detailValueStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.6,
  color: "#0f172a",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

