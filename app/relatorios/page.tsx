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
  placa_veiculo?: string | null;
  data_servico?: string | null;
  valor_total?: number | null;
  valor_cobranca?: number | null;
  valor_motorista?: number | null;
  adiantamento_motorista?: number | null;
  despesas?: number | null;
  despesas_motorista?: number | null;
  reembolso?: number | null;
  fechamento_motorista?: number | null;
  margem_bruta?: number | null;
  margem_operacao?: number | null;
  status?: string | null;
  pago?: boolean | null;
  pago_em?: string | null;
  visivel_motorista?: boolean | null;
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

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value?: number | null) {
  return moeda.format(Number(value || 0));
}

function formatPercent(value?: number | null) {
  const numero = Number(value || 0);
  return `${numero.toFixed(2).replace(".", ",")}%`;
}

function formatDate(value?: string | null) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function normalize(value?: string | null) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getDisplayOS(service: ServiceRow) {
  return service.os_sistema || service.os || service.os_cliente || "Sem OS";
}

function getDisplayEmpresa(service: ServiceRow) {
  return (
    service.empresa ||
    service.contratante ||
    service.empresa_operadora ||
    "NÃ£o informado"
  );
}

function getDisplayCliente(service: ServiceRow) {
  return service.cliente || service.cliente_final || "NÃ£o informado";
}

function getDisplayStatus(service: ServiceRow) {
  if (normalize(service.status) === "aguardando_pagamento") {
    return "Aguardando pagamento";
  }

  if (normalize(service.status) === "pendente") {
    return "Pendente";
  }

  if (normalize(service.status) === "pago" || service.pago === true) {
    return "Pago";
  }

  return service.status || "Sem status";
}

function getValorCobrado(service: ServiceRow) {
  return Number(service.valor_cobranca ?? service.valor_total ?? 0);
}

function getValorGastoTotal(service: ServiceRow) {
  const motorista = Number(
    service.fechamento_motorista ??
      service.valor_motorista ??
      0
  );

  const despesas = Number(
    service.despesas_motorista ??
      service.despesas ??
      service.reembolso ??
      0
  );

  const adiantamento = Number(service.adiantamento_motorista ?? 0);

  return motorista + despesas + adiantamento;
}

function getLucroValor(service: ServiceRow) {
  const cobrado = getValorCobrado(service);
  const gasto = getValorGastoTotal(service);

  const margemSalva = Number(service.margem_operacao ?? service.margem_bruta ?? NaN);
  if (!Number.isNaN(margemSalva) && margemSalva !== 0) {
    return margemSalva;
  }

  return cobrado - gasto;
}

function getLucroPercentual(service: ServiceRow) {
  const cobrado = getValorCobrado(service);
  const lucro = getLucroValor(service);

  if (!cobrado) return 0;
  return (lucro / cobrado) * 100;
}

function getNotaNumero(service: ServiceRow) {
  return service.numero_nota_fiscal || service.nota_fiscal_numero || "";
}

function getNotaVencimento(service: ServiceRow) {
  return service.data_vencimento_nota || service.nota_fiscal_vencimento || "";
}

function getNotaValor(service: ServiceRow) {
  return Number(service.valor_nota_fiscal ?? service.nota_fiscal_valor ?? 0);
}

function getStatusFiscal(service: ServiceRow) {
  const statusManual = normalize(service.status_nota_fiscal);
  if (statusManual === "recebida" || statusManual === "paga") return "Recebida";
  if (statusManual === "pendente") return "Pendente";

  const numero = getNotaNumero(service);
  const vencimento = getNotaVencimento(service);

  if (!numero && !vencimento) return "Sem nota";
  if (!vencimento) return "Sem vencimento";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataVenc = new Date(vencimento);
  if (Number.isNaN(dataVenc.getTime())) return "Sem vencimento";

  dataVenc.setHours(0, 0, 0, 0);

  if (dataVenc < hoje) return "Vencida";
  return "A vencer";
}

function serviceBelongsToEmpresa(service: ServiceRow, empresaLogada: string) {
  if (!empresaLogada) return true;

  const empresaNorm = normalize(empresaLogada);

  const candidatos = [
    service.empresa,
    service.contratante,
    service.empresa_operadora,
  ]
    .map((item) => normalize(item))
    .filter(Boolean);

  return candidatos.some((item) => item.includes(empresaNorm));
}

