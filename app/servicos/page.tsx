"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ServiceRow = {
  id: string;
  os_sistema?: string | null;
  os_cliente?: string | null;
  oc_cliente?: string | null;
  os?: string | null;
  empresa?: string | null;
  empresa_operadora?: string | null;
  contratante?: string | null;
  cliente?: string | null;
  cliente_final?: string | null;
  contato_cliente_final?: string | null;
  telefone_cliente_final?: string | null;
  motorista?: string | null;
  servico?: string | null;
  tipo_servico?: string | null;
  modo_cobranca?: string | null;
  origem?: string | null;
  destino?: string | null;
  endereco_retirada?: string | null;
  endereco_entrega?: string | null;
  endereco_informado_por?: string | null;
  placa_veiculo?: string | null;
  data_servico?: string | null;
  km?: number | null;
  km_total?: number | null;
  valor_total?: number | null;
  valor_cobranca?: number | null;
  valor_por_km?: number | null;
  valor_motorista?: number | null;
  adiantamento_motorista?: number | null;
  despesas?: number | null;
  despesas_motorista?: number | null;
  pedagio?: number | null;
  estacionamento?: number | null;
  alimentacao?: number | null;
  reembolso?: number | null;
  diaria?: number | null;
  fechamento_motorista?: number | null;
  margem_bruta?: number | null;
  margem_operacao?: number | null;
  etapa?: string | null;
  origem_base?: string | null;
  observacao?: string | null;
  observacoes?: string | null;
  checklist_obrigatorio?: boolean | null;
  checklist_instrucoes?: string | null;
  pago?: boolean | null;
  pago_em?: string | null;
  visivel_motorista?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success?: boolean;
  services?: ServiceRow[];
  total?: number;
  message?: string;
};

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value?: number | null) {
  return moeda.format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-BR");
}

function normalize(value?: string | null) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isPago(service: ServiceRow) {
  return normalize(service.status) === "pago" || service.pago === true;
}

function isHistoricoProtegido(service: ServiceRow) {
  return isPago(service) || service.visivel_motorista === false;
}

function isServicoAtivo(service: ServiceRow) {
  return !isHistoricoProtegido(service);
}

function getDisplayEmpresa(service: ServiceRow) {
  return (
    service.empresa ||
    service.contratante ||
    service.empresa_operadora ||
    "Não informado"
  );
}

function getDisplayCliente(service: ServiceRow) {
  return service.cliente || service.cliente_final || "Não informado";
}

function getDisplayOS(service: ServiceRow) {
  return service.os_sistema || service.os || service.os_cliente || "Sem OS";
}

function getDisplayObservacao(service: ServiceRow) {
  return service.observacoes || service.observacao || "Sem observações.";
}

function getStatusLabel(service: ServiceRow) {
  if (isPago(service)) return "Pago";
  const status = normalize(service.status);
  if (status === "aguardando_pagamento") return "Aguardando pagamento";
  if (status === "pendente") return "Pendente";
  if (service.status) return service.status;
  return "Sem status";
}

function getTipoServicoLabel(tipo?: string | null) {
  const value = normalize(tipo);
  if (value === "busca_veiculo") return "Busca de veículo";
  if (value === "entrega_veiculo") return "Entrega de veículo";
  if (value === "transporte_executivo") return "Transporte executivo";
  if (value === "transfer") return "Transfer";
  return tipo || "Não informado";
}

