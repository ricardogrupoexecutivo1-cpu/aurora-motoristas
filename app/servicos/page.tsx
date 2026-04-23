"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Car,
  MapPin,
  Calendar,
  Building2,
  User,
  Phone,
  MessageCircle,
  FileText,
  RefreshCw,
  Download,
  ChevronDown,
  X,
  ArrowUpDown,
  TrendingUp,
  Loader2,
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
    "Nao informado"
  );
}

function getDisplayCliente(service: ServiceRow) {
  return service.cliente || service.cliente_final || "Nao informado";
}

function getDisplayOS(service: ServiceRow) {
  return service.os_sistema || service.os || service.os_cliente || "Sem OS";
}

function getStatusInfo(service: ServiceRow) {
  if (isPago(service)) {
    return {
      label: "Pago",
      icon: <CheckCircle className="w-4 h-4" />,
      className: "bg-success/10 text-success border-success/20",
    };
  }

  const status = normalize(service.status);

  if (status === "aguardando_pagamento") {
    return {
      label: "Aguardando",
      icon: <Clock className="w-4 h-4" />,
      className: "bg-warning/10 text-warning border-warning/20",
    };
  }

  if (status === "pendente") {
    return {
      label: "Pendente",
      icon: <AlertCircle className="w-4 h-4" />,
      className: "bg-primary/10 text-primary border-primary/20",
    };
  }

  return {
    label: service.status || "Sem status",
    icon: <FileText className="w-4 h-4" />,
    className: "bg-muted text-muted-foreground border-border",
  };
}

function sanitizeWhatsappNumber(value?: string | null) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  if (digits.length >= 10) return `55${digits}`;
  return digits;
}

function buildWhatsappLink(service: ServiceRow) {
  const phone = sanitizeWhatsappNumber(service.telefone_cliente_final);
  if (!phone) return null;
  const nome = getDisplayCliente(service);
  const os = getDisplayOS(service);
  const rota =
    service.origem && service.destino
      ? `${service.origem} x ${service.destino}`
      : service.servico || "servico";
  const mensagem = `Ola, tudo bem? Estou falando sobre o servico ${os} (${rota}) para ${nome}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`;
}

export default function ServicosPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [aba, setAba] = useState<"ativos" | "historico">("ativos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRow | null>(null);

  async function carregarServicos() {
    try {
      setLoading(true);
      const response = await fetch("/api/services", {
        method: "GET",
        cache: "no-store",
      });
      const data: ApiResponse = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Falha ao carregar servicos.");
      }
      const rows = Array.isArray(data.services) ? data.services : [];
      rows.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
        const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
        return dateB - dateA;
      });
      setServices(rows);
    } catch (error) {
      console.error("Erro ao carregar servicos:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(
    service: ServiceRow,
    novoStatus: "pendente" | "aguardando_pagamento" | "pago"
  ) {
    try {
      setUpdatingId(service.id);
      const response = await fetch(`/api/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: novoStatus,
          pago: novoStatus === "pago",
          pago_em: novoStatus === "pago" ? new Date().toISOString() : null,
          visivel_motorista: novoStatus !== "pago",
        }),
      });
      if (response.ok) {
        await carregarServicos();
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  useEffect(() => {
    carregarServicos();
  }, []);

  const servicosFiltrados = useMemo(() => {
    let filtered = services;

    // Filtrar por aba
    if (aba === "ativos") {
      filtered = filtered.filter(isServicoAtivo);
    } else {
      filtered = filtered.filter(isHistoricoProtegido);
    }

    // Filtrar por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter(
        (s) => normalize(s.status) === statusFilter || (statusFilter === "pago" && isPago(s))
      );
    }

    // Filtrar por busca
    if (search) {
      const termo = normalize(search);
      filtered = filtered.filter((s) => {
        const campos = [
          s.os_sistema,
          s.os_cliente,
          s.empresa,
          s.cliente,
          s.motorista,
          s.origem,
          s.destino,
          s.placa_veiculo,
        ];
        return campos.some((c) => normalize(c).includes(termo));
      });
    }

    return filtered;
  }, [services, aba, statusFilter, search]);

  // Stats
  const stats = useMemo(() => {
    const ativos = services.filter(isServicoAtivo);
    const pagos = services.filter(isPago);
    const pendentes = ativos.filter((s) => normalize(s.status) === "pendente");
    const aguardando = ativos.filter((s) => normalize(s.status) === "aguardando_pagamento");
    const totalValor = ativos.reduce((acc, s) => acc + (s.valor_total || 0), 0);
    const totalPago = pagos.reduce((acc, s) => acc + (s.valor_total || 0), 0);

    return {
      total: services.length,
      ativos: ativos.length,
      pagos: pagos.length,
      pendentes: pendentes.length,
      aguardando: aguardando.length,
      totalValor,
      totalPago,
    };
  }, [services]);

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Servicos</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os servicos da plataforma</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => carregarServicos()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <Link
              href="/servicos/novo"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-premium text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Servico</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.ativos}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.aguardando}</p>
              <p className="text-xs text-muted-foreground">Aguardando</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pagos}</p>
              <p className="text-xs text-muted-foreground">Pagos</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold">{formatCurrency(stats.totalValor)}</p>
              <p className="text-xs text-muted-foreground">Total Ativos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setAba("ativos")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === "ativos"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ativos ({stats.ativos})
            </button>
            <button
              onClick={() => setAba("historico")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                aba === "historico"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Historico ({stats.pagos})
            </button>
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-2 flex-1 lg:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por OS, cliente, motorista..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aguardando_pagamento">Aguardando</option>
              <option value="pago">Pago</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : servicosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Nenhum servico encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? "Tente uma busca diferente" : "Crie seu primeiro servico"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {servicosFiltrados.map((service) => {
              const statusInfo = getStatusInfo(service);
              const whatsappLink = buildWhatsappLink(service);

              return (
                <div
                  key={service.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          {getDisplayOS(service)}
                        </span>
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${statusInfo.className}`}>
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(service.data_servico)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{getDisplayEmpresa(service)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="truncate max-w-[150px]">{getDisplayCliente(service)}</span>
                        </div>
                        {service.motorista && (
                          <div className="flex items-center gap-1.5">
                            <Car className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate max-w-[150px]">{service.motorista}</span>
                          </div>
                        )}
                      </div>

                      {(service.origem || service.destino) && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{service.origem || "?"}</span>
                          <span>→</span>
                          <span>{service.destino || "?"}</span>
                          {service.km && (
                            <span className="text-primary font-medium">({service.km} km)</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(service.valor_total)}</p>
                        {service.valor_motorista && (
                          <p className="text-xs text-muted-foreground">
                            Motorista: {formatCurrency(service.valor_motorista)}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {whatsappLink && (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          href={`/servicos/${service.id}`}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {!isPago(service) && (
                          <div className="relative group">
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-card rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={() => atualizarStatus(service, "aguardando_pagamento")}
                                disabled={updatingId === service.id}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4 text-warning" />
                                Aguardando Pagamento
                              </button>
                              <button
                                onClick={() => atualizarStatus(service, "pago")}
                                disabled={updatingId === service.id}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4 text-success" />
                                Marcar como Pago
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando {servicosFiltrados.length} de {services.length} servicos</span>
        <span>Total em tela: {formatCurrency(servicosFiltrados.reduce((acc, s) => acc + (s.valor_total || 0), 0))}</span>
      </div>
    </AppLayout>
  );
}