function downloadCsv(filename: string, rows: string[][]) {
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(";")
    )
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function RelatoriosPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Carregando relatÃ³rios...");
  const [empresaLogada, setEmpresaLogada] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [statusFiscalFilter, setStatusFiscalFilter] = useState("todos");

  async function carregar() {
    try {
      setLoading(true);
      setStatusText("Atualizando relatÃ³rio...");

      const response = await fetch("/api/services", {
        method: "GET",
        cache: "no-store",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Falha ao carregar base.");
      }

      const rows = Array.isArray(data.services) ? data.services : [];
      rows.sort((a, b) => {
        const dateA = new Date(a.data_servico || a.updated_at || 0).getTime();
        const dateB = new Date(b.data_servico || b.updated_at || 0).getTime();
        return dateB - dateA;
      });

      setServices(rows);
      setStatusText(
        rows.length
          ? `${rows.length} serviÃ§o(s) lidos para relatÃ³rio.`
          : "Nenhum serviÃ§o encontrado."
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar relatÃ³rio.";
      setServices([]);
      setStatusText(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    try {
      const empresaSessao =
        localStorage.getItem("aurora_session_empresa") ||
        localStorage.getItem("empresa") ||
        "";
      setEmpresaLogada(String(empresaSessao || "").trim());
    } catch {
      setEmpresaLogada("");
    }
  }, []);

  const baseEmpresa = useMemo(() => {
    return services.filter((service) =>
      serviceBelongsToEmpresa(service, empresaLogada)
    );
  }, [services, empresaLogada]);

  const filtrados = useMemo(() => {
    const termo = normalize(search);

    return baseEmpresa.filter((service) => {
      const status = normalize(getDisplayStatus(service));
      const statusFiscal = normalize(getStatusFiscal(service));

      const passaStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "pago"
          ? status === "pago"
          : statusFilter === "pendente"
          ? status === "pendente"
          : statusFilter === "aguardando_pagamento"
          ? status === "aguardando pagamento"
          : true;

      const passaFiscal =
        statusFiscalFilter === "todos"
          ? true
          : statusFiscal === normalize(statusFiscalFilter);

      if (!passaStatus || !passaFiscal) return false;

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
        getNotaNumero(service),
        getDisplayStatus(service),
        getStatusFiscal(service),
      ]
        .filter(Boolean)
        .join(" ");

      return normalize(searchable).includes(termo);
    });
  }, [baseEmpresa, search, statusFilter, statusFiscalFilter]);

  const resumo = useMemo(() => {
    const valorCobrado = filtrados.reduce((acc, item) => acc + getValorCobrado(item), 0);
    const valorGasto = filtrados.reduce((acc, item) => acc + getValorGastoTotal(item), 0);
    const lucroValor = filtrados.reduce((acc, item) => acc + getLucroValor(item), 0);
    const lucroPercentual = valorCobrado ? (lucroValor / valorCobrado) * 100 : 0;
    const totalNotasRecebidas = filtrados.filter(
      (item) => getStatusFiscal(item) === "Recebida"
    ).length;
    const totalSemNota = filtrados.filter(
      (item) => getStatusFiscal(item) === "Sem nota"
    ).length;

    return {
      quantidade: filtrados.length,
      valorCobrado,
      valorGasto,
      lucroValor,
      lucroPercentual,
      totalNotasRecebidas,
      totalSemNota,
    };
  }, [filtrados]);

  function exportarCsv() {
    const rows: string[][] = [
      [
        "Data",
        "OS",
        "Empresa",
        "Cliente",
        "Motorista",
        "ServiÃ§o",
        "Origem",
        "Destino",
        "Placa",
        "Status",
        "Valor Cobrado",
        "Valor Gasto Total",
        "Lucro Valor",
        "Lucro Percentual",
        "NÃºmero Nota",
        "Valor Nota",
        "Vencimento Nota",
        "Status Fiscal",
      ],
      ...filtrados.map((item) => [
        formatDate(item.data_servico),
        getDisplayOS(item),
        getDisplayEmpresa(item),
        getDisplayCliente(item),
        item.motorista || "NÃ£o informado",
        item.servico || "Sem tÃ­tulo",
        item.origem || "",
        item.destino || "",
        item.placa_veiculo || "",
        getDisplayStatus(item),
        String(getValorCobrado(item).toFixed(2)).replace(".", ","),
        String(getValorGastoTotal(item).toFixed(2)).replace(".", ","),
        String(getLucroValor(item).toFixed(2)).replace(".", ","),
        String(getLucroPercentual(item).toFixed(2)).replace(".", ","),
        getNotaNumero(item),
        String(getNotaValor(item).toFixed(2)).replace(".", ","),
        formatDate(getNotaVencimento(item)),
        getStatusFiscal(item),
      ]),
    ];

    const hoje = new Date().toISOString().slice(0, 10);
    downloadCsv(`relatorio-servicos-${hoje}.csv`, rows);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4f8fc 0%, #eef4fb 45%, #f6f8fb 100%)",
        padding: "24px 16px 48px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1380,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
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
            <span style={chipBlue}>Aurora Motoristas â€¢ RelatÃ³rios</span>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <Link href="/" style={secondaryButton}>
                Home
              </Link>
              <Link href="/admin/servicos" style={secondaryButton}>
                Admin â€¢ ServiÃ§os
              </Link>
              <button type="button" onClick={carregar} style={secondaryButtonAsButton}>
                Atualizar leitura
              </button>
              <button type="button" onClick={exportarCsv} style={primaryButtonAsButton}>
                Baixar CSV
              </button>
            </div>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 5vw, 46px)",
              lineHeight: 1.04,
              color: "#0f172a",
            }}
          >
            RelatÃ³rio operacional e financeiro estilo Excel
          </h1>

          <p
            style={{
              margin: 0,
              color: "#4b6478",
              fontSize: 15,
              lineHeight: 1.75,
              maxWidth: 1000,
            }}
          >
            Base pensada para seguir o espÃ­rito das planilhas de acerto de
            motoristas, cobranÃ§a e contas, jÃ¡ reforÃ§ada com leitura de valor
            cobrado, gasto total, lucro em valor e lucro em percentual para
            facilitar decisÃµes e conferÃªncia diÃ¡ria.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <span style={miniChip}>
              {loading ? "Atualizando..." : statusText}
            </span>

            {empresaLogada ? (
              <span style={miniChipEmpresa}>Empresa da sessÃ£o: {empresaLogada}</span>
            ) : (
              <span style={miniChipInfo}>Sem filtro de empresa na sessÃ£o</span>
            )}

            <span style={miniChipWarning}>
              Sistema em constante atualizaÃ§Ã£o e podem ocorrer instabilidades
              momentÃ¢neas.
            </span>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 14,
          }}
        >
          <ResumoCard
            titulo="Quantidade"
            valor={String(resumo.quantidade)}
            ajuda="Itens do relatÃ³rio atual"
          />
          <ResumoCard
            titulo="Valor cobrado"
            valor={formatCurrency(resumo.valorCobrado)}
            ajuda="Total previsto/lanÃ§ado"
          />
          <ResumoCard
            titulo="Valor gasto total"
            valor={formatCurrency(resumo.valorGasto)}
            ajuda="Motorista + despesas + adiantamento"
          />
          <ResumoCard
            titulo="Lucro em valor"
            valor={formatCurrency(resumo.lucroValor)}
            ajuda="Resultado da operaÃ§Ã£o"
          />
          <ResumoCard
            titulo="Lucro percentual"
            valor={formatPercent(resumo.lucroPercentual)}
            ajuda="Margem percentual da visÃ£o atual"
          />
          <ResumoCard
            titulo="Notas recebidas"
            valor={String(resumo.totalNotasRecebidas)}
            ajuda="Fiscal jÃ¡ baixado"
          />
          <ResumoCard
            titulo="Sem nota"
            valor={String(resumo.totalSemNota)}
            ajuda="Itens ainda sem registro fiscal"
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 18,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "grid",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Filtros do relatÃ³rio
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(220px, 1fr) minmax(220px, 1fr)",
              gap: 12,
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar OS, empresa, cliente, motorista, placa, serviÃ§o..."
              style={fieldStyle}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={fieldStyle}
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendentes</option>
              <option value="aguardando_pagamento">Aguardando pagamento</option>
              <option value="pago">Pagos</option>
            </select>

            <select
              value={statusFiscalFilter}
              onChange={(e) => setStatusFiscalFilter(e.target.value)}
              style={fieldStyle}
            >
              <option value="todos">Todos os fiscais</option>
              <option value="Sem nota">Sem nota</option>
              <option value="Pendente">Pendente</option>
              <option value="A vencer">A vencer</option>
              <option value="Vencida">Vencida</option>
              <option value="Recebida">Recebida</option>
            </select>
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 18,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              minWidth: 1480,
            }}
          >
            <div style={tableHeaderRow}>
              <CellHeader>Data</CellHeader>
              <CellHeader>OS</CellHeader>
              <CellHeader>Empresa</CellHeader>
              <CellHeader>Cliente</CellHeader>
              <CellHeader>Motorista</CellHeader>
              <CellHeader>ServiÃ§o</CellHeader>
              <CellHeader>Status</CellHeader>
              <CellHeader>Valor cobrado</CellHeader>
              <CellHeader>Valor gasto total</CellHeader>
              <CellHeader>Lucro valor</CellHeader>
              <CellHeader>Lucro %</CellHeader>
              <CellHeader>NÂº nota</CellHeader>
              <CellHeader>Valor nota</CellHeader>
              <CellHeader>Vencimento nota</CellHeader>
              <CellHeader>Status fiscal</CellHeader>
              <CellHeader>AÃ§Ãµes</CellHeader>
            </div>

            {loading ? (
              <EmptyState text="Carregando relatÃ³rio..." />
            ) : filtrados.length === 0 ? (
              <EmptyState text="Nenhum item encontrado com os filtros atuais." />
            ) : (
              filtrados.map((item) => (
                <div key={item.id} style={tableRow}>
                  <CellValue>{formatDate(item.data_servico)}</CellValue>
                  <CellValue>{getDisplayOS(item)}</CellValue>
                  <CellValue>{getDisplayEmpresa(item)}</CellValue>
                  <CellValue>{getDisplayCliente(item)}</CellValue>
                  <CellValue>{item.motorista || "NÃ£o informado"}</CellValue>
                  <CellValue>{item.servico || "Sem tÃ­tulo"}</CellValue>
                  <CellValue>{getDisplayStatus(item)}</CellValue>
                  <CellValue>{formatCurrency(getValorCobrado(item))}</CellValue>
                  <CellValue>{formatCurrency(getValorGastoTotal(item))}</CellValue>
                  <CellValue>{formatCurrency(getLucroValor(item))}</CellValue>
                  <CellValue>{formatPercent(getLucroPercentual(item))}</CellValue>
                  <CellValue>{getNotaNumero(item) || "â€”"}</CellValue>
                  <CellValue>{formatCurrency(getNotaValor(item))}</CellValue>
                  <CellValue>{formatDate(getNotaVencimento(item))}</CellValue>
                  <CellValue>{getStatusFiscal(item)}</CellValue>
                  <CellActions>
                    <Link href={`/servicos/${item.id}`} style={smallAction}>
                      Abrir
                    </Link>
                  </CellActions>
                </div>
              ))
            )}
          </div>
        </section>

        <section
          style={{
            borderRadius: 22,
            background: "#f8fbff",
            border: "1px solid #e5edf5",
            padding: 18,
            color: "#435b6e",
            fontSize: 13,
            lineHeight: 1.75,
          }}
        >
          Esta primeira versÃ£o do relatÃ³rio jÃ¡ nasce pronta para o uso real:
          cobranÃ§a, gasto, lucro em valor, lucro percentual e fiscal. No prÃ³ximo
          passo podemos acrescentar visÃ£o mensal, agrupamento por motorista,
          contas a pagar integradas e exportaÃ§Ã£o em formato ainda mais prÃ³ximo de
          planilha financeira.
        </section>
      </div>
    </main>
  );
}

