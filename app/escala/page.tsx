"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ScaleRisk = "Baixo" | "MÃ©dio" | "Alto";
type ScaleStatus =
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Reagendado";

type ScaleOrigin = "Base padrÃ£o" | "Base local";

type ScaleItem = {
  id: string;
  motorista: string;
  cliente: string;
  empresa: string;
  locadora: string;
  dataHora: string;
  status: ScaleStatus;
  risco: ScaleRisk;
  rota: string;
  origemBase: ScaleOrigin;
  motoristaReserva: string;
  veiculoReserva: string;
  observacao: string;
  telefoneMotorista: string;
  telefoneCliente: string;
};

function formatPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function openWhatsApp(phone: string, message: string) {
  if (typeof window === "undefined") return;
  const clean = formatPhone(phone);
  if (!clean) return;
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function buildScaleMessage(item: ScaleItem) {
  return `ðŸš— Aurora Motoristas

Atendimento: ${item.id}
Motorista: ${item.motorista}
Cliente: ${item.cliente}
Rota: ${item.rota}
Data/Hora: ${item.dataHora}
Status: ${item.status}
Risco: ${item.risco}

Mensagem operacional enviada pela Aurora para acompanhamento Ambiente seguro do atendimento.`;
}

function buildLocationRequest(item: ScaleItem) {
  return `ðŸ“ Aurora Motoristas

Atendimento: ${item.id}
Rota: ${item.rota}
Data/Hora: ${item.dataHora}

Se vocÃª concordar e estiver em atendimento, compartilhe sua localizaÃ§Ã£o atual para acompanhamento operacional desta corrida.

Esse compartilhamento deve ocorrer apenas durante a execuÃ§Ã£o do serviÃ§o.`;
}

function getStatusStyle(status: ScaleStatus): React.CSSProperties {
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

  if (status === "Reagendado") {
    return {
      background: "rgba(168, 85, 247, 0.12)",
      color: "#7e22ce",
      border: "1px solid rgba(168, 85, 247, 0.22)",
    };
  }

  return {
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0e7490",
    border: "1px solid rgba(6, 182, 212, 0.18)",
  };
}

function getRiskStyle(risk: ScaleRisk): React.CSSProperties {
  if (risk === "Alto") {
    return {
      background: "rgba(239, 68, 68, 0.12)",
      color: "#b91c1c",
      border: "1px solid rgba(239, 68, 68, 0.22)",
    };
  }

  if (risk === "MÃ©dio") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
  };
}

