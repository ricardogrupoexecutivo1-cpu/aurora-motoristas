"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type FlowStage =
  | "Cotação"
  | "Em andamento"
  | "Aguardando pagamento"
  | "Pago"
  | "Histórico"
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Concluído"
  | "Reagendado";

type FlowOrigin =
  | "Serviço padrão"
  | "Serviço local"
  | "Translado padrão"
  | "Translado local";

type FlowItem = {
  id: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  data: string;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  etapa: FlowStage;
  observacao: string;
  origemBase: FlowOrigin;
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

type PaidHistoryItem = FlowItem & {
  pagoEm: string;
};

const SERVICES_STORAGE_KEY = "aurora_motoristas_servicos";
const TRANSFERS_STORAGE_KEY = "aurora_motoristas_translados";
const PAID_STORAGE_KEY = "aurora_motoristas_operacao_baixados";
const HISTORY_STORAGE_KEY = "aurora_motoristas_historico_interno";

const baseFlow: FlowItem[] = [
  {
    id: "OP-0001",
    empresa: "Aurora Locadoras Premium",
    cliente: "Operação Aeroporto Premium",
    motorista: "Ricardo Moreira",
    servico: "Lagoa Santa x Savassi",
    data: "10/04/2026",
    valorTotal: 540,
    valorMotorista: 220,
    despesas: 60,
    etapa: "Cotação",
    observacao: "Cotação em análise com possibilidade de ajuste.",
    origemBase: "Serviço padrão",
  },
  {
    id: "OP-0002",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Executivo BH",
    motorista: "Carlos Henrique",
    servico: "BH x São Paulo",
    data: "10/04/2026",
    valorTotal: 1700,
    valorMotorista: 500,
    despesas: 200,
    etapa: "Em andamento",
    observacao: "Operação ativa com pedágios e apoio no percurso.",
    origemBase: "Serviço padrão",
  },
  {
    id: "OP-0003",
    empresa: "Aurora Locadoras Premium",
    cliente: "Evento Nacional",
    motorista: "João Pedro",
    servico: "BH x Confins",
    data: "10/04/2026",
    valorTotal: 400,
    valorMotorista: 150,
    despesas: 50,
    etapa: "Aguardando pagamento",
    observacao: "Serviço concluído, aguardando baixa financeira.",
    origemBase: "Serviço padrão",
  },
  {
    id: "OP-0004",
    empresa: "Aurora Locadoras Premium",
    cliente: "Cliente Premium Sul",
    motorista: "Carlos Henrique",
    servico: "Belo Horizonte x Ouro Preto",
    data: "09/04/2026",
    valorTotal: 390,
    valorMotorista: 180,
    despesas: 40,
    etapa: "Pago",
    observacao: "Pagamento realizado. Deve sair da visão operacional do motorista.",
    origemBase: "Serviço padrão",
  },
  {
    id: "OP-0005",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Contrato Corporativo Nacional",
    motorista: "Maria Fernanda",
    servico: "Contagem x Savassi",
    data: "07/04/2026",
    valorTotal: 680,
    valorMotorista: 260,
    despesas: 50,
    etapa: "Histórico",
    observacao: "Registro encerrado e preservado em histórico administrativo.",
    origemBase: "Serviço padrão",
  },
  {
    id: "OP-TRA-0001",
    empresa: "Aurora Locadoras Premium",
    cliente: "Executivo Nacional",
    motorista: "Carlos Henrique",
    servico: "Aeroporto de Confins x Savassi",
    data: "10/04/2026 08:45",
    valorTotal: 280,
    valorMotorista: 130,
    despesas: 24,
    etapa: "Reagendado",
    observacao: "Translado reagendado por atraso de voo.",
    origemBase: "Translado padrão",
  },
  {
    id: "OP-TRA-0002",
    empresa: "Grupo Executivo Mobilidade",
    cliente: "Delegação Internacional",
    motorista: "Maria Fernanda",
    servico: "Hotel Ouro Minas x Aeroporto de Confins",
    data: "10/04/2026 11:00",
    valorTotal: 320,
    valorMotorista: 150,
    despesas: 18,
    etapa: "Agendado",
    observacao: "Transfer confirmado com operação estável.",
    origemBase: "Translado padrão",
  },
  {
    id: "OP-TRA-0003",
    empresa: "Aurora Locadoras Premium",
    cliente: "Operação Aeroporto VIP",
    motorista: "João Pedro",
    servico: "Aeroporto de Confins x Lourdes",
    data: "10/04/2026 14:20",
    valorTotal: 260,
    valorMotorista: 120,
    despesas: 20,
    etapa: "Aguardando passageiro",
    observacao: "Motorista no aeroporto aguardando desembarque.",
    origemBase: "Translado padrão",
  },
];

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

function safeReadPaidIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PAID_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function safeWritePaidIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAID_STORAGE_KEY, JSON.stringify(ids));
}