function ResumoCard({
  titulo,
  valor,
  ajuda,
}: {
  titulo: string;
  valor: string;
  ajuda: string;
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
        {titulo}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#123047",
          marginBottom: 8,
          lineHeight: 1.15,
          wordBreak: "break-word",
        }}
      >
        {valor}
      </div>

      <div
        style={{
          color: "#6b7f90",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {ajuda}
      </div>
    </div>
  );
}

function CellHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 10px",
        fontSize: 12,
        fontWeight: 800,
        color: "#1d4ed8",
        textTransform: "uppercase",
        letterSpacing: 0.4,
        borderBottom: "1px solid #dbe5ef",
        background: "#f8fbff",
      }}
    >
      {children}
    </div>
  );
}

function CellValue({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "12px 10px",
        fontSize: 13,
        color: "#123047",
        borderBottom: "1px solid #edf2f7",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function CellActions({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #edf2f7",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        color: "#64748b",
        fontSize: 14,
      }}
    >
      {text}
    </div>
  );
}

const tableHeaderRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "110px 140px 180px 180px 160px 180px 140px 150px 160px 140px 100px 130px 130px 140px 140px 110px",
};

const tableRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "110px 140px 180px 180px 160px 180px 140px 150px 160px 140px 100px 130px 130px 140px 140px 110px",
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

const miniChip: React.CSSProperties = {
  background: "#f8fafc",
  color: "#334155",
  border: "1px solid #e2e8f0",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const miniChipEmpresa: React.CSSProperties = {
  background: "#ecfeff",
  color: "#0f766e",
  border: "1px solid #99f6e4",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const miniChipInfo: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  border: "1px solid #bfdbfe",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const miniChipWarning: React.CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
  borderRadius: 999,
  padding: "8px 12px",
  fontSize: 13,
  fontWeight: 700,
};

const fieldStyle: React.CSSProperties = {
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

const primaryButtonAsButton: React.CSSProperties = {
  border: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(14, 165, 233, 0.18)",
};

const secondaryButtonAsButton: React.CSSProperties = {
  border: "1px solid #dbe5ef",
  background: "#ffffff",
  color: "#123047",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
  cursor: "pointer",
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "10px 14px",
  fontWeight: 800,
};

const smallAction: React.CSSProperties = {
  textDecoration: "none",
  background: "#123047",
  color: "#ffffff",
  borderRadius: 10,
  padding: "8px 10px",
  fontWeight: 700,
  fontSize: 12,
};
