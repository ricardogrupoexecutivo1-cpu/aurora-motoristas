"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type QuoteRequest = {
  id: string;
  origem_registro?: string;
  tipo_servico?: string;
  modo_cobranca?: string;

  contratante?: string;
  cliente_final?: string;
  contato_cliente_final?: string | null;
  telefone_cliente_final?: string | null;
  data_desejada?: string | null;

  origem_resumida?: string;
  destino_resumido?: string;
  endereco_retirada?: string;
  endereco_entrega?: string;
  endereco_informado_por?: string | null;

  km_total?: number;
  valor_por_km?: number;
  valor_pacote_fechado?: number;

  quantidade_diarias?: number;
  valor_diaria?: number;
  total_diarias?: number;

  estimativa_reembolso?: number;
  valor_cotacao_apresentado?: number;

  observacoes?: string | null;

  status?: string;
  aprovado_pelo_cliente?: boolean;
  approved_at?: string | null;

  fechamento_manual_pendente?: boolean;
  nf_emitida?: boolean;
  numero_nf?: string | null;
  data_cobranca_manual?: string | null;
  vencimento_cobranca?: string | null;
  centro_custo?: string | null;

  converted_to_service?: boolean;
  converted_service_id?: string | null;
  converted_at?: string | null;

  created_at?: string;
  updated_at?: string;
};

type InternalService = {
  id: string;
  source: string;
  source_quote_id: string;

  tipo_servico: string;
  modo_cobranca: string;

  os: string;
  data_servico: string | null;
  status: string;

  contratante: string;
  cliente_final: string;
  contato_cliente_final: string | null;
  telefone_cliente_final: string | null;

  empresa_operadora: string;
  motorista: string;
  placa_veiculo: string | null;

  origem: string;
  destino: string;
  endereco_retirada: string;
  endereco_entrega: string;
  endereco_informado_por: string | null;

  km_total: number;
  valor_por_km: number;
  valor_cobranca: number;

  valor_motorista: number;
  adiantamento_motorista: number;
  despesas_motorista: number;
  fechamento_motorista: number;
  margem_operacao: number;

  checklist_obrigatorio: boolean;
  checklist_instrucoes: string | null;

  pedido_cotacao: string | null;
  observacoes: string | null;

  created_at: string;
  updated_at: string;
};

const QUOTES_STORAGE_KEY = "aurora_motoristas_pedidos_cotacao";
const SERVICES_STORAGE_KEY = "aurora_motoristas_services";

