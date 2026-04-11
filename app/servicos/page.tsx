"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ServiceStage =
  | "Cotação"
  | "Em andamento"
  | "Aguardando pagamento"
  | "Pago";

type ServiceItem = {
  id: string;
  osSistema: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  origem: string;
  destino: string;
  data: string;
  km: number;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  etapa: ServiceStage;
  observacao: string;
};

const initialServices: ServiceItem[] = [
  {
    id: "SER-0001",
    osSistema: "OS-2026-000151",
    empresa: "Aurora Locadoras Premium",
    cliente: "Operação Aeroporto Premium",
    motorista: "Ricardo Moreira",
    servico: "Lagoa Santa x Savassi",
    origem: "Lagoa Santa",
    destino: "Savassi",
    data: "10/04/2026",
    km: 42,
    valorTotal: 540,
    valorMotorista: 220,
    despesas: 60,
    etapa: "Cotação",
    observacao: "Cotação em análise com possibilidade de ajuste de valor.",
  },
  {
    id: "SER-0002",
    osSistema: "OS-2026-000152",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Executivo BH",
    motorista: "Carlos Henrique",
    servico: "BH x São Paulo",
    origem: "Belo Horizonte",
    destino: "São Paulo",
    data: "10/04/2026",
    km: 586,
    valorTotal: 1700,
    valorMotorista: 500,
    despesas: 200,
    etapa: "Em andamento",
    observacao: "Operação ativa com pedágios e apoio logístico.",
  },
  {
    id: "SER-0003",
    osSistema: "OS-2026-000153",
    empresa: "Aurora Locadoras Premium",
    cliente: "Evento Nacional",
    motorista: "João Pedro",
    servico: "BH x Confins",
    origem: "Belo Horizonte",
    destino: "Confins",
    data: "10/04/2026",
    km: 41,
    valorTotal: 400,
    valorMotorista: 150,
    despesas: 50,
    etapa: "Aguardando pagamento",
    observacao: "Serviço concluído, aguardando baixa financeira.",
  },
  {
    id: "SER-0004",
    osSistema: "OS-2026-000154",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Maria Fernanda",
    servico: "Contagem x Savassi",
    origem: "Contagem",
    destino: "Savassi",
    data: "09/04/2026",
    km: 28,
    valorTotal: 680,
    valorMotorista: 260,
    despesas: 50,
    etapa: "Pago",
    observacao:
      "Pagamento realizado. Este item deve sair da visão operacional do motorista.",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getStageStyle(stage: ServiceStage): React.CSSProperties {
  if (stage === "Cotação") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  if (stage === "Em andamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (stage === "Aguardando pagamento") {
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

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [search, setSearch] = useState("");
  const [mostrarPagos, setMostrarPagos] = useState(false);

  function advanceStage(serviceId: string) {
    setServices((current) =>
      current.map((item) => {
        if (item.id !== serviceId) {
          return item;
        }

        if (item.etapa === "Cotação") {
          return {
            ...item,
            etapa: "Em andamento",
            observacao: "Cotação aprovada. Serviço liberado para operação.",
          };
        }

        if (item.etapa === "Em andamento") {
          return {
            ...item,
            etapa: "Aguardando pagamento",
            observacao:
              "Serviço concluído operacionalmente. Aguardando baixa financeira.",
          };
        }

        if (item.etapa === "Aguardando pagamento") {
          return {
            ...item,
            etapa: "Pago",
            observacao:
              "Pagamento confirmado. O serviço deve sair da visão operacional do motorista.",
          };
        }

        return item;
      })
    );
  }

  function reopenService(serviceId: string) {
    setServices((current) =>
      current.map((item) => {
        if (item.id !== serviceId) {
          return item;
        }

        if (item.etapa === "Pago") {
          return {
            ...item,
            etapa: "Aguardando pagamento",
            observacao:
              "Baixa revertida para conferência administrativa. Serviço voltou para validação financeira.",
          };
        }

        if (item.etapa === "Aguardando pagamento") {
          return {
            ...item,
            etapa: "Em andamento",
            observacao:
              "Serviço retornado para análise operacional antes da baixa.",
          };
        }

        if (item.etapa === "Em andamento") {
          return {
            ...item,
            etapa: "Cotação",
            observacao: "Serviço retornado para etapa comercial.",
          };
        }

        return item;
      })
    );
  }

  const filteredServices = useMemo(() => {
    return services
      .filter((item) => (mostrarPagos ? true : item.etapa !== "Pago"))
      .filter((item) =>
        `${item.id} ${item.osSistema} ${item.empresa} ${item.cliente} ${item.motorista} ${item.servico} ${item.etapa}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [services, search, mostrarPagos]);

  const stats = useMemo(() => {
    const visiveisMotorista = services.filter((item) => item.etapa !== "Pago").length;
    const pagos = services.filter((item) => item.etapa === "Pago").length;
    const aguardando = services.filter(
      (item) => item.etapa === "Aguardando pagamento"
    ).length;
    const emAndamento = services.filter(
      (item) => item.etapa === "Em andamento"
    ).length;

    return {
      total: services.length,
      visiveisMotorista,
      pagos,
      aguardando,
      emAndamento,
    };
  }, [services]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • SERVIÇOS</div>
              <h1 style={styles.heroTitle}>
                Serviços com fluxo real entre operação, pagamento e blindagem
              </h1>
              <p style={styles.heroText}>
                Esta área agora controla a trilha operacional do serviço. Aqui o
                item nasce na cotação, entra em andamento, segue para pagamento e,
                quando pago, sai da visão operacional para respeitar a blindagem do sistema.
              </p>

              <div style={styles.heroActions}>
                <Link href="/operacao" style={styles.secondaryButton}>
                  Voltar para operação
                </Link>

                <Link href="/pagamentos" style={styles.primaryButton}>
                  Ir para pagamentos
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>FLUXO VIVO</span>
              <h2 style={styles.sideTitle}>Agora serviços deixam de ser tela solta</h2>
              <p style={styles.sideText}>
                O módulo passa a conduzir a operação real e prepara o caminho
                para integração futura com banco, baixa automática e histórico protegido.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Cotação → andamento</div>
                <div style={styles.sidePill}>Andamento → pagamento</div>
                <div style={styles.sidePill}>Pago → sai do motorista</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta tela já respeita a lógica:
            serviço pago não precisa continuar exposto na visão operacional do motorista.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total de serviços</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base completa</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Visíveis ao motorista</span>
            <strong style={styles.statValue}>{stats.visiveisMotorista}</strong>
            <span style={styles.statDetail}>Sem itens pagos</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Em andamento</span>
            <strong style={styles.statValue}>{stats.emAndamento}</strong>
            <span style={styles.statDetail}>Operação ativa</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aguardando pagamento</span>
            <strong style={styles.statValue}>{stats.aguardando}</strong>
            <span style={styles.statDetail}>Ponto de baixa</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.serviceCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>OPERAÇÃO DE SERVIÇOS</span>
                  <h2 style={styles.sectionTitle}>Fluxo editável do serviço</h2>
                </div>

                <div style={styles.filterArea}>
                  <label style={styles.checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={mostrarPagos}
                      onChange={(e) => setMostrarPagos(e.target.checked)}
                    />
                    <span>Mostrar pagos</span>
                  </label>

                  <input
                    placeholder="Buscar por OS, empresa, cliente, motorista ou etapa"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.serviceList}>
                {filteredServices.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum serviço encontrado para este filtro.
                  </div>
                ) : (
                  filteredServices.map((item) => (
                    <article key={item.id} style={styles.serviceItemCard}>
                      <div style={styles.serviceTop}>
                        <div>
                          <h3 style={styles.serviceTitle}>{item.servico}</h3>
                          <p style={styles.serviceSubline}>
                            {item.osSistema} • {item.data} • {item.empresa}
                          </p>
                        </div>

                        <div style={styles.serviceTopRight}>
                          <strong style={styles.serviceValue}>
                            {formatCurrency(item.valorTotal)}
                          </strong>
                          <span style={{ ...styles.badge, ...getStageStyle(item.etapa) }}>
                            {item.etapa}
                          </span>
                        </div>
                      </div>

                      <div style={styles.serviceGrid}>
                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Cliente</span>
                          <strong style={styles.dataValue}>{item.cliente}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Motorista</span>
                          <strong style={styles.dataValue}>{item.motorista}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Origem</span>
                          <strong style={styles.dataValue}>{item.origem}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Destino</span>
                          <strong style={styles.dataValue}>{item.destino}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>KM</span>
                          <strong style={styles.dataValue}>{item.km} km</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Valor motorista</span>
                          <strong style={styles.dataValue}>
                            {formatCurrency(item.valorMotorista)}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Despesas</span>
                          <strong style={styles.dataValue}>
                            {formatCurrency(item.despesas)}
                          </strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação</span>
                          <strong style={styles.dataValue}>{item.observacao}</strong>
                        </div>
                      </div>

                      <div style={styles.actionRow}>
                        {item.etapa !== "Pago" ? (
                          <button
                            type="button"
                            onClick={() => advanceStage(item.id)}
                            style={styles.primaryAction}
                          >
                            {item.etapa === "Cotação" && "Aprovar e iniciar"}
                            {item.etapa === "Em andamento" && "Concluir serviço"}
                            {item.etapa === "Aguardando pagamento" && "Confirmar pagamento"}
                          </button>
                        ) : (
                          <div style={styles.doneBox}>
                            Pago confirmado. Este item já deve sair da visão operacional do motorista.
                          </div>
                        )}

                        {item.etapa !== "Cotação" && (
                          <button
                            type="button"
                            onClick={() => reopenService(item.id)}
                            style={styles.secondaryAction}
                          >
                            Voltar etapa
                          </button>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>REGRA DE OURO</span>
              <h2 style={styles.sidebarTitle}>O que este arquivo já resolve</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Cotação aprovada</strong>
                  <span style={styles.ruleItemText}>
                    Sai da pré-venda e entra em operação ativa.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Serviço concluído</strong>
                  <span style={styles.ruleItemText}>
                    Vai para aguardando pagamento.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Pagamento confirmado</strong>
                  <span style={styles.ruleItemText}>
                    Fica marcado como pago e deixa de aparecer na visão operacional padrão.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Blindagem preparada</strong>
                  <span style={styles.ruleItemText}>
                    O próximo passo será ligar isso com histórico e Supabase real.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio operacional</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá alertar serviços parados, baixa pendente,
                margem ruim, motorista com excesso de carga e gargalos no fluxo.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler pendências</div>
                <div style={styles.robotItem}>Sugerir prioridade</div>
                <div style={styles.robotItem}>Acompanhar etapas</div>
                <div style={styles.robotItem}>Preparar auditoria</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operação
                </Link>
                <Link href="/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/historico" style={styles.navItem}>
                  Abrir histórico
                </Link>
                <Link href="/relatorios" style={styles.navItem}>
                  Abrir relatórios
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

  serviceCard: {
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

  filterArea: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    minWidth: 320,
  },

  checkboxWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.24)",
    borderRadius: 14,
    minHeight: 46,
    padding: "0 14px",
  },

  searchInput: {
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
    minWidth: 280,
  },

  serviceList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  serviceItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  serviceTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  serviceTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  serviceSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  serviceTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  serviceValue: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
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

  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
    marginTop: 16,
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

  doneBox: {
    display: "flex",
    alignItems: "center",
    minHeight: 48,
    padding: "0 16px",
    borderRadius: 14,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    fontSize: 14,
    fontWeight: 800,
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