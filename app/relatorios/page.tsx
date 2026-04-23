"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Download,
  RefreshCw,
  Search,
  Filter,
  FileSpreadsheet,
  Navigation,
  Home,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronRight,
  Eye,
} from "lucide-react";

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

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function formatCurrency(value?: number | null) {
  return moeda.format(Number(value || 0));
}

function formatPercent(value?: number | null) {
  const numero = Number(value || 0);
  return `${numero.toFixed(2).replace(".", ",")}%`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

function normalize(value?: string | null) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getDisplayOS(service: ServiceRow) {
  return service.os_sistema || service.os || service.os_cliente || "Sem OS";
}

function getDisplayEmpresa(service: ServiceRow) {
  return service.empresa || service.contratante || service.empresa_operadora || "-";
}

function getDisplayCliente(service: ServiceRow) {
  return service.cliente || service.cliente_final || "-";
}

function getDisplayStatus(service: ServiceRow) {
  if (normalize(service.status) === "aguardando_pagamento") return "Aguardando";
  if (normalize(service.status) === "pendente") return "Pendente";
  if (normalize(service.status) === "pago" || service.pago === true) return "Pago";
  return service.status || "-";
}

function getValorCobrado(service: ServiceRow) {
  return Number(service.valor_cobranca ?? service.valor_total ?? 0);
}

function getValorGastoTotal(service: ServiceRow) {
  const motorista = Number(service.fechamento_motorista ?? service.valor_motorista ?? 0);
  const despesas = Number(service.despesas_motorista ?? service.despesas ?? service.reembolso ?? 0);
  const adiantamento = Number(service.adiantamento_motorista ?? 0);
  return motorista + despesas + adiantamento;
}

function getLucroValor(service: ServiceRow) {
  const cobrado = getValorCobrado(service);
  const gasto = getValorGastoTotal(service);
  const margemSalva = Number(service.margem_operacao ?? service.margem_bruta ?? NaN);
  if (!Number.isNaN(margemSalva) && margemSalva !== 0) return margemSalva;
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
  const candidatos = [service.empresa, service.contratante, service.empresa_operadora].map((item) => normalize(item)).filter(Boolean);
  return candidatos.some((item) => item.includes(empresaNorm));
}

function downloadCsv(filename: string, rows: string[][]) {
  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
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
  const [empresaLogada, setEmpresaLogada] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [statusFiscalFilter, setStatusFiscalFilter] = useState("todos");

  async function carregar() {
    try {
      setLoading(true);
      const response = await fetch("/api/services", { method: "GET", cache: "no-store" });
      const data: ApiResponse = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.message || "Falha ao carregar.");
      const rows = Array.isArray(data.services) ? data.services : [];
      rows.sort((a, b) => {
        const dateA = new Date(a.data_servico || a.updated_at || 0).getTime();
        const dateB = new Date(b.data_servico || b.updated_at || 0).getTime();
        return dateB - dateA;
      });
      setServices(rows);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  useEffect(() => {
    try {
      const empresaSessao = localStorage.getItem("aurora_session_empresa") || localStorage.getItem("empresa") || "";
      setEmpresaLogada(String(empresaSessao || "").trim());
    } catch { setEmpresaLogada(""); }
  }, []);

  const baseEmpresa = useMemo(() => services.filter((service) => serviceBelongsToEmpresa(service, empresaLogada)), [services, empresaLogada]);

  const filtrados = useMemo(() => {
    const termo = normalize(search);
    return baseEmpresa.filter((service) => {
      const status = normalize(getDisplayStatus(service));
      const statusFiscal = normalize(getStatusFiscal(service));
      const passaStatus = statusFilter === "todos" ? true : statusFilter === "pago" ? status === "pago" : statusFilter === "pendente" ? status === "pendente" : statusFilter === "aguardando_pagamento" ? status === "aguardando" : true;
      const passaFiscal = statusFiscalFilter === "todos" ? true : statusFiscal === normalize(statusFiscalFilter);
      if (!passaStatus || !passaFiscal) return false;
      if (!termo) return true;
      const searchable = [getDisplayOS(service), getDisplayEmpresa(service), getDisplayCliente(service), service.motorista, service.servico, service.origem, service.destino, service.placa_veiculo, getNotaNumero(service), getDisplayStatus(service), getStatusFiscal(service)].filter(Boolean).join(" ");
      return normalize(searchable).includes(termo);
    });
  }, [baseEmpresa, search, statusFilter, statusFiscalFilter]);

  const resumo = useMemo(() => {
    const valorCobrado = filtrados.reduce((acc, item) => acc + getValorCobrado(item), 0);
    const valorGasto = filtrados.reduce((acc, item) => acc + getValorGastoTotal(item), 0);
    const lucroValor = filtrados.reduce((acc, item) => acc + getLucroValor(item), 0);
    const lucroPercentual = valorCobrado ? (lucroValor / valorCobrado) * 100 : 0;
    const totalNotasRecebidas = filtrados.filter((item) => getStatusFiscal(item) === "Recebida").length;
    const totalSemNota = filtrados.filter((item) => getStatusFiscal(item) === "Sem nota").length;
    return { quantidade: filtrados.length, valorCobrado, valorGasto, lucroValor, lucroPercentual, totalNotasRecebidas, totalSemNota };
  }, [filtrados]);

  function exportarCsv() {
    const rows: string[][] = [
      ["Data", "OS", "Empresa", "Cliente", "Motorista", "Servico", "Origem", "Destino", "Placa", "Status", "Valor Cobrado", "Valor Gasto", "Lucro", "Lucro %", "Nota", "Valor Nota", "Vencimento", "Status Fiscal"],
      ...filtrados.map((item) => [
        formatDate(item.data_servico), getDisplayOS(item), getDisplayEmpresa(item), getDisplayCliente(item), item.motorista || "-", item.servico || "-", item.origem || "", item.destino || "", item.placa_veiculo || "", getDisplayStatus(item),
        String(getValorCobrado(item).toFixed(2)).replace(".", ","), String(getValorGastoTotal(item).toFixed(2)).replace(".", ","), String(getLucroValor(item).toFixed(2)).replace(".", ","), String(getLucroPercentual(item).toFixed(2)).replace(".", ","),
        getNotaNumero(item), String(getNotaValor(item).toFixed(2)).replace(".", ","), formatDate(getNotaVencimento(item)), getStatusFiscal(item),
      ]),
    ];
    const hoje = new Date().toISOString().slice(0, 10);
    downloadCsv(`relatorio-servicos-${hoje}.csv`, rows);
  }

  const stats = [
    { label: "Total Servicos", valor: resumo.quantidade, icon: FileText, cor: "from-blue-500 to-cyan-500" },
    { label: "Valor Cobrado", valor: formatCurrency(resumo.valorCobrado), icon: DollarSign, cor: "from-emerald-500 to-green-500" },
    { label: "Valor Gasto", valor: formatCurrency(resumo.valorGasto), icon: TrendingDown, cor: "from-orange-500 to-amber-500" },
    { label: "Lucro Total", valor: formatCurrency(resumo.lucroValor), icon: TrendingUp, cor: "from-purple-500 to-pink-500", destaque: true },
    { label: "Margem %", valor: formatPercent(resumo.lucroPercentual), icon: BarChart3, cor: "from-indigo-500 to-violet-500" },
    { label: "Notas Recebidas", valor: resumo.totalNotasRecebidas, icon: CheckCircle, cor: "from-teal-500 to-cyan-500" },
    { label: "Sem Nota", valor: resumo.totalSemNota, icon: AlertCircle, cor: "from-rose-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl gradient-text">MOVO</span>
                <p className="text-[9px] text-muted-foreground tracking-widest -mt-1">BUSINESS</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/plataforma" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Plataforma</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Relatorios</h1>
            <p className="text-muted-foreground">Analise operacional e financeira completa</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={carregar} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">Atualizar</span>
            </button>
            <button onClick={exportarCsv} className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-premium text-white font-medium hover:opacity-90 transition-opacity">
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`card-premium p-4 ${stat.destaque ? "ring-2 ring-primary/50" : ""}`}>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.cor} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className={`text-xl font-bold ${stat.destaque ? "gradient-text" : ""}`}>{stat.valor}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card-premium p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar OS, empresa, cliente, motorista, placa..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-colors"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none min-w-[180px]">
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendentes</option>
              <option value="aguardando_pagamento">Aguardando</option>
              <option value="pago">Pagos</option>
            </select>
            <select value={statusFiscalFilter} onChange={(e) => setStatusFiscalFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none min-w-[180px]">
              <option value="todos">Todos Fiscais</option>
              <option value="Sem nota">Sem Nota</option>
              <option value="Pendente">Pendente</option>
              <option value="A vencer">A Vencer</option>
              <option value="Vencida">Vencida</option>
              <option value="Recebida">Recebida</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Data</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">OS</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Empresa</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Cliente</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Motorista</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Cobrado</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Gasto</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Lucro</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">%</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Fiscal</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
                      <p className="text-muted-foreground">Carregando dados...</p>
                    </td>
                  </tr>
                ) : filtrados.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-16 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Nenhum registro encontrado</p>
                    </td>
                  </tr>
                ) : (
                  filtrados.slice(0, 50).map((item, index) => {
                    const lucro = getLucroValor(item);
                    const lucroPercent = getLucroPercentual(item);
                    const status = getDisplayStatus(item);
                    const statusFiscal = getStatusFiscal(item);
                    return (
                      <tr key={item.id || index} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                        <td className="py-4 px-4 text-sm">{formatDate(item.data_servico)}</td>
                        <td className="py-4 px-4 text-sm font-mono font-medium">{getDisplayOS(item)}</td>
                        <td className="py-4 px-4 text-sm max-w-[150px] truncate">{getDisplayEmpresa(item)}</td>
                        <td className="py-4 px-4 text-sm max-w-[150px] truncate">{getDisplayCliente(item)}</td>
                        <td className="py-4 px-4 text-sm max-w-[120px] truncate">{item.motorista || "-"}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            status === "Pago" ? "bg-success/10 text-success" :
                            status === "Pendente" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>{status}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-right font-medium">{formatCurrency(getValorCobrado(item))}</td>
                        <td className="py-4 px-4 text-sm text-right text-muted-foreground">{formatCurrency(getValorGastoTotal(item))}</td>
                        <td className={`py-4 px-4 text-sm text-right font-bold ${lucro >= 0 ? "text-success" : "text-destructive"}`}>{formatCurrency(lucro)}</td>
                        <td className={`py-4 px-4 text-sm text-right ${lucroPercent >= 0 ? "text-success" : "text-destructive"}`}>{formatPercent(lucroPercent)}</td>
                        <td className="py-4 px-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            statusFiscal === "Recebida" ? "bg-success/10 text-success" :
                            statusFiscal === "Vencida" ? "bg-destructive/10 text-destructive" :
                            statusFiscal === "A vencer" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          }`}>{statusFiscal}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filtrados.length > 50 && (
            <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
              Mostrando 50 de {filtrados.length} registros. Exporte o CSV para ver todos.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
