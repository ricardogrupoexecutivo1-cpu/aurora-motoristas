"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function calcularLucro(item: ReportItem) {
  return item.valorTotal - item.despesas - item.valorMotorista;
}

function calcularMargem(item: ReportItem) {
  if (!item.valorTotal) return 0;
  const lucro = calcularLucro(item);
  return (lucro / item.valorTotal) * 100;
}

function getMargemStyle(margem: number): React.CSSProperties {
  if (margem < 10) {
    return {
      background: "rgba(239, 68, 68, 0.12)",
      color: "#b91c1c",
      border: "1px solid rgba(239, 68, 68, 0.25)",
    };
  }

  if (margem < 25) {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.25)",
    };
  }

  return {
    background: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    border: "1px solid rgba(16, 185, 129, 0.25)",
  };
}

type ReportPeriod = "Diário" | "Semanal" | "Mensal";
type ReportStatus =
  | "Cotação"
  | "Em andamento"
  | "Aguardando pagamento"
  | "Pago"
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Concluído"
  | "Reagendado";

type ReportOrigin =
  | "Serviço padrão"
  | "Serviço local"
  | "Translado padrão"
  | "Translado local";

type ReportItem = {
  id: string;
  periodo: ReportPeriod;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  status: ReportStatus;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  data: string;
  origemBase: ReportOrigin;
};

type LocalService = {
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
  etapa: "Cotação" | "Em andamento" | "Aguardando pagamento" | "Pago";
  observacao: string;
};

type LocalTransfer = {
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
  risco: "Baixo" | "Médio" | "Alto";
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  status:
    | "Agendado"
    | "Em deslocamento"
    | "Aguardando passageiro"
    | "Concluído"
    | "Reagendado";
  observacao: string;
  createdAt: string;
};

const SERVICES_STORAGE_KEY = "aurora_motoristas_servicos";
const TRANSFERS_STORAGE_KEY = "aurora_motoristas_translados";

