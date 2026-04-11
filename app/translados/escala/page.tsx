"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TransferStatus =
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Concluído"
  | "Reagendado";

type RiskLevel = "Baixo" | "Médio" | "Alto";

type Transfer = {
  id: string;
  motorista: string;
  cliente: string;
  empresa: string;
  locadora: string;
  origem: string;
  destino: string;
  horario: string;
  status: TransferStatus;
  risco: RiskLevel;
  motoristaReserva: string;
  veiculoReserva: string;
  observacao: string;
  origemBase?: "Base padrão" | "Base local";
};

type PersistedTransfer = {
  id: string;
  empresa: string;
  locadora: string;
  cliente: string;
  motorista: string;
  motoristaReserva: string;
  veiculoReserva: string;
  aeroporto: string;
  origem: string;
  destino: string;
  horarioPrevisto: string;
  horarioAtualizado: string;
  tempoEstimadoMin: number;
  acrescimoTransitoMin: number;
  risco: RiskLevel;
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  status: TransferStatus;
  observacao: string;
  createdAt: string;
};

const STORAGE_KEY = "aurora_motoristas_translados";

const data: Transfer[] = [
  {
    id: "TRA-0001",
    motorista: "Carlos Henrique",
    cliente: "Executivo Nacional",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    origem: "Confins",
    destino: "Savassi",
    horario: "08:45",
    status: "Reagendado",
    risco: "Médio",
    motoristaReserva: "João Pedro",
    veiculoReserva: "Corolla Executivo - RES-01",
    observacao: "Atraso de voo. Manter operação atenta ao desembarque.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0002",
    motorista: "Carlos Henrique",
    cliente: "Empresa XPTO",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    origem: "Savassi",
    destino: "Confins",
    horario: "10:10",
    status: "Agendado",
    risco: "Baixo",
    motoristaReserva: "Maria Fernanda",
    veiculoReserva: "Spin Executiva - RES-02",
    observacao: "Saída confirmada sem intercorrências até o momento.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0003",
    motorista: "João Pedro",
    cliente: "Operação VIP",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    origem: "Confins",
    destino: "Lourdes",
    horario: "14:20",
    status: "Aguardando passageiro",
    risco: "Médio",
    motoristaReserva: "Carlos Henrique",
    veiculoReserva: "Onix Sedan - RES-03",
    observacao: "Motorista no ponto aguardando desembarque.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0004",
    motorista: "Maria Fernanda",
    cliente: "Delegação Internacional",
    empresa: "Grupo Executivo Mobilidade",
    locadora: "Locadora Premium BH",
    origem: "Hotel Ouro Minas",
    destino: "Confins",
    horario: "11:00",
    status: "Agendado",
    risco: "Baixo",
    motoristaReserva: "João Pedro",
    veiculoReserva: "Tracker Executiva - RES-04",
    observacao: "Bagagem extra confirmada. Operação estável.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0005",
    motorista: "Maria Fernanda",
    cliente: "Cliente Aero Business",
    empresa: "Grupo Executivo Mobilidade",
    locadora: "Locadora Premium BH",
    origem: "Confins",
    destino: "Belvedere",
    horario: "11:15",
    status: "Agendado",
    risco: "Alto",
    motoristaReserva: "Carlos Henrique",
    veiculoReserva: "Corolla Cross - RES-05",
    observacao: "Janela curta entre atendimentos. Avaliar reserva preventiva.",
    origemBase: "Base padrão",
  },
];

function timeToMinutes(value: string) {
  const normalized = value.trim();
  const timePart = normalized.includes(" ")
    ? normalized.split(" ").pop() || normalized
    : normalized;

  const [hour, minute] = timePart.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return 0;
  return hour * 60 + minute;
}

function safeReadStorage(): Transfer[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(Boolean)
      .map((item: PersistedTransfer) => ({
        id: item.id,
        motorista: item.motorista,
        cliente: item.cliente,
        empresa: item.empresa,
        locadora: item.locadora,
        origem: item.origem,
        destino: item.destino,
        horario: item.horarioAtualizado || item.horarioPrevisto,
        status: item.status,
        risco: item.risco,
        motoristaReserva: item.motoristaReserva,
        veiculoReserva: item.veiculoReserva,
        observacao: item.observacao,
        origemBase: "Base local" as const,
      }));
  } catch {
    return [];
  }
}

