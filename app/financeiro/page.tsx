"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FinancialType = "Entrada" | "Saída";
type FinancialCategory =
  | "Conta a receber"
  | "Conta a pagar"
  | "Repasse motorista"
  | "Despesa operacional"
  | "Receita operacional"
  | "Adiantamento"
  | "Centro de custo";

type FinancialStatus = "Pendente" | "Pago" | "Recebido" | "Parcial";
type PaymentMethod = "PIX" | "Transferência" | "Dinheiro" | "Faturado" | "Cartão";

type FinancialEntry = {
  id: string;
  cliente: string;
  empresa: string;
  centroCusto: string;
  descricao: string;
  tipo: FinancialType;
  categoria: FinancialCategory;
  valor: number;
  status: FinancialStatus;
  metodo: PaymentMethod;
  vencimento: string;
  competencia: string;
  observacao: string;
};

const initialEntries: FinancialEntry[] = [
  {
    id: "FIN-0001",
    cliente: "Aurora Locadoras Premium",
    empresa: "Aurora Motoristas",
    centroCusto: "Operação Aeroporto",
    descricao: "Recebimento de translados da semana",
    tipo: "Entrada",
    categoria: "Conta a receber",
    valor: 4200,
    status: "Pendente",
    metodo: "Faturado",
    vencimento: "12/04/2026",
    competencia: "Abril/2026",
    observacao: "Receita operacional da semana com fechamento pendente.",
  },
  {
    id: "FIN-0002",
    cliente: "Pedro Paulo",
    empresa: "Aurora Motoristas",
    centroCusto: "Motoristas",
    descricao: "Repasse semanal motorista",
    tipo: "Saída",
    categoria: "Repasse motorista",
    valor: 980,
    status: "Pendente",
    metodo: "PIX",
    vencimento: "11/04/2026",
    competencia: "Abril/2026",
    observacao: "Repasse semanal previsto conforme operação realizada.",
  },
  {
    id: "FIN-0003",
    cliente: "Grupo Executivo Mobilidade",
    empresa: "Aurora Motoristas",
    centroCusto: "Corporativo",
    descricao: "Recebimento contrato corporativo",
    tipo: "Entrada",
    categoria: "Receita operacional",
    valor: 6800,
    status: "Recebido",
    metodo: "Transferência",
    vencimento: "09/04/2026",
    competencia: "Abril/2026",
    observacao: "Contrato corporativo liquidado no banco.",
  },
  {
    id: "FIN-0004",
    cliente: "Despesas gerais",
    empresa: "Aurora Motoristas",
    centroCusto: "Administrativo",
    descricao: "Combustível, pedágio e apoio",
    tipo: "Saída",
    categoria: "Despesa operacional",
    valor: 1350,
    status: "Pago",
    metodo: "PIX",
    vencimento: "09/04/2026",
    competencia: "Abril/2026",
    observacao: "Despesas operacionais consolidadas da semana.",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getTypeStyle(type: FinancialType): React.CSSProperties {
  if (type === "Entrada") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  return {
    background: "rgba(239, 68, 68, 0.10)",
    color: "#b91c1c",
    border: "1px solid rgba(239, 68, 68, 0.20)",
  };
}

function getStatusStyle(status: FinancialStatus): React.CSSProperties {
  if (status === "Recebido" || status === "Pago") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (status === "Parcial") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  return {
    background: "rgba(37, 99, 235, 0.10)",
    color: "#1d4ed8",
    border: "1px solid rgba(37, 99, 235, 0.18)",
  };
}

export default function FinanceiroPage() {
  const [entries, setEntries] = useState<FinancialEntry[]>(initialEntries);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Todos");
  const [form, setForm] = useState<FinancialEntry>({
    id: "",
    cliente: "",
    empresa: "Aurora Motoristas",
    centroCusto: "",
    descricao: "",
    tipo: "Entrada",
    categoria: "Conta a receber",
    valor: 0,
    status: "Pendente",
    metodo: "PIX",
    vencimento: "10/04/2026",
    competencia: "Abril/2026",
    observacao: "",
  });

  function updateForm<K extends keyof FinancialEntry>(
    field: K,
    value: FinancialEntry[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveEntry() {
    if (!form.cliente.trim() || !form.descricao.trim()) {
      alert("Preencha pelo menos cliente e descrição.");
      return;
    }

    const newEntry: FinancialEntry = {
      ...form,
      id: `FIN-${String(entries.length + 1).padStart(4, "0")}`,
    };

    setEntries((current) => [newEntry, ...current]);
    setForm({
      id: "",
      cliente: "",
      empresa: "Aurora Motoristas",
      centroCusto: "",
      descricao: "",
      tipo: "Entrada",
      categoria: "Conta a receber",
      valor: 0,
      status: "Pendente",
      metodo: "PIX",
      vencimento: "10/04/2026",
      competencia: "Abril/2026",
      observacao: "",
    });
  }

  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => (filterType === "Todos" ? true : item.tipo === filterType))
      .filter((item) =>
        `${item.id} ${item.cliente} ${item.empresa} ${item.centroCusto} ${item.descricao} ${item.tipo} ${item.categoria} ${item.status} ${item.metodo} ${item.competencia}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [entries, search, filterType]);

  const summary = useMemo(() => {
    const entradas = filteredEntries
      .filter((item) => item.tipo === "Entrada")
      .reduce((acc, item) => acc + item.valor, 0);

    const saidas = filteredEntries
      .filter((item) => item.tipo === "Saída")
      .reduce((acc, item) => acc + item.valor, 0);

    const aReceber = filteredEntries
      .filter((item) => item.tipo === "Entrada" && item.status !== "Recebido")
      .reduce((acc, item) => acc + item.valor, 0);

    const aPagar = filteredEntries
      .filter((item) => item.tipo === "Saída" && item.status !== "Pago")
      .reduce((acc, item) => acc + item.valor, 0);

    return {
      entradas,
      saidas,
      aReceber,
      aPagar,
      saldo: entradas - saidas,
    };
  }, [filteredEntries]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • FINANCEIRO</div>
              <h1 style={styles.heroTitle}>
                Entradas, saídas, contas a pagar e a receber em uma base central
              </h1>
              <p style={styles.heroText}>
                Esta área foi criada para reunir movimentações financeiras internas,
                visão por cliente, centro de custo e fechamento operacional em um só lugar,
                preparando o sistema para abandonar planilhas.
              </p>

              <div style={styles.heroActions}>
                <Link href="/pagamentos" style={styles.secondaryButton}>
                  Voltar para pagamentos
                </Link>
                <Link href="/relatorios" style={styles.primaryButton}>
                  Ir para relatórios
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>FINANCEIRO CENTRAL</span>
              <h2 style={styles.sideTitle}>Tudo reunido em um lugar só</h2>
              <p style={styles.sideText}>
                Ideal para acompanhar contas a pagar, contas a receber, despesas,
                repasses, receitas e centro de custo com leitura prática.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Contas a pagar</div>
                <div style={styles.sidePill}>Contas a receber</div>
                <div style={styles.sidePill}>Centro de custo</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta área já prepara o controle
            financeiro interno centralizado. A liberação restrita para administrador
            e autorizados será amarrada no próximo bloco de segurança.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Entradas</span>
            <strong style={styles.statValue}>{formatCurrency(summary.entradas)}</strong>
            <span style={styles.statDetail}>Receita lançada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Saídas</span>
            <strong style={styles.statValue}>{formatCurrency(summary.saidas)}</strong>
            <span style={styles.statDetail}>Desembolso lançado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>A receber</span>
            <strong style={styles.statValue}>{formatCurrency(summary.aReceber)}</strong>
            <span style={styles.statDetail}>Pendência de entrada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>A pagar</span>
            <strong style={styles.statValue}>{formatCurrency(summary.aPagar)}</strong>
            <span style={styles.statDetail}>Pendência de saída</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Saldo projetado</span>
            <strong style={styles.statValue}>{formatCurrency(summary.saldo)}</strong>
            <span style={styles.statDetail}>Entrada menos saída</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.formCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>LANÇAMENTO FINANCEIRO</span>
                  <h2 style={styles.sectionTitle}>Nova movimentação</h2>
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Cliente</label>
                  <input
                    value={form.cliente}
                    onChange={(e) => updateForm("cliente", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Aurora Locadoras Premium"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Empresa</label>
                  <input
                    value={form.empresa}
                    onChange={(e) => updateForm("empresa", e.target.value)}
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Centro de custo</label>
                  <input
                    value={form.centroCusto}
                    onChange={(e) => updateForm("centroCusto", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Operação Aeroporto"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Descrição</label>
                  <input
                    value={form.descricao}
                    onChange={(e) => updateForm("descricao", e.target.value)}
                    style={styles.input}
                    placeholder="Ex.: Repasse semanal motorista"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Tipo</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => updateForm("tipo", e.target.value as FinancialType)}
                    style={styles.select}
                  >
                    <option>Entrada</option>
                    <option>Saída</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Categoria</label>
                  <select
                    value={form.categoria}
                    onChange={(e) =>
                      updateForm("categoria", e.target.value as FinancialCategory)
                    }
                    style={styles.select}
                  >
                    <option>Conta a receber</option>
                    <option>Conta a pagar</option>
                    <option>Repasse motorista</option>
                    <option>Despesa operacional</option>
                    <option>Receita operacional</option>
                    <option>Adiantamento</option>
                    <option>Centro de custo</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Valor</label>
                  <input
                    value={String(form.valor)}
                    onChange={(e) =>
                      updateForm("valor", Number(e.target.value.replace(",", ".")) || 0)
                    }
                    style={styles.input}
                    placeholder="0"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateForm("status", e.target.value as FinancialStatus)
                    }
                    style={styles.select}
                  >
                    <option>Pendente</option>
                    <option>Pago</option>
                    <option>Recebido</option>
                    <option>Parcial</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Método</label>
                  <select
                    value={form.metodo}
                    onChange={(e) =>
                      updateForm("metodo", e.target.value as PaymentMethod)
                    }
                    style={styles.select}
                  >
                    <option>PIX</option>
                    <option>Transferência</option>
                    <option>Dinheiro</option>
                    <option>Faturado</option>
                    <option>Cartão</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Vencimento</label>
                  <input
                    value={form.vencimento}
                    onChange={(e) => updateForm("vencimento", e.target.value)}
                    style={styles.input}
                    placeholder="10/04/2026"
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Competência</label>
                  <input
                    value={form.competencia}
                    onChange={(e) => updateForm("competencia", e.target.value)}
                    style={styles.input}
                    placeholder="Abril/2026"
                  />
                </div>

                <div style={styles.fieldWide}>
                  <label style={styles.label}>Observação</label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => updateForm("observacao", e.target.value)}
                    style={styles.textarea}
                    placeholder="Ex.: conferir com o extrato do banco, custo do cliente, pendência de recebimento."
                  />
                </div>
              </div>

              <div style={styles.actionRow}>
                <button type="button" onClick={saveEntry} style={styles.primaryAction}>
                  Salvar movimentação
                </button>
              </div>
            </div>

            <div style={styles.listCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>BASE FINANCEIRA</span>
                  <h2 style={styles.sectionTitle}>Entradas e saídas</h2>
                </div>

                <div style={styles.filterWrap}>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={styles.select}
                  >
                    <option>Todos</option>
                    <option>Entrada</option>
                    <option>Saída</option>
                  </select>

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                    placeholder="Buscar por cliente, descrição, categoria ou centro de custo"
                  />
                </div>
              </div>

              <div style={styles.list}>
                {filteredEntries.length === 0 ? (
                  <div style={styles.emptyState}>Nenhuma movimentação encontrada.</div>
                ) : (
                  filteredEntries.map((item) => (
                    <article key={item.id} style={styles.itemCard}>
                      <div style={styles.itemTop}>
                        <div>
                          <div style={styles.metaRow}>
                            <span style={{ ...styles.badge, ...getTypeStyle(item.tipo) }}>
                              {item.tipo}
                            </span>
                            <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                              {item.status}
                            </span>
                          </div>

                          <h3 style={styles.itemTitle}>{item.descricao}</h3>
                          <p style={styles.itemSubline}>
                            {item.cliente} • {item.empresa} • {item.id}
                          </p>
                        </div>

                        <strong style={styles.itemValue}>
                          {formatCurrency(item.valor)}
                        </strong>
                      </div>

                      <div style={styles.itemGrid}>
                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Categoria</span>
                          <strong style={styles.dataValue}>{item.categoria}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Centro de custo</span>
                          <strong style={styles.dataValue}>
                            {item.centroCusto || "Não informado"}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Método</span>
                          <strong style={styles.dataValue}>{item.metodo}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Vencimento</span>
                          <strong style={styles.dataValue}>{item.vencimento}</strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Competência</span>
                          <strong style={styles.dataValue}>{item.competencia}</strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação</span>
                          <strong style={styles.dataValue}>
                            {item.observacao || "Sem observação."}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.previewCard}>
              <span style={styles.sectionEyebrow}>LEITURA FINANCEIRA</span>
              <h2 style={styles.sidebarTitle}>Resumo central</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Entradas</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(summary.entradas)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Saídas</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(summary.saidas)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>A receber</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(summary.aReceber)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>A pagar</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(summary.aPagar)}
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Saldo</strong>
                  <span style={styles.ruleItemText}>
                    {formatCurrency(summary.saldo)}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio financeiro</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá apontar cliente inadimplente, centro de custo pesado,
                excesso de saída, diferença entre banco e lançamento e risco de caixa.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Conferir entrada</div>
                <div style={styles.robotItem}>Conferir saída</div>
                <div style={styles.robotItem}>Ler centro de custo</div>
                <div style={styles.robotItem}>Ajudar no caixa</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/diarias" style={styles.navItem}>
                  Abrir diárias
                </Link>
                <Link href="/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
                </Link>
                <Link href="/relatorios" style={styles.navItem}>
                  Abrir relatórios
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operação
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
    fontSize: 26,
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-0.03em",
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
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
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

  formCard: {
    background: "linear-gradient(180deg, #ffffff 0%, #eefaff 100%)",
    borderRadius: 24,
    border: "1px solid rgba(125, 211, 252, 0.24)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15, 23, 42, 0.04)",
  },

  listCard: {
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
    fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)",
    lineHeight: 1.08,
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  fieldWide: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    gridColumn: "1 / -1",
  },

  label: {
    fontSize: 13,
    fontWeight: 900,
    color: "#0f172a",
  },

  input: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  select: {
    minHeight: 48,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },

  textarea: {
    minHeight: 120,
    borderRadius: 16,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: 14,
    fontSize: 14,
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },

  primaryAction: {
    border: "none",
    minHeight: 50,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    boxShadow: "0 14px 30px rgba(37, 99, 235, 0.18)",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  itemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  itemTop: {
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
    flexWrap: "wrap",
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

  itemTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  itemSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 600,
  },

  itemValue: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
  },

  itemGrid: {
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

  filterWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },

  searchInput: {
    minHeight: 46,
    minWidth: 280,
    borderRadius: 14,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 14px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
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

  previewCard: {
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