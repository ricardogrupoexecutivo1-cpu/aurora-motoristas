"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/app-layout";
import PageHeader from "@/components/ui/page-header";
import StatsCard from "@/components/ui/stats-card";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Calendar,
  ExternalLink,
} from "lucide-react";

type Motorista = {
  id: string;
  nome: string;
  cpf: string;
  cnh?: string | null;
  telefone?: string | null;
  email?: string | null;
  cep?: string | null;
  endereco?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  observacoes?: string | null;
  foto_url?: string | null;
  ativo?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  motoristas?: Motorista[];
  total?: number;
};

type FiltroStatus = "todos" | "pendentes" | "ativos" | "inativos";

function formatarCPF(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (!digits) return "---";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
}

function formatarTelefone(valor?: string | null) {
  const digits = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (!digits) return "---";
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function formatarData(valor?: string | null) {
  if (!valor) return "---";
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "---";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(data);
}

function inferirOrigemPublica(observacoes?: string | null) {
  return String(observacoes || "").toLowerCase().includes("cadastro_motorista_publico");
}

function obterStatusMotorista(motorista: Motorista) {
  if (motorista.ativo === true) {
    return { chave: "ativos" as const, rotulo: "Ativo", cor: "text-success", fundo: "bg-success/20" };
  }
  if (motorista.ativo === false && inferirOrigemPublica(motorista.observacoes)) {
    return { chave: "pendentes" as const, rotulo: "Pendente", cor: "text-warning", fundo: "bg-warning/20" };
  }
  return { chave: "inativos" as const, rotulo: "Inativo", cor: "text-muted-foreground", fundo: "bg-white/10" };
}

export default function MotoristasPage() {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");

  useEffect(() => {
    async function carregarMotoristas() {
      try {
        setCarregando(true);
        setErro("");
        const response = await fetch("/api/motoristas", { method: "GET", cache: "no-store" });
        const rawText = await response.text();
        let data: ApiResponse | null = null;
        try {
          data = rawText ? (JSON.parse(rawText) as ApiResponse) : null;
        } catch {
          data = null;
        }
        if (!response.ok) {
          setErro(data?.error || data?.message || rawText || `Falha ao carregar. HTTP ${response.status}`);
          return;
        }
        setMotoristas(Array.isArray(data?.motoristas) ? data.motoristas : []);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar motoristas.");
      } finally {
        setCarregando(false);
      }
    }
    carregarMotoristas();
  }, []);

  const totais = useMemo(() => {
    let ativos = 0, pendentes = 0, inativos = 0;
    for (const motorista of motoristas) {
      const status = obterStatusMotorista(motorista);
      if (status.chave === "ativos") ativos += 1;
      if (status.chave === "pendentes") pendentes += 1;
      if (status.chave === "inativos") inativos += 1;
    }
    return { total: motoristas.length, ativos, pendentes, inativos };
  }, [motoristas]);

  const motoristasFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return motoristas.filter((motorista) => {
      const status = obterStatusMotorista(motorista);
      if (filtroStatus !== "todos" && status.chave !== filtroStatus) return false;
      if (!termo) return true;
      const base = [motorista.nome, motorista.cpf, motorista.telefone, motorista.email, motorista.cidade, motorista.estado]
        .filter(Boolean).join(" ").toLowerCase();
      return base.includes(termo);
    });
  }, [busca, filtroStatus, motoristas]);

  const stats = [
    { title: "Total", value: carregando ? "..." : totais.total, icon: Users, iconColor: "text-primary", description: "Todos os motoristas" },
    { title: "Ativos", value: carregando ? "..." : totais.ativos, icon: UserCheck, iconColor: "text-success", description: "Operando na plataforma" },
    { title: "Pendentes", value: carregando ? "..." : totais.pendentes, icon: Clock, iconColor: "text-warning", description: "Aguardando analise" },
    { title: "Inativos", value: carregando ? "..." : totais.inativos, icon: UserX, iconColor: "text-muted-foreground", description: "Cadastros inativos" },
  ];

  const filterButtons = [
    { key: "todos", label: "Todos", count: totais.total },
    { key: "ativos", label: "Ativos", count: totais.ativos },
    { key: "pendentes", label: "Pendentes", count: totais.pendentes },
    { key: "inativos", label: "Inativos", count: totais.inativos },
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Motoristas"
        description="Gerencie todos os motoristas cadastrados na plataforma"
        icon={Users}
        breadcrumbs={[
          { label: "Dashboard", href: "/plataforma" },
          { label: "Motoristas" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Link
              href="/quero-ser-motorista"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-primary/50 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Link Publico
            </Link>
            <Link
              href="/motoristas/cadastrar"
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-premium text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Novo Motorista
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF, telefone..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm transition-all">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 text-sm transition-all">
                <Download className="w-4 h-4" />
                Exportar
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {filterButtons.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFiltroStatus(btn.key as FiltroStatus)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filtroStatus === btn.key
                    ? "gradient-premium text-white shadow-lg"
                    : "bg-white/5 border border-white/10 hover:border-primary/50"
                }`}
              >
                {btn.label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  filtroStatus === btn.key ? "bg-white/20" : "bg-white/10"
                }`}>
                  {btn.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {erro && (
          <div className="p-4 m-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5" />
            {erro}
          </div>
        )}

        {/* Loading */}
        {carregando ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando motoristas...</p>
          </div>
        ) : motoristasFiltrados.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/10" />
            <p className="text-muted-foreground">
              {busca.trim() ? "Nenhum motorista encontrado para essa busca." : "Nenhum motorista cadastrado ainda."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {motoristasFiltrados.map((motorista) => {
              const status = obterStatusMotorista(motorista);
              const origemPublica = inferirOrigemPublica(motorista.observacoes);
              const endereco = [motorista.cidade, motorista.estado].filter(Boolean).join(", ");

              return (
                <Link
                  key={motorista.id}
                  href={`/motoristas/${motorista.id}`}
                  className="block p-6 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {(motorista.nome || "M").charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                              {motorista.nome || "Sem nome"}
                            </h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.fundo} ${status.cor}`}>
                              {status.rotulo}
                            </span>
                            {origemPublica && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                                Cadastro Publico
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            CPF: {formatarCPF(motorista.cpf)}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatarTelefone(motorista.telefone)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">{motorista.email || "---"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{endereco || "---"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{formatarData(motorista.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!carregando && motoristasFiltrados.length > 0 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Mostrando {motoristasFiltrados.length} de {totais.total} motoristas
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
