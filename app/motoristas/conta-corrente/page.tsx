"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

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

type DriverPayment = {
  id: string;
  motorista: string;
  valor: number;
  observacao: string | null;
  created_at: string;
};

type DriverLedgerService = InternalService & {
  saldo_anterior_motorista: number;
  saldo_acumulado_motorista: number;
  pagar_agora_motorista: number;
};

type DriverLedgerRow = {
  motorista: string;
  totalServicos: number;
  totalValorServico: number;
  totalVales: number;
  totalDespesas: number;
  totalCobranca: number;
  saldoBruto: number;
  totalQuitado: number;
  saldoAcumulado: number;
  pagarAgora: number;
  margemTotal: number;
  servicos: DriverLedgerService[];
  pagamentos: DriverPayment[];
};

type PaymentDraft = {
  valor: string;
  observacao: string;
};

const SERVICES_STORAGE_KEY = "aurora_motoristas_services";
const PAYMENTS_STORAGE_KEY = "aurora_motoristas_driver_payments";

function safeText(value?: string | null, fallback = "â€”") {
  if (!value || !String(value).trim()) return fallback;
  return String(value);
}

function moneyDisplay(value?: number | null) {
  const safeValue = Number(value || 0);
  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "â€”";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
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

function loadServices(): InternalService[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as InternalService[];
  } catch (error) {
    console.error("Erro ao carregar serviços:", error);
    return [];
  }
}

function loadPayments(): DriverPayment[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as DriverPayment[];
  } catch (error) {
    console.error("Erro ao carregar pagamentos:", error);
    return [];
  }
}

function savePayments(payments: DriverPayment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(payments));
}

