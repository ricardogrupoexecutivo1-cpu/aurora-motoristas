"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/app-layout";
import {
  Play,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Car,
  User,
  Building2,
  DollarSign,
  Navigation,
  Phone,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Filter,
  Loader2,
  Calendar,
  TrendingUp,
  Zap,
  Timer,
  ArrowRight,
} from "lucide-react";

type FlowStage =
  | "Cotacao"
  | "Em andamento"
  | "Aguardando pagamento"
  | "Pago"
  | "Historico"
  | "Agendado"
  | "Em deslocamento"
  | "Aguardando passageiro"
  | "Concluido"
  | "Reagendado";

type FlowItem = {
  id: string;
  empresa: string;
  cliente: string;
  motorista: string;
  servico: string;
  data: string;
  valorTotal: number;
  valorMotorista: number;
  despesas: number;
  etapa: FlowStage;
  observacao: string;
  origemBase: string;
  origem?: string;
  destino?: string;
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

const DEMO_OPERATIONS: FlowItem[] = [
  {
    id: "OP-001",
    empresa: "Locadora Premium",
    cliente: "Carlos Silva",
    motorista: "Joao Santos",
    servico: "Transfer Aeroporto",
    data: new Date().toISOString(),
    valorTotal: 280,
    valorMotorista: 180,
    despesas: 30,
    etapa: "Em andamento",
    observacao: "Cliente VIP",
    origemBase: "Servico local",
    origem: "Aeroporto Confins",
    destino: "Hotel Fasano",
  },
  {
    id: "OP-002",
    empresa: "Frota Executiva",
    cliente: "Maria Oliveira",
    motorista: "Pedro Costa",
    servico: "Viagem Corporativa",
    data: new Date().toISOString(),
    valorTotal: 450,
    valorMotorista: 280,
    despesas: 50,
    etapa: "Agendado",
    observacao: "Reuniao importante",
    origemBase: "Transfer padrao",
    origem: "Centro Empresarial",
    destino: "Sao Paulo",
  },
  {
    id: "OP-003",
    empresa: "VIP Transport",
    cliente: "Roberto Almeida",
    motorista: "Lucas Ferreira",
    servico: "Busca de Veiculo",
    data: new Date().toISOString(),
    valorTotal: 350,
    valorMotorista: 220,
    despesas: 40,
    etapa: "Aguardando passageiro",
    observacao: "",
    origemBase: "Servico padrao",
    origem: "Concessionaria BMW",
    destino: "Residencia Cliente",
  },
];

function getStageInfo(stage: FlowStage) {
  switch (stage) {
    case "Em andamento":
    case "Em deslocamento":
      return {
        icon: <Play className="w-4 h-4" />,
        className: "bg-primary/10 text-primary border-primary/20",
        priority: 1,
      };
    case "Aguardando passageiro":
      return {
        icon: <Timer className="w-4 h-4" />,
        className: "bg-warning/10 text-warning border-warning/20",
        priority: 2,
      };
    case "Agendado":
      return {
        icon: <Clock className="w-4 h-4" />,
        className: "bg-accent/10 text-accent border-accent/20",
        priority: 3,
      };
    case "Concluido":
    case "Pago":
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        className: "bg-success/10 text-success border-success/20",
        priority: 4,
      };
    case "Aguardando pagamento":
      return {
        icon: <DollarSign className="w-4 h-4" />,
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        priority: 5,
      };
    default:
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        className: "bg-muted text-muted-foreground border-border",
        priority: 10,
      };
  }
}

export default function OperacaoPage() {
  const [operations, setOperations] = useState<FlowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<string>("todos");

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setOperations(DEMO_OPERATIONS);
      setLoading(false);
    }, 800);
  }, []);

  const filteredOperations = useMemo(() => {
    if (filterStage === "todos") return operations;
    return operations.filter((op) => op.etapa === filterStage);
  }, [operations, filterStage]);

  const stats = useMemo(() => {
    const emAndamento = operations.filter(
      (op) => op.etapa === "Em andamento" || op.etapa === "Em deslocamento"
    ).length;
    const aguardando = operations.filter(
      (op) => op.etapa === "Aguardando passageiro"
    ).length;
    const agendados = operations.filter((op) => op.etapa === "Agendado").length;
    const total = operations.reduce((acc, op) => acc + op.valorTotal, 0);

    return { emAndamento, aguardando, agendados, total };
  }, [operations]);

  const stages: FlowStage[] = [
    "Em andamento",
    "Aguardando passageiro",
    "Agendado",
    "Aguardando pagamento",
    "Concluido",
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
              Central de Operacoes
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe em tempo real todas as operacoes ativas
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 500);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
            <Link
              href="/servicos/novo"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-premium text-white text-sm font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Nova Operacao</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-primary">{stats.emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-warning">{stats.aguardando}</p>
              <p className="text-sm text-muted-foreground">Aguardando</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Timer className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-accent">{stats.agendados}</p>
              <p className="text-sm text-muted-foreground">Agendados</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-success">{formatCurrency(stats.total)}</p>
              <p className="text-sm text-muted-foreground">Total Operacoes</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStage("todos")}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            filterStage === "todos"
              ? "gradient-premium text-white shadow-lg"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Todos ({operations.length})
        </button>
        {stages.map((stage) => {
          const count = operations.filter((op) => op.etapa === stage).length;
          const info = getStageInfo(stage);
          return (
            <button
              key={stage}
              onClick={() => setFilterStage(stage)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filterStage === stage
                  ? `${info.className} border`
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {info.icon}
              {stage} ({count})
            </button>
          );
        })}
      </div>

      {/* Operations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card rounded-2xl p-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredOperations.length === 0 ? (
          <div className="glass-card rounded-2xl p-20 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Navigation className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Nenhuma operacao encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              As operacoes aparecerao aqui quando iniciadas
            </p>
          </div>
        ) : (
          filteredOperations.map((operation) => {
            const stageInfo = getStageInfo(operation.etapa);

            return (
              <div
                key={operation.id}
                className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-bold">
                        {operation.id}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-sm font-medium ${stageInfo.className}`}
                      >
                        {stageInfo.icon}
                        {operation.etapa}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(operation.data)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{operation.servico}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{operation.empresa}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{operation.cliente}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-muted-foreground" />
                        <span>{operation.motorista}</span>
                      </div>
                    </div>

                    {(operation.origem || operation.destino) && (
                      <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-muted/50">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{operation.origem}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{operation.destino}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatCurrency(operation.valorTotal)}</p>
                      <p className="text-xs text-muted-foreground">
                        Motorista: {formatCurrency(operation.valorMotorista)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <a
                        href={`https://wa.me/5531997490074?text=Operacao ${operation.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </a>
                      <button className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {operation.observacao && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Obs:</span> {operation.observacao}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