function moneyDisplay(value?: number | null) {
  const safeValue = Number(value || 0);
  return safeValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

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

function loadRequests(): QuoteRequest[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(QUOTES_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as QuoteRequest[];
  } catch (error) {
    console.error("Erro ao carregar pedidos de cotação:", error);
    return [];
  }
}

function buildInternalServiceFromQuote(item: QuoteRequest): InternalService {
  const nowIso = new Date().toISOString();
  const serviceId = `svc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const osNumber = `OS-${new Date().getFullYear()}-${String(
    Date.now()
  ).slice(-6)}`;

  const valorCobranca = Number(item.valor_cotacao_apresentado || 0);

  return {
    id: serviceId,
    source: "pedido_cotacao_convertido",
    source_quote_id: item.id,

    tipo_servico: item.tipo_servico || "outro",
    modo_cobranca: item.modo_cobranca || "fechado_total",

    os: osNumber,
    data_servico: item.data_desejada || null,
    status: "pendente",

    contratante: item.contratante || "",
    cliente_final: item.cliente_final || "",
    contato_cliente_final: item.contato_cliente_final || null,
    telefone_cliente_final: item.telefone_cliente_final || null,

    empresa_operadora: "Aurora Motoristas",
    motorista: "",
    placa_veiculo: null,

    origem: item.origem_resumida || "",
    destino: item.destino_resumido || "",
    endereco_retirada: item.endereco_retirada || "",
    endereco_entrega: item.endereco_entrega || "",
    endereco_informado_por: item.endereco_informado_por || null,

    km_total: Number(item.km_total || 0),
    valor_por_km: Number(item.valor_por_km || 0),
    valor_cobranca: valorCobranca,

    valor_motorista: 0,
    adiantamento_motorista: 0,
    despesas_motorista: 0,
    fechamento_motorista: 0,
    margem_operacao: valorCobranca,

    checklist_obrigatorio: true,
    checklist_instrucoes:
      "Completar checklist interno antes da liberação/finalização do serviço.",

    pedido_cotacao: item.id || null,
    observacoes: item.observacoes || null,

    created_at: nowIso,
    updated_at: nowIso,
  };
}

export default function PedidosCotacaoPage() {
  const [requests, setRequests] = useState<QuoteRequest[]>([]);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setRequests(loadRequests());
  }, []);

  const filteredRequests = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return requests;

    return requests.filter((item) => {
      const haystack = [
        item.id,
        item.contratante,
        item.cliente_final,
        item.contato_cliente_final,
        item.telefone_cliente_final,
        item.tipo_servico,
        item.modo_cobranca,
        item.origem_resumida,
        item.destino_resumido,
        item.endereco_retirada,
        item.endereco_entrega,
        item.observacoes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [requests, search]);

  const totalPedidos = requests.length;
  const totalAprovados = requests.filter(
    (item) => item.aprovado_pelo_cliente
  ).length;
  const totalPendentesFechamento = requests.filter(
    (item) => item.fechamento_manual_pendente
  ).length;
  const totalSemNF = requests.filter((item) => !item.nf_emitida).length;

  function refreshList() {
    setRequests(loadRequests());
    setFeedback("Leitura atualizada.");
  }

  function convertToInternalService(item: QuoteRequest) {
    if (typeof window === "undefined") return;

    if (item.converted_to_service) {
      setFeedback(
        `Este pedido já foi convertido em serviço interno (${item.converted_service_id || "sem ID"}).`
      );
      return;
    }

    try {
      const newService = buildInternalServiceFromQuote(item);

      const servicesRaw = window.localStorage.getItem(SERVICES_STORAGE_KEY);
      const currentServices = servicesRaw ? JSON.parse(servicesRaw) : [];
      const safeServices = Array.isArray(currentServices) ? currentServices : [];
      const nextServices = [newService, ...safeServices];
      window.localStorage.setItem(
        SERVICES_STORAGE_KEY,
        JSON.stringify(nextServices)
      );

      const currentQuotes = loadRequests();
      const updatedQuotes = currentQuotes.map((quote) => {
        if (quote.id !== item.id) return quote;

        return {
          ...quote,
          converted_to_service: true,
          converted_service_id: newService.id,
          converted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });

      window.localStorage.setItem(
        QUOTES_STORAGE_KEY,
        JSON.stringify(updatedQuotes)
      );

      setRequests(updatedQuotes);
      setFeedback(
        `Pedido ${item.id} convertido em serviço interno com sucesso. ID do serviço: ${newService.id}`
      );
    } catch (error) {
      console.error("Erro ao converter pedido em serviço:", error);
      setFeedback("Não foi possível converter o pedido em serviço interno.");
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
          maxWidth: 1180,
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
                Pedidos de cotação
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  maxWidth: 820,
                  fontSize: 15,
                }}
              >
                Área interna para leitura dos pedidos aprovados pelo cliente.
                Esta tela organiza a entrada comercial antes da conversão em
                operação interna, sem mexer no disparo dos motoristas.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/pedido-cotacao" style={linkSecondaryStyle}>
                Abrir página do cliente
              </Link>

              <Link href="/servicos" style={linkPrimaryStyle}>
                Ir para serviços
              </Link>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
            }}
          >
            <InfoCard label="Total de pedidos" value={String(totalPedidos)} />
            <InfoCard label="Aprovados" value={String(totalAprovados)} />
            <InfoCard
              label="Fechamento pendente"
              value={String(totalPendentesFechamento)}
            />
            <InfoCard label="Sem NF" value={String(totalSemNF)} />
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 24,
            padding: 20,
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            display: "grid",
            gap: 14,
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por contratante, cliente, telefone, rota, tipo..."
              style={{
                flex: 1,
                minWidth: 260,
                borderRadius: 14,
                border: "1px solid #cbd5e1",
                padding: "12px 14px",
                fontSize: 14,
                outline: "none",
                background: "#ffffff",
                color: "#0f172a",
              }}
            />

            <button
              type="button"
              onClick={refreshList}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid #0ea5e9",
                background: "#f0f9ff",
                color: "#0369a1",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Atualizar leitura
            </button>
          </div>

          {feedback ? (
            <div style={noticeBoxStyle}>{feedback}</div>
          ) : null}

          {filteredRequests.length === 0 ? (
            <div style={emptyBoxStyle}>
              Nenhum pedido de cotação encontrado nesta leitura.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {filteredRequests.map((item) => (
                <article
                  key={item.id}
                  style={{
                    background: "#fcfdff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 20,
                    padding: 18,
                    display: "grid",
                    gap: 14,
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
                        {getTipoLabel(item.tipo_servico)} •{" "}
                        {getModoLabel(item.modo_cobranca)}
                      </div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 20,
                          lineHeight: 1.2,
                        }}
                      >
                        {safeText(item.contratante)} → {safeText(item.cliente_final)}
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#475569",
                          fontSize: 14,
                        }}
                      >
                        Protocolo: {safeText(item.id)} • Aprovado em:{" "}
                        {formatDate(item.approved_at || item.created_at)}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        flexWrap: "wrap",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: 999,
                          background: item.aprovado_pelo_cliente
                            ? "#ecfdf5"
                            : "#fff7ed",
                          border: `1px solid ${
                            item.aprovado_pelo_cliente ? "#bbf7d0" : "#fdba74"
                          }`,
                          color: item.aprovado_pelo_cliente ? "#166534" : "#9a3412",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {item.aprovado_pelo_cliente
                          ? "Aprovado pelo cliente"
                          : safeText(item.status)}
                      </div>

                      <button
                        type="button"
                        onClick={() => convertToInternalService(item)}
                        disabled={Boolean(item.converted_to_service)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 12,
                          border: "1px solid #0ea5e9",
                          background: item.converted_to_service
                            ? "#e2e8f0"
                            : "#0ea5e9",
                          color: item.converted_to_service ? "#475569" : "#ffffff",
                          fontWeight: 800,
                          cursor: item.converted_to_service
                            ? "not-allowed"
                            : "pointer",
                        }}
                      >
                        {item.converted_to_service
                          ? "Já convertido"
                          : "Converter em serviço interno"}
                      </button>
                    </div>
                  </div>

                  {item.converted_to_service ? (
                    <div
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: 16,
                        padding: 14,
                        color: "#1d4ed8",
                        fontSize: 14,
                        lineHeight: 1.55,
                      }}
                    >
                      <strong>Conversão concluída:</strong> serviço interno criado
                      com ID {safeText(item.converted_service_id)} em{" "}
                      {formatDate(item.converted_at)}.
                    </div>
                  ) : null}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <MiniInfo
                      label="Contato do cliente final"
                      value={safeText(item.contato_cliente_final)}
                    />
                    <MiniInfo
                      label="Telefone"
                      value={safeText(item.telefone_cliente_final)}
                    />
                    <MiniInfo
                      label="Data desejada"
                      value={formatDate(item.data_desejada)}
                    />
                    <MiniInfo
                      label="Origem resumida"
                      value={safeText(item.origem_resumida)}
                    />
                    <MiniInfo
                      label="Destino resumido"
                      value={safeText(item.destino_resumido)}
                    />
                    <MiniInfo
                      label="Cobrança apresentada"
                      value={moneyDisplay(item.valor_cotacao_apresentado)}
                    />
                    <MiniInfo
                      label="Reembolso previsto"
                      value={moneyDisplay(item.estimativa_reembolso)}
                    />
                    <MiniInfo
                      label="NF emitida"
                      value={item.nf_emitida ? "Sim" : "Não"}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <div style={detailBoxStyle}>
                      <strong style={detailTitleStyle}>Retirada</strong>
                      <div style={detailValueStyle}>
                        {safeText(item.endereco_retirada)}
                      </div>
                    </div>

                    <div style={detailBoxStyle}>
                      <strong style={detailTitleStyle}>Entrega</strong>
                      <div style={detailValueStyle}>
                        {safeText(item.endereco_entrega)}
                      </div>
                    </div>

                    <div style={detailBoxStyle}>
                      <strong style={detailTitleStyle}>Informado por</strong>
                      <div style={detailValueStyle}>
                        {safeText(item.endereco_informado_por)}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: 12,
                    }}
                  >
                    <MiniInfo
                      label="KM total"
                      value={String(item.km_total ?? 0)}
                    />
                    <MiniInfo
                      label="Valor por KM"
                      value={moneyDisplay(item.valor_por_km)}
                    />
                    <MiniInfo
                      label="Pacote fechado"
                      value={moneyDisplay(item.valor_pacote_fechado)}
                    />
                    <MiniInfo
                      label="Qtd. diárias"
                      value={String(item.quantidade_diarias ?? 0)}
                    />
                    <MiniInfo
                      label="Valor diária"
                      value={moneyDisplay(item.valor_diaria)}
                    />
                    <MiniInfo
                      label="Total diárias"
                      value={moneyDisplay(item.total_diarias)}
                    />
                  </div>

                  <div style={detailBoxStyle}>
                    <strong style={detailTitleStyle}>Observações</strong>
                    <div style={detailValueStyle}>
                      {safeText(item.observacoes, "Sem observações.")}
                    </div>
                  </div>

                  <div style={noticeBoxStyle}>
                    <strong>Próximo passo operacional:</strong> após a conversão,
                    o serviço interno fica disponível na base local para a equipe
                    completar motorista, placa, checklist, fechamento e demais
                    dados protegidos. O disparo dos motoristas continua intacto.
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
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

const emptyBoxStyle: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
  borderRadius: 18,
  padding: 24,
  color: "#475569",
  textAlign: "center",
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

const detailValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 14,
  lineHeight: 1.55,
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