function getServiceSortDate(service: InternalService): number {
  const value = service.data_servico || service.created_at || service.updated_at;
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function MotoristasContaCorrentePage() {
  const [services, setServices] = useState<InternalService[]>([]);
  const [payments, setPayments] = useState<DriverPayment[]>([]);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, PaymentDraft>>({});

  useEffect(() => {
    refreshData();
  }, []);

  const ledgerRows = useMemo(() => {
    const grouped = new Map<string, InternalService[]>();

    services
      .filter((service) => service.motorista?.trim())
      .forEach((service) => {
        const key = service.motorista!.trim().toLowerCase();
        const current = grouped.get(key) || [];
        current.push(service);
        grouped.set(key, current);
      });

    const rows: DriverLedgerRow[] = [];

    grouped.forEach((groupServices, key) => {
      const ordered = [...groupServices].sort(
        (a, b) => getServiceSortDate(a) - getServiceSortDate(b)
      );

      const motoristaNome = ordered[0]?.motorista?.trim() || "Sem nome";
      const pagamentosMotorista = payments
        .filter((payment) => payment.motorista.trim().toLowerCase() === key)
        .sort((a, b) => {
          const da = new Date(a.created_at).getTime();
          const db = new Date(b.created_at).getTime();
          return db - da;
        });

      let saldoBruto = 0;
      let totalValorServico = 0;
      let totalVales = 0;
      let totalDespesas = 0;
      let totalCobranca = 0;
      let margemTotal = 0;

      const servicosProcessados: DriverLedgerService[] = ordered.map((service) => {
        const valorServico = Number(service.valor_motorista || 0);
        const vale = Number(service.adiantamento_motorista || 0);
        const despesas = Number(service.despesas_motorista || 0);
        const cobranca = Number(service.valor_cobranca || 0);
        const saldoServico =
          typeof service.fechamento_motorista === "number"
            ? Number(service.fechamento_motorista || 0)
            : valorServico - vale - despesas;

        const saldoAnterior = saldoBruto;
        saldoBruto += saldoServico;

        totalValorServico += valorServico;
        totalVales += vale;
        totalDespesas += despesas;
        totalCobranca += cobranca;
        margemTotal += Number(service.margem_operacao || 0);

        return {
          ...service,
          saldo_anterior_motorista: saldoAnterior,
          saldo_acumulado_motorista: saldoBruto,
          pagar_agora_motorista: 0,
        };
      });

      const totalQuitado = pagamentosMotorista.reduce(
        (acc, payment) => acc + Number(payment.valor || 0),
        0
      );

      const saldoAcumulado = saldoBruto - totalQuitado;
      const pagarAgora = saldoAcumulado > 0 ? saldoAcumulado : 0;

      rows.push({
        motorista: motoristaNome,
        totalServicos: servicosProcessados.length,
        totalValorServico,
        totalVales,
        totalDespesas,
        totalCobranca,
        saldoBruto,
        totalQuitado,
        saldoAcumulado,
        pagarAgora,
        margemTotal,
        servicos: servicosProcessados.reverse(),
        pagamentos: pagamentosMotorista,
      });
    });

    rows.sort((a, b) => a.motorista.localeCompare(b.motorista, "pt-BR"));
    return rows;
  }, [services, payments]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return ledgerRows;

    return ledgerRows.filter((row) => {
      const haystack = [
        row.motorista,
        ...row.servicos.flatMap((service) => [
          service.os,
          service.contratante,
          service.cliente_final,
          service.origem,
          service.destino,
          service.status,
          service.observacoes,
        ]),
        ...row.pagamentos.flatMap((payment) => [payment.observacao]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [ledgerRows, search]);

  const totalMotoristas = filteredRows.length;
  const totalSaldoNegativo = filteredRows
    .filter((row) => row.saldoAcumulado < 0)
    .reduce((acc, row) => acc + Math.abs(row.saldoAcumulado), 0);
  const totalPagarAgora = filteredRows.reduce(
    (acc, row) => acc + row.pagarAgora,
    0
  );
  const totalMargem = filteredRows.reduce((acc, row) => acc + row.margemTotal, 0);

  function refreshData() {
    const loadedServices = loadServices();
    const loadedPayments = loadPayments();

    setServices(loadedServices);
    setPayments(loadedPayments);

    const nextDrafts: Record<string, PaymentDraft> = {};
    const uniqueDrivers = Array.from(
      new Set(
        loadedServices
          .map((service) => service.motorista?.trim())
          .filter(Boolean) as string[]
      )
    );

    uniqueDrivers.forEach((driver) => {
      nextDrafts[driver.toLowerCase()] = {
        valor: "",
        observacao: "",
      };
    });

    setPaymentDrafts((prev) => ({ ...nextDrafts, ...prev }));
    setFeedback("Leitura da conta corrente dos motoristas atualizada.");
  }

  function updatePaymentDraft(
    motorista: string,
    field: keyof PaymentDraft,
    value: string
  ) {
    const key = motorista.trim().toLowerCase();
    setPaymentDrafts((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || { valor: "", observacao: "" }),
        [field]: value,
      },
    }));
  }

  function registerPayment(row: DriverLedgerRow) {
    const key = row.motorista.trim().toLowerCase();
    const draft = paymentDrafts[key] || { valor: "", observacao: "" };
    const valorInformado = currencyStringToNumber(draft.valor);

    if (valorInformado <= 0) {
      setFeedback(`Informe um valor válido para quitar ${row.motorista}.`);
      return;
    }

    if (valorInformado > row.pagarAgora) {
      setFeedback(
        `O valor informado para ${row.motorista} não pode ser maior que o valor sugerido para pagar agora.`
      );
      return;
    }

    try {
      const nextPayments = [
        {
          id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          motorista: row.motorista,
          valor: valorInformado,
          observacao: draft.observacao.trim() || null,
          created_at: new Date().toISOString(),
        },
        ...payments,
      ];

      savePayments(nextPayments);
      setPayments(nextPayments);
      setPaymentDrafts((prev) => ({
        ...prev,
        [key]: { valor: "", observacao: "" },
      }));
      setFeedback(`Quitação registrada com sucesso para ${row.motorista}.`);
    } catch (error) {
      console.error("Erro ao registrar quitação:", error);
      setFeedback("Não foi possível registrar a quitação.");
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
          maxWidth: 1240,
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
                Conta corrente dos motoristas
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  maxWidth: 860,
                  fontSize: 15,
                }}
              >
                Visão consolidada por motorista, com saldo anterior, saldo do
                serviço, saldo acumulado, valor sugerido para pagar agora e
                histórico de quitações, mantendo a margem da empresa separada.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/servicos/complementacao" style={linkSecondaryStyle}>
                Complementação
              </Link>

              <Link href="/servicos" style={linkPrimaryStyle}>
                Fluxo operacional
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <InfoCard label="Motoristas" value={String(totalMotoristas)} />
            <InfoCard
              label="Saldo negativo acumulado"
              value={moneyDisplay(totalSaldoNegativo)}
            />
            <InfoCard
              label="Total sugerido para pagar"
              value={moneyDisplay(totalPagarAgora)}
            />
            <InfoCard label="Margem total" value={moneyDisplay(totalMargem)} />
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
              placeholder="Buscar por motorista, OS, contratante, cliente, rota..."
              style={searchInputStyle}
            />

            <button
              type="button"
              onClick={refreshData}
              style={actionOutlineButtonStyle}
            >
              Atualizar leitura
            </button>
          </div>

          {feedback ? <div style={noticeBoxStyle}>{feedback}</div> : null}
        </section>

        {filteredRows.length === 0 ? (
          <div style={emptyBoxStyle}>
            Nenhum motorista com serviços complementados encontrado nesta leitura.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredRows.map((row) => {
              const paymentDraft =
                paymentDrafts[row.motorista.trim().toLowerCase()] || {
                  valor: "",
                  observacao: "",
                };

              return (
                <article
                  key={row.motorista}
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
                      flexWrap: "wrap",
                      gap: 12,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 24,
                          lineHeight: 1.15,
                        }}
                      >
                        {row.motorista}
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#475569",
                          fontSize: 14,
                        }}
                      >
                        {row.totalServicos} serviço(s) nesta leitura
                      </p>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                        minWidth: "min(100%, 720px)",
                      }}
                    >
                      <InfoCard
                        label="Total valor serviço"
                        value={moneyDisplay(row.totalValorServico)}
                      />
                      <InfoCard
                        label="Total vales"
                        value={moneyDisplay(row.totalVales)}
                      />
                      <InfoCard
                        label="Total despesas"
                        value={moneyDisplay(row.totalDespesas)}
                      />
                      <InfoCard
                        label="Saldo bruto"
                        value={moneyDisplay(row.saldoBruto)}
                      />
                      <InfoCard
                        label="Total quitado"
                        value={moneyDisplay(row.totalQuitado)}
                      />
                      <InfoCard
                        label="Saldo acumulado"
                        value={moneyDisplay(row.saldoAcumulado)}
                      />
                      <InfoCard
                        label="Pagar agora"
                        value={moneyDisplay(row.pagarAgora)}
                      />
                      <InfoCard
                        label="Margem total"
                        value={moneyDisplay(row.margemTotal)}
                      />
                    </div>
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
                        borderColor: row.saldoAcumulado < 0 ? "#fca5a5" : "#86efac",
                        background: row.saldoAcumulado < 0 ? "#fef2f2" : "#f0fdf4",
                        color: row.saldoAcumulado < 0 ? "#b91c1c" : "#166534",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: 6 }}>
                        {row.saldoAcumulado < 0
                          ? "Saldo acumulado negativo"
                          : "Saldo acumulado positivo"}
                      </strong>
                      <span>{moneyDisplay(row.saldoAcumulado)}</span>
                    </div>

                    <div
                      style={{
                        ...resultBoxStyle,
                        borderColor: row.pagarAgora > 0 ? "#86efac" : "#cbd5e1",
                        background: row.pagarAgora > 0 ? "#f0fdf4" : "#f8fafc",
                        color: row.pagarAgora > 0 ? "#166534" : "#475569",
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: 6 }}>
                        Valor sugerido para pagar agora
                      </strong>
                      <span>{moneyDisplay(row.pagarAgora)}</span>
                    </div>
                  </div>

                  <section style={sectionBoxStyle}>
                    <SectionTitle
                      title="Registrar quitação"
                      subtitle="Use quando fizer o pagamento real ao motorista para abater do saldo acumulado."
                    />

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 14,
                      }}
                    >
                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Valor a quitar</span>
                        <input
                          value={paymentDraft.valor}
                          onChange={(e) =>
                            updatePaymentDraft(
                              row.motorista,
                              "valor",
                              formatCurrencyInput(e.target.value)
                            )
                          }
                          placeholder="0,00"
                          inputMode="numeric"
                          style={inputStyle}
                        />
                      </label>

                      <label style={labelStyle}>
                        <span style={labelTextStyle}>Observação</span>
                        <input
                          value={paymentDraft.observacao}
                          onChange={(e) =>
                            updatePaymentDraft(
                              row.motorista,
                              "observacao",
                              e.target.value
                            )
                          }
                          placeholder="Ex.: PIX, dinheiro, fechamento semanal..."
                          style={inputStyle}
                        />
                      </label>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => registerPayment(row)}
                        disabled={row.pagarAgora <= 0}
                        style={{
                          ...actionPrimaryButtonStyle,
                          opacity: row.pagarAgora <= 0 ? 0.5 : 1,
                          cursor: row.pagarAgora <= 0 ? "not-allowed" : "pointer",
                        }}
                      >
                        Registrar quitação
                      </button>
                    </div>
                  </section>

                  <section style={sectionBoxStyle}>
                    <SectionTitle
                      title="Histórico dos serviços"
                      subtitle="Cada serviço mostra o saldo anterior, o saldo do serviço e o saldo acumulado do motorista."
                    />

                    <div style={{ display: "grid", gap: 12 }}>
                      {row.servicos.map((service) => {
                        const valorServico = Number(service.valor_motorista || 0);
                        const vale = Number(service.adiantamento_motorista || 0);
                        const despesas = Number(service.despesas_motorista || 0);
                        const saldoServico =
                          typeof service.fechamento_motorista === "number"
                            ? Number(service.fechamento_motorista || 0)
                            : valorServico - vale - despesas;
                        const saldoAnterior = Number(
                          service.saldo_anterior_motorista || 0
                        );
                        const saldoAcumulado = Number(
                          service.saldo_acumulado_motorista || 0
                        );
                        const pagarAgora = Number(
                          service.pagar_agora_motorista || 0
                        );

                        return (
                          <div key={service.id} style={serviceCardStyle}>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 12,
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
                                  {getTipoLabel(service.tipo_servico)} â€¢{" "}
                                  {getModoLabel(service.modo_cobranca)}
                                </div>
                                <h3
                                  style={{
                                    margin: 0,
                                    fontSize: 18,
                                    lineHeight: 1.2,
                                  }}
                                >
                                  {safeText(service.os)} â€¢ {safeText(service.contratante)} â†’{" "}
                                  {safeText(service.cliente_final)}
                                </h3>
                                <p
                                  style={{
                                    margin: "6px 0 0",
                                    color: "#475569",
                                    fontSize: 14,
                                  }}
                                >
                                  Data: {formatDate(service.data_servico)} â€¢ Status:{" "}
                                  {safeText(service.status)}
                                </p>
                              </div>

                              <div style={pillStyle}>{safeText(service.placa_veiculo)}</div>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                gap: 12,
                              }}
                            >
                              <MiniInfo
                                label="Valor do serviço"
                                value={moneyDisplay(valorServico)}
                              />
                              <MiniInfo label="Vale" value={moneyDisplay(vale)} />
                              <MiniInfo
                                label="Despesas"
                                value={moneyDisplay(despesas)}
                              />
                              <MiniInfo
                                label="Saldo anterior"
                                value={moneyDisplay(saldoAnterior)}
                              />
                              <MiniInfo
                                label="Saldo do serviço"
                                value={moneyDisplay(saldoServico)}
                              />
                              <MiniInfo
                                label="Saldo acumulado"
                                value={moneyDisplay(saldoAcumulado)}
                              />
                              <MiniInfo
                                label="Pagar agora"
                                value={moneyDisplay(pagarAgora)}
                              />
                              <MiniInfo
                                label="Margem"
                                value={moneyDisplay(service.margem_operacao)}
                              />
                            </div>

                            {service.despesas_detalhadas &&
                            service.despesas_detalhadas.length > 0 ? (
                              <div style={detailBoxStyle}>
                                <strong style={detailTitleStyle}>
                                  Despesas detalhadas
                                </strong>
                                <div
                                  style={{
                                    display: "grid",
                                    gap: 6,
                                    marginTop: 8,
                                  }}
                                >
                                  {service.despesas_detalhadas.map((expense) => (
                                    <div
                                      key={expense.id}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 12,
                                        fontSize: 14,
                                        color: "#334155",
                                      }}
                                    >
                                      <span>{safeText(expense.descricao)}</span>
                                      <strong>{moneyDisplay(expense.valor)}</strong>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section style={sectionBoxStyle}>
                    <SectionTitle
                      title="Histórico de quitações"
                      subtitle="Pagamentos já registrados para este motorista."
                    />

                    {row.pagamentos.length === 0 ? (
                      <div style={emptyInnerBoxStyle}>
                        Nenhuma quitação registrada para este motorista.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gap: 10 }}>
                        {row.pagamentos.map((payment) => (
                          <div key={payment.id} style={paymentCardStyle}>
                            <div>
                              <strong>{moneyDisplay(payment.valor)}</strong>
                              <div style={{ color: "#475569", fontSize: 13, marginTop: 4 }}>
                                {formatDate(payment.created_at)}
                              </div>
                            </div>

                            <div
                              style={{
                                color: "#334155",
                                fontSize: 14,
                                textAlign: "right",
                                maxWidth: 420,
                              }}
                            >
                              {safeText(payment.observacao, "Sem observação.")}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>
        {label}
      </div>
      <strong style={{ fontSize: 16 }}>{value}</strong>
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

const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
};

const labelTextStyle: React.CSSProperties = {
  fontWeight: 700,
};

const emptyBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
  borderRadius: 18,
  padding: 24,
  color: "#475569",
  textAlign: "center",
};

const emptyInnerBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
  borderRadius: 16,
  padding: 18,
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

const serviceCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  display: "grid",
  gap: 14,
};

const paymentCardStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const detailBoxStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 14,
};

const detailTitleStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  color: "#475569",
};

const noticeBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 18,
  padding: 16,
  color: "#334155",
  fontSize: 14,
  lineHeight: 1.6,
  marginTop: 14,
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

