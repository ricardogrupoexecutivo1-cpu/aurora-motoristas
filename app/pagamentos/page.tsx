"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PaymentStatus = "Aguardando baixa" | "Baixado" | "Pago ao motorista";
type PaymentMethod = "PIX" | "Transferência" | "Dinheiro" | "Faturado";
type PaymentOrigin =
  | "Serviço padrão"
  | "Serviço local"
  | "Translado padrão"
  | "Translado local";

type PaymentItem = {
  id: string;
  osSistema: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  dataServico: string;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  valorTransfer?: number;
  metodoPagamento: PaymentMethod;
  status: PaymentStatus;
  observacaoFinanceira: string;
  origemBase: PaymentOrigin;
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
  origemBase: PaymentOrigin;
  pagoEm: string;
};

const SERVICES_STORAGE_KEY = "aurora_motoristas_servicos";
const TRANSFERS_STORAGE_KEY = "aurora_motoristas_translados";
const HISTORY_STORAGE_KEY = "aurora_motoristas_historico_interno";

const initialPayments: PaymentItem[] = [
  {
    id: "PAG-0001",
    osSistema: "OS-2026-000153",
    empresa: "Aurora Locadoras Premium",
    cliente: "Evento Nacional",
    motorista: "João Pedro",
    servico: "BH x Confins",
    dataServico: "10/04/2026",
    valorTotal: 400,
    valorMotorista: 150,
    despesas: 50,
    adiantamento: 0,
    valorTransfer: 400,
    metodoPagamento: "PIX",
    status: "Aguardando baixa",
    observacaoFinanceira:
      "Serviço concluído aguardando conferência e baixa financeira.",
    origemBase: "Serviço padrão",
  },
  {
    id: "PAG-0002",
    osSistema: "OS-2026-000155",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Premium Sul",
    motorista: "Carlos Henrique",
    servico: "Belo Horizonte x Ouro Preto",
    dataServico: "09/04/2026",
    valorTotal: 390,
    valorMotorista: 180,
    despesas: 40,
    adiantamento: 50,
    valorTransfer: 390,
    metodoPagamento: "Transferência",
    status: "Baixado",
    observacaoFinanceira:
      "Baixa da empresa concluída. Falta repasse final ao motorista.",
    origemBase: "Serviço padrão",
  },
  {
    id: "PAG-0003",
    osSistema: "OS-2026-000156",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Maria Fernanda",
    servico: "Contagem x Savassi",
    dataServico: "07/04/2026",
    valorTotal: 680,
    valorMotorista: 260,
    despesas: 50,
    adiantamento: 0,
    valorTransfer: 680,
    metodoPagamento: "Faturado",
    status: "Pago ao motorista",
    observacaoFinanceira:
      "Baixa concluída e repasse ao motorista finalizado.",
    origemBase: "Serviço padrão",
  },
  {
    id: "PAG-TRA-0001",
    osSistema: "TRA-0001",
    empresa: "Aurora Locadoras Premium",
    cliente: "Executivo Nacional",
    motorista: "Carlos Henrique",
    servico: "Aeroporto de Confins x Savassi",
    dataServico: "10/04/2026 08:45",
    valorTotal: 280,
    valorMotorista: 130,
    despesas: 24,
    adiantamento: 40,
    valorTransfer: 280,
    metodoPagamento: "PIX",
    status: "Aguardando baixa",
    observacaoFinanceira:
      "Translado reagendado aguardando conferência financeira.",
    origemBase: "Translado padrão",
  },
  {
    id: "PAG-TRA-0002",
    osSistema: "TRA-0002",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Delegação Internacional",
    motorista: "Maria Fernanda",
    servico: "Hotel Ouro Minas x Aeroporto de Confins",
    dataServico: "10/04/2026 11:00",
    valorTotal: 320,
    valorMotorista: 150,
    despesas: 18,
    adiantamento: 0,
    valorTransfer: 320,
    metodoPagamento: "Faturado",
    status: "Baixado",
    observacaoFinanceira: "Translado confirmado e pronto para repasse.",
    origemBase: "Translado padrão",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function safeReadServices(): LocalService[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.filter(Boolean) as LocalService[]) : [];
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
    return Array.isArray(parsed) ? (parsed.filter(Boolean) as LocalTransfer[]) : [];
  } catch {
    return [];
  }
}