function getStatusStyles(service: ServiceRow) {
  if (isPago(service)) {
    return {
      bg: "#dcfce7",
      color: "#166534",
      border: "#86efac",
      label: "Pago",
    };
  }

  const status = normalize(service.status);

  if (status === "aguardando_pagamento") {
    return {
      bg: "#fef3c7",
      color: "#92400e",
      border: "#fcd34d",
      label: "Aguardando pagamento",
    };
  }

  if (status === "pendente") {
    return {
      bg: "#e0f2fe",
      color: "#075985",
      border: "#7dd3fc",
      label: "Pendente",
    };
  }

  return {
    bg: "#e2e8f0",
    color: "#334155",
    border: "#cbd5e1",
    label: getStatusLabel(service),
  };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < 768);
    }

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  return isMobile;
}

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Carregando serviços...");
  const [search, setSearch] = useState("");
  const [aba, setAba] = useState<"ativos" | "historico">("ativos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  async function carregarServicos(message?: string) {
    try {
      setLoading(true);
      setStatusText(message || "Atualizando leitura...");

      const response = await fetch("/api/services", {
        method: "GET",
        cache: "no-store",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Falha ao carregar serviços.");
      }

      const rows = Array.isArray(data.services) ? data.services : [];
      rows.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });

      setServices(rows);
      setStatusText(
        rows.length > 0
          ? `${rows.length} serviço(s) carregado(s) com sucesso.`
          : "Nenhum serviço encontrado na base."
      );
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Erro ao carregar serviços.";
      setStatusText(messageText);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatusRapido(
    service: ServiceRow,
    novoStatus: "pendente" | "aguardando_pagamento" | "pago"
  ) {
    const payload = {
      id: service.id,
      status: novoStatus,
      pago: novoStatus === "pago",
      pago_em: novoStatus === "pago" ? new Date().toISOString() : null,
      visivel_motorista: novoStatus === "pago" ? false : true,
      updated_at: new Date().toISOString(),
    };

    try {
      setUpdatingId(service.id);
      setStatusText(`Atualizando status de ${getDisplayOS(service)}...`);

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Falha ao atualizar status.");
      }

      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id
            ? {
                ...item,
                status: novoStatus,
                pago: novoStatus === "pago",
                pago_em: novoStatus === "pago" ? payload.pago_em : null,
                visivel_motorista: novoStatus === "pago" ? false : true,
                updated_at: payload.updated_at,
              }
            : item
        )
      );

      if (novoStatus === "pago") {
        setAba("historico");
      } else {
        setAba("ativos");
      }

      setStatusText(
        `Status de ${getDisplayOS(service)} atualizado para ${novoStatus}.`
      );
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Erro ao atualizar status.";
      setStatusText(messageText);
      alert(messageText);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  const ativos = useMemo(
    () => services.filter((service) => isServicoAtivo(service)),
    [services]
  );

  const historico = useMemo(
    () => services.filter((service) => isHistoricoProtegido(service)),
    [services]
  );

  const listaBase = aba === "ativos" ? ativos : historico;

  const listaFiltrada = useMemo(() => {
    const termo = normalize(search);

    return listaBase.filter((service) => {
      const statusNorm = normalize(service.status);

      const passaStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "pago"
          ? isPago(service)
          : statusFilter === "aguardando_pagamento"
          ? statusNorm === "aguardando_pagamento"
          : statusFilter === "pendente"
          ? statusNorm === "pendente"
          : true;

      if (!passaStatus) return false;

      if (!termo) return true;

      const searchable = [
        getDisplayOS(service),
        getDisplayEmpresa(service),
        getDisplayCliente(service),
        service.motorista,
        service.servico,
        service.origem,
        service.destino,
        service.placa_veiculo,
        service.contato_cliente_final,
        service.telefone_cliente_final,
        getDisplayObservacao(service),
      ]
        .filter(Boolean)
        .join(" ");

      return normalize(searchable).includes(termo);
    });
  }, [listaBase, search, statusFilter]);

  const totalServicos = services.length;
  const totalAtivos = ativos.length;
  const totalHistorico = historico.length;
  const totalPendentes = services.filter(
    (service) => normalize(service.status) === "pendente"
  ).length;
  const totalAguardandoPagamento = services.filter(
    (service) => normalize(service.status) === "aguardando_pagamento"
  ).length;
  const totalPagos = services.filter((service) => isPago(service)).length;

  const somaCobrancaVisao = listaBase.reduce(
    (acc, service) =>
      acc + Number(service.valor_cobranca ?? service.valor_total ?? 0),
    0
  );

  const somaMargemVisao = listaBase.reduce(
    (acc, service) =>
      acc + Number(service.margem_operacao ?? service.margem_bruta ?? 0),
    0
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4f8fc 0%, #eef4fb 45%, #f6f8fb 100%)",
        padding: isMobile ? "16px 12px 36px" : "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/" style={topLinkStyle}>
              Voltar
            </Link>

            <Link href="/servicos/novo" style={topPrimaryStyle}>
              Novo serviço
            </Link>
          </div>

          <button onClick={() => carregarServicos()} style={topButtonStyle}>
            Atualizar leitura
          </button>
        </div>

        <section
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            borderRadius: 28,
            padding: isMobile ? 18 : 24,
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            border: "1px solid #e7eef6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={chipBlue}>Aurora Motoristas</span>

            <h1
              style={{
                margin: 0,
                fontSize: isMobile ? 28 : 34,
                lineHeight: 1.05,
                color: "#0f172a",
                wordBreak: "break-word",
              }}
            >
              Serviços cadastrados
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.7,
                maxWidth: 980,
              }}
            >
              Visão operacional premium com separação entre serviços ativos e
              histórico interno protegido. Quando um serviço é marcado como pago
              ou fica com <strong>visível para motorista = não</strong>, ele sai
              da visão operacional e permanece preservado no histórico interno.
            </p>

            <div
              style={{
                marginTop: 4,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span style={chipNeutral}>
                {loading ? "Atualizando..." : statusText}
              </span>

              <span style={chipWarning}>
                Sistema em constante atualização e podem ocorrer instabilidades
                momentâneas.
              </span>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          <StatCard
            label="Serviços ativos"
            value={String(totalAtivos)}
            help="Visíveis na operação"
          />
          <StatCard
            label="Histórico protegido"
            value={String(totalHistorico)}
            help="Pagos ou ocultos do motorista"
          />
          <StatCard
            label="Pendentes"
            value={String(totalPendentes)}
            help="Aguardando execução"
          />
          <StatCard
            label="Aguardando pagamento"
            value={String(totalAguardandoPagamento)}
            help="Execução feita sem baixa final"
          />
          <StatCard
            label="Pagos"
            value={String(totalPagos)}
            help="Baixados no histórico"
          />
          <StatCard
            label="Base total"
            value={String(totalServicos)}
            help="Tudo salvo no Supabase"
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "minmax(0, 1.4fr) minmax(320px, 0.6fr)",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 26,
              padding: isMobile ? 14 : 18,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                <button
                  onClick={() => setAba("ativos")}
                  style={{
                    ...pillButtonBase,
                    background: aba === "ativos" ? "#0ea5e9" : "#eff6ff",
                    color: aba === "ativos" ? "#ffffff" : "#0f172a",
                    boxShadow:
                      aba === "ativos"
                        ? "0 12px 26px rgba(14, 165, 233, 0.20)"
                        : "none",
                  }}
                >
                  Serviços ativos
                </button>

                <button
                  onClick={() => setAba("historico")}
                  style={{
                    ...pillButtonBase,
                    background: aba === "historico" ? "#0ea5e9" : "#eff6ff",
                    color: aba === "historico" ? "#ffffff" : "#0f172a",
                    boxShadow:
                      aba === "historico"
                        ? "0 12px 26px rgba(14, 165, 233, 0.20)"
                        : "none",
                  }}
                >
                  Histórico interno protegido
                </button>
              </div>

              <div
                style={{
                  color: "#5b7488",
                  fontSize: 13,
                  fontWeight: 700,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                {aba === "ativos"
                  ? "Aqui ficam apenas os serviços ainda visíveis na operação."
                  : "Aqui ficam os serviços pagos ou ocultos da visão do motorista."}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                gap: 12,
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar OS, contratante, cliente, motorista, rota, placa..."
                style={searchInputStyle}
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={searchInputStyle}
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="aguardando_pagamento">
                  Aguardando pagamento
                </option>
                <option value="pago">Pagos</option>
              </select>
            </div>

            {loading ? (
              <EmptyState text="Carregando serviços..." />
            ) : listaFiltrada.length === 0 ? (
              <EmptyState
                text={
                  aba === "ativos"
                    ? "Nenhum serviço ativo encontrado com os filtros atuais."
                    : "Nenhum item encontrado no histórico protegido com os filtros atuais."
                }
              />
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
                  gap: 14,
                }}
              >
                {listaFiltrada.map((service) => {
                  const statusBadge = getStatusStyles(service);
                  const historicoProtegido = isHistoricoProtegido(service);
                  const disabled = updatingId === service.id;

                  return (
                    <article
                      key={service.id}
                      style={{
                        background: "#fcfdff",
                        border: "1px solid #e7eef6",
                        borderRadius: 24,
                        padding: isMobile ? 14 : 18,
                        boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        position: "relative",
                        overflow: "hidden",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: "0 auto 0 0",
                          width: 6,
                          background: historicoProtegido ? "#fb923c" : "#0ea5e9",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          flexWrap: isMobile ? "wrap" : "nowrap",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            paddingLeft: 6,
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <span style={chipSoftBlue}>
                            {getTipoServicoLabel(service.tipo_servico)}
                          </span>

                          <strong
                            style={{
                              fontSize: isMobile ? 18 : 20,
                              lineHeight: 1.25,
                              color: "#0f172a",
                              wordBreak: "break-word",
                            }}
                          >
                            {service.servico || "Serviço sem título"}
                          </strong>

                          <span
                            style={{
                              color: "#5b7488",
                              fontSize: 13,
                              fontWeight: 700,
                              wordBreak: "break-word",
                            }}
                          >
                            {getDisplayOS(service)} •{" "}
                            {formatDate(service.data_servico)}
                          </span>
                        </div>

                        <span
                          style={{
                            alignSelf: "flex-start",
                            background: statusBadge.bg,
                            color: statusBadge.color,
                            border: `1px solid ${statusBadge.border}`,
                            borderRadius: 999,
                            padding: "8px 12px",
                            fontWeight: 800,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {statusBadge.label}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          paddingLeft: 6,
                        }}
                      >
                        <span style={miniTag}>
                          {historicoProtegido ? "Histórico protegido" : "Ativo"}
                        </span>
                        <span style={miniTag}>
                          {service.modo_cobranca === "por_km"
                            ? "Por KM"
                            : "Fechado total"}
                        </span>
                        <span style={miniTag}>
                          Visível ao motorista:{" "}
                          {service.visivel_motorista === false ? "Não" : "Sim"}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile
                            ? "1fr"
                            : "repeat(2, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        <Info
                          label="Contratante"
                          value={getDisplayEmpresa(service)}
                        />
                        <Info
                          label="Cliente final"
                          value={getDisplayCliente(service)}
                        />
                        <Info
                          label="Motorista"
                          value={service.motorista || "Não informado"}
                        />
                        <Info
                          label="Placa"
                          value={service.placa_veiculo || "Não informada"}
                        />
                        <Info
                          label="KM"
                          value={String(service.km_total ?? service.km ?? 0)}
                        />
                        <Info
                          label="Valor por KM"
                          value={formatCurrency(service.valor_por_km ?? 0)}
                        />
                        <Info
                          label="Cobrança contratante"
                          value={formatCurrency(
                            service.valor_cobranca ?? service.valor_total ?? 0
                          )}
                        />
                        <Info
                          label="Valor motorista"
                          value={formatCurrency(service.valor_motorista ?? 0)}
                        />
                        <Info
                          label="Despesas motorista"
                          value={formatCurrency(
                            service.despesas_motorista ??
                              service.despesas ??
                              service.reembolso ??
                              0
                          )}
                        />
                        <Info
                          label="Fechamento motorista"
                          value={formatCurrency(
                            service.fechamento_motorista ?? 0
                          )}
                        />
                        <Info
                          label="Margem"
                          value={formatCurrency(
                            service.margem_operacao ?? service.margem_bruta ?? 0
                          )}
                        />
                        <Info
                          label="Contato final"
                          value={
                            service.contato_cliente_final || "Não informado"
                          }
                        />
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                          gap: 10,
                        }}
                      >
                        <WideInfo
                          label="Retirada"
                          value={
                            service.endereco_retirada ||
                            service.origem ||
                            "Não informada"
                          }
                        />
                        <WideInfo
                          label="Entrega"
                          value={
                            service.endereco_entrega ||
                            service.destino ||
                            "Não informada"
                          }
                        />
                      </div>

                      <div
                        style={{
                          borderRadius: 18,
                          background: historicoProtegido ? "#fff7ed" : "#eff6ff",
                          border: `1px solid ${
                            historicoProtegido ? "#fed7aa" : "#bfdbfe"
                          }`,
                          padding: 14,
                          color: "#435b6e",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        {historicoProtegido ? (
                          <>
                            <strong style={{ color: "#9a3412" }}>
                              Baixa concluída:
                            </strong>{" "}
                            esta operação já saiu da visão do motorista e segue
                            preservada apenas para controle interno.
                          </>
                        ) : (
                          <>
                            <strong style={{ color: "#1d4ed8" }}>
                              Operação ativa:
                            </strong>{" "}
                            este serviço ainda está em fluxo operacional e
                            permanece na camada ativa do sistema.
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          borderRadius: 16,
                          background: "#f8fbff",
                          border: "1px solid #e5edf5",
                          padding: 14,
                          color: "#435b6e",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        <strong style={{ color: "#123047" }}>
                          Observações:
                        </strong>{" "}
                        {getDisplayObservacao(service)}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: isMobile
                            ? "1fr"
                            : "repeat(2, minmax(0, 1fr))",
                          gap: 10,
                        }}
                      >
                        <Info
                          label="WhatsApp contato final"
                          value={
                            service.telefone_cliente_final || "Não informado"
                          }
                        />
                        <Info label="Pago" value={isPago(service) ? "Sim" : "Não"} />
                        <Info
                          label="Pago em"
                          value={
                            service.pago_em
                              ? formatDateTime(service.pago_em)
                              : "—"
                          }
                        />
                        <Info
                          label="Atualizado em"
                          value={formatDateTime(service.updated_at)}
                        />
                      </div>

                      <div
                        style={{
                          borderRadius: 18,
                          background: "#ffffff",
                          border: "1px solid #e7eef6",
                          padding: 14,
                          display: "flex",
                          flexDirection: "column",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: "#123047",
                          }}
                        >
                          Ação rápida de status
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 10,
                          }}
                        >
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              atualizarStatusRapido(service, "pendente")
                            }
                            style={{
                              ...quickActionStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Pendente
                          </button>

                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              atualizarStatusRapido(
                                service,
                                "aguardando_pagamento"
                              )
                            }
                            style={{
                              ...quickActionStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Aguardando pagamento
                          </button>

                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => atualizarStatusRapido(service, "pago")}
                            style={{
                              ...quickActionPrimaryStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Marcar como pago
                          </button>
                        </div>

                        <div
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            lineHeight: 1.6,
                          }}
                        >
                          {disabled
                            ? "Atualizando este serviço..."
                            : "Ao marcar como pago, o item sai da visão ativa e vai para o histórico protegido."}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: 4,
                        }}
                      >
                        <div
                          style={{
                            color: "#64748b",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Sistema em constante atualização • podem ocorrer
                          instabilidades momentâneas
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: 10,
                            flexWrap: "wrap",
                          }}
                        >
                          <Link
                            href={`/servicos/${service.id}`}
                            style={actionSecondaryStyle}
                          >
                            Abrir
                          </Link>

                          <Link
                            href={`/servicos/${service.id}`}
                            style={actionPrimaryStyle}
                          >
                            Editar serviço
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              position: isMobile ? "relative" : "sticky",
              top: isMobile ? 0 : 16,
            }}
          >
            <SideCard
              title="Exibidos agora"
              value={String(listaFiltrada.length)}
              help="Resultado após filtros e busca."
            />
            <SideCard
              title={`Cobrança da visão ${aba === "ativos" ? "ativa" : "histórica"}`}
              value={formatCurrency(somaCobrancaVisao)}
              help={
                aba === "ativos"
                  ? "Soma apenas dos serviços ainda ativos na operação."
                  : "Soma do histórico protegido atualmente exibido."
              }
            />
            <SideCard
              title={`Margem da visão ${aba === "ativos" ? "ativa" : "histórica"}`}
              value={formatCurrency(somaMargemVisao)}
              help={
                aba === "ativos"
                  ? "Não mistura histórico pago com operação atual."
                  : "Consolidação visual do histórico protegido."
              }
            />

            <div
              style={{
                background: "#ffffff",
                borderRadius: 22,
                padding: 18,
                border: "1px solid #e7eef6",
                boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                }}
              >
                Leitura operacional
              </div>

              <div
                style={{
                  color: "#4b6478",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                {aba === "ativos"
                  ? "Você está vendo apenas a camada ativa da operação. Pagos e ocultos do motorista ficam fora desta visão."
                  : "Você está vendo a camada protegida do histórico interno, preservando a regra de ocultação ao motorista."}
              </div>

              <div
                style={{
                  borderRadius: 16,
                  background: "#f8fbff",
                  border: "1px solid #e5edf5",
                  padding: 14,
                  color: "#435b6e",
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                Esta lateral foi pensada para leitura rápida de lançamentos,
                totais e situação da visão atual, sem confundir operação ativa
                com histórico já baixado.
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string;
  help: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 22,
        padding: 18,
        border: "1px solid #e7eef6",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          color: "#5b7488",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#123047",
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#6b7f90",
          fontSize: 13,
        }}
      >
        {help}
      </div>
    </div>
  );
}

function SideCard({
  title,
  value,
  help,
}: {
  title: string;
  value: string;
  help: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 22,
        padding: 18,
        border: "1px solid #e7eef6",
        boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          color: "#5b7488",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: "#123047",
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#6b7f90",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {help}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        borderRadius: 22,
        border: "1px dashed #cbd5e1",
        padding: 28,
        textAlign: "center",
        color: "#64748b",
        background: "#f8fafc",
      }}
    >
      {text}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e7eef6",
        borderRadius: 16,
        padding: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6b7f90",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#123047",
          fontWeight: 800,
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function WideInfo({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e7eef6",
        borderRadius: 16,
        padding: 12,
        minWidth: 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: "#6b7f90",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#123047",
          fontWeight: 700,
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const topLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
};

const topPrimaryStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
  boxShadow: "0 12px 30px rgba(14, 165, 233, 0.20)",
};

const topButtonStyle: React.CSSProperties = {
  border: "none",
  cursor: "pointer",
  background: "#ffffff",
  color: "#123047",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 700,
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
};

const searchInputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #d8e3ee",
  padding: "14px 16px",
  fontSize: 15,
  outline: "none",
  background: "#f8fbff",
  color: "#123047",
  boxSizing: "border-box",
};

const pillButtonBase: React.CSSProperties = {
  border: "none",
  cursor: "pointer",
  borderRadius: 999,
  padding: "10px 14px",
  fontWeight: 800,
};

const chipBlue: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#e0f2fe",
  color: "#075985",
  borderRadius: 999,
  padding: "6px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const chipSoftBlue: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "6px 10px",
  fontWeight: 800,
  fontSize: 12,
};

const chipNeutral: React.CSSProperties = {
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const chipWarning: React.CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const miniTag: React.CSSProperties = {
  background: "#f8fafc",
  color: "#475569",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  padding: "6px 10px",
  fontSize: 12,
  fontWeight: 700,
};

const actionPrimaryStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#123047",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
};

const actionSecondaryStyle: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
};

const quickActionStyle: React.CSSProperties = {
  border: "1px solid #dbe5ef",
  background: "#ffffff",
  color: "#123047",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
};

const quickActionPrimaryStyle: React.CSSProperties = {
  border: "none",
  background: "#16a34a",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 12px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(22, 163, 74, 0.18)",
};