"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type DriverStatus = "disponivel" | "ocupado";
type OfferStatus = "rascunho" | "enviado" | "fechado";

type Driver = {
  id: string;
  nome: string;
  telefone: string;
  status: DriverStatus;
  base: string;
  cidade: string;
  categoria: string;
};

type DriverDecision = "aguardando" | "aceitou" | "recusou";

type OfferLog = {
  driverId: string;
  driverName: string;
  decision: DriverDecision;
  respondedAt: string | null;
};

const initialDrivers: Driver[] = [
  {
    id: "MOT-0001",
    nome: "Pedro Paulo",
    telefone: "5531990001005",
    status: "disponivel",
    base: "Aurora Frotas Executivas",
    cidade: "Belo Horizonte",
    categoria: "Executivo / translado",
  },
  {
    id: "MOT-0002",
    nome: "Carlos Henrique",
    telefone: "5531990001002",
    status: "disponivel",
    base: "Aurora Frotas Executivas",
    cidade: "Belo Horizonte",
    categoria: "Executivo / viagens",
  },
  {
    id: "MOT-0003",
    nome: "João Pedro",
    telefone: "5531990001003",
    status: "disponivel",
    base: "Aurora Frotas Executivas",
    cidade: "Confins",
    categoria: "Aeroporto / translado",
  },
  {
    id: "MOT-0004",
    nome: "Maria Fernanda",
    telefone: "5531990001004",
    status: "ocupado",
    base: "Grupo Executivo Mobilidade",
    cidade: "Belo Horizonte",
    categoria: "Executivo / corporativo",
  },
];

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

function formatNow() {
  return new Date().toLocaleString("pt-BR");
}

function buildOfferMessage(
  driver: Driver,
  service: {
    os: string;
    cliente: string;
    rota: string;
    dataHora: string;
    valor: string;
    observacao: string;
  }
) {
  return `🚗 Aurora Motoristas

Oferta de serviço
OS: ${service.os}
Motorista acionado: ${driver.nome}
Cliente: ${service.cliente}
Rota: ${service.rota}
Data/Hora: ${service.dataHora}
Valor do serviço: ${service.valor}

Observação:
${service.observacao}

Regras:
- Você pode aceitar ou recusar livremente.
- Não há punição por recusa.
- O serviço será fechado com quem der o aceite primeiro.
- Os demais permanecem livres para outros chamados.

Responda com:
ACEITO
ou
RECUSO`;
}

