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

function getStatusStyle(status: PaymentStatus): React.CSSProperties {
  if (status === "Aguardando baixa") {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
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
    background: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    border: "1px solid rgba(16, 185, 129, 0.22)",
  };
}

function getOriginStyle(origin: PaymentOrigin): React.CSSProperties {
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
  const updated = current.filter((item) => item.id !== osSistema);
  safeWriteStoredHistory(updated);
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

  if (status === "Concluído") {
    return "Baixado";
  }

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
    if (isLocal) {
      setLocalPayments((current) =>
        current.map((item) => {
          if (item.id !== paymentId) {
            return item;
          }

          if (item.status === "Aguardando baixa") {
            return {
              ...item,
              status: "Baixado",
              observacaoFinanceira:
                "Baixa confirmada. Item local pronto para fechamento e repasse.",
            };
          }

          if (item.status === "Baixado") {
            const updatedItem: PaymentItem = {
              ...item,
              status: "Pago ao motorista",
              observacaoFinanceira:
                "Repasse ao motorista confirmado. Item local pronto para histórico protegido.",
            };

            appendPaymentToHistory(updatedItem);
            return updatedItem;
          }

          return item;
        })
      );

      setFeedback("Pagamento da base local atualizado com sucesso.");
      return;
    }

    setPayments((current) =>
      current.map((item) => {
        if (item.id !== paymentId) {
          return item;
        }

        if (item.status === "Aguardando baixa") {
          return {
            ...item,
            status: "Baixado",
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
      })
    );

    setFeedback("Pagamento da base padrão atualizado com sucesso.");
  }

  function backPayment(paymentId: string, isLocal: boolean) {
    if (isLocal) {
      setLocalPayments((current) =>
        current.map((item) => {
          if (item.id !== paymentId) {
            return item;
          }

          if (item.status === "Pago ao motorista") {
            removePaymentFromHistory(item.osSistema);

            return {
              ...item,
              status: "Baixado",
              observacaoFinanceira:
                "Repasse voltou para conferência administrativa.",
            };
          }

          if (item.status === "Baixado") {
            return {
              ...item,
              status: "Aguardando baixa",
              observacaoFinanceira:
                "Baixa revertida para validação financeira.",
            };
          }

          return item;
        })
      );

      setFeedback("Pagamento da base local voltou uma etapa.");
      return;
    }

    setPayments((current) =>
      current.map((item) => {
        if (item.id !== paymentId) {
          return item;
        }

        if (item.status === "Pago ao motorista") {
          removePaymentFromHistory(item.osSistema);

          return {
            ...item,
            status: "Baixado",
            observacaoFinanceira:
              "Repasse voltou para conferência administrativa.",
          };
        }

        if (item.status === "Baixado") {
          return {
            ...item,
            status: "Aguardando baixa",
            observacaoFinanceira:
              "Baixa revertida para validação financeira.",
          };
        }

        return item;
      })
    );

    setFeedback("Pagamento da base padrão voltou uma etapa.");
  }

  function changeMethod(
    paymentId: string,
    newMethod: PaymentMethod,
    isLocal: boolean
  ) {
    if (isLocal) {
      setLocalPayments((current) =>
        current.map((item) =>
          item.id === paymentId ? { ...item, metodoPagamento: newMethod } : item
        )
      );
      return;
    }

    setPayments((current) =>
      current.map((item) =>
        item.id === paymentId ? { ...item, metodoPagamento: newMethod } : item
      )
    );
  }

  function changeAdvanceValue(
    paymentId: string,
    value: string,
    isLocal: boolean
  ) {
    const parsed = Number(value.replace(",", ".")) || 0;

    if (isLocal) {
      setLocalPayments((current) =>
        current.map((item) =>
          item.id === paymentId ? { ...item, adiantamento: parsed } : item
        )
      );
      return;
    }

    setPayments((current) =>
      current.map((item) =>
        item.id === paymentId ? { ...item, adiantamento: parsed } : item
      )
    );
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
    const aguardando = allPayments.filter(
      (item) => item.status === "Aguardando baixa"
    ).length;
    const baixados = allPayments.filter((item) => item.status === "Baixado").length;
    const finalizados = allPayments.filter(
      (item) => item.status === "Pago ao motorista"
    ).length;

    return {
      total: allPayments.length,
      aguardando,
      baixados,
      finalizados,
      totalFinanceiro: allPayments.reduce((acc, item) => acc + item.valorTotal, 0),
      totalRepasse: allPayments.reduce((acc, item) => acc + item.valorMotorista, 0),
      totalDespesas: allPayments.reduce((acc, item) => acc + item.despesas, 0),
      totalAdiantamento: allPayments.reduce((acc, item) => acc + item.adiantamento, 0),
      locais: allPayments.filter(
        (item) =>
          item.origemBase === "Serviço local" ||
          item.origemBase === "Translado local"
      ).length,
      translados: allPayments.filter(
        (item) =>
          item.origemBase === "Translado padrão" ||
          item.origemBase === "Translado local"
      ).length,
    };
  }, [allPayments]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • PAGAMENTOS</div>
              <h1 style={styles.heroTitle}>
                Baixa financeira, repasse e fechamento com serviços e translados integrados
              </h1>
              <p style={styles.heroText}>
                Esta área agora junta serviços e translados no mesmo financeiro,
                mantendo baixa, repasse, adiantamento, despesas e leitura clara da
                origem de cada operação.
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

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>CAMADA FINANCEIRA</span>
              <h2 style={styles.sideTitle}>Serviços + translados</h2>
              <p style={styles.sideText}>
                Aqui o financeiro lê a operação principal e também o módulo de
                translados, deixando a baixa mais próxima da sua rotina real.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Aguardando baixa</div>
                <div style={styles.sidePill}>Baixado</div>
                <div style={styles.sidePill}>Pago ao motorista</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta tela já integra serviços,
            translados, base padrão e base local no mesmo fluxo financeiro.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Itens financeiros</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Base unificada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aguardando baixa</span>
            <strong style={styles.statValue}>{stats.aguardando}</strong>
            <span style={styles.statDetail}>Conferência pendente</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Baixados</span>
            <strong style={styles.statValue}>{stats.baixados}</strong>
            <span style={styles.statDetail}>Prontos para repasse</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Finalizados</span>
            <strong style={styles.statValue}>{stats.finalizados}</strong>
            <span style={styles.statDetail}>Prontos para histórico</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total financeiro</span>
            <strong style={styles.statValue}>
              {formatCurrency(stats.totalFinanceiro)}
            </strong>
            <span style={styles.statDetail}>Receita desta base</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total repasse</span>
            <strong style={styles.statValue}>
              {formatCurrency(stats.totalRepasse)}
            </strong>
            <span style={styles.statDetail}>Motoristas envolvidos</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Despesas totais</span>
            <strong style={styles.statValue}>
              {formatCurrency(stats.totalDespesas)}
            </strong>
            <span style={styles.statDetail}>Custos somados</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Adiantamento total</span>
            <strong style={styles.statValue}>
              {formatCurrency(stats.totalAdiantamento)}
            </strong>
            <span style={styles.statDetail}>Inclui translados</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Base local integrada</span>
            <strong style={styles.statValue}>{stats.locais}</strong>
            <span style={styles.statDetail}>Serviços e translados locais</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Itens de translado</span>
            <strong style={styles.statValue}>{stats.translados}</strong>
            <span style={styles.statDetail}>Financeiro do aeroporto</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.paymentCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>CONTROLE FINANCEIRO</span>
                  <h2 style={styles.sectionTitle}>Baixas, repasses e adiantamentos</h2>
                </div>

                <div style={styles.filterArea}>
                  <label style={styles.checkboxWrap}>
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
                      <article key={item.id} style={styles.paymentItemCard}>
                        <div style={styles.paymentTop}>
                          <div>
                            <div style={styles.metaRow}>
                              <span
                                style={{
                                  ...styles.originTag,
                                  ...getOriginStyle(item.origemBase),
                                }}
                              >
                                {item.origemBase}
                              </span>
                            </div>

                            <h3 style={styles.paymentTitle}>{item.servico}</h3>
                            <p style={styles.paymentSubline}>
                              {item.osSistema} • {item.dataServico} • {item.empresa}
                            </p>
                          </div>

                          <div style={styles.paymentTopRight}>
                            <strong style={styles.paymentValue}>
                              {formatCurrency(item.valorTotal)}
                            </strong>
                            <span
                              style={{
                                ...styles.badge,
                                ...getStatusStyle(item.status),
                              }}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>

                        <div style={styles.paymentGrid}>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Cliente</span>
                            <strong style={styles.dataValue}>{item.cliente}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Motorista</span>
                            <strong style={styles.dataValue}>{item.motorista}</strong>
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
                              {formatCurrency(item.valorTransfer ?? item.valorTotal)}
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
                            <input
                              value={String(item.adiantamento)}
                              onChange={(e) =>
                                changeAdvanceValue(item.id, e.target.value, isLocal)
                              }
                              style={styles.input}
                              placeholder="0"
                            />
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Método</span>
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
                          </div>

                          <div style={styles.dataItemWide}>
                            <span style={styles.dataLabel}>Observação financeira</span>
                            <strong style={styles.dataValue}>
                              {item.observacaoFinanceira}
                            </strong>
                          </div>
                        </div>

                        <div style={styles.actionRow}>
                          {item.status !== "Pago ao motorista" ? (
                            <button
                              type="button"
                              onClick={() => advancePayment(item.id, isLocal)}
                              style={styles.primaryAction}
                            >
                              {item.status === "Aguardando baixa" && "Confirmar baixa"}
                              {item.status === "Baixado" && "Confirmar repasse"}
                            </button>
                          ) : (
                            <div style={styles.doneBox}>
                              Registro finalizado. Pronto para histórico interno protegido.
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
          </div>

          <aside style={styles.rightColumn}>
            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>O QUE ESTE BLOCO FECHA</span>
              <h2 style={styles.sidebarTitle}>Leitura financeira real</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Serviços e translados</strong>
                  <span style={styles.ruleItemText}>
                    O financeiro agora lê os dois fluxos no mesmo painel.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Baixa separada</strong>
                  <span style={styles.ruleItemText}>
                    Primeiro confirma entrada e baixa da operação.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Repasse do motorista</strong>
                  <span style={styles.ruleItemText}>
                    Depois confirma o pagamento ao motorista.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Origem visível</strong>
                  <span style={styles.ruleItemText}>
                    Você sabe se o item veio de serviço ou translado, padrão ou local.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio financeiro</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá alertar pagamentos travados, repasses
                atrasados, inconsistências entre valor total, despesas,
                adiantamentos e origem da operação.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler baixa pendente</div>
                <div style={styles.robotItem}>Apontar repasse atrasado</div>
                <div style={styles.robotItem}>Conferir margem</div>
                <div style={styles.robotItem}>Preparar fechamento</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/translados" style={styles.navItem}>
                  Abrir translados
                </Link>
                <Link href="/translados/escala" style={styles.navItem}>
                  Abrir escala
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

  paymentCard: {
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

  feedbackBox: {
    marginBottom: 16,
    padding: "14px 16px",
    borderRadius: 16,
    background: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.18)",
    color: "#065f46",
    lineHeight: 1.7,
    fontSize: 14,
    fontWeight: 800,
  },

  paymentList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  paymentItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  paymentTop: {
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

  paymentTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  paymentSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  paymentTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  paymentValue: {
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

  paymentGrid: {
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

  input: {
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 12px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
  },

  select: {
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid rgba(125, 211, 252, 0.28)",
    padding: "0 12px",
    fontSize: 14,
    color: "#0f172a",
    background: "#ffffff",
    outline: "none",
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