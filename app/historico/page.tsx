"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type HistoryStatus = "Pago" | "Baixado" | "Encerrado";
type PaymentMethod = "PIX" | "TransferÃªncia" | "Faturado" | "Dinheiro";
type ClosingOrigin =
  | "Baixa confirmada"
  | "Repasse concluÃ­do"
  | "Encerramento administrativo";

type HistoryOrigin =
  | "ServiÃ§o padrÃ£o"
  | "ServiÃ§o local"
  | "Translado padrÃ£o"
  | "Translado local";

type HistoryItem = {
  id: string;
  osSistema: string;
  osCliente: string;
  ocSistema: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  status: HistoryStatus;
  valorTotal: number;
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  dataBaixa: string;
  metodoPagamento: PaymentMethod;
  origemFechamento: ClosingOrigin;
  observacao: string;
  origemBase: HistoryOrigin;
};

type StoredHistoryItem = {
  id: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  data: string;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  etapa: string;
  observacao: string;
  origemBase: HistoryOrigin;
  pagoEm: string;
};

const HISTORY_STORAGE_KEY = "aurora_motoristas_historico_interno";

const baseHistoryItems: HistoryItem[] = [
  {
    id: "HIS-0001",
    osSistema: "OS-2026-000155",
    osCliente: "OS-CLI-4514",
    ocSistema: "OC-2026-000093",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Premium Sul",
    motorista: "Carlos Henrique",
    servico: "Belo Horizonte x Ouro Preto",
    status: "Pago",
    valorTotal: 390,
    valorTransfer: 390,
    valorMotorista: 180,
    despesas: 40,
    adiantamento: 50,
    dataBaixa: "09/04/2026",
    metodoPagamento: "TransferÃªncia",
    origemFechamento: "Repasse concluÃ­do",
    observacao:
      "Baixa finalizada, adiantamento conferido e repasse do motorista confirmado. Registro mantido apenas para conferÃªncia administrativa.",
    origemBase: "ServiÃ§o padrÃ£o",
  },
  {
    id: "HIS-0002",
    osSistema: "OS-2026-000156",
    osCliente: "OS-CLI-4515",
    ocSistema: "OC-2026-000094",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Maria Fernanda",
    servico: "Contagem x Savassi",
    status: "Encerrado",
    valorTotal: 680,
    valorTransfer: 680,
    valorMotorista: 260,
    despesas: 50,
    adiantamento: 0,
    dataBaixa: "07/04/2026",
    metodoPagamento: "Faturado",
    origemFechamento: "Encerramento administrativo",
    observacao:
      "ServiÃ§o finalizado, repasse concluÃ­do e retenÃ§Ã£o administrativa aplicada no histÃ³rico interno protegido.",
    origemBase: "ServiÃ§o padrÃ£o",
  },
  {
    id: "HIS-0003",
    osSistema: "OS-2026-000157",
    osCliente: "OS-CLI-4516",
    ocSistema: "OC-2026-000095",
    empresa: "Aurora Locadoras Premium",
    cliente: "OperaÃ§Ã£o Aeroporto VIP",
    motorista: "JoÃ£o Pedro",
    servico: "Confins x Savassi",
    status: "Baixado",
    valorTotal: 520,
    valorTransfer: 520,
    valorMotorista: 220,
    despesas: 35,
    adiantamento: 0,
    dataBaixa: "08/04/2026",
    metodoPagamento: "PIX",
    origemFechamento: "Baixa confirmada",
    observacao:
      "Baixa concluÃ­da e operaÃ§Ã£o preservada em histÃ³rico para conferÃªncia financeira e administrativa.",
    origemBase: "ServiÃ§o padrÃ£o",
  },
  {
    id: "HIS-TRA-0001",
    osSistema: "TRA-0001",
    osCliente: "TRA-CLI-7001",
    ocSistema: "OC-TRA-2026-000201",
    empresa: "Aurora Locadoras Premium",
    cliente: "Executivo Nacional",
    motorista: "Carlos Henrique",
    servico: "Aeroporto de Confins x Savassi",
    status: "Baixado",
    valorTotal: 280,
    valorTransfer: 280,
    valorMotorista: 130,
    despesas: 24,
    adiantamento: 40,
    dataBaixa: "10/04/2026",
    metodoPagamento: "PIX",
    origemFechamento: "Baixa confirmada",
    observacao:
      "Translado preservado em histÃ³rico com leitura de despesas e adiantamento.",
    origemBase: "Translado padrÃ£o",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getStatusStyle(status: HistoryItem["status"]): React.CSSProperties {
  if (status === "Pago") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "Baixado") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  return {
    background: "rgba(6, 182, 212, 0.10)",
    color: "#0e7490",
    border: "1px solid rgba(6, 182, 212, 0.18)",
  };
}

function getOriginStyle(origin: HistoryOrigin): React.CSSProperties {
  if (origin === "ServiÃ§o padrÃ£o") {
    return {
      background: "rgba(148, 163, 184, 0.12)",
      color: "#475569",
      border: "1px solid rgba(148, 163, 184, 0.22)",
    };
  }

  if (origin === "ServiÃ§o local") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (origin === "Translado padrÃ£o") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  return {
    background: "rgba(168, 85, 247, 0.12)",
    color: "#7e22ce",
    border: "1px solid rgba(168, 85, 247, 0.22)",
  };
}

function safeReadStoredHistory(): StoredHistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as StoredHistoryItem[];
  } catch {
    return [];
  }
}

