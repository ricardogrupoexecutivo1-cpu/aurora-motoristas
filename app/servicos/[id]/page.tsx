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

type PageProps = {
  params: Promise<{ id: string }>;
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

function isPago(service?: ServiceRow | null) {
  if (!service) return false;
  return normalize(service.status) === "pago" || service.pago === true;
}

function isHistoricoProtegido(service?: ServiceRow | null) {
  if (!service) return false;
  return isPago(service) || service.visivel_motorista === false;
}

function getDisplayOS(service?: ServiceRow | null) {
  if (!service) return "Sem OS";
  return service.os_sistema || service.os || service.os_cliente || "Sem OS";
}

function getDisplayEmpresa(service?: ServiceRow | null) {
  if (!service) return "Não informado";
  return (
    service.empresa ||
    service.contratante ||
    service.empresa_operadora ||
    "Não informado"
  );
}

function getDisplayCliente(service?: ServiceRow | null) {
  if (!service) return "Não informado";
  return service.cliente || service.cliente_final || "Não informado";
}

function getDisplayObservacao(service?: ServiceRow | null) {
  if (!service) return "Sem observações.";
  return service.observacoes || service.observacao || "Sem observações.";
}

function getStatusLabel(service?: ServiceRow | null) {
  if (!service) return "Sem status";
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

function getNotaNumero(service?: ServiceRow | null) {
  if (!service) return "";
  return service.numero_nota_fiscal || service.nota_fiscal_numero || "";
}

function getNotaEmissao(service?: ServiceRow | null) {
  if (!service) return "";
  return service.data_emissao_nota || service.nota_fiscal_emissao || "";
}

function getNotaVencimento(service?: ServiceRow | null) {
  if (!service) return "";
  return service.data_vencimento_nota || service.nota_fiscal_vencimento || "";
}

function getNotaValor(service?: ServiceRow | null) {
  if (!service) return 0;
  return service.valor_nota_fiscal ?? service.nota_fiscal_valor ?? 0;
}

function hasNota(service?: ServiceRow | null) {
  if (!service) return false;
  return Boolean(
    getNotaNumero(service) ||
      getNotaEmissao(service) ||
      getNotaVencimento(service) ||
      getNotaValor(service)
  );
}

function getNotaStatusFiscal(service?: ServiceRow | null) {
  if (!service) {
    return {
      label: "Sem nota",
      bg: "#f8fafc",
      color: "#475569",
      border: "#cbd5e1",
      tone: "neutro" as const,
    };
  }

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

export default function ServicoDetalhePage({ params }: PageProps) {
  const [resolvedId, setResolvedId] = useState("");
  const [service, setService] = useState<ServiceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Carregando serviço...");
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const [notaNumero, setNotaNumero] = useState("");
  const [notaEmissao, setNotaEmissao] = useState("");
  const [notaVencimento, setNotaVencimento] = useState("");
  const [notaValor, setNotaValor] = useState("");
  const [statusFiscal, setStatusFiscal] = useState("");

  useEffect(() => {
    let active = true;

    async function resolveParams() {
      try {
        const value = await params;
        if (!active) return;
        setResolvedId(value?.id || "");
      } catch {
        if (!active) return;
        setResolvedId("");
      }
    }

    resolveParams();

    return () => {
      active = false;
    };
  }, [params]);

  useEffect(() => {
    let active = true;

    async function carregarServico() {
      if (!resolvedId) {
        setLoading(false);
        setService(null);
        setLoadError("ID do serviço não informado.");
        setStatusText("Não foi possível identificar o serviço.");
        return;
      }

      try {
        setLoading(true);
        setLoadError("");
        setStatusText("Lendo serviço no Supabase...");

        const response = await fetch("/api/services", {
          method: "GET",
          cache: "no-store",
        });

        const data: ApiResponse = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Falha ao ler a base de serviços.");
        }

        const rows = Array.isArray(data.services) ? data.services : [];
        const found = rows.find((item) => item.id === resolvedId) || null;

        if (!found) {
          setService(null);
          setLoadError("Serviço não encontrado na base atual.");
          setStatusText("Nenhum serviço com este ID foi localizado.");
          return;
        }

        if (!active) return;

        setService(found);
        setNotaNumero(getNotaNumero(found));
        setNotaEmissao(getNotaEmissao(found));
        setNotaVencimento(getNotaVencimento(found));
        setNotaValor(
          getNotaValor(found) ? String(getNotaValor(found)).replace(".", ",") : ""
        );
        setStatusFiscal(found.status_nota_fiscal || "");
        setStatusText("Serviço carregado com sucesso.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao carregar serviço.";
        if (!active) return;
        setService(null);
        setLoadError(message);
        setStatusText(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    carregarServico();

    return () => {
      active = false;
    };
  }, [resolvedId]);

  const historicoProtegido = useMemo(
    () => isHistoricoProtegido(service),
    [service]
  );

  const pago = useMemo(() => isPago(service), [service]);

  const notaStatus = useMemo(() => getNotaStatusFiscal(service), [service]);

  async function salvarFiscal() {
    if (!service) return;

    try {
      setSaving(true);
      setStatusText(`Salvando dados fiscais de ${getDisplayOS(service)}...`);

      const valorNormalizado = notaValor
        ? Number(
            String(notaValor)
              .replace(/\./g, "")
              .replace(",", ".")
          )
        : null;

      const payload = {
        id: service.id,
        numero_nota_fiscal: notaNumero || null,
        nota_fiscal_numero: notaNumero || null,
        data_emissao_nota: notaEmissao || null,
        nota_fiscal_emissao: notaEmissao || null,
        data_vencimento_nota: notaVencimento || null,
        nota_fiscal_vencimento: notaVencimento || null,
        valor_nota_fiscal:
          valorNormalizado !== null && !Number.isNaN(valorNormalizado)
            ? valorNormalizado
            : null,
        nota_fiscal_valor:
          valorNormalizado !== null && !Number.isNaN(valorNormalizado)
            ? valorNormalizado
            : null,
        status_nota_fiscal: statusFiscal || null,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Falha ao salvar dados fiscais.");
      }

      const atualizado: ServiceRow = {
        ...service,
        ...payload,
      };

      setService(atualizado);
      setStatusText("Dados fiscais salvos com sucesso.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao salvar fiscal.";
      setStatusText(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link
              href="/servicos"
              style={{
                textDecoration: "none",
                background: "#ffffff",
                color: "#123047",
                border: "1px solid #dbe5ef",
                borderRadius: 12,
                padding: "10px 14px",
                fontWeight: 700,
              }}
            >
              Voltar para serviços
            </Link>

            <Link
              href="/servicos/novo"
              style={{
                textDecoration: "none",
                background: "#0ea5e9",
                color: "#ffffff",
                borderRadius: 12,
                padding: "10px 14px",
                fontWeight: 700,
                boxShadow: "0 12px 30px rgba(14, 165, 233, 0.20)",
              }}
            >
              Novo serviço
            </Link>
          </div>

          <div
            style={{
              background: "#ffffff",
              color: "#5b7488",
              border: "1px solid #e7eef6",
              borderRadius: 12,
              padding: "10px 14px",
              fontWeight: 700,
            }}
          >
            {loading ? "Atualizando..." : statusText}
          </div>
        </div>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            border: "1px solid #e7eef6",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                background: "#e0f2fe",
                color: "#075985",
                borderRadius: 999,
                padding: "6px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Aurora Motoristas
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                lineHeight: 1.1,
              }}
            >
              Serviço individual
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.6,
              }}
            >
              Tela interna de leitura segura da operação e edição fiscal. Quando
              o serviço é marcado como pago ou sai da visibilidade do motorista,
              ele continua acessível aqui para conferência interna, sem quebrar a
              regra de ocultação da visão operacional do motorista.
            </p>

            <div
              style={{
                marginTop: 4,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span
                style={{
                  background: "#fff7ed",
                  color: "#9a3412",
                  border: "1px solid #fed7aa",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Sistema em constante atualização e podem ocorrer instabilidades
                momentâneas.
              </span>

              <span
                style={{
                  background: "#f8fafc",
                  color: "#334155",
                  border: "1px solid #e2e8f0",
                  borderRadius: 999,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                ID: {resolvedId || "não resolvido"}
              </span>
            </div>
          </div>
        </section>

        {loading ? (
          <section
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #e7eef6",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Carregando serviço...
          </section>
        ) : loadError || !service ? (
          <section
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 24,
              border: "1px solid #fecaca",
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#991b1b",
                marginBottom: 10,
              }}
            >
              Não foi possível abrir este serviço
            </div>

            <p
              style={{
                margin: 0,
                color: "#7f1d1d",
                lineHeight: 1.7,
              }}
            >
              {loadError || "Serviço não encontrado."}
            </p>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Link
                href="/servicos"
                style={{
                  textDecoration: "none",
                  background: "#123047",
                  color: "#ffffff",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontWeight: 800,
                }}
              >
                Voltar para a listagem
              </Link>

              <Link
                href="/servicos/novo"
                style={{
                  textDecoration: "none",
                  background: "#ffffff",
                  color: "#123047",
                  border: "1px solid #dbe5ef",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontWeight: 800,
                }}
              >
                Cadastrar novo serviço
              </Link>
            </div>
          </section>
        ) : (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 14,
              }}
            >
              {[
                {
                  label: "OS do sistema",
                  value: getDisplayOS(service),
                  help: "Número interno da operação",
                },
                {
                  label: "Status",
                  value: getStatusLabel(service),
                  help: "Situação atual do serviço",
                },
                {
                  label: "Visão",
                  value: historicoProtegido
                    ? "Histórico protegido"
                    : "Serviço ativo",
                  help: historicoProtegido
                    ? "Fora da visão do motorista"
                    : "Ainda visível na operação",
                },
                {
                  label: "Data do serviço",
                  value: formatDate(service.data_servico),
                  help: "Data operacional registrada",
                },
                {
                  label: "Cobrança",
                  value: formatCurrency(
                    service.valor_cobranca ?? service.valor_total ?? 0
                  ),
                  help: "Valor da operação",
                },
                {
                  label: "Fechamento motorista",
                  value: formatCurrency(
                    service.fechamento_motorista ??
                      service.valor_motorista ??
                      0
                  ),
                  help: "Valor interno do motorista",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
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
                    {item.label}
                  </div>

                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#123047",
                      lineHeight: 1.3,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#6b7f90",
                      fontSize: 13,
                    }}
                  >
                    {item.help}
                  </div>
                </div>
              ))}
            </section>

            <section
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.8fr",
                gap: 16,
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  padding: 20,
                  border: "1px solid #e7eef6",
                  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: 24,
                        lineHeight: 1.2,
                        color: "#0f172a",
                      }}
                    >
                      {service.servico || "Serviço sem título"}
                    </h2>

                    <div
                      style={{
                        marginTop: 6,
                        color: "#64748b",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {getTipoServicoLabel(service.tipo_servico)}
                    </div>
                  </div>

                  <span
                    style={{
                      alignSelf: "flex-start",
                      background: pago ? "#dcfce7" : "#fff7ed",
                      color: pago ? "#166534" : "#9a3412",
                      borderRadius: 999,
                      padding: "8px 12px",
                      fontWeight: 800,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getStatusLabel(service)}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  <Info label="Contratante" value={getDisplayEmpresa(service)} />
                  <Info label="Cliente" value={getDisplayCliente(service)} />
                  <Info
                    label="Contato cliente"
                    value={service.contato_cliente_final || "Não informado"}
                  />
                  <Info
                    label="Telefone cliente"
                    value={service.telefone_cliente_final || "Não informado"}
                  />
                  <Info
                    label="Motorista"
                    value={service.motorista || "Não informado"}
                  />
                  <Info
                    label="Placa"
                    value={service.placa_veiculo || "Não informada"}
                  />
                  <Info label="Origem" value={service.origem || "Não informada"} />
                  <Info
                    label="Destino"
                    value={service.destino || "Não informado"}
                  />
                  <Info
                    label="Endereço retirada"
                    value={service.endereco_retirada || "Não informado"}
                  />
                  <Info
                    label="Endereço entrega"
                    value={service.endereco_entrega || "Não informado"}
                  />
                  <Info
                    label="Informado por"
                    value={service.endereco_informado_por || "Não informado"}
                  />
                  <Info
                    label="Etapa"
                    value={service.etapa || "Não informada"}
                  />
                </div>

                <div
                  style={{
                    borderRadius: 18,
                    background: "#f8fbff",
                    border: "1px solid #e5edf5",
                    padding: 16,
                    color: "#435b6e",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: "#123047" }}>Observações:</strong>{" "}
                  {getDisplayObservacao(service)}
                </div>

                {service.checklist_obrigatorio ? (
                  <div
                    style={{
                      borderRadius: 18,
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      padding: 16,
                      color: "#1e3a8a",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    <strong>Checklist obrigatório:</strong>{" "}
                    {service.checklist_instrucoes ||
                      "Motorista deve cumprir o checklist definido para esta operação."}
                  </div>
                ) : null}

                <div
                  style={{
                    borderRadius: 18,
                    background: historicoProtegido ? "#fff7ed" : "#ecfeff",
                    border: `1px solid ${
                      historicoProtegido ? "#fed7aa" : "#bae6fd"
                    }`,
                    padding: 16,
                    color: "#3b5568",
                    fontSize: 14,
                    lineHeight: 1.7,
                  }}
                >
                  {historicoProtegido ? (
                    <>
                      <strong style={{ color: "#9a3412" }}>
                        Histórico interno protegido:
                      </strong>{" "}
                      este serviço foi preservado para conferência interna e não
                      deve mais aparecer como item ativo para o motorista.
                    </>
                  ) : (
                    <>
                      <strong style={{ color: "#075985" }}>
                        Serviço ativo:
                      </strong>{" "}
                      este item ainda está no fluxo operacional normal e segue
                      visível na camada ativa do sistema.
                    </>
                  )}
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 24,
                  padding: 20,
                  border: "1px solid #e7eef6",
                  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    lineHeight: 1.2,
                    color: "#0f172a",
                  }}
                >
                  Consolidação interna
                </h3>

                <Info
                  label="Cobrança total"
                  value={formatCurrency(
                    service.valor_cobranca ?? service.valor_total ?? 0
                  )}
                />
                <Info
                  label="Valor motorista"
                  value={formatCurrency(service.valor_motorista ?? 0)}
                />
                <Info
                  label="Adiantamento motorista"
                  value={formatCurrency(service.adiantamento_motorista ?? 0)}
                />
                <Info
                  label="Despesas"
                  value={formatCurrency(
                    service.despesas_motorista ??
                      service.despesas ??
                      service.reembolso ??
                      0
                  )}
                />
                <Info
                  label="Fechamento motorista"
                  value={formatCurrency(service.fechamento_motorista ?? 0)}
                />
                <Info
                  label="Margem operação"
                  value={formatCurrency(
                    service.margem_operacao ?? service.margem_bruta ?? 0
                  )}
                />
                <Info
                  label="KM"
                  value={String(service.km_total ?? service.km ?? 0)}
                />
                <Info label="Pago?" value={pago ? "Sim" : "Não"} />
                <Info
                  label="Pago em"
                  value={service.pago_em ? formatDateTime(service.pago_em) : "—"}
                />
                <Info
                  label="Visível para motorista"
                  value={service.visivel_motorista === false ? "Não" : "Sim"}
                />
                <Info
                  label="Criado em"
                  value={formatDateTime(service.created_at)}
                />
                <Info
                  label="Atualizado em"
                  value={formatDateTime(service.updated_at)}
                />
              </div>
            </section>

            <section
              style={{
                background: "#ffffff",
                borderRadius: 24,
                padding: 20,
                border: "1px solid #e7eef6",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 22,
                      lineHeight: 1.2,
                      color: "#0f172a",
                    }}
                  >
                    Fiscal do serviço
                  </h3>

                  <p
                    style={{
                      margin: "6px 0 0 0",
                      color: "#64748b",
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}
                  >
                    Área interna para registrar nota fiscal sem expor dados ao
                    motorista nem ao cliente.
                  </p>
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 36,
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 800,
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
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <Field
                  label="Número da nota"
                  value={notaNumero}
                  onChange={setNotaNumero}
                  placeholder="Ex.: 000123"
                />

                <Field
                  label="Valor da nota"
                  value={notaValor}
                  onChange={setNotaValor}
                  placeholder="Ex.: 1500,00"
                />

                <Field
                  label="Data de emissão"
                  value={notaEmissao}
                  onChange={setNotaEmissao}
                  placeholder="AAAA-MM-DD"
                  type="date"
                />

                <Field
                  label="Data de vencimento"
                  value={notaVencimento}
                  onChange={setNotaVencimento}
                  placeholder="AAAA-MM-DD"
                  type="date"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 320px)",
                  gap: 12,
                }}
              >
                <SelectField
                  label="Status fiscal"
                  value={statusFiscal}
                  onChange={setStatusFiscal}
                  options={[
                    { value: "", label: "Sem status manual" },
                    { value: "pendente", label: "Pendente" },
                    { value: "recebida", label: "Recebida" },
                  ]}
                />
              </div>

              <div
                style={{
                  borderRadius: 16,
                  background:
                    notaStatus.tone === "vermelho"
                      ? "#fef2f2"
                      : notaStatus.tone === "verde"
                      ? "#f0fdf4"
                      : notaStatus.tone === "azul"
                      ? "#eff6ff"
                      : "#f8fafc",
                  border:
                    notaStatus.tone === "vermelho"
                      ? "1px solid #fecaca"
                      : notaStatus.tone === "verde"
                      ? "1px solid #bbf7d0"
                      : notaStatus.tone === "azul"
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",
                  padding: 14,
                  fontSize: 13,
                  lineHeight: 1.7,
                  fontWeight: 700,
                  color:
                    notaStatus.tone === "vermelho"
                      ? "#b91c1c"
                      : notaStatus.tone === "verde"
                      ? "#166534"
                      : notaStatus.tone === "azul"
                      ? "#1d4ed8"
                      : "#475569",
                }}
              >
                {notaStatus.label === "Sem nota"
                  ? "Ainda não há dados fiscais preenchidos neste serviço."
                  : notaStatus.label === "Vencida"
                  ? "Atenção: a nota está vencida e exige ação rápida."
                  : notaStatus.label === "A vencer"
                  ? "A nota está cadastrada e ainda dentro do prazo."
                  : notaStatus.label === "Recebida"
                  ? "A nota já foi marcada como recebida."
                  : "Controle fiscal preparado para conferência interna."}
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
                  onClick={salvarFiscal}
                  disabled={saving}
                  style={{
                    border: "none",
                    background: "#0f172a",
                    color: "#ffffff",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontWeight: 800,
                    cursor: "pointer",
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? "Salvando fiscal..." : "Salvar fiscal"}
                </button>
              </div>

              <div
                style={{
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: 14,
                  color: "#475569",
                  fontSize: 13,
                  lineHeight: 1.7,
                }}
              >
                Esta área é interna. O registro fiscal fica preservado para
                administração e não deve aparecer para motorista nem para cliente.
              </div>
            </section>
          </>
        )}
      </div>
    </main>
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#6b7f90",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          borderRadius: 14,
          border: "1px solid #d8e3ee",
          padding: "14px 16px",
          fontSize: 15,
          outline: "none",
          background: "#f8fbff",
          color: "#123047",
          boxSizing: "border-box",
        }}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: "#6b7f90",
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          borderRadius: 14,
          border: "1px solid #d8e3ee",
          padding: "14px 16px",
          fontSize: 15,
          outline: "none",
          background: "#f8fbff",
          color: "#123047",
          boxSizing: "border-box",
        }}
      >
        {options.map((option) => (
          <option key={option.value || "empty"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}