function safeReadHistory(): PaidHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? (parsed.filter(Boolean) as PaidHistoryItem[])
      : [];
  } catch {
    return [];
  }
}

function safeWriteHistory(items: PaidHistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

function formatDateTimeNow() {
  return new Date().toLocaleString("pt-BR");
}

function formatPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function openWhatsApp(phone: string, message: string) {
  if (typeof window === "undefined") return;
  const cleanPhone = formatPhone(phone);
  if (!cleanPhone) return;
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function getDriverPhoneByName(name: string) {
  const normalized = name.trim().toLowerCase();

  const map: Record<string, string> = {
    "ricardo moreira": "5531990001001",
    "carlos henrique": "5531990001002",
    "joão pedro": "5531990001003",
    "joao pedro": "5531990001003",
    "maria fernanda": "5531990001004",
    "pedro paulo": "5531990001005",
  };

  return map[normalized] ?? "5531990001999";
}

function getClientPhoneByName(name: string) {
  const normalized = name.trim().toLowerCase();

  const map: Record<string, string> = {
    "operação aeroporto premium": "5531880002001",
    "operacao aeroporto premium": "5531880002001",
    "cliente executivo bh": "5531880002002",
    "evento nacional": "5531880002003",
    "cliente premium sul": "5531880002004",
    "contrato corporativo nacional": "5531880002005",
    "executivo nacional": "5531880002006",
    "delegação internacional": "5531880002007",
    "delegacao internacional": "5531880002007",
    "operação aeroporto vip": "5531880002008",
    "operacao aeroporto vip": "5531880002008",
    "joao bosco": "5531880002009",
    "joao silva": "5531880002010",
  };

  return map[normalized] ?? "5531880002999";
}

function buildOperationMessage(item: FlowItem) {
  return `🚗 Aurora Motoristas

OS/Operação: ${item.id}
Empresa: ${item.empresa}
Cliente: ${item.cliente}
Motorista: ${item.motorista}
Serviço: ${item.servico}
Data: ${item.data}
Valor: ${item.valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
Status atual: ${item.etapa}

Mensagem enviada pela operação da Aurora para acompanhamento do atendimento.`;
}

function buildLocationRequestMessage(item: FlowItem) {
  return `📍 Aurora Motoristas

Operação: ${item.id}
Serviço: ${item.servico}
Data: ${item.data}

Se você concordar, compartilhe sua localização atual para acompanhamento desta operação durante o atendimento.

Esse envio deve ser feito somente durante a execução do serviço.`;
}

function mapLocalService(item: LocalService): FlowItem {
  return {
    id: item.osSistema || item.id,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: item.servico,
    data: item.data,
    valorTotal: item.valorTotal,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    etapa: item.etapa,
    observacao:
      item.observacao?.trim() || "Serviço local integrado à operação mãe.",
    origemBase: "Serviço local",
  };
}

function mapLocalTransfer(item: LocalTransfer): FlowItem {
  return {
    id: item.id,
    empresa: item.empresa,
    cliente: item.cliente,
    motorista: item.motorista,
    servico: `${item.origem} x ${item.destino}`,
    data: item.horarioAtualizado || item.horarioPrevisto,
    valorTotal: item.valorTransfer,
    valorMotorista: item.valorMotorista,
    despesas: item.despesas,
    etapa: item.status,
    observacao:
      item.observacao?.trim() || "Translado local integrado à operação mãe.",
    origemBase: "Translado local",
  };
}

function getStageStyle(stage: FlowStage): React.CSSProperties {
  if (stage === "Cotação") {
    return {
      background: "rgba(148, 163, 184, 0.12)",
      color: "#475569",
      border: "1px solid rgba(148, 163, 184, 0.22)",
    };
  }

  if (stage === "Em andamento" || stage === "Em deslocamento") {
    return {
      background: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
      border: "1px solid rgba(37, 99, 235, 0.18)",
    };
  }

  if (
    stage === "Aguardando pagamento" ||
    stage === "Aguardando passageiro"
  ) {
    return {
      background: "rgba(245, 158, 11, 0.12)",
      color: "#b45309",
      border: "1px solid rgba(245, 158, 11, 0.22)",
    };
  }

  if (stage === "Pago" || stage === "Concluído") {
    return {
      background: "rgba(16, 185, 129, 0.12)",
      color: "#047857",
      border: "1px solid rgba(16, 185, 129, 0.22)",
    };
  }

  if (stage === "Agendado" || stage === "Reagendado") {
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

function getOriginStyle(origin: FlowOrigin): React.CSSProperties {
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

function canMarkAsPaid(item: FlowItem) {
  return (
    item.etapa === "Aguardando pagamento" ||
    item.etapa === "Em andamento" ||
    item.etapa === "Aguardando passageiro"
  );
}

export default function OperacaoPage() {
  const [search, setSearch] = useState("");
  const [localFlow, setLocalFlow] = useState<FlowItem[]>([]);
  const [paidIds, setPaidIds] = useState<string[]>([]);
  const [recentMessage, setRecentMessage] = useState("");

  useEffect(() => {
    const localServices = safeReadServices().map(mapLocalService);
    const localTransfers = safeReadTransfers().map(mapLocalTransfer);
    const paid = safeReadPaidIds();

    setLocalFlow([...localTransfers, ...localServices]);
    setPaidIds(paid);
  }, []);

  function markAsPaid(item: FlowItem) {
    const alreadyPaid = paidIds.includes(item.id);
    if (alreadyPaid) return;

    const nextPaidIds = [item.id, ...paidIds];
    setPaidIds(nextPaidIds);
    safeWritePaidIds(nextPaidIds);

    const currentHistory = safeReadHistory();
    const existsInHistory = currentHistory.some((historyItem) => historyItem.id === item.id);

    if (!existsInHistory) {
      const historyItem: PaidHistoryItem = {
        ...item,
        etapa: "Pago",
        observacao: `${item.observacao} • Baixa registrada em ${formatDateTimeNow()}.`,
        pagoEm: formatDateTimeNow(),
      };

      safeWriteHistory([historyItem, ...currentHistory]);
    }

    setRecentMessage(
      `${item.id} marcado como pago e removido da visão operacional do motorista.`
    );
  }

  const allFlow = useMemo(() => {
    const fullFlow = [...localFlow, ...baseFlow];

    return fullFlow.filter((item) => {
      const hiddenByStage =
        item.etapa === "Pago" ||
        item.etapa === "Histórico" ||
        item.etapa === "Concluído";

      const hiddenByManualPaid = paidIds.includes(item.id);

      return !(hiddenByStage || hiddenByManualPaid);
    });
  }, [localFlow, paidIds]);

  const filteredFlow = useMemo(() => {
    return allFlow.filter((item) =>
      `${item.id} ${item.empresa} ${item.cliente} ${item.motorista} ${item.servico} ${item.etapa} ${item.origemBase}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [allFlow, search]);

  const stats = useMemo(() => {
    return {
      total: filteredFlow.length,
      cotacao: filteredFlow.filter((item) => item.etapa === "Cotação").length,
      andamento: filteredFlow.filter(
        (item) =>
          item.etapa === "Em andamento" ||
          item.etapa === "Em deslocamento" ||
          item.etapa === "Agendado" ||
          item.etapa === "Reagendado" ||
          item.etapa === "Aguardando passageiro"
      ).length,
      aguardandoPagamento: filteredFlow.filter(
        (item) => item.etapa === "Aguardando pagamento"
      ).length,
      locais: filteredFlow.filter(
        (item) =>
          item.origemBase === "Serviço local" ||
          item.origemBase === "Translado local"
      ).length,
      translados: filteredFlow.filter(
        (item) =>
          item.origemBase === "Translado padrão" ||
          item.origemBase === "Translado local"
      ).length,
    };
  }, [filteredFlow]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • OPERAÇÃO</div>
              <h1 style={styles.heroTitle}>
                Fluxo completo da operação com serviços e translados em uma visão única
              </h1>
              <p style={styles.heroText}>
                Esta página conecta a trilha do serviço e do translado desde a
                cotação ou agendamento até pagamento e histórico, inclusive para
                itens criados localmente.
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
              <span style={styles.sideKicker}>VISÃO MÃE</span>
              <h2 style={styles.sideTitle}>Tudo ligado no mesmo fluxo</h2>
              <p style={styles.sideText}>
                Cotação, execução, translados, pagamento e histórico passam a
                ficar visíveis na mesma trilha operacional.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Cotação</div>
                <div style={styles.sidePill}>Pagamento</div>
                <div style={styles.sidePill}>Histórico</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta camada já integra base padrão,
            base local, serviços e translados na visão mãe da operação.
          </div>

          {recentMessage ? <div style={styles.successBanner}>{recentMessage}</div> : null}
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Operações visíveis</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Fluxo consolidado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Em cotação</span>
            <strong style={styles.statValue}>{stats.cotacao}</strong>
            <span style={styles.statDetail}>Pré-operação comercial</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Em andamento</span>
            <strong style={styles.statValue}>{stats.andamento}</strong>
            <span style={styles.statDetail}>Operação ativa</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Aguardando pagamento</span>
            <strong style={styles.statValue}>{stats.aguardandoPagamento}</strong>
            <span style={styles.statDetail}>Pronto para baixa</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Base local integrada</span>
            <strong style={styles.statValue}>{stats.locais}</strong>
            <span style={styles.statDetail}>Itens locais integrados</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Translados na operação</span>
            <strong style={styles.statValue}>{stats.translados}</strong>
            <span style={styles.statDetail}>Fluxo de aeroporto</span>
          </article>
        </div>
      </section>

      <section style={styles.contentSection}>
        <div style={styles.mainGrid}>
          <div style={styles.leftColumn}>
            <div style={styles.flowCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>TRILHA OPERACIONAL</span>
                  <h2 style={styles.sectionTitle}>Da cotação ao histórico</h2>
                </div>

                <input
                  placeholder="Buscar por empresa, cliente, motorista, serviço, translado ou etapa"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.flowList}>
                {filteredFlow.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhuma operação encontrada para este filtro.
                  </div>
                ) : (
                  filteredFlow.map((item) => (
                    <article key={`${item.origemBase}-${item.id}`} style={styles.flowItemCard}>
                      <div style={styles.flowTop}>
                        <div>
                          <div style={styles.metaRow}>
                            <span style={{ ...styles.originTag, ...getOriginStyle(item.origemBase) }}>
                              {item.origemBase}
                            </span>
                          </div>

                          <h3 style={styles.flowTitle}>{item.servico}</h3>
                          <p style={styles.flowSubline}>
                            {item.id} • {item.data} • {item.empresa}
                          </p>
                        </div>

                        <div style={styles.flowTopRight}>
                          <strong style={styles.flowValue}>
                            {item.valorTotal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                          <span style={{ ...styles.badge, ...getStageStyle(item.etapa) }}>
                            {item.etapa}
                          </span>
                        </div>
                      </div>

                      <div style={styles.flowGrid}>
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
                            {item.valorTotal.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Repasse motorista</span>
                          <strong style={styles.dataValue}>
                            {item.valorMotorista.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                        </div>

                        <div style={styles.dataItem}>
                          <span style={styles.dataLabel}>Despesas</span>
                          <strong style={styles.dataValue}>
                            {item.despesas.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </strong>
                        </div>

                        <div style={styles.dataItemWide}>
                          <span style={styles.dataLabel}>Observação do fluxo</span>
                          <strong style={styles.dataValue}>{item.observacao}</strong>
                        </div>
                      </div>

                      <div style={styles.actionBlock}>
                        <div style={styles.communicationRow}>
                          <button
                            type="button"
                            style={styles.whatsDriverButton}
                            onClick={() =>
                              openWhatsApp(
                                getDriverPhoneByName(item.motorista),
                                buildOperationMessage(item)
                              )
                            }
                          >
                            WhatsApp motorista
                          </button>

                          <button
                            type="button"
                            style={styles.whatsClientButton}
                            onClick={() =>
                              openWhatsApp(
                                getClientPhoneByName(item.cliente),
                                buildOperationMessage(item)
                              )
                            }
                          >
                            WhatsApp cliente
                          </button>

                          <button
                            type="button"
                            style={styles.locationButton}
                            onClick={() =>
                              openWhatsApp(
                                getDriverPhoneByName(item.motorista),
                                buildLocationRequestMessage(item)
                              )
                            }
                          >
                            Solicitar localização
                          </button>
                        </div>

                        <div style={styles.itemActions}>
                          {canMarkAsPaid(item) ? (
                            <button
                              type="button"
                              onClick={() => markAsPaid(item)}
                              style={styles.payButton}
                            >
                              Marcar como pago
                            </button>
                          ) : (
                            <span style={styles.readonlyHint}>
                              Acompanhamento em andamento
                            </span>
                          )}
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
              <span style={styles.sectionEyebrow}>LEITURA DO FLUXO</span>
              <h2 style={styles.sidebarTitle}>Etapas conectadas</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Cotação</strong>
                  <span style={styles.ruleItemText}>
                    Entrada comercial e precificação do serviço.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Em andamento</strong>
                  <span style={styles.ruleItemText}>
                    Serviço ativo e translado em execução ou escala.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Aguardando pagamento</strong>
                  <span style={styles.ruleItemText}>
                    Concluído operacionalmente, mas ainda sem baixa.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Pago / Histórico</strong>
                  <span style={styles.ruleItemText}>
                    Sai da visão do motorista e permanece só em histórico interno.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <span style={styles.sectionEyebrow}>COMUNICAÇÃO SEGURA</span>
              <h2 style={styles.sidebarTitle}>Contato dentro da operação</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>WhatsApp com contexto</strong>
                  <span style={styles.ruleItemText}>
                    As mensagens saem já com OS, rota, cliente e status da operação.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Pedido de localização</strong>
                  <span style={styles.ruleItemText}>
                    A solicitação é feita com consentimento, somente durante o atendimento.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Menos evasão</strong>
                  <span style={styles.ruleItemText}>
                    Quanto mais o contato parte da operação, maior o controle do fluxo.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio ao fluxo inteiro</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá apontar gargalos, operações paradas em uma
                etapa, pendências de baixa e trilhas com risco operacional.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler gargalo do fluxo</div>
                <div style={styles.robotItem}>Alertar etapa parada</div>
                <div style={styles.robotItem}>Sugerir prioridade</div>
                <div style={styles.robotItem}>Ajudar na transição</div>
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

  successBanner: {
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

  flowCard: {
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

  flowList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  flowItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  flowTop: {
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

  flowTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  flowSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  flowTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  flowValue: {
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

  flowGrid: {
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

  actionBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 16,
  },

  communicationRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  itemActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },

  payButton: {
    border: "none",
    minHeight: 44,
    padding: "0 16px",
    borderRadius: 14,
    cursor: "pointer",
    fontWeight: 900,
    color: "#ffffff",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 12px 24px rgba(5, 150, 105, 0.20)",
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

  readonlyHint: {
    display: "inline-flex",
    alignItems: "center",
    minHeight: 40,
    padding: "0 12px",
    borderRadius: 12,
    color: "#64748b",
    fontSize: 13,
    fontWeight: 800,
    background: "rgba(148, 163, 184, 0.10)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
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