function getStatusStyle(status: TransferStatus): React.CSSProperties {
  if (status === "Agendado") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  if (status === "Em deslocamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (status === "Aguardando passageiro") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  if (status === "Concluído") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  return {
    background: "rgba(168, 85, 247, 0.12)",
    color: "#7e22ce",
    border: "1px solid rgba(168, 85, 247, 0.22)",
  };
}

function getRiskStyle(risk: RiskLevel): React.CSSProperties {
  if (risk === "Baixo") {
    return {
      background: "rgba(16, 185, 129, 0.10)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.18)",
    };
  }

  if (risk === "Médio") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.20)",
  };
}

export default function EscalaPage() {
  const [search, setSearch] = useState("");
  const [localData, setLocalData] = useState<Transfer[]>([]);

  useEffect(() => {
    const saved = safeReadStorage();
    setLocalData(saved);
  }, []);

  const mergedData = useMemo(() => {
    return [...localData, ...data];
  }, [localData]);

  const grouped = useMemo(() => {
    const filtered = mergedData.filter((item) =>
      `${item.motorista} ${item.cliente} ${item.empresa} ${item.locadora} ${item.origem} ${item.destino} ${item.status} ${item.risco} ${item.motoristaReserva} ${item.veiculoReserva} ${item.origemBase ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const groupedByDriver: Record<string, Transfer[]> = {};

    filtered.forEach((item) => {
      if (!groupedByDriver[item.motorista]) {
        groupedByDriver[item.motorista] = [];
      }
      groupedByDriver[item.motorista].push(item);
    });

    Object.keys(groupedByDriver).forEach((driver) => {
      groupedByDriver[driver].sort(
        (a, b) => timeToMinutes(a.horario) - timeToMinutes(b.horario)
      );
    });

    return groupedByDriver;
  }, [mergedData, search]);

  const stats = useMemo(() => {
    const flat = Object.values(grouped).flat();

    return {
      motoristas: Object.keys(grouped).length,
      atendimentos: flat.length,
      riscoAlto: flat.filter((item) => item.risco === "Alto").length,
      reagendados: flat.filter((item) => item.status === "Reagendado").length,
      locais: flat.filter((item) => item.origemBase === "Base local").length,
    };
  }, [grouped]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • ESCALA</div>
              <h1 style={styles.heroTitle}>
                Escala operacional por motorista com risco, reserva e base integrada
              </h1>
              <p style={styles.heroText}>
                Esta tela agora junta a escala padrão com os translados criados
                no cadastro novo, permitindo enxergar a operação do dia por motorista
                sem perder risco, contingência e origem do item.
              </p>

              <div style={styles.heroActions}>
                <Link href="/translados" style={styles.secondaryButton}>
                  Voltar translados
                </Link>
                <Link href="/operacao" style={styles.primaryButton}>
                  Ir para operação
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>ESCALA DO DIA</span>
              <h2 style={styles.sideTitle}>Leitura rápida para segunda pesada</h2>
              <p style={styles.sideText}>
                Aqui você vê quem está com carga alta, onde há risco maior e qual
                reserva pode ser acionada antes de estourar a operação, agora também
                com base local integrada.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Por motorista</div>
                <div style={styles.sidePill}>Por horário</div>
                <div style={styles.sidePill}>Com contingência</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta escala já lê a base local
            e integra os novos translados automaticamente.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Motoristas visíveis</span>
            <strong style={styles.statValue}>{stats.motoristas}</strong>
            <span style={styles.statDetail}>Escala agrupada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Atendimentos</span>
            <strong style={styles.statValue}>{stats.atendimentos}</strong>
            <span style={styles.statDetail}>Base do dia</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Risco alto</span>
            <strong style={styles.statValue}>{stats.riscoAlto}</strong>
            <span style={styles.statDetail}>Atenção imediata</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Reagendados</span>
            <strong style={styles.statValue}>{stats.reagendados}</strong>
            <span style={styles.statDetail}>Fluxo alterado</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Base local integrada</span>
            <strong style={styles.statValue}>{stats.locais}</strong>
            <span style={styles.statDetail}>Itens vindos de /translados/novo</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.headerRow}>
          <div>
            <span style={styles.sectionEyebrow}>VISÃO OPERACIONAL</span>
            <h2 style={styles.sectionTitle}>Escala de translados</h2>
          </div>

          <input
            placeholder="Buscar motorista, cliente, empresa, rota, risco ou reserva..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <section style={styles.grid}>
          {Object.keys(grouped).length === 0 && (
            <div style={styles.empty}>Nenhum resultado encontrado</div>
          )}

          {Object.entries(grouped).map(([motorista, lista]) => {
            const totalMotorista = lista.length;
            const riscoAltoMotorista = lista.filter(
              (item) => item.risco === "Alto"
            ).length;

            return (
              <div key={motorista} style={styles.card}>
                <div style={styles.driverHeader}>
                  <div>
                    <h3 style={styles.driver}>{motorista}</h3>
                    <p style={styles.driverMeta}>
                      {totalMotorista} atendimento(s) • {riscoAltoMotorista} em risco alto
                    </p>
                  </div>

                  <span
                    style={{
                      ...styles.driverBadge,
                      ...(riscoAltoMotorista > 0 ? getRiskStyle("Alto") : getRiskStyle("Baixo")),
                    }}
                  >
                    {riscoAltoMotorista > 0 ? "Atenção" : "Estável"}
                  </span>
                </div>

                {lista.map((item, index) => {
                  const next = lista[index + 1];
                  const conflito =
                    next &&
                    timeToMinutes(next.horario) - timeToMinutes(item.horario) <= 20;

                  return (
                    <div
                      key={`${item.origemBase}-${item.id}`}
                      style={{
                        ...styles.item,
                        borderColor:
                          item.risco === "Alto"
                            ? "rgba(239, 68, 68, 0.35)"
                            : conflito
                            ? "rgba(245, 158, 11, 0.35)"
                            : "rgba(226, 232, 240, 1)",
                      }}
                    >
                      <div style={styles.rowTop}>
                        <div>
                          <div style={styles.metaRow}>
                            <span
                              style={
                                item.origemBase === "Base local"
                                  ? styles.localTag
                                  : styles.defaultTag
                              }
                            >
                              {item.origemBase ?? "Base padrão"}
                            </span>
                          </div>

                          <strong style={styles.time}>{item.horario}</strong>
                        </div>

                        <div style={styles.badgeWrap}>
                          <span style={{ ...styles.statusBadge, ...getStatusStyle(item.status) }}>
                            {item.status}
                          </span>
                          <span style={{ ...styles.statusBadge, ...getRiskStyle(item.risco) }}>
                            Risco {item.risco}
                          </span>
                        </div>
                      </div>

                      <div style={styles.route}>
                        {item.origem} → {item.destino}
                      </div>

                      <div style={styles.client}>{item.cliente}</div>

                      <div style={styles.metaText}>
                        {item.empresa} • {item.locadora}
                      </div>

                      <div style={styles.reserveBox}>
                        <div style={styles.reserveItem}>
                          <span style={styles.reserveLabel}>Motorista reserva</span>
                          <strong style={styles.reserveValue}>{item.motoristaReserva}</strong>
                        </div>

                        <div style={styles.reserveItem}>
                          <span style={styles.reserveLabel}>Veículo reserva</span>
                          <strong style={styles.reserveValue}>{item.veiculoReserva}</strong>
                        </div>
                      </div>

                      <div style={styles.note}>{item.observacao}</div>

                      {conflito ? (
                        <div style={styles.alert}>
                          ⚠️ Janela curta entre atendimentos. Avaliar apoio ou redistribuição.
                        </div>
                      ) : null}

                      {item.risco === "Alto" ? (
                        <div style={styles.alertDanger}>
                          🚨 Risco alto. Deixar reserva pronta antes da execução.
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    paddingBottom: 56,
    background:
      "linear-gradient(180deg, #f6fbff 0%, #edf8ff 34%, #ffffff 72%, #f8fcff 100%)",
  },

  heroSection: {
    position: "relative",
    overflow: "hidden",
    padding: "32px 20px 18px",
  },

  glowOne: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 340,
    height: 340,
    borderRadius: "50%",
    background: "rgba(0, 194, 255, 0.18)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  glowTwo: {
    position: "absolute",
    top: -80,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: "50%",
    background: "rgba(37, 99, 235, 0.16)",
    filter: "blur(58px)",
    pointerEvents: "none",
  },

  heroCard: {
    position: "relative",
    maxWidth: 1240,
    margin: "0 auto",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    borderRadius: 30,
    padding: "28px 22px 24px",
    boxShadow: "0 24px 60px rgba(14, 165, 233, 0.10)",
    backdropFilter: "blur(12px)",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.15fr) minmax(300px, 0.85fr)",
    gap: 18,
    alignItems: "start",
  },

  heroLeft: {
    minWidth: 0,
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
    padding: "0 16px",
    borderRadius: 999,
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0c4a6e",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(1.9rem, 3.7vw, 3.5rem)",
    lineHeight: 1.03,
    fontWeight: 950,
    letterSpacing: "-0.05em",
    maxWidth: 860,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 860,
    color: "#334155",
    fontSize: 16,
    lineHeight: 1.8,
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 26,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.20)",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    padding: "0 22px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#0f172a",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(125, 211, 252, 0.34)",
  },

  heroRightCard: {
    borderRadius: 26,
    padding: 22,
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    border: "1px solid rgba(125, 211, 252, 0.30)",
    boxShadow: "0 18px 44px rgba(8, 47, 73, 0.08)",
  },

  sideKicker: {
    display: "inline-block",
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
    marginBottom: 10,
  },

  sideTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  sideText: {
    marginTop: 12,
    marginBottom: 0,
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },

  sidePills: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  sidePill: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.84)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.55,
  },

  noticeBox: {
    marginTop: 20,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(6, 182, 212, 0.08)",
    border: "1px solid rgba(6, 182, 212, 0.16)",
    color: "#164e63",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 700,
  },

  statsSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "8px 20px 4px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 18,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
  },

  statLabel: {
    display: "block",
    color: "#475569",
    fontSize: 14,
    fontWeight: 700,
  },

  statValue: {
    display: "block",
    marginTop: 8,
    color: "#0f172a",
    fontSize: 30,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },

  statDetail: {
    display: "block",
    marginTop: 8,
    color: "#0891b2",
    fontSize: 13,
    fontWeight: 700,
  },

  contentSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "18px 20px 0",
  },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 18,
  },

  sectionEyebrow: {
    display: "inline-block",
    marginBottom: 8,
    color: "#0891b2",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(1.5rem, 2.6vw, 2.3rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  searchInput: {
    minHeight: 48,
    minWidth: 320,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#ffffff",
    borderRadius: 22,
    padding: 18,
    border: "1px solid rgba(125, 211, 252, 0.22)",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
  },

  driverHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 14,
  },

  driver: {
    margin: 0,
    color: "#0f172a",
    fontSize: 20,
    fontWeight: 900,
  },

  driverMeta: {
    marginTop: 6,
    marginBottom: 0,
    color: "#64748b",
    fontSize: 13,
    fontWeight: 700,
  },

  driverBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  item: {
    border: "1px solid rgba(226, 232, 240, 1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    background: "#ffffff",
  },

  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },

  metaRow: {
    display: "flex",
    gap: 8,
    marginBottom: 8,
  },

  localTag: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    border: "1px solid rgba(37, 99, 235, 0.18)",
    fontSize: 12,
    fontWeight: 800,
  },

  defaultTag: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    fontSize: 12,
    fontWeight: 800,
  },

  time: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 900,
  },

  badgeWrap: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  route: {
    marginTop: 10,
    color: "#0f172a",
    fontWeight: 900,
    fontSize: 16,
  },

  client: {
    marginTop: 6,
    color: "#334155",
    fontSize: 14,
    fontWeight: 800,
  },

  metaText: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.6,
  },

  reserveBox: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 8,
    marginTop: 12,
  },

  reserveItem: {
    padding: 10,
    borderRadius: 12,
    background: "rgba(248, 250, 252, 1)",
    border: "1px solid rgba(226, 232, 240, 1)",
  },

  reserveLabel: {
    display: "block",
    color: "#64748b",
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    marginBottom: 4,
  },

  reserveValue: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: 800,
    lineHeight: 1.5,
  },

  note: {
    marginTop: 12,
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.6,
    fontWeight: 700,
  },

  alert: {
    marginTop: 10,
    color: "#b45309",
    fontSize: 12,
    fontWeight: 800,
    background: "rgba(245, 158, 11, 0.10)",
    border: "1px solid rgba(245, 158, 11, 0.18)",
    borderRadius: 12,
    padding: "10px 12px",
  },

  alertDanger: {
    marginTop: 10,
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: 800,
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    borderRadius: 12,
    padding: "10px 12px",
  },

  empty: {
    textAlign: "center",
    padding: 40,
    color: "#64748b",
    background: "#ffffff",
    borderRadius: 18,
    border: "1px dashed rgba(125, 211, 252, 0.34)",
    fontWeight: 700,
  },
};