function getDriverStatusStyle(status: DriverStatus): React.CSSProperties {
  if (status === "ocupado") {
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

function getDecisionStyle(decision: DriverDecision): React.CSSProperties {
  if (decision === "aceitou") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (decision === "recusou") {
    return {
      background: "rgba(239, 68, 68, 0.12)",
      color: "#b91c1c",
      border: "1px solid rgba(239, 68, 68, 0.22)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

export default function OfertasPage() {
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [offerStatus, setOfferStatus] = useState<OfferStatus>("rascunho");
  const [closedWith, setClosedWith] = useState<string>("");
  const [feedback, setFeedback] = useState("");
  const [logs, setLogs] = useState<OfferLog[]>([]);
  const [search, setSearch] = useState("");

  const [service, setService] = useState({
    os: "OS-2026-000201",
    cliente: "Cliente Aero Business",
    rota: "Confins → Belvedere",
    dataHora: "10/04/2026 18:20",
    valor: "R$ 320,00",
    observacao:
      "Atendimento executivo com janela curta. Confirmar disponibilidade antes do deslocamento.",
  });

  const filteredDrivers = useMemo(() => {
    return initialDrivers.filter((driver) =>
      `${driver.nome} ${driver.base} ${driver.cidade} ${driver.categoria}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const stats = useMemo(() => {
    const disponiveis = filteredDrivers.filter(
      (driver) => driver.status === "disponivel"
    ).length;
    const ocupados = filteredDrivers.filter(
      (driver) => driver.status === "ocupado"
    ).length;
    const aguardando = logs.filter(
      (item) => item.decision === "aguardando"
    ).length;
    const aceites = logs.filter((item) => item.decision === "aceitou").length;
    const recusas = logs.filter((item) => item.decision === "recusou").length;

    return {
      total: filteredDrivers.length,
      disponiveis,
      ocupados,
      aguardando,
      aceites,
      recusas,
    };
  }, [filteredDrivers, logs]);

  function toggleDriver(id: string) {
    if (offerStatus === "fechado") return;

    setSelectedDrivers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function sendOffer() {
    if (selectedDrivers.length === 0) {
      setFeedback("Selecione pelo menos um motorista para disparar a oferta.");
      return;
    }

    const nextLogs: OfferLog[] = initialDrivers
      .filter((driver) => selectedDrivers.includes(driver.id))
      .map((driver) => ({
        driverId: driver.id,
        driverName: driver.nome,
        decision: "aguardando",
        respondedAt: null,
      }));

    setLogs(nextLogs);
    setOfferStatus("enviado");
    setClosedWith("");
    setFeedback(
      "Oferta enviada. Agora o primeiro aceite válido fecha o serviço."
    );
  }

  function sendWhatsAppToDriver(driver: Driver) {
    openWhatsApp(driver.telefone, buildOfferMessage(driver, service));
  }

  function acceptOffer(driver: Driver) {
    if (offerStatus === "fechado") {
      setFeedback(`Serviço já fechado com ${closedWith}.`);
      return;
    }

    setLogs((current) =>
      current.map((item) => {
        if (item.driverId === driver.id) {
          return {
            ...item,
            decision: "aceitou",
            respondedAt: formatNow(),
          };
        }

        if (item.decision === "aguardando") {
          return {
            ...item,
            decision: "recusou",
            respondedAt: formatNow(),
          };
        }

        return item;
      })
    );

    setOfferStatus("fechado");
    setClosedWith(driver.nome);
    setFeedback(
      `Serviço fechado com ${driver.nome}. Os demais ficaram livres para outros chamados.`
    );
  }

  function refuseOffer(driver: Driver) {
    if (offerStatus === "fechado") {
      setFeedback(`Serviço já fechado com ${closedWith}.`);
      return;
    }

    setLogs((current) =>
      current.map((item) =>
        item.driverId === driver.id
          ? {
              ...item,
              decision: "recusou",
              respondedAt: formatNow(),
            }
          : item
      )
    );

    setFeedback(
      `${driver.nome} recusou sem punição. O serviço segue aberto aos demais.`
    );
  }

  function resetOffer() {
    setSelectedDrivers([]);
    setOfferStatus("rascunho");
    setClosedWith("");
    setLogs([]);
    setFeedback("Oferta reiniciada. Monte um novo disparo.");
  }

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>
                AURORA MOTORISTAS • OFERTA DE SERVIÇO
              </div>

              <h1 style={styles.heroTitle}>
                Disparo inteligente da demanda com fechamento no primeiro aceite
              </h1>

              <p style={styles.heroText}>
                Esta tela prepara a oferta para vários motoristas, respeitando a
                regra de liberdade total de aceite ou recusa, sem punição e com
                fechamento automático para quem confirmar primeiro.
              </p>

              <div style={styles.heroActions}>
                <Link href="/escala" style={styles.secondaryButton}>
                  Voltar para escala
                </Link>

                <Link href="/operacao" style={styles.primaryButton}>
                  Ir para operação
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>REGRA OPERACIONAL</span>
              <h2 style={styles.sideTitle}>Livre aceite e recusa</h2>
              <p style={styles.sideText}>
                O serviço é disparado para vários motoristas, pode ser recusado
                sem punição e será fechado com o primeiro aceite válido.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Sem punição por recusa</div>
                <div style={styles.sidePill}>Primeiro aceite leva</div>
                <div style={styles.sidePill}>Demais ficam livres</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta camada prepara o fluxo seguro
            de oferta para serviços esporádicos, com mais controle da operação e
            menos atravessamento.
          </div>

          {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : null}
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Motoristas no filtro</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base visível</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Disponíveis</span>
            <strong style={styles.statValue}>{stats.disponiveis}</strong>
            <span style={styles.statDetail}>Prontos para receber oferta</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Ocupados</span>
            <strong style={styles.statValue}>{stats.ocupados}</strong>
            <span style={styles.statDetail}>Exigem atenção operacional</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Status da oferta</span>
            <strong style={styles.statValue}>
              {offerStatus === "rascunho"
                ? "Rascunho"
                : offerStatus === "enviado"
                ? "Enviado"
                : "Fechado"}
            </strong>
            <span style={styles.statDetail}>Fluxo atual</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aguardando resposta</span>
            <strong style={styles.statValue}>{stats.aguardando}</strong>
            <span style={styles.statDetail}>Motoristas acionados</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aceites</span>
            <strong style={styles.statValue}>{stats.aceites}</strong>
            <span style={styles.statDetail}>Confirmações registradas</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Recusas</span>
            <strong style={styles.statValue}>{stats.recusas}</strong>
            <span style={styles.statDetail}>Sem punição</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Fechado com</span>
            <strong style={styles.statValue}>{closedWith || "—"}</strong>
            <span style={styles.statDetail}>Primeiro aceite válido</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.offerCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>DETALHE DA OFERTA</span>
                  <h2 style={styles.sectionTitle}>Monte o chamado</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>OS</span>
                  <input
                    value={service.os}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        os: e.target.value,
                      }))
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Cliente</span>
                  <input
                    value={service.cliente}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        cliente: e.target.value,
                      }))
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Rota</span>
                  <input
                    value={service.rota}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        rota: e.target.value,
                      }))
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Data / Hora</span>
                  <input
                    value={service.dataHora}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        dataHora: e.target.value,
                      }))
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.dataItem}>
                  <span style={styles.dataLabel}>Valor</span>
                  <input
                    value={service.valor}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        valor: e.target.value,
                      }))
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.dataItemWide}>
                  <span style={styles.dataLabel}>Observação operacional</span>
                  <textarea
                    value={service.observacao}
                    onChange={(e) =>
                      setService((current) => ({
                        ...current,
                        observacao: e.target.value,
                      }))
                    }
                    style={styles.textarea}
                  />
                </div>
              </div>

              <div style={styles.actionRow}>
                <button
                  type="button"
                  style={styles.primaryAction}
                  onClick={sendOffer}
                >
                  Disparar oferta
                </button>

                <button
                  type="button"
                  style={styles.secondaryAction}
                  onClick={resetOffer}
                >
                  Reiniciar
                </button>
              </div>
            </div>

            <div style={styles.offerCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>BASE DE MOTORISTAS</span>
                  <h2 style={styles.sectionTitle}>
                    Selecionar quem vai receber
                  </h2>
                </div>

                <input
                  placeholder="Buscar por nome, base, cidade ou categoria"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.driverList}>
                {filteredDrivers.map((driver) => {
                  const selected = selectedDrivers.includes(driver.id);
                  const log = logs.find((item) => item.driverId === driver.id);

                  return (
                    <article key={driver.id} style={styles.driverCard}>
                      <div style={styles.driverTop}>
                        <div style={styles.driverInfo}>
                          <h3 style={styles.driverTitle}>{driver.nome}</h3>
                          <p style={styles.driverSubline}>
                            {driver.base} • {driver.cidade}
                          </p>
                          <p style={styles.driverSubline}>
                            {driver.categoria}
                          </p>
                        </div>

                        <div style={styles.driverTopRight}>
                          <span
                            style={{
                              ...styles.badge,
                              ...getDriverStatusStyle(driver.status),
                            }}
                          >
                            {driver.status === "disponivel"
                              ? "Disponível"
                              : "Ocupado"}
                          </span>

                          {log ? (
                            <span
                              style={{
                                ...styles.badge,
                                ...getDecisionStyle(log.decision),
                              }}
                            >
                              {log.decision === "aguardando"
                                ? "Aguardando"
                                : log.decision === "aceitou"
                                ? "Aceitou"
                                : "Recusou"}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div style={styles.driverBottom}>
                        <label style={styles.checkboxWrap}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleDriver(driver.id)}
                            disabled={offerStatus === "fechado"}
                          />
                          <span>Selecionar motorista</span>
                        </label>

                        <div style={styles.driverActions}>
                          <button
                            type="button"
                            style={styles.whatsButton}
                            onClick={() => sendWhatsAppToDriver(driver)}
                          >
                            WhatsApp
                          </button>

                          {offerStatus === "enviado" && selected ? (
                            <>
                              <button
                                type="button"
                                style={styles.acceptButton}
                                onClick={() => acceptOffer(driver)}
                              >
                                Aceitar
                              </button>

                              <button
                                type="button"
                                style={styles.refuseButton}
                                onClick={() => refuseOffer(driver)}
                              >
                                Recusar
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {log?.respondedAt ? (
                        <div style={styles.logBox}>
                          Última atualização: {log.respondedAt}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>REGRA DO CHAMADO</span>
              <h2 style={styles.sidebarTitle}>Como a oferta funciona</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Livre recusa</strong>
                  <span style={styles.ruleItemText}>
                    O motorista pode recusar quantas vezes quiser, sem punição.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>
                    Sem volume garantido
                  </strong>
                  <span style={styles.ruleItemText}>
                    Os serviços são esporádicos e dependem da necessidade real
                    dos clientes.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>
                    Primeiro aceite leva
                  </strong>
                  <span style={styles.ruleItemText}>
                    O atendimento fica com quem confirmar primeiro de forma
                    válida.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>
                    Demais ficam livres
                  </strong>
                  <span style={styles.ruleItemText}>
                    Os outros motoristas seguem disponíveis para novos chamados.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>CAMADA CONTRATUAL</span>
              <h2 style={styles.sidebarTitle}>Segurança operacional</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>
                    Freelance / eventual
                  </strong>
                  <span style={styles.ruleItemText}>
                    O sistema parte do modelo de serviços livres, sem garantia
                    de continuidade.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>CTB e condução</strong>
                  <span style={styles.ruleItemText}>
                    O motorista deve conduzir em conformidade com o CTB e com as
                    regras aplicáveis da operação.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>
                    Telemetria quando houver
                  </strong>
                  <span style={styles.ruleItemText}>
                    Se o veículo tiver telemetria, a condução deve seguir os
                    parâmetros informados para a operação.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio à distribuição</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá sugerir qual motorista acionar primeiro,
                ler histórico de aceite, separar base por cidade e reduzir tempo
                de resposta.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Priorizar disponível</div>
                <div style={styles.robotItem}>Ler tempo de resposta</div>
                <div style={styles.robotItem}>Reduzir duplicidade</div>
                <div style={styles.robotItem}>Fechar no primeiro aceite</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/escala" style={styles.navItem}>
                  Abrir escala
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operação
                </Link>
                <Link href="/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/historico" style={styles.navItem}>
                  Abrir histórico
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
    padding: "24px 12px 18px",
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
    borderRadius: 24,
    padding: "20px 14px 18px",
    boxShadow: "0 24px 60px rgba(14, 165, 233, 0.10)",
    backdropFilter: "blur(12px)",
  },

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
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
    flexWrap: "wrap",
    lineHeight: 1.4,
  },

  heroTitle: {
    margin: 0,
    fontSize: "clamp(1.55rem, 5.2vw, 3.5rem)",
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-0.05em",
    maxWidth: 860,
    wordBreak: "break-word",
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 860,
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.75,
  },

  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 26,
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.20)",
    textAlign: "center",
  },

  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 900,
    color: "#0f172a",
    background: "rgba(255,255,255,0.85)",
    border: "1px solid rgba(125, 211, 252, 0.34)",
    textAlign: "center",
  },

  heroRightCard: {
    borderRadius: 22,
    padding: 18,
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
    fontSize: 22,
    lineHeight: 1.12,
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

  feedbackBox: {
    marginTop: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  statsSection: {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "8px 12px 4px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  },

  statCard: {
    background: "#ffffff",
    borderRadius: 22,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 16,
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.05)",
    minWidth: 0,
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
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    wordBreak: "break-word",
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
    padding: "18px 12px 0",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
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

  offerCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 16,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
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
    fontSize: "clamp(1.3rem, 4.5vw, 2.3rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    wordBreak: "break-word",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },

  searchInput: {
    minHeight: 46,
    width: "100%",
    maxWidth: "100%",
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },

  input: {
    minHeight: 44,
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 12px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    minHeight: 108,
    width: "100%",
    borderRadius: 12,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 12,
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 14,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.16)",
    minWidth: 0,
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
    minWidth: 0,
  },

  dataLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },

  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },

  primaryAction: {
    border: "none",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.18)",
  },

  secondaryAction: {
    border: "1px solid rgba(125, 211, 252, 0.28)",
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#0f172a",
    background: "#ffffff",
  },

  driverList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  driverCard: {
    borderRadius: 22,
    padding: 16,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
  },

  driverTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  driverInfo: {
    minWidth: 0,
    flex: 1,
  },

  driverTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 900,
    wordBreak: "break-word",
  },

  driverSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
    wordBreak: "break-word",
  },

  driverTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 8,
    width: "100%",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    width: "fit-content",
    maxWidth: "100%",
  },

  driverBottom: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 16,
  },

  checkboxWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 42,
    padding: "0 12px",
    borderRadius: 12,
    background: "rgba(148, 163, 184, 0.08)",
    border: "1px solid rgba(148, 163, 184, 0.14)",
    fontWeight: 700,
    color: "#0f172a",
    flexWrap: "wrap",
  },

  driverActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },

  whatsButton: {
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

  acceptButton: {
    border: "none",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 10px 20px rgba(37, 99, 235, 0.18)",
  },

  refuseButton: {
    border: "none",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    color: "#ffffff",
    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    boxShadow: "0 10px 20px rgba(239, 68, 68, 0.18)",
  },

  logBox: {
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(6, 182, 212, 0.08)",
    border: "1px solid rgba(6, 182, 212, 0.16)",
    color: "#164e63",
    fontSize: 13,
    fontWeight: 700,
    wordBreak: "break-word",
  },

  infoCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #f4fbff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 18,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
  },

  sidebarTitle: {
    margin: 0,
    fontSize: 22,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#0f172a",
    wordBreak: "break-word",
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
    padding: 18,
    boxShadow: "0 20px 50px rgba(2, 6, 23, 0.24)",
    minWidth: 0,
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
    fontSize: 22,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#ffffff",
    wordBreak: "break-word",
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
    gridTemplateColumns: "1fr",
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
    wordBreak: "break-word",
  },

  navCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 18,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
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