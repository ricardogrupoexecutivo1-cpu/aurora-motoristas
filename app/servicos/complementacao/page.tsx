"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ExpenseItem = {
  id: string;
  descricao: string;
  valor: string;
};

type DetailedExpenseSaved = {
  id: string;
  descricao: string;
  valor: number;
};

type InternalService = {
  id: string;
  source?: string;
  source_quote_id?: string;

  tipo_servico?: string;
  modo_cobranca?: string;

  os?: string;
  data_servico?: string | null;
  status?: string;

  contratante?: string;
  cliente_final?: string;
  contato_cliente_final?: string | null;
  telefone_cliente_final?: string | null;

  empresa_operadora?: string;
  motorista?: string;
  placa_veiculo?: string | null;

  origem?: string;
  destino?: string;
  endereco_retirada?: string;
  endereco_entrega?: string;
  endereco_informado_por?: string | null;

  km_total?: number;
  valor_por_km?: number;
  valor_cobranca?: number;

  valor_motorista?: number;
  adiantamento_motorista?: number;
  despesas_motorista?: number;
  despesas_detalhadas?: DetailedExpenseSaved[];
  fechamento_motorista?: number;
  margem_operacao?: number;

  saldo_anterior_motorista?: number;
  saldo_acumulado_motorista?: number;
  pagar_agora_motorista?: number;

  checklist_obrigatorio?: boolean;
  checklist_instrucoes?: string | null;
  checklist_enviado?: boolean;

  pedido_cotacao?: string | null;
  observacoes?: string | null;

  created_at?: string;
  updated_at?: string;
};

type DraftFields = {
  motorista: string;
  placa_veiculo: string;
  status: string;
  valor_motorista: string;
  adiantamento_motorista: string;
  despesas: ExpenseItem[];
  checklist_obrigatorio: boolean;
  checklist_instrucoes: string;
  checklist_enviado: boolean;
};

const STORAGE_KEY = "aurora_motoristas_services";