function getOriginStyle(origin: ScaleOrigin): React.CSSProperties {
  if (origin === "Base local") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

const scaleItems: ScaleItem[] = [
  {
    id: "ESC-LOCAL-0002",
    motorista: "Pedro Paulo",
    cliente: "JoÃ£o Bosco",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    dataHora: "10/04/2026 08:30",
    status: "Em deslocamento",
    risco: "Alto",
    rota: "Confins â†’ Belvedere",
    origemBase: "Base local",
    motoristaReserva: "NÃ£o informado",
    veiculoReserva: "Corolla",
    observacao: "Voo no horÃ¡rio. Janela curta entre atendimentos. Avaliar apoio ou redistribuiÃ§Ã£o.",
    telefoneMotorista: "5531990001005",
    telefoneCliente: "5531880002009",
  },
  {
    id: "ESC-LOCAL-0001",
    motorista: "Pedro Paulo",
    cliente: "JoÃ£o Silva",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    dataHora: "10/04/2026 08:30",
    status: "Agendado",
    risco: "MÃ©dio",
    rota: "Aeroporto â†’ Belvedere",
    origemBase: "Base local",
    motoristaReserva: "Kenedy Silva",
    veiculoReserva: "Corolla",
    observacao: "Parada por causa de obras.",
    telefoneMotorista: "5531990001005",
    telefoneCliente: "5531880002010",
  },
  {
    id: "ESC-0001",
    motorista: "Carlos Henrique",
    cliente: "Executivo Nacional",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    dataHora: "10/04/2026 08:45",
    status: "Reagendado",
    risco: "MÃ©dio",
    rota: "Confins â†’ Savassi",
    origemBase: "Base padrÃ£o",
    motoristaReserva: "JoÃ£o Pedro",
    veiculoReserva: "Corolla Executivo - RES-01",
    observacao: "Atraso de voo. Manter operaÃ§Ã£o atenta ao desembarque.",
    telefoneMotorista: "5531990001002",
    telefoneCliente: "5531880002006",
  },
  {
    id: "ESC-0002",
    motorista: "Carlos Henrique",
    cliente: "Empresa XPTO",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    dataHora: "10/04/2026 10:10",
    status: "Agendado",
    risco: "Baixo",
    rota: "Savassi â†’ Confins",
    origemBase: "Base padrÃ£o",
    motoristaReserva: "Maria Fernanda",
    veiculoReserva: "Spin Executiva - RES-02",
    observacao: "SaÃ­da confirmada sem intercorrÃªncias atÃ© o momento.",
    telefoneMotorista: "5531990001002",
    telefoneCliente: "5531880002020",
  },
  {
    id: "ESC-0003",
    motorista: "JoÃ£o Pedro",
    cliente: "OperaÃ§Ã£o VIP",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    dataHora: "10/04/2026 14:20",
    status: "Aguardando passageiro",
    risco: "MÃ©dio",
    rota: "Confins â†’ Lourdes",
    origemBase: "Base padrÃ£o",
    motoristaReserva: "Carlos Henrique",
    veiculoReserva: "Onix Sedan - RES-03",
    observacao: "Motorista no ponto aguardando desembarque.",
    telefoneMotorista: "5531990001003",
    telefoneCliente: "5531880002008",
  },
  {
    id: "ESC-0004",
    motorista: "Maria Fernanda",
    cliente: "DelegaÃ§Ã£o Internacional",
    empresa: "Grupo Executivo Mobilidade",
    locadora: "Locadora Premium BH",
    dataHora: "10/04/2026 11:00",
    status: "Agendado",
    risco: "Baixo",
    rota: "Hotel Ouro Minas â†’ Confins",
    origemBase: "Base padrÃ£o",
    motoristaReserva: "JoÃ£o Pedro",
    veiculoReserva: "Tracker Executiva - RES-04",
    observacao: "Bagagem extra confirmada. OperaÃ§Ã£o estÃ¡vel.",
    telefoneMotorista: "5531990001004",
    telefoneCliente: "5531880002007",
  },
  {
    id: "ESC-0005",
    motorista: "Maria Fernanda",
    cliente: "Cliente Aero Business",
    empresa: "Grupo Executivo Mobilidade",
    locadora: "Locadora Premium BH",
    dataHora: "10/04/2026 11:15",
    status: "Agendado",
    risco: "Alto",
    rota: "Confins â†’ Belvedere",
    origemBase: "Base padrÃ£o",
    motoristaReserva: "Carlos Henrique",
    veiculoReserva: "Corolla Cross - RES-05",
    observacao: "Janela curta entre atendimentos. Avaliar reserva preventiva.",
    telefoneMotorista: "5531990001004",
    telefoneCliente: "5531880002021",
  },
];

export default function EscalaPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return scaleItems.filter((item) =>
      `${item.motorista} ${item.cliente} ${item.empresa} ${item.rota} ${item.risco} ${item.motoristaReserva} ${item.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const grouped = useMemo(() => {
    const byDriver = new Map<string, ScaleItem[]>();

    for (const item of filtered) {
      const current = byDriver.get(item.motorista) ?? [];
      current.push(item);
      byDriver.set(item.motorista, current);
    }

    return Array.from(byDriver.entries()).map(([motorista, items]) => ({
      motorista,
      items,
      total: items.length,
      riscoAlto: items.filter((item) => item.risco === "Alto").length,
    }));
  }, [filtered]);

  const stats = useMemo(() => {
    return {
      motoristas: grouped.length,
      atendimentos: filtered.length,
      riscoAlto: filtered.filter((item) => item.risco === "Alto").length,
      reagendados: filtered.filter((item) => item.status === "Reagendado").length,
      locais: filtered.filter((item) => item.origemBase === "Base local").length,
    };
  }, [filtered, grouped]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ ESCALA</div>
              <h1 style={styles.heroTitle}>
                Escala operacional por motorista com risco, reserva e base integrada
              </h1>
              <p style={styles.heroText}>
                Esta tela junta a escala padrÃ£o com os translados criados no
                cadastro novo, permitindo enxergar a operaÃ§Ã£o do dia por motorista
                sem perder risco, contingÃªncia e origem do item.
              </p>

              <div style={styles.heroActions}>
                <Link href="/translados" style={styles.secondaryButton}>
                  Voltar translados
                </Link>

                <Link href="/operacao" style={styles.primaryButton}>
                  Ir para operaÃ§Ã£o
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>ESCALA DO DIA</span>
              <h2 style={styles.sideTitle}>Leitura rÃ¡pida para segunda pesada</h2>
              <p style={styles.sideText}>
                Aqui vocÃª vÃª quem estÃ¡ com carga alta, onde hÃ¡ risco maior e qual
                reserva pode ser acionada antes de estourar a operaÃ§Ã£o, agora
                tambÃ©m com base local integrada.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Por motorista</div>
                <div style={styles.sidePill}>Por horÃ¡rio</div>
                <div style={styles.sidePill}>Com contingÃªncia</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualizaÃ§Ã£o. Esta escala jÃ¡ lÃª a base local e
            integra os novos translados automaticamente.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Motoristas visÃ­veis</span>
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
            <span style={styles.statDetail}>AtenÃ§Ã£o imediata</span>
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
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.scaleCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>VISÃƒO OPERACIONAL</span>
                  <h2 style={styles.sectionTitle}>Escala de translados</h2>
                </div>

                <input
                  placeholder="Buscar motorista, cliente, empresa, rota, risco ou reserva..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.groupList}>
                {grouped.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum atendimento encontrado para este filtro.
                  </div>
                ) : (
                  grouped.map((group) => (
                    <article key={group.motorista} style={styles.driverCard}>
                      <div style={styles.driverHeader}>
                        <div>
                          <h3 style={styles.driverTitle}>{group.motorista}</h3>
                          <p style={styles.driverSubline}>
                            {group.total} atendimento(s) â€¢ {group.riscoAlto} em risco alto
                          </p>
                        </div>

                        <span
                          style={{
                            ...styles.driverBadge,
                            ...(group.riscoAlto > 0 ? styles.driverAttention : styles.driverStable),
                          }}
                        >
                          {group.riscoAlto > 0 ? "AtenÃ§Ã£o" : "EstÃ¡vel"}
                        </span>
                      </div>

                      <div style={styles.itemList}>
                        {group.items.map((item) => (
                          <div key={item.id} style={styles.itemCard}>
                            <div style={styles.itemTop}>
                              <div style={styles.metaRow}>
                                <span style={{ ...styles.originTag, ...getOriginStyle(item.origemBase) }}>
                                  {item.origemBase}
                                </span>
                                <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                                  {item.status}
                                </span>
                                <span style={{ ...styles.badge, ...getRiskStyle(item.risco) }}>
                                  Risco {item.risco}
                                </span>
                              </div>

                              <h4 style={styles.routeTitle}>{item.rota}</h4>
                              <p style={styles.routeSubline}>
                                {item.dataHora} â€¢ {item.cliente}
                              </p>
                              <p style={styles.routeSubline}>
                                {item.empresa} â€¢ {item.locadora}
                              </p>
                            </div>

                            <div style={styles.itemGrid}>
                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>Motorista reserva</span>
                                <strong style={styles.dataValue}>{item.motoristaReserva}</strong>
                              </div>

                              <div style={styles.dataItem}>
                                <span style={styles.dataLabel}>VeÃ­culo reserva</span>
                                <strong style={styles.dataValue}>{item.veiculoReserva}</strong>
                              </div>

                              <div style={styles.dataItemWide}>
                                <span style={styles.dataLabel}>ObservaÃ§Ã£o</span>
                                <strong style={styles.dataValue}>{item.observacao}</strong>
                              </div>
                            </div>

                            {item.risco === "Alto" ? (
                              <div style={styles.alertBox}>
                                ðŸš¨ Risco alto. Deixar reserva pronta antes da execuÃ§Ã£o.
                              </div>
                            ) : null}

                            <div style={styles.communicationRow}>
                              <button
                                type="button"
                                style={styles.whatsDriverButton}
                                onClick={() =>
                                  openWhatsApp(
                                    item.telefoneMotorista,
                                    buildScaleMessage(item)
                                  )
                                }
                              >
                                Motorista
                              </button>

                              <button
                                type="button"
                                style={styles.whatsClientButton}
                                onClick={() =>
                                  openWhatsApp(
                                    item.telefoneCliente,
                                    buildScaleMessage(item)
                                  )
                                }
                              >
                                Cliente
                              </button>

                              <button
                                type="button"
                                style={styles.locationButton}
                                onClick={() =>
                                  openWhatsApp(
                                    item.telefoneMotorista,
                                    buildLocationRequest(item)
                                  )
                                }
                              >
                                LocalizaÃ§Ã£o
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>COMUNICAÃ‡ÃƒO SEGURA</span>
              <h2 style={styles.sidebarTitle}>Contato pela escala</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Mensagem com contexto</strong>
                  <span style={styles.ruleItemText}>
                    O contato sai com motorista, cliente, rota, status e data.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>LocalizaÃ§Ã£o com consentimento</strong>
                  <span style={styles.ruleItemText}>
                    A solicitaÃ§Ã£o Ã© operacional e sÃ³ deve ser usada durante o atendimento.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Menos evasÃ£o</strong>
                  <span style={styles.ruleItemText}>
                    A conversa parte da escala e continua vinculada ao atendimento.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÃ” AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio Ã  escala</h2>
              <p style={styles.sidebarTextDark}>
                O RobÃ´ Aurora poderÃ¡ comparar risco, janela entre atendimentos,
                reservas disponÃ­veis e pontos onde a operaÃ§Ã£o precisa de reforÃ§o.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler risco alto</div>
                <div style={styles.robotItem}>Sugerir reserva</div>
                <div style={styles.robotItem}>Apontar conflito</div>
                <div style={styles.robotItem}>Ajudar na redistribuiÃ§Ã£o</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÃ‡ÃƒO</span>
              <h2 style={styles.sidebarTitle}>PrÃ³ximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/translados/novo" style={styles.navItem}>
                  Novo translado
                </Link>
                <Link href="/translados" style={styles.navItem}>
                  Abrir translados
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operaÃ§Ã£o
                </Link>
                <Link href="/historico" style={styles.navItem}>
                  Abrir histÃ³rico
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f6fbff 0%, #edf8ff 34%, #ffffff 72%, #f8fcff 100%)",
    color: "#0f172a",
    paddingBottom: 56,
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

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.85fr)",
    gap: 18,
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
    minWidth: 0,
  },

  scaleCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
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
    fontSize: "clamp(1.5rem, 2.6vw, 2.3rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  searchInput: {
    minHeight: 46,
    minWidth: 320,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  groupList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  driverCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  driverHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 14,
  },

  driverTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 900,
  },

  driverSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  driverBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 32,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
  },

  driverAttention: {
    background: "rgba(245, 158, 11, 0.12)",
    color: "#b45309",
    border: "1px solid rgba(245, 158, 11, 0.22)",
  },

  driverStable: {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    border: "1px solid rgba(16, 185, 129, 0.22)",
  },

  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  itemCard: {
    borderRadius: 18,
    padding: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
  },

  itemTop: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  metaRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 8,
  },

  originTag: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  routeTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
  },

  routeSubline: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },

  itemGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 14,
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
  },

  dataItemWide: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    gridColumn: "1 / -1",
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  dataValue: {
    color: "#0f172a",
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 800,
  },

  alertBox: {
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.20)",
    color: "#991b1b",
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.6,
  },

  communicationRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },

  whatsDriverButton: {
    border: "none",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    boxShadow: "0 10px 20px rgba(34, 197, 94, 0.18)",
  },

  whatsClientButton: {
    border: "none",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    boxShadow: "0 10px 20px rgba(6, 182, 212, 0.18)",
  },

  locationButton: {
    border: "none",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    boxShadow: "0 10px 20px rgba(124, 58, 237, 0.18)",
  },

  emptyState: {
    padding: 18,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px dashed rgba(125, 211, 252, 0.34)",
    color: "#475569",
    fontSize: 15,
    fontWeight: 700,
  },

  infoCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  ruleItem: {
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },

  ruleItemTitle: {
    display: "block",
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
  },

  ruleItemText: {
    display: "block",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.65,
    color: "#475569",
  },

  darkCard: {
    background: "linear-gradient(135deg, #082f49 0%, #0f172a 58%, #172554 100%)",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
  },

  robotTag: {
    display: "inline-block",
    marginBottom: 10,
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.08em",
  },

  sidebarTitleDark: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#ffffff",
  },

  sidebarTextDark: {
    marginTop: 12,
    marginBottom: 0,
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 15,
  },

  robotList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 18,
  },

  robotItem: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },

  navCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },

  navItem: {
    display: "block",
    textDecoration: "none",
    color: "#0f172a",
    fontWeight: 800,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
  },
};