function mapStoredHistoryItem(item: StoredHistoryItem, index: number): HistoryItem {
  return {
    id: `HIS-STORED-${String(index + 1).padStart(4, "0")}`,
    osSistema: item.id,
    osCliente: `OS-CLI-${String(index + 9001).padStart(4, "0")}`,
    ocSistema: `OC-INT-${String(index + 301).padStart(6, "0")}`,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: item.servico,
    status: "Pago",
    valorTotal: item.valorTotal,
    valorTransfer: item.valorTotal,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    adiantamento: 0,
    dataBaixa: item.pagoEm || item.data,
    metodoPagamento: "PIX",
    origemFechamento: "Baixa confirmada",
    observacao:
      item.observacao?.trim() ||
      "Registro vindo da baixa da operaÃ§Ã£o e preservado em histÃ³rico interno.",
    origemBase: item.origemBase,
  };
}

export default function HistoricoPage() {
  const [search, setSearch] = useState("");
  const [storedItems, setStoredItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const historyFromStorage = safeReadStoredHistory().map(mapStoredHistoryItem);
    setStoredItems(historyFromStorage);
  }, []);

  const allItems = useMemo(() => {
    const merged = [...storedItems, ...baseHistoryItems];
    const deduplicated = merged.filter(
      (item, index, array) =>
        array.findIndex(
          (candidate) =>
            candidate.osSistema === item.osSistema &&
            candidate.empresa === item.empresa &&
            candidate.cliente === item.cliente
        ) === index
    );

    return deduplicated;
  }, [storedItems]);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) =>
      `${item.id} ${item.osSistema} ${item.osCliente} ${item.ocSistema} ${item.empresa} ${item.cliente} ${item.motorista} ${item.servico} ${item.status} ${item.metodoPagamento} ${item.origemFechamento} ${item.origemBase}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [allItems, search]);

  const stats = useMemo(() => {
    return {
      total: filteredItems.length,
      totalReceita: filteredItems.reduce((acc, item) => acc + item.valorTotal, 0),
      totalTransfer: filteredItems.reduce((acc, item) => acc + item.valorTransfer, 0),
      totalRepasse: filteredItems.reduce((acc, item) => acc + item.valorMotorista, 0),
      totalDespesas: filteredItems.reduce((acc, item) => acc + item.despesas, 0),
      totalAdiantamento: filteredItems.reduce((acc, item) => acc + item.adiantamento, 0),
      locais: filteredItems.filter(
        (item) =>
          item.origemBase === "ServiÃ§o local" ||
          item.origemBase === "Translado local"
      ).length,
      translados: filteredItems.filter(
        (item) =>
          item.origemBase === "Translado padrÃ£o" ||
          item.origemBase === "Translado local"
      ).length,
    };
  }, [filteredItems]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS â€¢ HISTÃ“RICO</div>
              <h1 style={styles.heroTitle}>
                HistÃ³rico interno protegido com serviÃ§os e translados no fechamento final
              </h1>
              <p style={styles.heroText}>
                Esta Ã¡rea agora lÃª o histÃ³rico salvo pela baixa da operaÃ§Ã£o,
                mantendo repasse, despesas, fechamento e retenÃ§Ã£o administrativa
                fora da visÃ£o operacional do motorista.
              </p>

              <div style={styles.heroActions}>
                <Link href="/pagamentos" style={styles.secondaryButton}>
                  Voltar para pagamentos
                </Link>

                <Link href="/relatorios" style={styles.primaryButton}>
                  Ir para relatÃ³rios
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>TRILHA FINAL</span>
              <h2 style={styles.sideTitle}>ServiÃ§os e translados encerrados</h2>
              <p style={styles.sideText}>
                O histÃ³rico mostra a camada final da operaÃ§Ã£o com origem do item,
                mÃ©todo usado, valor total, repasse e fechamento consolidado.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Baixa confirmada</div>
                <div style={styles.sidePill}>Repasse concluÃ­do</div>
                <div style={styles.sidePill}>Encerramento administrativo</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualizaÃ§Ã£o. Esta Ã¡rea foi preparada para manter
            auditoria, retenÃ§Ã£o protegida e leitura final de serviÃ§os e translados.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Registros no histÃ³rico</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Itens protegidos</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Receita histÃ³rica</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalReceita)}</strong>
            <span style={styles.statDetail}>Base encerrada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Valor transfer</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalTransfer)}</strong>
            <span style={styles.statDetail}>ComposiÃ§Ã£o financeira final</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Repasse histÃ³rico</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalRepasse)}</strong>
            <span style={styles.statDetail}>Motoristas processados</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Despesas histÃ³ricas</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalDespesas)}</strong>
            <span style={styles.statDetail}>Custos registrados</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Adiantamento histÃ³rico</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalAdiantamento)}</strong>
            <span style={styles.statDetail}>Base consolidada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Translados no histÃ³rico</span>
            <strong style={styles.statValue}>{stats.translados}</strong>
            <span style={styles.statDetail}>Fluxo de aeroporto</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Base local integrada</span>
            <strong style={styles.statValue}>{stats.locais}</strong>
            <span style={styles.statDetail}>Vindos da operaÃ§Ã£o</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.historyCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>HISTÃ“RICO CONSOLIDADO</span>
                  <h2 style={styles.sectionTitle}>Registros internos protegidos</h2>
                </div>

                <div style={styles.searchBox}>
                  <input
                    placeholder="Buscar por OS, empresa, cliente, motorista, mÃ©todo, origem ou base"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.historyList}>
                {filteredItems.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum registro encontrado para este filtro.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <article key={item.id} style={styles.historyItemCard}>
                      <div style={styles.historyTop}>
                        <div>
                          <div style={styles.metaRow}>
                            <span style={{ ...styles.originTag, ...getOriginStyle(item.origemBase) }}>
                              {item.origemBase}
                            </span>
                          </div>

                          <h3 style={styles.historyTitle}>{item.servico}</h3>
                          <p style={styles.historySubline}>
                            {item.id} â€¢ {item.osSistema} â€¢ {item.dataBaixa}
                          </p>
                        </div>

                        <div style={styles.historyTopRight}>
                          <strong style={styles.historyValue}>
                            {formatCurrency(item.valorTotal)}
                          </strong>
                          <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      <div style={styles.historyGrid}>
                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Empresa</span>
                          <strong style={styles.dataValue}>{item.empresa}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Cliente</span>
                          <strong style={styles.dataValue}>{item.cliente}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Motorista</span>
                          <strong style={styles.dataValue}>{item.motorista}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OS cliente</span>
                          <strong style={styles.dataValue}>{item.osCliente}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>OC sistema</span>
                          <strong style={styles.dataValue}>{item.ocSistema}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>MÃ©todo</span>
                          <strong style={styles.dataValue}>{item.metodoPagamento}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Origem do fechamento</span>
                          <strong style={styles.dataValue}>{item.origemFechamento}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Data da baixa</span>
                          <strong style={styles.dataValue}>{item.dataBaixa}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Valor total</span>
                          <strong style={styles.dataValue}>
                            {formatCurrency(item.valorTotal)}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Valor transfer</span>
                          <strong style={styles.dataValue}>
                            {formatCurrency(item.valorTransfer)}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Repasse motorista</span>
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

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Adiantamento</span>
                          <strong style={styles.dataValue}>
                            {formatCurrency(item.adiantamento)}
                          </strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>ObservaÃ§Ã£o administrativa final</span>
                          <strong style={styles.dataValue}>{item.observacao}</strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>FINALIDADE</span>
              <h2 style={styles.sidebarTitle}>O que este mÃ³dulo agora mostra</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Baixa consolidada</strong>
                  <span style={styles.ruleItemText}>
                    Guarda a leitura final da baixa financeira.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Repasse consolidado</strong>
                  <span style={styles.ruleItemText}>
                    Mostra quando o motorista jÃ¡ foi processado.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>ServiÃ§os e translados</strong>
                  <span style={styles.ruleItemText}>
                    O histÃ³rico agora lÃª os dois fluxos no mesmo painel.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Blindagem administrativa</strong>
                  <span style={styles.ruleItemText}>
                    MantÃ©m tudo protegido fora da visÃ£o operacional do motorista.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÃ” AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio ao histÃ³rico</h2>
              <p style={styles.sidebarTextDark}>
                O RobÃ´ Aurora poderÃ¡ localizar baixas antigas, comparar mÃ©todo de
                pagamento, identificar fechamento incompleto e reforÃ§ar a trilha de auditoria.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Conferir baixa</div>
                <div style={styles.robotItem}>Ler repasse</div>
                <div style={styles.robotItem}>Comparar mÃ©todo</div>
                <div style={styles.robotItem}>Apoiar auditoria</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÃ‡ÃƒO</span>
              <h2 style={styles.sidebarTitle}>PrÃ³ximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/translados" style={styles.navItem}>
                  Abrir translados
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operaÃ§Ã£o
                </Link>
                <Link href="/relatorios" style={styles.navItem}>
                  Abrir relatÃ³rios
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
    maxWidth: 820,
  },

  heroText: {
    marginTop: 16,
    marginBottom: 0,
    maxWidth: 820,
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

  historyCard: {
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

  searchBox: {
    minWidth: 320,
  },

  searchInput: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  historyItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  historyTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },

  metaRow: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
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

  historyTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  historySubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  historyTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  historyValue: {
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

  historyGrid: {
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
