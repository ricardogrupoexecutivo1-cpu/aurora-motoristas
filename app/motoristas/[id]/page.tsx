"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

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

  // Campos fiscais opcionais â€” leitura segura
  numero_nota_fiscal?: string | null;
  nota_fiscal_numero?: string | null;
  data_emissao_nota?: string | null;
  nota_fiscal_emissao?: string | null;
  data_vencimento_nota?: string | null;
  nota_fiscal_vencimento?: string | null;
  valor_nota_fiscal?: number | null;
  nota_fiscal_valor?: number | null;
  status_nota_fiscal?: string | null;
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
  if (!value) return "â€”";
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

function buildEmpresaList(services: ServiceRow[]) {
  const mapa = new Map<string, string>();

  for (const service of services) {
    const nome = getDisplayEmpresa(service);
    const chave = normalize(nome);
    if (!chave || chave === "nao informado") continue;
    if (!mapa.has(chave)) {
      mapa.set(chave, nome);
    }
  }

  return Array.from(mapa.values()).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function getNotaNumero(service: ServiceRow) {
  return service.numero_nota_fiscal || service.nota_fiscal_numero || "";
}

function getNotaEmissao(service: ServiceRow) {
  return service.data_emissao_nota || service.nota_fiscal_emissao || "";
}

function getNotaVencimento(service: ServiceRow) {
  return service.data_vencimento_nota || service.nota_fiscal_vencimento || "";
}

function getNotaValor(service: ServiceRow) {
  return service.valor_nota_fiscal ?? service.nota_fiscal_valor ?? 0;
}

function getNotaStatusFiscal(service: ServiceRow) {
  const statusManual = normalize(service.status_nota_fiscal);
  const numero = getNotaNumero(service);
  const emissao = getNotaEmissao(service);
  const vencimento = getNotaVencimento(service);

  if (!numero && !emissao && !vencimento) {
    return {
      label: "Sem nota",
      bg: "#f8fafc",
      color: "#475569",
      border: "#cbd5e1",
      tone: "neutro" as const,
    };
  }

  if (statusManual === "paga" || statusManual === "recebida") {
    return {
      label: "Recebida",
      bg: "#dcfce7",
      color: "#166534",
      border: "#86efac",
      tone: "verde" as const,
    };
  }

  const dataVenc = vencimento ? new Date(vencimento) : null;

  if (!dataVenc || Number.isNaN(dataVenc.getTime())) {
    return {
      label: "Sem vencimento",
      bg: "#eff6ff",
      color: "#1d4ed8",
      border: "#bfdbfe",
      tone: "azul" as const,
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const venc = new Date(dataVenc);
  venc.setHours(0, 0, 0, 0);

  if (venc < hoje) {
    return {
      label: "Vencida",
      bg: "#fef2f2",
      color: "#b91c1c",
      border: "#fca5a5",
      tone: "vermelho" as const,
    };
  }

  return {
    label: "A vencer",
    bg: "#dcfce7",
    color: "#166534",
    border: "#86efac",
    tone: "verde" as const,
  };
}

export default function AdminServicosPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState(
    "Carregando painel administrativo...",
  );
  const [search, setSearch] = useState("");
  const [empresaFiltro, setEmpresaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [aba, setAba] = useState<"todos" | "ativos" | "historico">("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  async function carregarServicos(message?: string) {
    try {
      setLoading(true);
      setStatusText(message || "Atualizando leitura administrativa...");

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
          ? `${rows.length} serviço(s) carregado(s) na visão administrativa.`
          : "Nenhum serviço encontrado na base.",
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

  async function atualizarService(
    service: ServiceRow,
    payload: Partial<ServiceRow>,
    mensagem: string,
  ) {
    try {
      setUpdatingId(service.id);
      setStatusText(mensagem);

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: service.id,
          ...payload,
          updated_at: new Date().toISOString(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Falha ao atualizar serviço.");
      }

      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id
            ? {
                ...item,
                ...payload,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Erro ao atualizar serviço.";
      setStatusText(messageText);
      alert(messageText);
    } finally {
      setUpdatingId(null);
    }
  }

  async function atualizarStatusRapido(
    service: ServiceRow,
    novoStatus: "pendente" | "aguardando_pagamento" | "pago",
  ) {
    const payload: Partial<ServiceRow> = {
      status: novoStatus,
      pago: novoStatus === "pago",
      pago_em: novoStatus === "pago" ? new Date().toISOString() : null,
      visivel_motorista: novoStatus === "pago" ? false : true,
    };

    await atualizarService(
      service,
      payload,
      `Atualizando ${getDisplayOS(service)} para ${novoStatus}...`,
    );

    setStatusText(
      `Status de ${getDisplayOS(service)} atualizado para ${novoStatus}.`,
    );
  }

  async function reabrirServico(
    service: ServiceRow,
    destino: "pendente" | "aguardando_pagamento",
  ) {
    const payload: Partial<ServiceRow> = {
      status: destino,
      pago: false,
      pago_em: null,
      visivel_motorista: true,
    };

    await atualizarService(
      service,
      payload,
      `Reabrindo ${getDisplayOS(service)} para ${destino}...`,
    );

    setStatusText(`${getDisplayOS(service)} foi reaberto para ${destino}.`);
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  const empresas = useMemo(() => buildEmpresaList(services), [services]);

  const totais = useMemo(() => {
    const total = services.length;
    const ativos = services.filter((service) => isServicoAtivo(service)).length;
    const historico = services.filter((service) =>
      isHistoricoProtegido(service),
    ).length;
    const pendentes = services.filter(
      (service) => normalize(service.status) === "pendente",
    ).length;
    const aguardandoPagamento = services.filter(
      (service) => normalize(service.status) === "aguardando_pagamento",
    ).length;
    const pagos = services.filter((service) => isPago(service)).length;

    const cobrancaTotal = services.reduce(
      (acc, service) =>
        acc + Number(service.valor_cobranca ?? service.valor_total ?? 0),
      0,
    );

    const margemTotal = services.reduce(
      (acc, service) =>
        acc + Number(service.margem_operacao ?? service.margem_bruta ?? 0),
      0,
    );

    return {
      total,
      ativos,
      historico,
      pendentes,
      aguardandoPagamento,
      pagos,
      cobrancaTotal,
      margemTotal,
    };
  }, [services]);

  const listaBase = useMemo(() => {
    if (aba === "ativos") {
      return services.filter((service) => isServicoAtivo(service));
    }

    if (aba === "historico") {
      return services.filter((service) => isHistoricoProtegido(service));
    }

    return services;
  }, [aba, services]);

  const listaFiltrada = useMemo(() => {
    const termo = normalize(search);

    return listaBase.filter((service) => {
      if (empresaFiltro !== "todas") {
        if (normalize(getDisplayEmpresa(service)) !== normalize(empresaFiltro)) {
          return false;
        }
      }

      const statusNorm = normalize(service.status);
      const passaStatus =
        statusFiltro === "todos"
          ? true
          : statusFiltro === "pago"
            ? isPago(service)
            : statusFiltro === "aguardando_pagamento"
              ? statusNorm === "aguardando_pagamento"
              : statusFiltro === "pendente"
                ? statusNorm === "pendente"
                : statusFiltro === "ativo"
                  ? isServicoAtivo(service)
                  : statusFiltro === "historico"
                    ? isHistoricoProtegido(service)
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
        getNotaNumero(service),
        getNotaEmissao(service),
        getNotaVencimento(service),
      ]
        .filter(Boolean)
        .join(" ");

      return normalize(searchable).includes(termo);
    });
  }, [empresaFiltro, listaBase, search, statusFiltro]);

  const graficoDados = [
    { label: "Ativos", value: totais.ativos, color: "#0ea5e9" },
    { label: "Pendentes", value: totais.pendentes, color: "#38bdf8" },
    {
      label: "Aguardando pagamento",
      value: totais.aguardandoPagamento,
      color: "#f59e0b",
    },
    { label: "Pagos", value: totais.pagos, color: "#22c55e" },
    { label: "Histórico", value: totais.historico, color: "#fb923c" },
  ];

  const maiorBarra = Math.max(...graficoDados.map((item) => item.value), 1);

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        <section style={heroStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
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
              <div style={heroBadge}>Admin â€¢ Serviços</div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                <Link
                  href="/"
                  style={{
                    ...topButtonStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Home
                </Link>

                <button
                  type="button"
                  onClick={() => window.history.back()}
                  style={{
                    ...topButtonStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Voltar
                </button>

                <Link
                  href="/servicos"
                  style={{
                    ...topButtonStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Operação
                </Link>

                <Link
                  href="/motoristas"
                  style={{
                    ...topButtonStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Motoristas
                </Link>

                <Link
                  href="/plataforma/cotacoes/nova"
                  style={{
                    ...topPrimaryStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Novo serviço
                </Link>

                <button
                  type="button"
                  onClick={() => carregarServicos()}
                  style={{
                    ...topRefreshStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  Atualizar leitura
                </button>
              </div>
            </div>

            <h1 style={heroTitle}>
              Painel administrativo de serviços com leitura visual clara
            </h1>

            <p style={heroText}>
              Aqui você enxerga a <strong>base total</strong>, sem limitar pela
              empresa da sessão. É a camada de conferência, correção e gestão
              administrativa, com visão completa de ativos, pendentes,
              aguardando pagamento, pagos e histórico protegido.
            </p>

            <div style={heroInfoRow}>
              <span style={chipNeutral}>
                {loading ? "Atualizando..." : statusText}
              </span>
              <span style={chipWarning}>
                Sistema em constante atualização e podem ocorrer instabilidades
                momentÃ¢neas.
              </span>
            </div>
          </div>
        </section>

        <section style={statsGridStyle}>
          <StatCard
            label="Base total"
            value={String(totais.total)}
            help="Todos os serviços da base administrativa."
          />
          <StatCard
            label="Ativos"
            value={String(totais.ativos)}
            help="Ainda visíveis na operação."
          />
          <StatCard
            label="Pendentes"
            value={String(totais.pendentes)}
            help="Aguardando avanço operacional."
          />
          <StatCard
            label="Aguardando pagamento"
            value={String(totais.aguardandoPagamento)}
            help="Executados sem baixa final."
          />
          <StatCard
            label="Pagos"
            value={String(totais.pagos)}
            help="Com baixa concluída."
          />
          <StatCard
            label="Histórico protegido"
            value={String(totais.historico)}
            help="Pagos ou ocultos do motorista."
          />
        </section>

        <section
          style={{
            ...twoColumnsStyle,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "minmax(0, 1.25fr) minmax(320px, 0.75fr)",
          }}
        >
          <div style={panelStyle}>
            <div style={sectionEyebrow}>Gráfico principal</div>
            <h2 style={sectionTitle}>Status da operação</h2>
            <p style={sectionText}>
              Leitura visual imediata para entender onde a base está concentrada.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {graficoDados.map((item) => {
                const width = `${(item.value / maiorBarra) * 100}%`;

                return (
                  <div key={item.label} style={{ display: "grid", gap: 8 }}>
                    <div style={barHeaderStyle}>
                      <span style={barLabelStyle}>{item.label}</span>
                      <strong style={barValueStyle}>{item.value}</strong>
                    </div>

                    <div style={barTrackStyle}>
                      <div
                        style={{
                          ...barFillStyle,
                          width,
                          background: item.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={panelStyle}>
            <div style={sectionEyebrow}>Financeiro visual</div>
            <h2 style={sectionTitle}>Resumo administrativo</h2>

            <div style={{ display: "grid", gap: 12 }}>
              <MiniFinanceCard
                label="Cobrança total da base"
                value={formatCurrency(totais.cobrancaTotal)}
              />
              <MiniFinanceCard
                label="Margem total da base"
                value={formatCurrency(totais.margemTotal)}
              />
              <MiniFinanceCard
                label="Exibidos após filtros"
                value={String(listaFiltrada.length)}
              />
            </div>

            <div style={adminNoteStyle}>
              Este painel foi pensado para leitura rápida, conferência geral e
              correções administrativas sem misturar a visão operacional enxuta
              com a visão master.
            </div>
          </div>
        </section>

        <section style={panelStyle}>
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div style={sectionEyebrow}>Filtros administrativos</div>
            <h2 style={sectionTitle}>Controle total da base</h2>

            <div style={tabsRowStyle}>
              <button
                type="button"
                onClick={() => setAba("todos")}
                style={{
                  ...tabButtonStyle,
                  background: aba === "todos" ? "#0f172a" : "#ffffff",
                  color: aba === "todos" ? "#ffffff" : "#123047",
                }}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setAba("ativos")}
                style={{
                  ...tabButtonStyle,
                  background: aba === "ativos" ? "#0f172a" : "#ffffff",
                  color: aba === "ativos" ? "#ffffff" : "#123047",
                }}
              >
                Ativos
              </button>
              <button
                type="button"
                onClick={() => setAba("historico")}
                style={{
                  ...tabButtonStyle,
                  background: aba === "historico" ? "#0f172a" : "#ffffff",
                  color: aba === "historico" ? "#ffffff" : "#123047",
                }}
              >
                Histórico protegido
              </button>
            </div>

            <div
              style={{
                ...filtersGridStyle,
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "minmax(0, 2fr) minmax(220px, 1fr) minmax(220px, 1fr)",
              }}
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar OS, empresa, cliente, motorista, rota, placa..."
                style={inputStyle}
              />

              <select
                value={empresaFiltro}
                onChange={(e) => setEmpresaFiltro(e.target.value)}
                style={inputStyle}
              >
                <option value="todas">Todas as empresas</option>
                {empresas.map((empresa) => (
                  <option key={empresa} value={empresa}>
                    {empresa}
                  </option>
                ))}
              </select>

              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                style={inputStyle}
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Ativos</option>
                <option value="pendente">Pendentes</option>
                <option value="aguardando_pagamento">Aguardando pagamento</option>
                <option value="pago">Pagos</option>
                <option value="historico">Histórico protegido</option>
              </select>
            </div>
          </div>
        </section>

        <section style={listGridStyle}>
          {loading ? (
            <EmptyState text="Carregando painel administrativo..." />
          ) : listaFiltrada.length === 0 ? (
            <EmptyState text="Nenhum serviço encontrado com os filtros atuais." />
          ) : (
            listaFiltrada.map((service) => {
              const statusBadge = getStatusStyles(service);
              const historicoProtegido = isHistoricoProtegido(service);
              const disabled = updatingId === service.id;
              const notaStatus = getNotaStatusFiscal(service);

              return (
                <article key={service.id} style={serviceCardStyle}>
                  <div
                    style={{
                      ...serviceAccentStyle,
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
                    <div style={{ display: "grid", gap: 6, minWidth: 0, flex: 1 }}>
                      <strong style={serviceTitleStyle}>
                        {service.servico || "Serviço sem título"}
                      </strong>
                      <span style={serviceMetaStyle}>
                        {getDisplayOS(service)} â€¢ {formatDate(service.data_servico)}
                      </span>
                    </div>

                    <span
                      style={{
                        ...statusBadgeStyle,
                        background: statusBadge.bg,
                        color: statusBadge.color,
                        border: `1px solid ${statusBadge.border}`,
                        whiteSpace: isMobile ? "normal" : "nowrap",
                        textAlign: "center",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      {statusBadge.label}
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
                    <Info label="Empresa" value={getDisplayEmpresa(service)} />
                    <Info label="Cliente final" value={getDisplayCliente(service)} />
                    <Info label="Motorista" value={service.motorista || "Não informado"} />
                    <Info label="Placa" value={service.placa_veiculo || "Não informada"} />
                    <Info
                      label="Cobrança"
                      value={formatCurrency(
                        service.valor_cobranca ?? service.valor_total ?? 0,
                      )}
                    />
                    <Info
                      label="Margem"
                      value={formatCurrency(
                        service.margem_operacao ?? service.margem_bruta ?? 0,
                      )}
                    />
                  </div>

                  <div style={fiscalBoxStyle}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={fiscalTitleStyle}>Controle fiscal / nota</div>

                      <span
                        style={{
                          ...notaBadgeStyle,
                          background: notaStatus.bg,
                          color: notaStatus.color,
                          border: `1px solid ${notaStatus.border}`,
                        }}
                      >
                        {notaStatus.label}
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
                        label="Número da nota"
                        value={getNotaNumero(service) || "Não informada"}
                      />
                      <Info
                        label="Valor da nota"
                        value={
                          getNotaNumero(service) ||
                          getNotaEmissao(service) ||
                          getNotaVencimento(service)
                            ? formatCurrency(getNotaValor(service))
                            : "Não informado"
                        }
                      />
                      <Info
                        label="Data de emissão"
                        value={formatDate(getNotaEmissao(service) || null)}
                      />
                      <Info
                        label="Data de vencimento"
                        value={formatDate(getNotaVencimento(service) || null)}
                      />
                    </div>

                    <div
                      style={{
                        ...fiscalNoteStyle,
                        background:
                          notaStatus.tone === "vermelho"
                            ? "#fef2f2"
                            : notaStatus.tone === "verde"
                              ? "#f0fdf4"
                              : "#f8fafc",
                        border:
                          notaStatus.tone === "vermelho"
                            ? "1px solid #fecaca"
                            : notaStatus.tone === "verde"
                              ? "1px solid #bbf7d0"
                              : "1px solid #e2e8f0",
                        color:
                          notaStatus.tone === "vermelho"
                            ? "#b91c1c"
                            : notaStatus.tone === "verde"
                              ? "#166534"
                              : "#475569",
                      }}
                    >
                      {notaStatus.label === "Sem nota"
                        ? "Nota fiscal ainda não informada neste serviço."
                        : notaStatus.label === "Vencida"
                          ? "Atenção: esta nota fiscal está vencida e precisa de ação rápida."
                          : notaStatus.label === "A vencer"
                            ? "Nota fiscal em acompanhamento e ainda dentro do prazo."
                            : notaStatus.label === "Recebida"
                              ? "Nota fiscal já recebida/baixada conforme status informado."
                              : "Controle fiscal visual preparado para conferência rápida."}
                    </div>
                  </div>

                  <div style={observationBoxStyle}>
                    <strong style={{ color: "#123047" }}>Observações:</strong>{" "}
                    {getDisplayObservacao(service)}
                  </div>

                  <div style={actionsBoxStyle}>
                    <div style={actionsTitleStyle}>Ação rápida administrativa</div>

                    {historicoProtegido ? (
                      <>
                        <div style={lockedNoteStyle}>
                          Este item está no histórico protegido. Aqui você pode
                          reabrir o serviço para voltar Ã  operação ativa quando
                          precisar corrigir uma baixa, um pagamento ou uma
                          visibilidade indevida.
                        </div>

                        <div style={actionsRowStyle}>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => reabrirServico(service, "pendente")}
                            style={{
                              ...actionButtonStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Reabrir para pendente
                          </button>

                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() =>
                              reabrirServico(service, "aguardando_pagamento")
                            }
                            style={{
                              ...actionPrimaryButtonStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Reabrir para aguardando pagamento
                          </button>
                        </div>

                        <div style={helperTextStyle}>
                          {disabled
                            ? "Atualizando este serviço..."
                            : "Ao reabrir, o item volta para a visão ativa e fica visível novamente para a operação."}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={actionsRowStyle}>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => atualizarStatusRapido(service, "pendente")}
                            style={{
                              ...actionButtonStyle,
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
                                "aguardando_pagamento",
                              )
                            }
                            style={{
                              ...actionButtonStyle,
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
                              ...actionPrimaryButtonStyle,
                              opacity: disabled ? 0.6 : 1,
                            }}
                          >
                            Marcar como pago
                          </button>
                        </div>

                        <div style={helperTextStyle}>
                          {disabled
                            ? "Atualizando este serviço..."
                            : "Ao marcar como pago, ele sai da visão ativa e vai para o histórico protegido."}
                        </div>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={footerMetaStyle}>
                      Atualizado em {formatDateTime(service.updated_at)}
                    </span>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      <Link href={`/servicos/${service.id}`} style={secondaryLinkStyle}>
                        Abrir
                      </Link>
                      <Link href={`/servicos/${service.id}`} style={primaryLinkStyle}>
                        Editar serviço
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })
          )}
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
    <article style={statCardStyle}>
      <div style={statLabelStyle}>{label}</div>
      <div style={statValueStyle}>{value}</div>
      <div style={statHelpStyle}>{help}</div>
    </article>
  );
}

function MiniFinanceCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={miniFinanceCardStyle}>
      <div style={miniFinanceLabelStyle}>{label}</div>
      <div style={miniFinanceValueStyle}>{value}</div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={infoCardStyle}>
      <div style={infoLabelStyle}>{label}</div>
      <div style={infoValueStyle}>{value}</div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div style={emptyStateStyle}>{text}</div>;
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f4f8fc 0%, #eef4fb 45%, #f6f8fb 100%)",
  padding: "24px 16px 48px",
  color: "#123047",
};

const containerStyle: CSSProperties = {
  width: "100%",
  maxWidth: 1320,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const heroStyle: CSSProperties = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 28,
  padding: 24,
  border: "1px solid #e7eef6",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
};

const heroBadge: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "8px 14px",
  borderRadius: 999,
  background: "#e0f2fe",
  border: "1px solid #bae6fd",
  color: "#075985",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
};

const heroTitle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(28px, 5vw, 42px)",
  lineHeight: 1.06,
  color: "#0f172a",
  fontWeight: 900,
  wordBreak: "break-word",
};

const heroText: CSSProperties = {
  margin: 0,
  color: "#4b6478",
  fontSize: 15,
  lineHeight: 1.75,
  maxWidth: 980,
};

const heroInfoRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const chipNeutral: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#334155",
  fontSize: 13,
  fontWeight: 700,
};

const chipWarning: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 12px",
  borderRadius: 999,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  color: "#9a3412",
  fontSize: 13,
  fontWeight: 700,
};

const topButtonStyle: CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 14px",
  borderRadius: 999,
  background: "#ffffff",
  border: "1px solid rgba(148,163,184,0.20)",
  color: "#123047",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};

const topPrimaryStyle: CSSProperties = {
  ...topButtonStyle,
  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  color: "#ffffff",
  border: "1px solid transparent",
  boxShadow: "0 14px 32px rgba(37, 99, 235, 0.22)",
};

const topRefreshStyle: CSSProperties = {
  ...topButtonStyle,
  background: "#0f172a",
  color: "#ffffff",
  border: "1px solid #0f172a",
};

const statsGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 14,
};

const statCardStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 24,
  padding: 18,
  border: "1px solid #e7eef6",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
};

const statLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#0891b2",
  marginBottom: 10,
};

const statValueStyle: CSSProperties = {
  fontSize: 32,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1,
  marginBottom: 8,
};

const statHelpStyle: CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
  color: "#64748b",
};

const twoColumnsStyle: CSSProperties = {
  display: "grid",
  gap: 16,
  alignItems: "start",
};

const panelStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 26,
  padding: 20,
  border: "1px solid #e7eef6",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  minWidth: 0,
};

const sectionEyebrow: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.45,
  color: "#0891b2",
};

const sectionTitle: CSSProperties = {
  margin: 0,
  fontSize: 28,
  lineHeight: 1.08,
  color: "#0f172a",
  fontWeight: 900,
};

const sectionText: CSSProperties = {
  margin: 0,
  color: "#64748b",
  fontSize: 14,
  lineHeight: 1.7,
};

const barHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "center",
};

const barLabelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#123047",
};

const barValueStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 900,
  color: "#0f172a",
};

const barTrackStyle: CSSProperties = {
  width: "100%",
  height: 14,
  borderRadius: 999,
  background: "#e2e8f0",
  overflow: "hidden",
};

const barFillStyle: CSSProperties = {
  height: "100%",
  borderRadius: 999,
  transition: "width 0.3s ease",
};

const miniFinanceCardStyle: CSSProperties = {
  borderRadius: 18,
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  padding: 14,
};

const miniFinanceLabelStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b",
  marginBottom: 6,
};

const miniFinanceValueStyle: CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  color: "#0f172a",
  lineHeight: 1.1,
};

const adminNoteStyle: CSSProperties = {
  borderRadius: 18,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  padding: 14,
  color: "#1e3a8a",
  fontSize: 13,
  lineHeight: 1.7,
  fontWeight: 700,
};

const tabsRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const tabButtonStyle: CSSProperties = {
  minHeight: 40,
  padding: "10px 14px",
  borderRadius: 999,
  border: "1px solid #dbeafe",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};

const filtersGridStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 52,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
  padding: "14px 16px",
  fontSize: 15,
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
};

const listGridStyle: CSSProperties = {
  display: "grid",
  gap: 14,
};

const serviceCardStyle: CSSProperties = {
  background: "#fcfdff",
  border: "1px solid #e7eef6",
  borderRadius: 24,
  padding: 18,
  boxShadow: "0 16px 34px rgba(15, 23, 42, 0.05)",
  display: "flex",
  flexDirection: "column",
  gap: 14,
  position: "relative",
  overflow: "hidden",
  minWidth: 0,
};

const serviceAccentStyle: CSSProperties = {
  position: "absolute",
  inset: "0 auto 0 0",
  width: 6,
};

const serviceTitleStyle: CSSProperties = {
  fontSize: 20,
  lineHeight: 1.25,
  color: "#0f172a",
  wordBreak: "break-word",
};

const serviceMetaStyle: CSSProperties = {
  color: "#5b7488",
  fontSize: 13,
  fontWeight: 700,
  wordBreak: "break-word",
};

const statusBadgeStyle: CSSProperties = {
  alignSelf: "flex-start",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 800,
  fontSize: 12,
};

const infoCardStyle: CSSProperties = {
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.14)",
  background: "#ffffff",
  padding: 14,
  minWidth: 0,
};

const infoLabelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  color: "#0891b2",
  marginBottom: 6,
  wordBreak: "break-word",
};

const infoValueStyle: CSSProperties = {
  fontSize: 14,
  lineHeight: 1.65,
  color: "#0f172a",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const fiscalBoxStyle: CSSProperties = {
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e7eef6",
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const fiscalTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#123047",
};

const notaBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 36,
  padding: "8px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
};

const fiscalNoteStyle: CSSProperties = {
  borderRadius: 14,
  padding: 12,
  fontSize: 13,
  lineHeight: 1.6,
  fontWeight: 700,
};

const observationBoxStyle: CSSProperties = {
  borderRadius: 16,
  background: "#f8fbff",
  border: "1px solid #e5edf5",
  padding: 14,
  color: "#435b6e",
  fontSize: 14,
  lineHeight: 1.6,
};

const actionsBoxStyle: CSSProperties = {
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e7eef6",
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const actionsTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#123047",
};

const lockedNoteStyle: CSSProperties = {
  borderRadius: 14,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  padding: 12,
  color: "#475569",
  fontSize: 13,
  lineHeight: 1.6,
  fontWeight: 700,
};

const actionsRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const actionButtonStyle: CSSProperties = {
  minHeight: 40,
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#123047",
  fontSize: 13,
  fontWeight: 800,
  cursor: "pointer",
};

const actionPrimaryButtonStyle: CSSProperties = {
  ...actionButtonStyle,
  background: "#0f172a",
  color: "#ffffff",
  border: "1px solid #0f172a",
};

const helperTextStyle: CSSProperties = {
  fontSize: 12,
  color: "#64748b",
  lineHeight: 1.6,
};

const footerMetaStyle: CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 700,
};

const secondaryLinkStyle: CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 40,
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  background: "#ffffff",
  color: "#123047",
  fontSize: 13,
  fontWeight: 800,
};

const primaryLinkStyle: CSSProperties = {
  ...secondaryLinkStyle,
  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  color: "#ffffff",
  border: "1px solid transparent",
};

const emptyStateStyle: CSSProperties = {
  minHeight: 140,
  borderRadius: 24,
  border: "1px dashed rgba(148,163,184,0.28)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#475569",
  fontSize: 15,
  fontWeight: 700,
  background: "rgba(248,250,252,0.72)",
  textAlign: "center",
  padding: 20,
};