function safeText(value?: string | null, fallback = "—") {
  if (!value || !String(value).trim()) return fallback;
  return String(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

function moneyDisplay(value?: number | null) {
  const safeValue = Number(value || 0);
  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatCurrencyInput(value: string) {
  const digits = onlyDigits(value);
  if (!digits) return "";
  const numberValue = Number(digits) / 100;
  return numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function currencyStringToNumber(value: string) {
  if (!value) return 0;
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPlate(value: string) {
  const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
}

function getTipoLabel(value?: string) {
  switch (value) {
    case "busca_veiculo":
      return "Busca de veículo";
    case "entrega_veiculo":
      return "Entrega de veículo";
    case "transporte_executivo":
      return "Transporte executivo";
    case "transfer":
      return "Transfer";
    case "motorista_diaria":
      return "Motorista por diária";
    case "outro":
      return "Outro";
    default:
      return value || "Não definido";
  }
}

function getModoLabel(value?: string) {
  switch (value) {
    case "fechado_total":
      return "Pacote fechado";
    case "por_km_tudo_nosso":
      return "KM com despesas por nossa conta";
    case "por_km_mais_reembolso":
      return "KM menor + reembolso";
    case "diaria_fechada":
      return "Diária fechada";
    default:
      return value || "Não definido";
  }
}

function createEmptyExpense(): ExpenseItem {
  return {
    id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    descricao: "",
    valor: "",
  };
}

function loadServices(): InternalService[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as InternalService[];
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    return [];
  }
}

function buildDraftFromService(service: InternalService): DraftFields {
  const detailedExpenses =
    service.despesas_detalhadas && service.despesas_detalhadas.length > 0
      ? service.despesas_detalhadas.map((item) => ({
          id: item.id || createEmptyExpense().id,
          descricao: item.descricao || "",
          valor:
            Number(item.valor || 0) > 0
              ? Number(item.valor).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "",
        }))
      : [
          {
            id: createEmptyExpense().id,
            descricao: "",
            valor:
              service.despesas_motorista && service.despesas_motorista > 0
                ? service.despesas_motorista.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "",
          },
        ];

  return {
    motorista: service.motorista || "",
    placa_veiculo: service.placa_veiculo || "",
    status: service.status || "pendente",
    valor_motorista:
      service.valor_motorista && service.valor_motorista > 0
        ? service.valor_motorista.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "",
    adiantamento_motorista:
      service.adiantamento_motorista && service.adiantamento_motorista > 0
        ? service.adiantamento_motorista.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "",
    despesas: detailedExpenses,
    checklist_obrigatorio: Boolean(service.checklist_obrigatorio),
    checklist_instrucoes: service.checklist_instrucoes || "",
    checklist_enviado: Boolean(service.checklist_enviado),
  };
}

function getServiceSortDate(service: InternalService): number {
  const value = service.data_servico || service.created_at || service.updated_at;
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getSaldoAnteriorMotorista(
  allServices: InternalService[],
  currentServiceId: string,
  motorista: string
) {
  const motoristaNormalizado = motorista.trim().toLowerCase();
  if (!motoristaNormalizado) return 0;

  return allServices
    .filter((service) => {
      if (service.id === currentServiceId) return false;
      if (!service.motorista?.trim()) return false;
      return service.motorista.trim().toLowerCase() === motoristaNormalizado;
    })
    .sort((a, b) => getServiceSortDate(a) - getServiceSortDate(b))
    .reduce((acc, service) => {
      const saldoDoServico =
        typeof service.fechamento_motorista === "number"
          ? Number(service.fechamento_motorista || 0)
          : Number(service.valor_motorista || 0) -
            Number(service.adiantamento_motorista || 0) -
            Number(service.despesas_motorista || 0);

      return acc + saldoDoServico;
    }, 0);
}

export default function ServicosComplementacaoPage() {
  const [services, setServices] = useState<InternalService[]>([]);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [drafts, setDrafts] = useState<Record<string, DraftFields>>({});

  useEffect(() => {
    refreshServices();
  }, []);

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase();

    const converted = services.filter(
      (item) => item.source === "pedido_cotacao_convertido"
    );

    if (!term) return converted;

    return converted.filter((item) => {
      const haystack = [
        item.id,
        item.os,
        item.contratante,
        item.cliente_final,
        item.motorista,
        item.placa_veiculo,
        item.origem,
        item.destino,
        item.endereco_retirada,
        item.endereco_entrega,
        item.status,
        item.tipo_servico,
        item.modo_cobranca,
        item.pedido_cotacao,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [services, search]);

  function refreshServices() {
    const loaded = loadServices();
    setServices(loaded);

    const nextDrafts: Record<string, DraftFields> = {};
    loaded.forEach((service) => {
      if (service.id) {
        nextDrafts[service.id] = buildDraftFromService(service);
      }
    });
    setDrafts(nextDrafts);
    setFeedback("Leitura de serviços convertidos atualizada.");
  }

  function updateDraft<K extends keyof DraftFields>(
    serviceId: string,
    field: K,
    value: DraftFields[K]
  ) {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: value,
      },
    }));
  }

  function addExpense(serviceId: string) {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        despesas: [...(prev[serviceId]?.despesas || []), createEmptyExpense()],
      },
    }));
  }

  function removeExpense(serviceId: string, expenseId: string) {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        despesas: (prev[serviceId]?.despesas || []).filter(
          (item) => item.id !== expenseId
        ),
      },
    }));
  }

  function updateExpense(
    serviceId: string,
    expenseId: string,
    field: "descricao" | "valor",
    value: string
  ) {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        despesas: (prev[serviceId]?.despesas || []).map((item) =>
          item.id === expenseId ? { ...item, [field]: value } : item
        ),
      },
    }));
  }

  function saveServiceCompletion(service: InternalService) {
    if (!service.id) return;

    const draft = drafts[service.id];
    if (!draft) return;

    try {
      const loaded = loadServices();

      const valorMotorista = currencyStringToNumber(draft.valor_motorista);
      const vale = currencyStringToNumber(draft.adiantamento_motorista);

      const despesasDetalhadas = (draft.despesas || [])
        .filter(
          (exp) => exp.descricao.trim() || currencyStringToNumber(exp.valor) > 0
        )
        .map((exp) => ({
          id: exp.id,
          descricao: exp.descricao.trim() || "Despesa sem nome",
          valor: currencyStringToNumber(exp.valor),
        }));

      const totalDespesas = despesasDetalhadas.reduce(
        (acc, exp) => acc + Number(exp.valor || 0),
        0
      );

      const saldoAnteriorMotorista = getSaldoAnteriorMotorista(
        loaded,
        service.id,
        draft.motorista
      );

      const saldoServicoMotorista = valorMotorista - vale - totalDespesas;
      const saldoAcumuladoMotorista =
        saldoAnteriorMotorista + saldoServicoMotorista;
      const pagarAgora = saldoAcumuladoMotorista > 0 ? saldoAcumuladoMotorista : 0;

      const updated = loaded.map((item) => {
        if (item.id !== service.id) return item;

        const valorCobranca = Number(item.valor_cobranca || 0);
        const margem = valorCobranca - valorMotorista - totalDespesas;

        return {
          ...item,
          motorista: draft.motorista.trim(),
          placa_veiculo: draft.placa_veiculo.trim() || null,
          status: draft.status || "pendente",
          valor_motorista: valorMotorista,
          adiantamento_motorista: vale,
          despesas_motorista: totalDespesas,
          despesas_detalhadas: despesasDetalhadas,
          fechamento_motorista: saldoServicoMotorista,
          saldo_anterior_motorista: saldoAnteriorMotorista,
          saldo_acumulado_motorista: saldoAcumuladoMotorista,
          pagar_agora_motorista: pagarAgora,
          margem_operacao: margem,
          checklist_obrigatorio: draft.checklist_obrigatorio,
          checklist_instrucoes: draft.checklist_instrucoes.trim() || null,
          checklist_enviado: draft.checklist_enviado,
          observacoes: item.observacoes || null,
          updated_at: new Date().toISOString(),
        };
      });

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setServices(updated);
      setFeedback(`Serviço ${service.os || service.id} atualizado com sucesso.`);
    } catch (error) {
      console.error("Erro ao salvar complementação:", error);
      setFeedback("Não foi possível salvar a complementação do serviço.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f7fbff 0%, #eef6ff 48%, #ffffff 100%)",
        padding: "24px 16px 64px",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1220,
          margin: "0 auto",
          display: "grid",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: "#0369a1",
                  fontWeight: 700,
                }}
              >
                Aurora Motoristas
              </p>
              <h1
                style={{
                  margin: "6px 0 8px",
                  fontSize: 30,
                  lineHeight: 1.1,
                }}
              >
                Complementação de serviços convertidos
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  maxWidth: 860,
                  fontSize: 15,
                }}
              >
                Tela interna para completar motorista, placa, checklist, status e
                fechamento básico dos serviços vindos de pedido de cotação, sem
                mexer na tela operacional principal.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/pedidos-cotacao" style={linkSecondaryStyle}>
                Pedidos de cotação
              </Link>

              <Link href="/servicos" style={linkPrimaryStyle}>
                Fluxo operacional
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por OS, contratante, cliente, motorista, placa, rota..."
              style={searchInputStyle}
            />

            <button
              type="button"
              onClick={refreshServices}
              style={actionOutlineButtonStyle}
            >
              Atualizar leitura
            </button>
          </div>

          {feedback ? <div style={noticeBoxStyle}>{feedback}</div> : null}
        </section>

        {filteredServices.length === 0 ? (
          <div style={emptyBoxStyle}>
            Nenhum serviço convertido encontrado nesta leitura.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {filteredServices.map((service) => {
              const draft =
                drafts[service.id || ""] || buildDraftFromService(service);

              const valorMotorista = currencyStringToNumber(draft.valor_motorista || "");
              const vale = currencyStringToNumber(
                draft.adiantamento_motorista || ""
              );
              const totalDespesas = (draft.despesas || []).reduce(
                (acc, item) => acc + currencyStringToNumber(item.valor),
                0
              );

              const saldoAnteriorMotorista = getSaldoAnteriorMotorista(
                services,
                service.id || "",
                draft.motorista
              );
              const saldoServicoMotorista = valorMotorista - vale - totalDespesas;
              const saldoAcumuladoMotorista =
                saldoAnteriorMotorista + saldoServicoMotorista;
              const pagarAgora =
                saldoAcumuladoMotorista > 0 ? saldoAcumuladoMotorista : 0;

              const valorCobranca = Number(service.valor_cobranca || 0);
              const margem = valorCobranca - valorMotorista - totalDespesas;
              const saldoNegativo = saldoServicoMotorista < 0;
              const margemNegativa = margem < 0;

              return (
                <article
                  key={service.id}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #dbeafe",
                    borderRadius: 24,
                    padding: 20,
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
                    display: "grid",
                    gap: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#0369a1",
                          fontWeight: 800,
                          marginBottom: 6,
                        }}
                      >
                        {getTipoLabel(service.tipo_servico)} •{" "}
                        {getModoLabel(service.modo_cobranca)}
                      </div>
                      <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>
                        {safeText(service.os)} • {safeText(service.contratante)} →{" "}
                        {safeText(service.cliente_final)}
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#475569",
                          fontSize: 14,
                        }}
                      >
                        Pedido origem: {safeText(service.pedido_cotacao)} • Criado em{" "}
                        {formatDate(service.created_at)}
                      </p>
                    </div>

                    <div style={pillStyle}>{safeText(service.status, "pendente")}</div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <MiniInfo label="Contato" value={safeText(service.contato_cliente_final)} />
                    <MiniInfo label="Telefone" value={safeText(service.telefone_cliente_final)} />
                    <MiniInfo label="Data do serviço" value={formatDate(service.data_servico)} />
                    <MiniInfo label="Origem" value={safeText(service.origem)} />
                    <MiniInfo label="Destino" value={safeText(service.destino)} />
                    <MiniInfo label="Cobrança ao contratante" value={moneyDisplay(service.valor_cobranca)} />
                  </div>

                  <section style={sectionBoxStyle}>
                    <SectionTitle
                      title="Complementação interna"
                      subtitle="Preencha aqui o que faltou da operação interna."
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 14,
                      }}
                    >
                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Motorista</span>
                        <input
                          value={draft.motorista}
                          onChange={(e) =>
                            updateDraft(service.id || "", "motorista", e.target.value)
                          }
                          placeholder="Ex.: João Carlos"
                          style={inputStyle}
                        />
                      </label>

                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Placa</span>
                        <input
                          value={draft.placa_veiculo}
                          onChange={(e) =>
                            updateDraft(
                              service.id || "",
                              "placa_veiculo",
                              formatPlate(e.target.value)
                            )
                          }
                          placeholder="ABC-1234"
                          style={inputStyle}
                        />
                      </label>

                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Status</span>
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            updateDraft(service.id || "", "status", e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="pendente">pendente</option>
                          <option value="em_andamento">em_andamento</option>
                          <option value="concluido">concluido</option>
                          <option value="aguardando_pagamento">aguardando_pagamento</option>
                          <option value="pago">pago</option>
                          <option value="cancelado">cancelado</option>
                        </select>
                      </label>

                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Valor do serviço do motorista</span>
                        <input
                          value={draft.valor_motorista}
                          onChange={(e) =>
                            updateDraft(
                              service.id || "",
                              "valor_motorista",
                              formatCurrencyInput(e.target.value)
                            )
                          }
                          placeholder="0,00"
                          inputMode="numeric"
                          style={inputStyle}
                        />
                      </label>

                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Vale / adiantamento</span>
                        <input
                          value={draft.adiantamento_motorista}
                          onChange={(e) =>
                            updateDraft(
                              service.id || "",
                              "adiantamento_motorista",
                              formatCurrencyInput(e.target.value)
                            )
                          }
                          placeholder="0,00"
                          inputMode="numeric"
                          style={inputStyle}
                        />
                      </label>
                    </div>

                    <section style={sectionBoxStyle}>
                      <SectionTitle
                        title="Despesas editáveis"
                        subtitle="Adicione quantas despesas forem necessárias, com nomes livres e valores independentes."
                      />

                      <div style={{ display: "grid", gap: 12 }}>
                        {(draft.despesas || []).map((expense, index) => (
                          <div
                            key={expense.id}
                            style={{
                              display: "grid",
                              gridTemplateColumns: "minmax(220px, 1fr) 180px auto",
                              gap: 12,
                              alignItems: "end",
                            }}
                          >
                            <label style={labelStyle}>
                              <span style={labelTextStyle}>
                                Despesa {index + 1} • descrição
                              </span>
                              <input
                                value={expense.descricao}
                                onChange={(e) =>
                                  updateExpense(
                                    service.id || "",
                                    expense.id,
                                    "descricao",
                                    e.target.value
                                  )
                                }
                                placeholder="Ex.: combustível, pedágio, hotel, alimentação..."
                                style={inputStyle}
                              />
                            </label>

                            <label style={labelStyle}>
                              <span style={labelTextStyle}>Valor</span>
                              <input
                                value={expense.valor}
                                onChange={(e) =>
                                  updateExpense(
                                    service.id || "",
                                    expense.id,
                                    "valor",
                                    formatCurrencyInput(e.target.value)
                                  )
                                }
                                placeholder="0,00"
                                inputMode="numeric"
                                style={inputStyle}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => removeExpense(service.id || "", expense.id)}
                              style={removeButtonStyle}
                            >
                              Remover
                            </button>
                          </div>
                        ))}

                        <div style={{ display: "flex", justifyContent: "flex-start" }}>
                          <button
                            type="button"
                            onClick={() => addExpense(service.id || "")}
                            style={actionOutlineButtonStyle}
                          >
                            Adicionar despesa
                          </button>
                        </div>
                      </div>
                    </section>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                      }}
                    >
                      <MiniInfo
                        label="Valor do serviço"
                        value={moneyDisplay(valorMotorista)}
                      />
                      <MiniInfo label="Vale" value={moneyDisplay(vale)} />
                      <MiniInfo
                        label="Total das despesas"
                        value={moneyDisplay(totalDespesas)}
                      />
                      <MiniInfo
                        label="Saldo anterior do motorista"
                        value={moneyDisplay(saldoAnteriorMotorista)}
                      />
                      <MiniInfo
                        label="Saldo do serviço"
                        value={moneyDisplay(saldoServicoMotorista)}
                      />
                      <MiniInfo
                        label="Saldo acumulado"
                        value={moneyDisplay(saldoAcumuladoMotorista)}
                      />
                      <MiniInfo
                        label="Pagar agora"
                        value={moneyDisplay(pagarAgora)}
                      />
                      <MiniInfo
                        label="Margem da operação"
                        value={moneyDisplay(margem)}
                      />
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          ...resultBoxStyle,
                          borderColor: saldoNegativo ? "#fca5a5" : "#86efac",
                          background: saldoNegativo ? "#fef2f2" : "#f0fdf4",
                          color: saldoNegativo ? "#b91c1c" : "#166534",
                        }}
                      >
                        <strong style={{ display: "block", marginBottom: 6 }}>
                          {saldoNegativo
                            ? "Saldo do serviço negativo"
                            : "Saldo do serviço positivo"}
                        </strong>
                        <span>{moneyDisplay(saldoServicoMotorista)}</span>
                      </div>

                      <div
                        style={{
                          ...resultBoxStyle,
                          borderColor:
                            saldoAcumuladoMotorista < 0 ? "#fca5a5" : "#86efac",
                          background:
                            saldoAcumuladoMotorista < 0 ? "#fef2f2" : "#f0fdf4",
                          color:
                            saldoAcumuladoMotorista < 0 ? "#b91c1c" : "#166534",
                        }}
                      >
                        <strong style={{ display: "block", marginBottom: 6 }}>
                          {saldoAcumuladoMotorista < 0
                            ? "Saldo acumulado negativo"
                            : "Saldo acumulado positivo"}
                        </strong>
                        <span>{moneyDisplay(saldoAcumuladoMotorista)}</span>
                      </div>

                      <div
                        style={{
                          ...resultBoxStyle,
                          borderColor: margemNegativa ? "#fca5a5" : "#86efac",
                          background: margemNegativa ? "#fef2f2" : "#f0fdf4",
                          color: margemNegativa ? "#b91c1c" : "#166534",
                        }}
                      >
                        <strong style={{ display: "block", marginBottom: 6 }}>
                          {margemNegativa
                            ? "Operação em prejuízo"
                            : "Operação com margem positiva"}
                        </strong>
                        <span>{moneyDisplay(margem)}</span>
                      </div>
                    </div>
                  </section>

                  <section style={sectionBoxStyle}>
                    <SectionTitle
                      title="Checklist interno"
                      subtitle="Continua interno e não interfere no fluxo público."
                    />

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 700,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={draft.checklist_obrigatorio}
                        onChange={(e) =>
                          updateDraft(
                            service.id || "",
                            "checklist_obrigatorio",
                            e.target.checked
                          )
                        }
                      />
                      Checklist obrigatório
                    </label>

                    <label style={labelStyle}>
                      <span style={labelTextStyle}>Instruções do checklist</span>
                      <textarea
                        value={draft.checklist_instrucoes}
                        onChange={(e) =>
                          updateDraft(
                            service.id || "",
                            "checklist_instrucoes",
                            e.target.value
                          )
                        }
                        rows={4}
                        placeholder="Fotos, avarias, combustível, documentos, quilometragem..."
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          paddingTop: 12,
                        }}
                      />
                    </label>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontWeight: 700,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={draft.checklist_enviado}
                        onChange={(e) =>
                          updateDraft(
                            service.id || "",
                            "checklist_enviado",
                            e.target.checked
                          )
                        }
                      />
                      Checklist enviado / concluído
                    </label>
                  </section>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => saveServiceCompletion(service)}
                      style={actionPrimaryButtonStyle}
                    >
                      Salvar complementação
                    </button>
                  </div>

                  <div style={noticeBoxStyle}>
                    <strong>Blindagem mantida:</strong> esta página existe para
                    complementar o serviço convertido sem mexer na tela operacional
                    principal que já está funcionando.
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>{title}</h2>
      <p style={{ margin: 0, color: "#475569", fontSize: 14 }}>{subtitle}</p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14 }}>
        {value}
      </div>
    </div>
  );
}

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 260,
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  fontSize: 14,
  outline: "none",
  background: "#ffffff",
  color: "#0f172a",
};

const emptyBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
  borderRadius: 18,
  padding: 24,
  color: "#475569",
  textAlign: "center",
};

const sectionBoxStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  background: "#fcfdff",
  border: "1px solid #e2e8f0",
  borderRadius: 20,
  padding: 18,
};

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelTextStyle: React.CSSProperties = {
  fontWeight: 700,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  fontSize: 14,
  outline: "none",
  background: "#ffffff",
  color: "#0f172a",
};

const noticeBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.6,
};

const resultBoxStyle: React.CSSProperties = {
  border: "1px solid",
  borderRadius: 18,
  padding: 16,
  fontSize: 14,
  lineHeight: 1.6,
};

const pillStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  background: "#eef6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
  fontWeight: 800,
  fontSize: 13,
};

const actionOutlineButtonStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid #0ea5e9",
  background: "#f0f9ff",
  color: "#0369a1",
  fontWeight: 800,
  cursor: "pointer",
};

const actionPrimaryButtonStyle: React.CSSProperties = {
  padding: "12px 18px",
  borderRadius: 14,
  border: "1px solid #0ea5e9",
  background: "#0ea5e9",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
};

const removeButtonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #fecaca",
  background: "#fff1f2",
  color: "#be123c",
  fontWeight: 800,
  cursor: "pointer",
  height: 46,
};

const linkSecondaryStyle: React.CSSProperties = {
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  fontWeight: 600,
  background: "#fff",
};

const linkPrimaryStyle: React.CSSProperties = {
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: 12,
  border: "1px solid #0ea5e9",
  color: "#0369a1",
  fontWeight: 700,
  background: "#f0f9ff",
};