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

type TransferItem = {
  id: string;
  empresa: string;
  locadora: string;
  aeroporto: string;
  origem: string;
  destino: string;
  cliente: string;
  motorista: string;
  motoristaReserva: string;
  veiculoReserva: string;
  horarioPrevisto: string;
  horarioAtualizado: string;
  tempoEstimadoMin: number;
  acrescimoTransitoMin: number;
  valorTransfer: number;
  valorMotorista: number;
  despesas: number;
  adiantamento: number;
  status: TransferStatus;
  risco: RiskLevel;
  observacao: string;
  origemBase?: "Base padrão" | "Base local";
};

const STORAGE_KEY = "aurora_motoristas_translados";

const initialTransfers: TransferItem[] = [
  {
    id: "TRA-0001",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    aeroporto: "Confins",
    origem: "Aeroporto de Confins",
    destino: "Savassi",
    cliente: "Executivo Nacional",
    motorista: "Carlos Henrique",
    motoristaReserva: "João Pedro",
    veiculoReserva: "Corolla Executivo - RES-01",
    horarioPrevisto: "10/04/2026 08:30",
    horarioAtualizado: "10/04/2026 08:45",
    tempoEstimadoMin: 45,
    acrescimoTransitoMin: 20,
    valorTransfer: 280,
    valorMotorista: 130,
    despesas: 24,
    adiantamento: 40,
    status: "Reagendado",
    risco: "Médio",
    observacao:
      "Horário ajustado por atraso do voo. Manter contato ativo com a locadora.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0002",
    empresa: "Grupo Executivo Mobilidade",
    locadora: "Locadora Premium BH",
    aeroporto: "Confins",
    origem: "Hotel Ouro Minas",
    destino: "Aeroporto de Confins",
    cliente: "Delegação Internacional",
    motorista: "Maria Fernanda",
    motoristaReserva: "Carlos Henrique",
    veiculoReserva: "Spin Executiva - RES-02",
    horarioPrevisto: "10/04/2026 11:00",
    horarioAtualizado: "10/04/2026 11:00",
    tempoEstimadoMin: 38,
    acrescimoTransitoMin: 0,
    valorTransfer: 320,
    valorMotorista: 150,
    despesas: 18,
    adiantamento: 0,
    status: "Agendado",
    risco: "Baixo",
    observacao:
      "Transfer confirmado. Passageiros com bagagem extra. Verificar porta de embarque.",
    origemBase: "Base padrão",
  },
  {
    id: "TRA-0003",
    empresa: "Aurora Locadoras Premium",
    locadora: "Aurora Frotas Executivas",
    aeroporto: "Confins",
    origem: "Aeroporto de Confins",
    destino: "Lourdes",
    cliente: "Operação Aeroporto VIP",
    motorista: "João Pedro",
    motoristaReserva: "Maria Fernanda",
    veiculoReserva: "Onix Sedan - RES-03",
    horarioPrevisto: "10/04/2026 14:20",
    horarioAtualizado: "10/04/2026 14:20",
    tempoEstimadoMin: 42,
    acrescimoTransitoMin: 10,
    valorTransfer: 260,
    valorMotorista: 120,
    despesas: 20,
    adiantamento: 20,
    status: "Aguardando passageiro",
    risco: "Médio",
    observacao:
      "Motorista já no aeroporto aguardando desembarque no portão combinado.",
    origemBase: "Base padrão",
  },
];

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
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

function parseDateTime(value: string) {
  const [datePart, timePart] = value.split(" ");
  if (!datePart || !timePart) return null;

  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (
    !day ||
    !month ||
    !year ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  return new Date(year, month - 1, day, hour, minute);
}

function formatDateTime(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function buildEta(item: TransferItem) {
  const start = parseDateTime(item.horarioAtualizado || item.horarioPrevisto);
  if (!start) return "--/--/---- --:--";

  const totalMinutes = item.tempoEstimadoMin + item.acrescimoTransitoMin;
  const eta = new Date(start.getTime() + totalMinutes * 60 * 1000);
  return formatDateTime(eta);
}

function buildClientTracking(item: TransferItem) {
  const eta = buildEta(item);
  const atraso =
    item.acrescimoTransitoMin > 0
      ? ` com acréscimo estimado de ${item.acrescimoTransitoMin} min por trânsito`
      : "";

  return `Seu motorista ${item.motorista} está vinculado ao trajeto ${item.origem} até ${item.destino}. Horário operacional atualizado: ${item.horarioAtualizado}. Previsão estimada de chegada: ${eta}${atraso}.`;
}

function safeReadStorage(): TransferItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean).map((item) => ({
      ...item,
      origemBase: "Base local" as const,
    })) as TransferItem[];
  } catch {
    return [];
  }
}