const reportItems: ReportItem[] = [
  {
    id: "REL-0001",
    periodo: "Diário",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Executivo BH",
    motorista: "Carlos Henrique",
    servico: "BH x São Paulo",
    status: "Em andamento",
    valorTotal: 1700,
    valorMotorista: 500,
    despesas: 200,
    adiantamento: 0,
    data: "10/04/2026",
    origemBase: "Serviço padrão",
  },
  {
    id: "REL-0002",
    periodo: "Semanal",
    empresa: "Aurora Locadoras Premium",
    cliente: "Evento Nacional",
    motorista: "João Pedro",
    servico: "BH x Confins",
    status: "Aguardando pagamento",
    valorTotal: 400,
    valorMotorista: 150,
    despesas: 50,
    adiantamento: 0,
    data: "10/04/2026",
    origemBase: "Serviço padrão",
  },
  {
    id: "REL-0003",
    periodo: "Mensal",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Empresa XYZ",
    motorista: "Maria Fernanda",
    servico: "Contagem x Savassi",
    status: "Pago",
    valorTotal: 540,
    valorMotorista: 220,
    despesas: 60,
    adiantamento: 0,
    data: "09/04/2026",
    origemBase: "Serviço padrão",
  },
  {
    id: "REL-0004",
    periodo: "Mensal",
    empresa: "Aurora Locadoras Premium",
    cliente: "Operação Aeroporto Premium",
    motorista: "Ricardo Moreira",
    servico: "Lagoa Santa x Savassi",
    status: "Cotação",
    valorTotal: 540,
    valorMotorista: 220,
    despesas: 60,
    adiantamento: 0,
    data: "09/04/2026",
    origemBase: "Serviço padrão",
  },
  {
    id: "REL-TRA-0001",
    periodo: "Diário",
    empresa: "Aurora Locadoras Premium",
    cliente: "Executivo Nacional",
    motorista: "Carlos Henrique",
    servico: "Aeroporto de Confins x Savassi",
    status: "Reagendado",
    valorTotal: 280,
    valorMotorista: 130,
    despesas: 24,
    adiantamento: 40,
    data: "10/04/2026",
    origemBase: "Translado padrão",
  },
  {
    id: "REL-TRA-0002",
    periodo: "Diário",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Delegação Internacional",
    motorista: "Maria Fernanda",
    servico: "Hotel Ouro Minas x Aeroporto de Confins",
    status: "Agendado",
    valorTotal: 320,
    valorMotorista: 150,
    despesas: 18,
    adiantamento: 0,
    data: "10/04/2026",
    origemBase: "Translado padrão",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getStatusStyle(status: ReportStatus): React.CSSProperties {
  if (status === "Pago" || status === "Concluído") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (
    status === "Aguardando pagamento" ||
    status === "Aguardando passageiro"
  ) {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  if (status === "Em andamento" || status === "Em deslocamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (status === "Agendado" || status === "Reagendado") {
    return {
      background: "rgba(6, 182, 212, 0.10)",
      color: "#0e7490",
      border: "1px solid rgba(6, 182, 212, 0.18)",
    };
  }

  return {
    background: "rgba(148, 163, 184, 0.12)",
    color: "#475569",
    border: "1px solid rgba(148, 163, 184, 0.22)",
  };
}

function getOriginStyle(origin: ReportOrigin): React.CSSProperties {
  if (origin === "Serviço padrão") {
    return {
      background: "rgba(148, 163, 184, 0.12)",
      color: "#475569",
      border: "1px solid rgba(148, 163, 184, 0.22)",
    };
  }

  if (origin === "Serviço local") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (origin === "Translado padrão") {
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

function safeReadServices(): LocalService[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as LocalService[];
  } catch {
    return [];
  }
}

function safeReadTransfers(): LocalTransfer[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(TRANSFERS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean) as LocalTransfer[];
  } catch {
    return [];
  }
}

function inferPeriod(date: string): ReportPeriod {
  const onlyDate = date.includes(" ") ? date.split(" ")[0] : date;
  const [day, month, year] = onlyDate.split("/").map(Number);

  if (!day || !month || !year) return "Mensal";

  const parsed = new Date(year, month - 1, day);
  const base = new Date(2026, 3, 10);
  const diffMs = Math.abs(base.getTime() - parsed.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) return "Diário";
  if (diffDays <= 7) return "Semanal";
  return "Mensal";
}

function mapLocalServiceToReport(item: LocalService): ReportItem {
  return {
    id: item.osSistema || item.id,
    periodo: inferPeriod(item.data),
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: item.servico,
    status: item.etapa,
    valorTotal: item.valorTotal,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    adiantamento: 0,
    data: item.data,
    origemBase: "Serviço local",
  };
}

function mapLocalTransferToReport(item: LocalTransfer): ReportItem {
  const dataBase = item.horarioAtualizado || item.horarioPrevisto;

  return {
    id: item.id,
    periodo: inferPeriod(dataBase),
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: `${item.origem} x ${item.destino}`,
    status: item.status,
    valorTotal: item.valorTransfer,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    adiantamento: item.adiantamento,
    data: dataBase,
    origemBase: "Translado local",
  };
}

export default function RelatoriosPage() {
  const [search, setSearch] = useState("");
  const [periodo, setPeriodo] = useState("Todos");
  const [localItems, setLocalItems] = useState<ReportItem[]>([]);

  useEffect(() => {
    const localServices = safeReadServices().map(mapLocalServiceToReport);
    const localTransfers = safeReadTransfers().map(mapLocalTransferToReport);
    setLocalItems([...localTransfers, ...localServices]);
  }, []);

  const allItems = useMemo(() => {
    return [...localItems, ...reportItems];
  }, [localItems]);

  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => (periodo === "Todos" ? true : item.periodo === periodo))
      .filter((item) =>
        `${item.id} ${item.empresa} ${item.cliente} ${item.motorista} ${item.servico} ${item.status} ${item.origemBase}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [allItems, search, periodo]);

  const stats = useMemo(() => {
    const totalReceita = filteredItems.reduce((acc, item) => acc + item.valorTotal, 0);
    const totalRepasse = filteredItems.reduce((acc, item) => acc + item.valorMotorista, 0);
    const totalDespesas = filteredItems.reduce((acc, item) => acc + item.despesas, 0);
    const totalAdiantamento = filteredItems.reduce((acc, item) => acc + item.adiantamento, 0);
    const totalPago = filteredItems
      .filter((item) => item.status === "Pago" || item.status === "Concluído")
      .reduce((acc, item) => acc + item.valorTotal, 0);
    const totalLucro = filteredItems.reduce((acc, item) => acc + calcularLucro(item), 0);

    return {
      total: filteredItems.length,
      receita: totalReceita,
      repasse: totalRepasse,
      despesas: totalDespesas,
      adiantamento: totalAdiantamento,
      pago: totalPago,
      lucro: totalLucro,
      locais: filteredItems.filter(
        (item) =>
          item.origemBase === "Serviço local" || item.origemBase === "Translado local"
      ).length,
      translados: filteredItems.filter(
        (item) =>
          item.origemBase === "Translado padrão" ||
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
              <div style={styles.eyebrow}>AURORA MOTORISTAS • RELATÓRIOS</div>
              <h1 style={styles.heroTitle}>
                Relatórios premium com serviços e translados na mesma leitura gerencial
              </h1>
              <p style={styles.heroText}>
                Esta área agora entrega leitura clara do que entrou, do que está
                pendente e do que veio de serviços e translados, padrão e local,
                ampliando a visão gerencial da operação inteira.
              </p>

              <div style={styles.heroActions}>
                <Link href="/historico" style={styles.secondaryButton}>
                  Voltar para histórico
                </Link>

                <Link href="/translados" style={styles.primaryButton}>
                  Ir para translados
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>LEITURA GERENCIAL</span>
              <h2 style={styles.sideTitle}>Operação visível sem perder a blindagem</h2>
              <p style={styles.sideText}>
                Agora os relatórios enxergam serviços, translados, base padrão e
                base local na mesma camada gerencial.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Diário</div>
                <div style={styles.sidePill}>Semanal</div>
                <div style={styles.sidePill}>Mensal</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta base já integra serviços,
            translados, filtros por período e leitura gerencial mais coerente.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Registros visíveis</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base filtrada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Receita total</span>
            <strong style={styles.statValue}>{formatCurrency(stats.receita)}</strong>
            <span style={styles.statDetail}>Serviços no filtro atual</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Repasse motoristas</span>
            <strong style={styles.statValue}>{formatCurrency(stats.repasse)}</strong>
            <span style={styles.statDetail}>Total separado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Despesas</span>
            <strong style={styles.statValue}>{formatCurrency(stats.despesas)}</strong>
            <span style={styles.statDetail}>Custos registrados</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Receita paga</span>
            <strong style={styles.statValue}>{formatCurrency(stats.pago)}</strong>
            <span style={styles.statDetail}>Itens com fechamento confirmado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Adiantamento</span>
            <strong style={styles.statValue}>{formatCurrency(stats.adiantamento)}</strong>
            <span style={styles.statDetail}>Base financeira adicional</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Lucro estimado</span>
            <strong style={styles.statValue}>{formatCurrency(stats.lucro)}</strong>
            <span style={styles.statDetail}>Receita menos repasse e despesas</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Translados no relatório</span>
            <strong style={styles.statValue}>{stats.translados}</strong>
            <span style={styles.statDetail}>Fluxo de aeroporto</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Base local no relatório</span>
            <strong style={styles.statValue}>{stats.locais}</strong>
            <span style={styles.statDetail}>Itens vindos do cadastro local</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.reportCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>BASE ANALÍTICA</span>
                  <h2 style={styles.sectionTitle}>Relatórios operacionais</h2>
                </div>

                <div style={styles.filterWrap}>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    style={styles.select}
                  >
                    <option>Todos</option>
                    <option>Diário</option>
                    <option>Semanal</option>
                    <option>Mensal</option>
                  </select>

                  <input
                    placeholder="Buscar por cliente, empresa, motorista, status ou origem"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.reportList}>
                {filteredItems.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum relatório encontrado para este filtro.
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const lucro = calcularLucro(item);
                    const margem = calcularMargem(item);

                    return (
                      <article key={`${item.origemBase}-${item.id}`} style={styles.reportItemCard}>
                        <div style={styles.reportTop}>
                          <div>
                            <div style={styles.metaRow}>
                              <span style={{ ...styles.originTag, ...getOriginStyle(item.origemBase) }}>
                                {item.origemBase}
                              </span>
                            </div>

                            <h3 style={styles.reportTitle}>{item.servico}</h3>
                            <p style={styles.reportSubline}>
                              {item.id} • {item.periodo} • {item.data}
                            </p>
                          </div>

                          <div style={styles.reportTopRight}>
                            <strong style={styles.reportValue}>
                              {formatCurrency(item.valorTotal)}
                            </strong>
                            <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        <div style={styles.reportGrid}>
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
                            <span style={styles.dataLabel}>Período</span>
                            <strong style={styles.dataValue}>{item.periodo}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Valor total</span>
                            <strong style={styles.dataValue}>{formatCurrency(item.valorTotal)}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Repasse motorista</span>
                            <strong style={styles.dataValue}>
                              {formatCurrency(item.valorMotorista)}
                            </strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Despesas</span>
                            <strong style={styles.dataValue}>{formatCurrency(item.despesas)}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Adiantamento</span>
                            <strong style={styles.dataValue}>{formatCurrency(item.adiantamento)}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Lucro</span>
                            <strong style={styles.dataValue}>{formatCurrency(lucro)}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Margem</span>
                            <span style={{ ...styles.badge, ...getMargemStyle(margem) }}>
                              {margem.toFixed(1)}%
                            </span>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Status</span>
                            <strong style={styles.dataValue}>{item.status}</strong>
                          </div>
                        </div>

                        {margem < 10 && (
                          <div style={styles.alertBox}>
                            ⚠️ Margem muito baixa. Avaliar preço, despesas ou repasse desta operação.
                          </div>
                        )}
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>INDICADORES</span>
              <h2 style={styles.sidebarTitle}>Leitura rápida</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Receita paga</strong>
                  <span style={styles.ruleItemText}>{formatCurrency(stats.pago)}</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Receita total</strong>
                  <span style={styles.ruleItemText}>{formatCurrency(stats.receita)}</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Repasse total</strong>
                  <span style={styles.ruleItemText}>{formatCurrency(stats.repasse)}</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Despesas totais</strong>
                  <span style={styles.ruleItemText}>{formatCurrency(stats.despesas)}</span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Lucro estimado</strong>
                  <span style={styles.ruleItemText}>{formatCurrency(stats.lucro)}</span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio analítico</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá comparar períodos, apontar cliente com baixa
                margem, sugerir ajustes de rota, operação, translado e modelo financeiro.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Comparar períodos</div>
                <div style={styles.robotItem}>Ler margem provável</div>
                <div style={styles.robotItem}>Apontar pendências</div>
                <div style={styles.robotItem}>Sugerir melhoria</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/translados/novo" style={styles.navItem}>
                  Novo translado
                </Link>
                <Link href="/translados" style={styles.navItem}>
                  Abrir translados
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

  reportCard: {
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

  filterWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    minWidth: 320,
  },

  select: {
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
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
    minWidth: 240,
  },

  reportList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  reportItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  reportTop: {
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

  reportTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  reportSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  reportTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  reportValue: {
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

  reportGrid: {
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