function safeReadStoredHistory(): StoredHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed.filter(Boolean) as StoredHistoryItem[]) : [];
  } catch {
    return [];
  }
}

function safeWriteStoredHistory(items: StoredHistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

function appendPaymentToHistory(item: PaymentItem) {
  if (typeof window === "undefined") return;

  const current = safeReadStoredHistory();
  const alreadyExists = current.some(
    (historyItem) => historyItem.id === item.osSistema
  );

  if (alreadyExists) return;

  const newItem: StoredHistoryItem = {
    id: item.osSistema,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: item.servico,
    data: item.dataServico,
    valorTotal: item.valorTransfer ?? item.valorTotal,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    etapa: "Pago",
    observacao: item.observacaoFinanceira,
    origemBase: item.origemBase,
    pagoEm: new Date().toLocaleString("pt-BR"),
  };

  safeWriteStoredHistory([newItem, ...current]);
}

function removePaymentFromHistory(osSistema: string) {
  if (typeof window === "undefined") return;
  const current = safeReadStoredHistory();
  safeWriteStoredHistory(current.filter((item) => item.id !== osSistema));
}

function inferPaymentStatusFromServiceStage(
  etapa: LocalService["etapa"]
): PaymentStatus | null {
  if (etapa === "Aguardando pagamento") return "Aguardando baixa";
  if (etapa === "Pago") return "Pago ao motorista";
  return null;
}

function mapLocalServiceToPayment(item: LocalService): PaymentItem | null {
  const status = inferPaymentStatusFromServiceStage(item.etapa);
  if (!status) return null;

  return {
    id: `PAY-${item.id}`,
    osSistema: item.osSistema,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: item.servico,
    dataServico: item.data,
    valorTotal: item.valorTotal,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    adiantamento: 0,
    valorTransfer: item.valorTotal,
    metodoPagamento: "PIX",
    status,
    observacaoFinanceira:
      status === "Aguardando baixa"
        ? "Serviço vindo da base local aguardando conferência e baixa."
        : "Serviço vindo da base local já marcado como pago ao motorista.",
    origemBase: "Serviço local",
  };
}

function inferPaymentStatusFromTransferStatus(
  status: LocalTransfer["status"]
): PaymentStatus | null {
  if (
    status === "Agendado" ||
    status === "Em deslocamento" ||
    status === "Aguardando passageiro" ||
    status === "Reagendado"
  ) {
    return "Aguardando baixa";
  }

  if (status === "Concluído") return "Baixado";
  return null;
}

function mapLocalTransferToPayment(item: LocalTransfer): PaymentItem | null {
  const status = inferPaymentStatusFromTransferStatus(item.status);
  if (!status) return null;

  return {
    id: `PAY-${item.id}`,
    osSistema: item.id,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: `${item.origem} x ${item.destino}`,
    dataServico: item.horarioAtualizado || item.horarioPrevisto,
    valorTotal: item.valorTransfer,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    adiantamento: item.adiantamento,
    valorTransfer: item.valorTransfer,
    metodoPagamento: "PIX",
    status,
    observacaoFinanceira:
      status === "Aguardando baixa"
        ? "Translado local aguardando conferência financeira."
        : "Translado local concluído e pronto para repasse.",
    origemBase: "Translado local",
  };
}

function getStatusStyle(status: PaymentStatus): React.CSSProperties {
  if (status === "Aguardando baixa") {
    return {
      color: "#a16207",
      background: "rgba(254, 243, 199, 0.95)",
      borderColor: "rgba(245, 158, 11, 0.24)",
    };
  }

  if (status === "Baixado") {
    return {
      color: "#1d4ed8",
      background: "rgba(219, 234, 254, 0.95)",
      borderColor: "rgba(37, 99, 235, 0.20)",
    };
  }

  return {
    color: "#047857",
    background: "rgba(209, 250, 229, 0.95)",
    borderColor: "rgba(16, 185, 129, 0.22)",
  };
}

function getOriginStyle(origin: PaymentOrigin): React.CSSProperties {
  if (origin.includes("Translado")) {
    return {
      color: "#0e7490",
      background: "rgba(207, 250, 254, 0.95)",
      borderColor: "rgba(34, 211, 238, 0.26)",
    };
  }

  return {
    color: "#6d28d9",
    background: "rgba(237, 233, 254, 0.95)",
    borderColor: "rgba(124, 58, 237, 0.22)",
  };
}

export default function PagamentosPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [localPayments, setLocalPayments] = useState<PaymentItem[]>([]);
  const [search, setSearch] = useState("");
  const [mostrarFinalizados, setMostrarFinalizados] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const localServices = safeReadServices()
      .map(mapLocalServiceToPayment)
      .filter(Boolean) as PaymentItem[];

    const localTransfers = safeReadTransfers()
      .map(mapLocalTransferToPayment)
      .filter(Boolean) as PaymentItem[];

    setLocalPayments([...localTransfers, ...localServices]);
  }, []);

  const allPayments = useMemo(() => {
    return [...localPayments, ...payments];
  }, [localPayments, payments]);

  function advancePayment(paymentId: string, isLocal: boolean) {
    const updater = (current: PaymentItem[]) =>
      current.map((item) => {
        if (item.id !== paymentId) return item;

        if (item.status === "Aguardando baixa") {
          return {
            ...item,
            status: "Baixado" as PaymentStatus,
            observacaoFinanceira:
              "Baixa confirmada. Item pronto para fechamento e repasse.",
          };
        }

        if (item.status === "Baixado") {
          const updatedItem: PaymentItem = {
            ...item,
            status: "Pago ao motorista",
            observacaoFinanceira:
              "Repasse ao motorista confirmado. Item pronto para histórico protegido.",
          };

          appendPaymentToHistory(updatedItem);
          return updatedItem;
        }

        return item;
      });

    if (isLocal) {
      setLocalPayments(updater);
      setFeedback("Pagamento da base local atualizado com sucesso.");
      return;
    }

    setPayments(updater);
    setFeedback("Pagamento da base padrão atualizado com sucesso.");
  }

  function backPayment(paymentId: string, isLocal: boolean) {
    const updater = (current: PaymentItem[]) =>
      current.map((item) => {
        if (item.id !== paymentId) return item;

        if (item.status === "Pago ao motorista") {
          removePaymentFromHistory(item.osSistema);
          return {
            ...item,
            status: "Baixado" as PaymentStatus,
            observacaoFinanceira: "Repasse voltou para conferência administrativa.",
          };
        }

        if (item.status === "Baixado") {
          return {
            ...item,
            status: "Aguardando baixa" as PaymentStatus,
            observacaoFinanceira: "Baixa revertida para validação financeira.",
          };
        }

        return item;
      });

    if (isLocal) {
      setLocalPayments(updater);
      setFeedback("Pagamento da base local voltou uma etapa.");
      return;
    }

    setPayments(updater);
    setFeedback("Pagamento da base padrão voltou uma etapa.");
  }

  function changeMethod(
    paymentId: string,
    newMethod: PaymentMethod,
    isLocal: boolean
  ) {
    const updater = (current: PaymentItem[]) =>
      current.map((item) =>
        item.id === paymentId ? { ...item, metodoPagamento: newMethod } : item
      );

    if (isLocal) {
      setLocalPayments(updater);
      return;
    }

    setPayments(updater);
  }

  function changeAdvanceValue(paymentId: string, value: string, isLocal: boolean) {
    const parsed = Number(value.replace(",", ".")) || 0;
    const updater = (current: PaymentItem[]) =>
      current.map((item) =>
        item.id === paymentId ? { ...item, adiantamento: parsed } : item
      );

    if (isLocal) {
      setLocalPayments(updater);
      return;
    }

    setPayments(updater);
  }

  const filteredPayments = useMemo(() => {
    return allPayments
      .filter((item) =>
        mostrarFinalizados ? true : item.status !== "Pago ao motorista"
      )
      .filter((item) =>
        `${item.id} ${item.osSistema} ${item.empresa} ${item.cliente} ${item.motorista} ${item.servico} ${item.status} ${item.origemBase}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [allPayments, search, mostrarFinalizados]);

  const stats = useMemo(() => {
    return {
      total: allPayments.length,
      aguardando: allPayments.filter((item) => item.status === "Aguardando baixa")
        .length,
      baixados: allPayments.filter((item) => item.status === "Baixado").length,
      finalizados: allPayments.filter(
        (item) => item.status === "Pago ao motorista"
      ).length,
      totalFinanceiro: allPayments.reduce((acc, item) => acc + item.valorTotal, 0),
      totalRepasse: allPayments.reduce((acc, item) => acc + item.valorMotorista, 0),
      totalDespesas: allPayments.reduce((acc, item) => acc + item.despesas, 0),
      totalAdiantamento: allPayments.reduce(
        (acc, item) => acc + item.adiantamento,
        0
      ),
      locais: allPayments.filter(
        (item) =>
          item.origemBase === "Serviço local" ||
          item.origemBase === "Translado local"
      ).length,
      translados: allPayments.filter((item) => item.origemBase.includes("Translado"))
        .length,
    };
  }, [allPayments]);

  return (
    <main style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />
      <div style={styles.glowC} />

      <section style={styles.shell}>
        <header style={styles.topBar}>
          <Link href="/" style={styles.brand}>
            <span style={styles.brandIcon}>✦</span>
            <span>
              <strong>Aurora Motoristas</strong>
              <small>Financeiro nacional</small>
            </span>
          </Link>

          <nav style={styles.topLinks}>
            <Link href="/servicos">Serviços</Link>
            <Link href="/translados">Translados</Link>
            <Link href="/historico">Histórico</Link>
            <Link href="/relatorios">Relatórios</Link>
          </nav>
        </header>

        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.eyebrow}>Aurora Motoristas • Pagamentos</div>

            <h1 style={styles.heroTitle}>
              Financeiro claro,
              <span> inteligente.</span>
              <br />
              Repasse sem confusão.
            </h1>

            <p style={styles.heroText}>
              Baixa financeira, repasse de motoristas, despesas, adiantamentos,
              serviços e translados em um painel premium, leve e fácil de enxergar.
            </p>

            <div style={styles.heroActions}>
              <Link href="/servicos" style={styles.secondaryButton}>
                Voltar para serviços
              </Link>
              <Link href="/historico" style={styles.primaryButton}>
                Ir para histórico
              </Link>
            </div>
          </div>

          <aside style={styles.heroPanel}>
            <span>Painel financeiro Aurora</span>
            <strong>{formatCurrency(stats.totalFinanceiro)}</strong>
            <small>Total financeiro da base atual</small>

            <div style={styles.panelMiniGrid}>
              <div>
                <strong>{stats.aguardando}</strong>
                <span>Aguardando</span>
              </div>
              <div>
                <strong>{stats.baixados}</strong>
                <span>Baixados</span>
              </div>
              <div>
                <strong>{stats.finalizados}</strong>
                <span>Finalizados</span>
              </div>
            </div>
          </aside>
        </section>

        <section style={styles.metricsGrid}>
          <MetricCard label="Itens financeiros" value={String(stats.total)} detail="Base unificada" />
          <MetricCard label="Aguardando baixa" value={String(stats.aguardando)} detail="Conferência pendente" />
          <MetricCard label="Total repasse" value={formatCurrency(stats.totalRepasse)} detail="Motoristas envolvidos" />
          <MetricCard label="Adiantamentos" value={formatCurrency(stats.totalAdiantamento)} detail="Inclui translados" />
          <MetricCard label="Despesas" value={formatCurrency(stats.totalDespesas)} detail="Custos somados" />
          <MetricCard label="Translados" value={String(stats.translados)} detail="Financeiro operacional" />
        </section>

        <section style={styles.contentGrid}>
          <div style={styles.mainColumn}>
            <div style={styles.toolbarCard}>
              <div>
                <span style={styles.sectionKicker}>Controle financeiro</span>
                <h2 style={styles.sectionTitle}>Baixas, repasses e adiantamentos</h2>
              </div>

              <div style={styles.filterArea}>
                <label style={styles.toggleBox}>
                  <input
                    type="checkbox"
                    checked={mostrarFinalizados}
                    onChange={(e) => setMostrarFinalizados(e.target.checked)}
                  />
                  <span>Mostrar finalizados</span>
                </label>

                <input
                  placeholder="Buscar por OS, empresa, cliente, motorista, origem ou status"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
            </div>

            {feedback ? <div style={styles.feedbackBox}>{feedback}</div> : null}

            <div style={styles.paymentList}>
              {filteredPayments.length === 0 ? (
                <div style={styles.emptyState}>
                  Nenhum pagamento encontrado para este filtro.
                </div>
              ) : (
                filteredPayments.map((item) => {
                  const isLocal =
                    item.origemBase === "Serviço local" ||
                    item.origemBase === "Translado local";

                  return (
                    <article key={item.id} style={styles.paymentCard}>
                      <div style={styles.paymentTop}>
                        <div>
                          <div style={styles.badgeRow}>
                            <span
                              style={{
                                ...styles.originBadge,
                                ...getOriginStyle(item.origemBase),
                              }}
                            >
                              {item.origemBase}
                            </span>

                            <span
                              style={{
                                ...styles.statusBadge,
                                ...getStatusStyle(item.status),
                              }}
                            >
                              {item.status}
                            </span>
                          </div>

                          <h3 style={styles.paymentTitle}>{item.servico}</h3>
                          <p style={styles.paymentSubline}>
                            {item.osSistema} • {item.dataServico} • {item.empresa}
                          </p>
                        </div>

                        <div style={styles.paymentValueBox}>
                          <span>Valor total</span>
                          <strong>{formatCurrency(item.valorTotal)}</strong>
                        </div>
                      </div>

                      <div style={styles.dataGrid}>
                        <DataItem label="Cliente" value={item.cliente} />
                        <DataItem label="Motorista" value={item.motorista} />
                        <DataItem
                          label="Valor transfer"
                          value={formatCurrency(item.valorTransfer ?? item.valorTotal)}
                        />
                        <DataItem
                          label="Repasse motorista"
                          value={formatCurrency(item.valorMotorista)}
                        />
                        <DataItem label="Despesas" value={formatCurrency(item.despesas)} />

                        <label style={styles.fieldBox}>
                          <span>Adiantamento</span>
                          <input
                            value={String(item.adiantamento)}
                            onChange={(e) =>
                              changeAdvanceValue(item.id, e.target.value, isLocal)
                            }
                            style={styles.input}
                            placeholder="0"
                          />
                        </label>

                        <label style={styles.fieldBox}>
                          <span>Método</span>
                          <select
                            value={item.metodoPagamento}
                            onChange={(e) =>
                              changeMethod(
                                item.id,
                                e.target.value as PaymentMethod,
                                isLocal
                              )
                            }
                            style={styles.select}
                          >
                            <option>PIX</option>
                            <option>Transferência</option>
                            <option>Dinheiro</option>
                            <option>Faturado</option>
                          </select>
                        </label>

                        <div style={styles.noteBox}>
                          <span>Observação financeira</span>
                          <strong>{item.observacaoFinanceira}</strong>
                        </div>
                      </div>

                      <div style={styles.actionRow}>
                        {item.status !== "Pago ao motorista" ? (
                          <button
                            type="button"
                            onClick={() => advancePayment(item.id, isLocal)}
                            style={styles.primaryAction}
                          >
                            {item.status === "Aguardando baixa"
                              ? "Confirmar baixa"
                              : "Confirmar repasse"}
                          </button>
                        ) : (
                          <div style={styles.doneBox}>
                            Registro finalizado e pronto para histórico protegido.
                          </div>
                        )}

                        {item.status !== "Aguardando baixa" && (
                          <button
                            type="button"
                            onClick={() => backPayment(item.id, isLocal)}
                            style={styles.secondaryAction}
                          >
                            Voltar etapa
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <aside style={styles.sideColumn}>
            <div style={styles.robotCard}>
              <span style={styles.robotTag}>Robô Aurora</span>
              <h2 style={styles.robotTitle}>Apoio financeiro inteligente</h2>
              <p style={styles.robotText}>
                O Robô Aurora monitora baixas pendentes, repasses atrasados,
                inconsistências de margem, despesas, adiantamentos e origem da operação.
              </p>

              <div style={styles.robotList}>
                <span>Ler baixa pendente</span>
                <span>Apontar repasse atrasado</span>
                <span>Conferir margem</span>
                <span>Preparar fechamento</span>
              </div>
            </div>

            <div style={styles.infoCard}>
              <span style={styles.sectionKicker}>O que este bloco fecha</span>
              <h2 style={styles.sideTitle}>Leitura financeira real</h2>

              <div style={styles.ruleList}>
                <Rule title="Serviços e translados" text="O financeiro lê os dois fluxos no mesmo painel." />
                <Rule title="Baixa separada" text="Primeiro confirma entrada e baixa da operação." />
                <Rule title="Repasse do motorista" text="Depois confirma o pagamento ao motorista." />
                <Rule title="Origem visível" text="Você sabe se veio de serviço ou translado, padrão ou local." />
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionKicker}>Navegação</span>
              <h2 style={styles.sideTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/translados" style={styles.navItem}>Abrir translados</Link>
                <Link href="/translados/escala" style={styles.navItem}>Abrir escala</Link>
                <Link href="/historico" style={styles.navItem}>Abrir histórico</Link>
                <Link href="/relatorios" style={styles.navItem}>Abrir relatórios</Link>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article style={styles.metricCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.dataItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Rule({ title, text }: { title: string; text: string }) {
  return (
    <div style={styles.ruleItem}>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 10% 8%, rgba(236,72,153,0.18), transparent 28%), radial-gradient(circle at 88% 12%, rgba(124,58,237,0.20), transparent 30%), radial-gradient(circle at 50% 40%, rgba(34,211,238,0.18), transparent 34%), linear-gradient(135deg, #f7f9ff 0%, #eef4ff 36%, #faf0ff 70%, #ecfeff 100%)",
    color: "#0b1020",
    paddingBottom: 56,
  },
  glowA: {
    position: "absolute",
    top: -120,
    left: -90,
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(236,72,153,0.18)",
    filter: "blur(70px)",
  },
  glowB: {
    position: "absolute",
    top: -100,
    right: -120,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "rgba(124,58,237,0.20)",
    filter: "blur(76px)",
  },
  glowC: {
    position: "absolute",
    bottom: 80,
    left: "35%",
    width: 360,
    height: 360,
    borderRadius: "50%",
    background: "rgba(34,211,238,0.16)",
    filter: "blur(78px)",
  },
  shell: {
    position: "relative",
    zIndex: 1,
    maxWidth: 1240,
    margin: "0 auto",
    padding: "24px 18px 0",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 0 24px",
  },
  brand: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    color: "#0b1020",
    textDecoration: "none",
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontWeight: 900,
    background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
    boxShadow: "0 14px 30px rgba(124,58,237,0.22)",
  },
  topLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.25fr) minmax(290px, 0.75fr)",
    gap: 18,
    alignItems: "stretch",
    padding: 26,
    borderRadius: 34,
    background: "rgba(255,255,255,0.70)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 28px 90px rgba(99,102,241,0.16)",
    backdropFilter: "blur(18px)",
  },
  heroContent: {
    minWidth: 0,
  },
  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 36,
    padding: "0 16px",
    borderRadius: 999,
    color: "#0f766e",
    background: "rgba(153,246,228,0.62)",
    border: "1px solid rgba(20,184,166,0.18)",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  heroTitle: {
    margin: "18px 0 0",
    maxWidth: 840,
    fontSize: "clamp(2.2rem, 5vw, 5rem)",
    lineHeight: 0.95,
    letterSpacing: "-0.07em",
    fontWeight: 950,
  },
  heroText: {
    margin: "18px 0 0",
    maxWidth: 760,
    color: "#64748b",
    lineHeight: 1.75,
    fontSize: 17,
    fontWeight: 650,
  },
  heroActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 26,
  },
  primaryButton: {
    minHeight: 54,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    borderRadius: 16,
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 950,
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 42%, #ec4899 100%)",
    boxShadow: "0 18px 42px rgba(124,58,237,0.25)",
  },
  secondaryButton: {
    minHeight: 54,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 24px",
    borderRadius: 16,
    color: "#111827",
    textDecoration: "none",
    fontWeight: 950,
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(124,58,237,0.14)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
  },
  heroPanel: {
    borderRadius: 28,
    padding: 22,
    background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(238,242,255,0.74))",
    border: "1px solid rgba(124,58,237,0.14)",
    boxShadow: "0 18px 46px rgba(99,102,241,0.12)",
  },
  panelMiniGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 10,
    marginTop: 20,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))",
    gap: 14,
    marginTop: 18,
  },
  metricCard: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 16px 40px rgba(99,102,241,0.10)",
    backdropFilter: "blur(14px)",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(300px, 0.75fr)",
    gap: 18,
    marginTop: 18,
  },
  mainColumn: {
    minWidth: 0,
  },
  sideColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    minWidth: 0,
  },
  toolbarCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 16px 40px rgba(99,102,241,0.09)",
    backdropFilter: "blur(14px)",
  },
  sectionKicker: {
    display: "block",
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  sectionTitle: {
    margin: "8px 0 0",
    fontSize: 26,
    lineHeight: 1.05,
    fontWeight: 950,
    letterSpacing: "-0.04em",
  },
  filterArea: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  toggleBox: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 46,
    padding: "0 14px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(124,58,237,0.14)",
    color: "#111827",
    fontWeight: 850,
  },
  searchInput: {
    minHeight: 46,
    minWidth: 280,
    borderRadius: 14,
    border: "1px solid rgba(124,58,237,0.16)",
    background: "rgba(255,255,255,0.90)",
    color: "#111827",
    padding: "0 14px",
    outline: "none",
  },
  feedbackBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 18,
    color: "#047857",
    background: "rgba(209,250,229,0.92)",
    border: "1px solid rgba(16,185,129,0.20)",
    fontWeight: 850,
  },
  paymentList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 14,
  },
  paymentCard: {
    padding: 18,
    borderRadius: 26,
    background: "rgba(255,255,255,0.80)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 18px 46px rgba(99,102,241,0.10)",
    backdropFilter: "blur(14px)",
  },
  paymentTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  originBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    fontWeight: 900,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 28,
    padding: "0 10px",
    borderRadius: 999,
    border: "1px solid",
    fontSize: 12,
    fontWeight: 900,
  },
  paymentTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 950,
    letterSpacing: "-0.03em",
  },
  paymentSubline: {
    margin: "8px 0 0",
    color: "#64748b",
    lineHeight: 1.6,
    fontWeight: 700,
  },
  paymentValueBox: {
    minWidth: 170,
    padding: 14,
    borderRadius: 18,
    background: "linear-gradient(135deg, rgba(238,242,255,0.92), rgba(236,253,245,0.78))",
    border: "1px solid rgba(124,58,237,0.12)",
    textAlign: "right",
  },
  dataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
    marginTop: 16,
  },
  dataItem: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 13,
    borderRadius: 16,
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(124,58,237,0.10)",
  },
  fieldBox: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 13,
    borderRadius: 16,
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(124,58,237,0.10)",
  },
  input: {
    minHeight: 42,
    borderRadius: 12,
    border: "1px solid rgba(124,58,237,0.14)",
    background: "#ffffff",
    color: "#111827",
    padding: "0 12px",
    outline: "none",
  },
  select: {
    minHeight: 42,
    borderRadius: 12,
    border: "1px solid rgba(124,58,237,0.14)",
    background: "#ffffff",
    color: "#111827",
    padding: "0 12px",
    outline: "none",
  },
  noteBox: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 13,
    borderRadius: 16,
    background: "rgba(240,253,250,0.85)",
    border: "1px solid rgba(20,184,166,0.14)",
  },
  actionRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  primaryAction: {
    minHeight: 48,
    padding: "0 18px",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
    color: "#ffffff",
    fontWeight: 950,
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 45%, #ec4899 100%)",
    boxShadow: "0 14px 32px rgba(124,58,237,0.22)",
  },
  secondaryAction: {
    minHeight: 48,
    padding: "0 18px",
    borderRadius: 14,
    cursor: "pointer",
    color: "#111827",
    fontWeight: 950,
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(124,58,237,0.14)",
  },
  doneBox: {
    display: "flex",
    alignItems: "center",
    minHeight: 48,
    padding: "0 16px",
    borderRadius: 14,
    color: "#047857",
    background: "rgba(209,250,229,0.88)",
    border: "1px solid rgba(16,185,129,0.20)",
    fontWeight: 850,
  },
  emptyState: {
    padding: 18,
    borderRadius: 22,
    background: "rgba(255,255,255,0.72)",
    border: "1px dashed rgba(124,58,237,0.18)",
    color: "#64748b",
    fontWeight: 850,
  },
  robotCard: {
    padding: 20,
    borderRadius: 26,
    background: "linear-gradient(135deg, rgba(255,255,255,0.88), rgba(238,242,255,0.72))",
    border: "1px solid rgba(124,58,237,0.14)",
    boxShadow: "0 20px 54px rgba(99,102,241,0.12)",
    backdropFilter: "blur(14px)",
  },
  robotTag: {
    color: "#7c3aed",
    fontSize: 12,
    fontWeight: 950,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  robotTitle: {
    margin: "10px 0 0",
    fontSize: 24,
    lineHeight: 1.05,
    fontWeight: 950,
  },
  robotText: {
    margin: "12px 0 0",
    color: "#64748b",
    lineHeight: 1.7,
    fontWeight: 650,
  },
  robotList: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    marginTop: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 16px 40px rgba(99,102,241,0.09)",
  },
  sideTitle: {
    margin: "8px 0 0",
    fontSize: 23,
    fontWeight: 950,
    letterSpacing: "-0.03em",
  },
  ruleList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },
  ruleItem: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
    padding: 13,
    borderRadius: 16,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(124,58,237,0.10)",
  },
  navCard: {
    padding: 20,
    borderRadius: 26,
    background: "rgba(255,255,255,0.76)",
    border: "1px solid rgba(124,58,237,0.12)",
    boxShadow: "0 16px 40px rgba(99,102,241,0.09)",
  },
  navList: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 14,
  },
  navItem: {
    padding: "13px 14px",
    borderRadius: 15,
    color: "#111827",
    textDecoration: "none",
    fontWeight: 900,
    background: "rgba(255,255,255,0.86)",
    border: "1px solid rgba(124,58,237,0.12)",
  },
};