export default function TransladosPage() {
  const [transfers, setTransfers] = useState<TransferItem[]>(initialTransfers);
  const [localTransfers, setLocalTransfers] = useState<TransferItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = safeReadStorage();
    setLocalTransfers(saved);
  }, []);

  function updateStatus(id: string, status: TransferStatus, isLocal: boolean) {
    if (isLocal) {
      setLocalTransfers((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                observacao:
                  status === "Concluído"
                    ? "Transfer concluído. Operação pronta para conferência financeira."
                    : item.observacao,
              }
            : item
        )
      );
      return;
    }

    setTransfers((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              observacao:
                status === "Concluído"
                  ? "Transfer concluído. Operação pronta para conferência financeira."
                  : item.observacao,
            }
          : item
      )
    );
  }

  function updateTime(id: string, value: string, isLocal: boolean) {
    if (isLocal) {
      setLocalTransfers((current) =>
        current.map((item) =>
          item.id === id ? { ...item, horarioAtualizado: value } : item
        )
      );
      return;
    }

    setTransfers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, horarioAtualizado: value } : item
      )
    );
  }

  function updateAdvance(id: string, value: string, isLocal: boolean) {
    const parsed = Number(value.replace(",", ".")) || 0;

    if (isLocal) {
      setLocalTransfers((current) =>
        current.map((item) =>
          item.id === id ? { ...item, adiantamento: parsed } : item
        )
      );
      return;
    }

    setTransfers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, adiantamento: parsed } : item
      )
    );
  }

  function updateTransit(id: string, value: string, isLocal: boolean) {
    const parsed = Number(value.replace(",", ".")) || 0;

    if (isLocal) {
      setLocalTransfers((current) =>
        current.map((item) =>
          item.id === id ? { ...item, acrescimoTransitoMin: parsed } : item
        )
      );
      return;
    }

    setTransfers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, acrescimoTransitoMin: parsed } : item
      )
    );
  }

  function updateRisk(id: string, risk: RiskLevel, isLocal: boolean) {
    if (isLocal) {
      setLocalTransfers((current) =>
        current.map((item) =>
          item.id === id ? { ...item, risco: risk } : item
        )
      );
      return;
    }

    setTransfers((current) =>
      current.map((item) =>
        item.id === id ? { ...item, risco: risk } : item
      )
    );
  }

  const allTransfers = useMemo(() => {
    return [...localTransfers, ...transfers];
  }, [localTransfers, transfers]);

  const filteredTransfers = useMemo(() => {
    return allTransfers.filter((item) =>
      `${item.id} ${item.empresa} ${item.locadora} ${item.aeroporto} ${item.origem} ${item.destino} ${item.cliente} ${item.motorista} ${item.motoristaReserva} ${item.veiculoReserva} ${item.status} ${item.risco} ${item.origemBase ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [allTransfers, search]);

  const stats = useMemo(() => {
    return {
      total: filteredTransfers.length,
      agendados: filteredTransfers.filter((item) => item.status === "Agendado").length,
      andamento: filteredTransfers.filter(
        (item) =>
          item.status === "Em deslocamento" ||
          item.status === "Aguardando passageiro"
      ).length,
      concluidos: filteredTransfers.filter((item) => item.status === "Concluído").length,
      altoRisco: filteredTransfers.filter((item) => item.risco === "Alto").length,
      locais: filteredTransfers.filter((item) => item.origemBase === "Base local").length,
      totalTransfer: filteredTransfers.reduce((acc, item) => acc + item.valorTransfer, 0),
      totalMotorista: filteredTransfers.reduce((acc, item) => acc + item.valorMotorista, 0),
      totalDespesas: filteredTransfers.reduce((acc, item) => acc + item.despesas, 0),
      totalAdiantamento: filteredTransfers.reduce((acc, item) => acc + item.adiantamento, 0),
    };
  }, [filteredTransfers]);

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />

        <div style={styles.heroCard}>
          <div style={styles.heroGrid}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>AURORA MOTORISTAS • TRANSLADOS</div>
              <h1 style={styles.heroTitle}>
                Escala premium de translados com ETA, trânsito, reserva e base integrada
              </h1>
              <p style={styles.heroText}>
                Esta área agora junta a base padrão com os translados criados no
                novo cadastro, mantendo risco, contingência, horários e leitura
                financeira em um mesmo painel operacional.
              </p>

              <div style={styles.heroActions}>
                <Link href="/pagamentos" style={styles.secondaryButton}>
                  Voltar para pagamentos
                </Link>

                <Link href="/translados/escala" style={styles.primaryButton}>
                  Ir para escala
                </Link>
              </div>
            </div>

            <div style={styles.heroRightCard}>
              <span style={styles.sideKicker}>MÓDULO DE TRANSLADOS</span>
              <h2 style={styles.sideTitle}>Escala viva para aeroporto</h2>
              <p style={styles.sideText}>
                Pensado para mudanças frequentes de horário, contato rápido com a
                operação e leitura clara do custo por transfer, agora com base local integrada.
              </p>

              <div style={styles.sidePills}>
                <div style={styles.sidePill}>Escala do dia</div>
                <div style={styles.sidePill}>Atualização rápida</div>
                <div style={styles.sidePill}>Financeiro por transfer</div>
              </div>
            </div>
          </div>

          <div style={styles.noticeBox}>
            Sistema em constante atualização. Esta área já lê a base local e
            integra os novos translados ao fluxo do módulo.
          </div>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Translados visíveis</span>
            <strong style={styles.statValue}>{stats.total}</strong>
            <span style={styles.statDetail}>Escala filtrada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Agendados</span>
            <strong style={styles.statValue}>{stats.agendados}</strong>
            <span style={styles.statDetail}>Base programada</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Em operação</span>
            <strong style={styles.statValue}>{stats.andamento}</strong>
            <span style={styles.statDetail}>Deslocamento e espera</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Risco alto</span>
            <strong style={styles.statValue}>{stats.altoRisco}</strong>
            <span style={styles.statDetail}>Atenção da operação</span>
          </article>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total transfers</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalTransfer)}</strong>
            <span style={styles.statDetail}>Receita operacional</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Total motoristas</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalMotorista)}</strong>
            <span style={styles.statDetail}>Repasse previsto</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Despesas</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalDespesas)}</strong>
            <span style={styles.statDetail}>Custos do translado</span>
          </article>

          <article style={styles.statCard}>
            <span style={styles.statLabel}>Adiantamentos</span>
            <strong style={styles.statValue}>{formatCurrency(stats.totalAdiantamento)}</strong>
            <span style={styles.statDetail}>Operação antecipada</span>
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
            <div style={styles.transferCard}>
              <div style={styles.sectionHeader}>
                <div>
                  <span style={styles.sectionEyebrow}>ESCALA OPERACIONAL</span>
                  <h2 style={styles.sectionTitle}>Translados do aeroporto</h2>
                </div>

                <div style={styles.searchBox}>
                  <input
                    placeholder="Buscar por locadora, cliente, motorista, rota, reserva ou status"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              <div style={styles.transferList}>
                {filteredTransfers.length === 0 ? (
                  <div style={styles.emptyState}>
                    Nenhum translado encontrado para este filtro.
                  </div>
                ) : (
                  filteredTransfers.map((item) => {
                    const isLocal = item.origemBase === "Base local";

                    return (
                      <article key={`${item.origemBase}-${item.id}`} style={styles.transferItemCard}>
                        <div style={styles.transferTop}>
                          <div>
                            <div style={styles.metaRow}>
                              <span
                                style={isLocal ? styles.localTag : styles.defaultTag}
                              >
                                {item.origemBase ?? "Base padrão"}
                              </span>
                            </div>

                            <h3 style={styles.transferTitle}>
                              {item.origem} x {item.destino}
                            </h3>
                            <p style={styles.transferSubline}>
                              {item.id} • {item.aeroporto} • {item.locadora}
                            </p>
                          </div>

                          <div style={styles.transferTopRight}>
                            <strong style={styles.transferValue}>
                              {formatCurrency(item.valorTransfer)}
                            </strong>
                            <div style={styles.badgeWrap}>
                              <span style={{ ...styles.badge, ...getStatusStyle(item.status) }}>
                                {item.status}
                              </span>
                              <span style={{ ...styles.badge, ...getRiskStyle(item.risco) }}>
                                Risco {item.risco}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={styles.transferGrid}>
                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Empresa</span>
                            <strong style={styles.dataValue}>{item.empresa}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Locadora</span>
                            <strong style={styles.dataValue}>{item.locadora}</strong>
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
                            <span style={styles.dataLabel}>Motorista reserva</span>
                            <strong style={styles.dataValue}>{item.motoristaReserva}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Veículo reserva</span>
                            <strong style={styles.dataValue}>{item.veiculoReserva}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Horário previsto</span>
                            <strong style={styles.dataValue}>{item.horarioPrevisto}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Horário atualizado</span>
                            <input
                              value={item.horarioAtualizado}
                              onChange={(e) => updateTime(item.id, e.target.value, isLocal)}
                              style={styles.input}
                            />
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Tempo estimado</span>
                            <strong style={styles.dataValue}>{item.tempoEstimadoMin} min</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Acréscimo trânsito</span>
                            <input
                              value={String(item.acrescimoTransitoMin)}
                              onChange={(e) => updateTransit(item.id, e.target.value, isLocal)}
                              style={styles.input}
                            />
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Previsão de chegada</span>
                            <strong style={styles.dataValue}>{buildEta(item)}</strong>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Valor transfer</span>
                            <strong style={styles.dataValue}>
                              {formatCurrency(item.valorTransfer)}
                            </strong>
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

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Adiantamento</span>
                            <input
                              value={String(item.adiantamento)}
                              onChange={(e) => updateAdvance(item.id, e.target.value, isLocal)}
                              style={styles.input}
                            />
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Status</span>
                            <select
                              value={item.status}
                              onChange={(e) =>
                                updateStatus(item.id, e.target.value as TransferStatus, isLocal)
                              }
                              style={styles.select}
                            >
                              <option>Agendado</option>
                              <option>Em deslocamento</option>
                              <option>Aguardando passageiro</option>
                              <option>Concluído</option>
                              <option>Reagendado</option>
                            </select>
                          </div>

                          <div style={styles.dataItem}>
                            <span style={styles.dataLabel}>Risco operacional</span>
                            <select
                              value={item.risco}
                              onChange={(e) =>
                                updateRisk(item.id, e.target.value as RiskLevel, isLocal)
                              }
                              style={styles.select}
                            >
                              <option>Baixo</option>
                              <option>Médio</option>
                              <option>Alto</option>
                            </select>
                          </div>

                          <div style={styles.dataItemWide}>
                            <span style={styles.dataLabel}>Acompanhamento do cliente</span>
                            <strong style={styles.dataValue}>{buildClientTracking(item)}</strong>
                          </div>

                          <div style={styles.dataItemWide}>
                            <span style={styles.dataLabel}>Observação operacional</span>
                            <strong style={styles.dataValue}>{item.observacao}</strong>
                          </div>
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
              <h2 style={styles.sidebarTitle}>Operação mais segura</h2>

              <div style={styles.ruleList}>
                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Previsão para o cliente</strong>
                  <span style={styles.ruleItemText}>
                    Agora você consegue mostrar horário operacional e ETA estimado.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Leitura de trânsito</strong>
                  <span style={styles.ruleItemText}>
                    O acréscimo por congestionamento ajuda a evitar promessas furadas.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Plano B operacional</strong>
                  <span style={styles.ruleItemText}>
                    Motorista e veículo reserva já ficam visíveis para ação rápida.
                  </span>
                </div>

                <div style={styles.ruleItem}>
                  <strong style={styles.ruleItemTitle}>Base local integrada</strong>
                  <span style={styles.ruleItemText}>
                    O translado salvo no cadastro já aparece nesta tela.
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.darkCard}>
              <div style={styles.robotTag}>ROBÔ AURORA</div>
              <h2 style={styles.sidebarTitleDark}>Apoio aos translados</h2>
              <p style={styles.sidebarTextDark}>
                O Robô Aurora poderá alertar atrasos, horários conflitantes,
                repasses apertados, risco alto e necessidade de trocar motorista ou veículo.
              </p>

              <div style={styles.robotList}>
                <div style={styles.robotItem}>Ler atraso</div>
                <div style={styles.robotItem}>Apontar conflito</div>
                <div style={styles.robotItem}>Conferir ETA</div>
                <div style={styles.robotItem}>Sugerir reserva</div>
              </div>
            </div>

            <div style={styles.navCard}>
              <span style={styles.sectionEyebrow}>NAVEGAÇÃO</span>
              <h2 style={styles.sidebarTitle}>Próximos blocos</h2>

              <div style={styles.navList}>
                <Link href="/translados/novo" style={styles.navItem}>
                  Novo translado
                </Link>
                <Link href="/translados/escala" style={styles.navItem}>
                  Abrir escala
                </Link>
                <Link href="/operacao" style={styles.navItem}>
                  Abrir operação
                </Link>
                <Link href="/pagamentos" style={styles.navItem}>
                  Abrir pagamentos
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
    fontSize: 24,
    lineHeight: 1.2,
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

  transferCard: {
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

  transferList: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },

  transferItemCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    border: "1px solid rgba(125, 211, 252, 0.18)",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.04)",
  },

  transferTop: {
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

  transferTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
  },

  transferSubline: {
    marginTop: 8,
    marginBottom: 0,
    color: "#475569",
    lineHeight: 1.6,
    fontSize: 14,
    fontWeight: 600,
  },

  transferTopRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  },

  transferValue: {
    fontSize: 24,
    lineHeight: 1,
    fontWeight: 900,
    color: "#0284c7",
  },

  badgeWrap: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
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

  transferGrid: {
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