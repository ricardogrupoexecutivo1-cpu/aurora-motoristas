"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/app-layout";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  User,
  FileText,
  PiggyBank,
  Banknote,
  Receipt,
  Loader2,
  ChevronRight,
  Search,
  Eye,
} from "lucide-react";

type Transaction = {
  id: string;
  tipo: "entrada" | "saida";
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  status: "pago" | "pendente" | "agendado";
  entidade: string;
  referencia?: string;
};

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatCurrency(value: number) {
  return moeda.format(value);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "FIN-001",
    tipo: "entrada",
    categoria: "Servico",
    descricao: "Transfer Aeroporto CNF - Hotel",
    valor: 380,
    data: new Date().toISOString(),
    status: "pago",
    entidade: "Locadora Premium",
    referencia: "OS-2024-001",
  },
  {
    id: "FIN-002",
    tipo: "saida",
    categoria: "Pagamento Motorista",
    descricao: "Comissao Joao Santos",
    valor: 220,
    data: new Date().toISOString(),
    status: "pendente",
    entidade: "Joao Santos",
    referencia: "OS-2024-001",
  },
  {
    id: "FIN-003",
    tipo: "entrada",
    categoria: "Servico",
    descricao: "Viagem Corporativa SP",
    valor: 850,
    data: new Date(Date.now() - 86400000).toISOString(),
    status: "pago",
    entidade: "Frota Executiva",
    referencia: "OS-2024-002",
  },
  {
    id: "FIN-004",
    tipo: "saida",
    categoria: "Despesas",
    descricao: "Pedagio + Estacionamento",
    valor: 85,
    data: new Date(Date.now() - 86400000).toISOString(),
    status: "pago",
    entidade: "Operacao",
  },
  {
    id: "FIN-005",
    tipo: "entrada",
    categoria: "Servico",
    descricao: "Busca de Veiculo BMW",
    valor: 420,
    data: new Date(Date.now() - 172800000).toISOString(),
    status: "agendado",
    entidade: "VIP Transport",
    referencia: "OS-2024-003",
  },
];

export default function FinanceiroPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState<"todos" | "entrada" | "saida">("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [periodo, setPeriodo] = useState("mes");

  useEffect(() => {
    setTimeout(() => {
      setTransactions(DEMO_TRANSACTIONS);
      setLoading(false);
    }, 800);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filterTipo !== "todos" && t.tipo !== filterTipo) return false;
      if (filterStatus !== "todos" && t.status !== filterStatus) return false;
      if (search) {
        const termo = search.toLowerCase();
        return (
          t.descricao.toLowerCase().includes(termo) ||
          t.entidade.toLowerCase().includes(termo) ||
          t.referencia?.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [transactions, filterTipo, filterStatus, search]);

  const stats = useMemo(() => {
    const entradas = transactions
      .filter((t) => t.tipo === "entrada")
      .reduce((acc, t) => acc + t.valor, 0);
    const saidas = transactions
      .filter((t) => t.tipo === "saida")
      .reduce((acc, t) => acc + t.valor, 0);
    const saldo = entradas - saidas;
    const pendentes = transactions
      .filter((t) => t.status === "pendente")
      .reduce((acc, t) => acc + t.valor, 0);
    const receber = transactions
      .filter((t) => t.tipo === "entrada" && t.status !== "pago")
      .reduce((acc, t) => acc + t.valor, 0);
    const pagar = transactions
      .filter((t) => t.tipo === "saida" && t.status === "pendente")
      .reduce((acc, t) => acc + t.valor, 0);

    return { entradas, saidas, saldo, pendentes, receber, pagar };
  }, [transactions]);

  function getStatusInfo(status: string) {
    switch (status) {
      case "pago":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          className: "bg-success/10 text-success",
          label: "Pago",
        };
      case "pendente":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          className: "bg-warning/10 text-warning",
          label: "Pendente",
        };
      case "agendado":
        return {
          icon: <Calendar className="w-3.5 h-3.5" />,
          className: "bg-primary/10 text-primary",
          label: "Agendado",
        };
      default:
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          className: "bg-muted text-muted-foreground",
          label: status,
        };
    }
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">Financeiro</h1>
            <p className="text-muted-foreground mt-1">
              Controle completo de receitas, despesas e fluxo de caixa
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="h-10 px-3 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mes</option>
              <option value="ano">Este Ano</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium transition-all">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <span className="flex items-center gap-1 text-sm text-success">
              <ArrowUpRight className="w-4 h-4" />
              +12.5%
            </span>
          </div>
          <p className="text-3xl font-bold text-success">{formatCurrency(stats.entradas)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Entradas</p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-500" />
            </div>
            <span className="flex items-center gap-1 text-sm text-red-500">
              <ArrowDownLeft className="w-4 h-4" />
              -8.3%
            </span>
          </div>
          <p className="text-3xl font-bold text-red-500">{formatCurrency(stats.saidas)}</p>
          <p className="text-sm text-muted-foreground mt-1">Total Saidas</p>
        </div>

        <div className="glass-card p-6 rounded-2xl gradient-premium text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-sm text-white/80">
              <TrendingUp className="w-4 h-4" />
              Saldo
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(stats.saldo)}</p>
          <p className="text-sm text-white/70 mt-1">Saldo Atual</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold">{formatCurrency(stats.receber)}</p>
              <p className="text-xs text-muted-foreground">A Receber</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-lg font-bold">{formatCurrency(stats.pagar)}</p>
              <p className="text-xs text-muted-foreground">A Pagar</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold">{transactions.length}</p>
              <p className="text-xs text-muted-foreground">Transacoes</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-lg font-bold">
                {((stats.saldo / stats.entradas) * 100 || 0).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Margem</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Type Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setFilterTipo("todos")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterTipo === "todos"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterTipo("entrada")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterTipo === "entrada"
                  ? "bg-success/10 text-success"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Entradas
            </button>
            <button
              onClick={() => setFilterTipo("saida")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterTipo === "saida"
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Saidas
            </button>
          </div>

          {/* Search + Status */}
          <div className="flex items-center gap-2 flex-1 lg:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar transacoes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 px-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="todos">Todos Status</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="agendado">Agendado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium">Nenhuma transacao encontrada</p>
            <p className="text-sm text-muted-foreground mt-1">
              As transacoes aparecerao aqui
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTransactions.map((transaction) => {
              const statusInfo = getStatusInfo(transaction.status);
              const isEntrada = transaction.tipo === "entrada";

              return (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isEntrada ? "bg-success/10" : "bg-red-500/10"
                      }`}
                    >
                      {isEntrada ? (
                        <ArrowUpRight className="w-6 h-6 text-success" />
                      ) : (
                        <ArrowDownLeft className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{transaction.descricao}</p>
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {transaction.entidade}
                        </span>
                        <span>{transaction.categoria}</span>
                        {transaction.referencia && (
                          <span className="text-primary">{transaction.referencia}</span>
                        )}
                      </div>
                    </div>

                    {/* Value + Date */}
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          isEntrada ? "text-success" : "text-red-500"
                        }`}
                      >
                        {isEntrada ? "+" : "-"}
                        {formatCurrency(transaction.valor)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.data)}
                      </p>
                    </div>

                    {/* Actions */}
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando {filteredTransactions.length} transacoes</span>
        <span>
          Total filtrado:{" "}
          {formatCurrency(
            filteredTransactions.reduce(
              (acc, t) => acc + (t.tipo === "entrada" ? t.valor : -t.valor),
              0
            )
          )}
        </span>
      </div>
    </AppLayout>
  );
}
