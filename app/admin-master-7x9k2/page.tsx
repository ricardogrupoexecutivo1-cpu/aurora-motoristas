"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  Shield,
  Users,
  Car,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  Home,
  Settings,
  Bell,
  BarChart3,
  Wallet,
  FileText,
  UserCheck,
  UserX,
  ChevronRight,
  Star,
  Activity,
  Zap,
  Lock,
  Unlock,
  Ban,
  ChevronDown,
  Calendar,
  CreditCard,
  Building2,
  Bot,
  MessageSquare,
  Phone,
  Mail,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const ADMIN_PASSWORD = "aurora2024master";

type TabType = "dashboard" | "motoristas" | "clientes" | "corridas" | "servicos" | "financeiro" | "configuracoes";

export default function AdminMasterPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Dashboard data
  const [stats, setStats] = useState({
    totalMotoristas: 0,
    motoristasAtivos: 0,
    motoristasInativos: 0,
    totalClientes: 0,
    clientesAtivos: 0,
    totalCorridas: 0,
    corridasHoje: 0,
    corridasAndamento: 0,
    totalServicos: 0,
    servicosPendentes: 0,
    receitaTotal: 0,
    receitaMes: 0,
    taxaPlataforma: 0,
    notaMedia: 4.8,
  });

  const [motoristas, setMotoristas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [corridas, setCorridas] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      localStorage.setItem("admin_auth", "true");
    } else {
      setPasswordError("Senha incorreta. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar motoristas
      const { data: motoristasData } = await supabase
        .from("am_motoristas")
        .select("*")
        .order("created_at", { ascending: false });

      if (motoristasData) {
        setMotoristas(motoristasData);
        setStats((prev) => ({
          ...prev,
          totalMotoristas: motoristasData.length,
          motoristasAtivos: motoristasData.filter((m) => m.ativo && !m.bloqueado).length,
          motoristasInativos: motoristasData.filter((m) => !m.ativo || m.bloqueado).length,
        }));
      }

      // Carregar clientes
      const { data: clientesData } = await supabase
        .from("am_clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (clientesData) {
        setClientes(clientesData);
        setStats((prev) => ({
          ...prev,
          totalClientes: clientesData.length,
          clientesAtivos: clientesData.filter((c) => c.ativo).length,
        }));
      }

      // Carregar serviÃ§os
      const { data: servicosData } = await supabase
        .from("am_services")
        .select("*, am_motoristas(nome), am_clients(nome)")
        .order("created_at", { ascending: false })
        .limit(100);

      if (servicosData) {
        setServicos(servicosData);
        const receitaTotal = servicosData.reduce((acc, s) => acc + (s.valor_cliente || 0), 0);
        setStats((prev) => ({
          ...prev,
          totalServicos: servicosData.length,
          servicosPendentes: servicosData.filter((s) => s.status === "pendente").length,
          receitaTotal,
          receitaMes: receitaTotal * 0.3, // SimulaÃ§Ã£o
          taxaPlataforma: receitaTotal * 0.05,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMotoristaStatus = async (id: string, bloqueado: boolean) => {
    try {
      await supabase.from("am_motoristas").update({ bloqueado: !bloqueado }).eq("id", id);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar motorista:", error);
    }
  };

  const toggleClienteStatus = async (id: string, ativo: boolean) => {
    try {
      await supabase.from("am_clients").update({ ativo: !ativo }).eq("id", id);
      loadData();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Admin Master</h1>
              <p className="text-muted-foreground">Acesso restrito ao administrador</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Senha de acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Digite a senha master"
                  className="w-full px-4 py-3 bg-secondary rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground"
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-destructive">{passwordError}</p>
                )}
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                Acessar painel
              </button>

              <Link
                href="/"
                className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Voltar para o inÃ­cio
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const filteredMotoristas = motoristas.filter(
    (m) =>
      m.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cpf?.includes(searchTerm)
  );

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documento?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">Admin Master</h1>
              <p className="text-xs text-muted-foreground">Controle total</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "motoristas", label: "Motoristas", icon: Car },
            { id: "clientes", label: "Clientes", icon: Users },
            { id: "corridas", label: "Corridas", icon: MapPin },
            { id: "servicos", label: "ServiÃ§os", icon: FileText },
            { id: "financeiro", label: "Financeiro", icon: DollarSign },
            { id: "configuracoes", label: "ConfiguraÃ§Ãµes", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para o site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground capitalize">{activeTab}</h2>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-secondary rounded-xl border border-border focus:border-primary outline-none w-64 text-sm"
                />
              </div>

              <button
                onClick={loadData}
                className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Motoristas"
                  value={stats.totalMotoristas}
                  subtitle={`${stats.motoristasAtivos} ativos`}
                  icon={Car}
                  trend={12}
                  color="primary"
                />
                <StatCard
                  title="Total Clientes"
                  value={stats.totalClientes}
                  subtitle={`${stats.clientesAtivos} ativos`}
                  icon={Users}
                  trend={8}
                  color="success"
                />
                <StatCard
                  title="Total ServiÃ§os"
                  value={stats.totalServicos}
                  subtitle={`${stats.servicosPendentes} pendentes`}
                  icon={FileText}
                  trend={-3}
                  color="warning"
                />
                <StatCard
                  title="Receita Total"
                  value={formatCurrency(stats.receitaTotal)}
                  subtitle={`Taxa: ${formatCurrency(stats.taxaPlataforma)}`}
                  icon={DollarSign}
                  trend={15}
                  color="success"
                />
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">VisÃ£o geral</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium">Receita do mÃªs</p>
                          <p className="text-sm text-muted-foreground">Abril 2024</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-success">{formatCurrency(stats.receitaMes)}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Taxa plataforma (5%)</p>
                          <p className="text-sm text-muted-foreground">Acumulado</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-primary">{formatCurrency(stats.taxaPlataforma)}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium">Nota mÃ©dia</p>
                          <p className="text-sm text-muted-foreground">Plataforma</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-warning">{stats.notaMedia}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Atividade recente</h3>
                  <div className="space-y-3">
                    {servicos.slice(0, 5).map((servico, i) => (
                      <div key={servico.id || i} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(servico.status) }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{servico.contratante}</p>
                          <p className="text-xs text-muted-foreground">
                            {servico.am_motoristas?.nome || "Sem motorista"}
                          </p>
                        </div>
                        <span
                          className="px-2 py-1 rounded-lg text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(servico.status)}20`,
                            color: getStatusColor(servico.status),
                          }}
                        >
                          {getStatusLabel(servico.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/motoristas/cadastrar"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <UserCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Novo motorista</p>
                      <p className="text-xs text-muted-foreground">Cadastrar</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/cadastros/clientes"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <Users className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Novo cliente</p>
                      <p className="text-xs text-muted-foreground">Cadastrar</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/servicos/novo"
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                      <FileText className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">Novo serviÃ§o</p>
                      <p className="text-xs text-muted-foreground">Cadastrar</p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => {}}
                  className="p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                      <Download className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <p className="font-medium">Exportar dados</p>
                      <p className="text-xs text-muted-foreground">RelatÃ³rio</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Motoristas Tab */}
          {activeTab === "motoristas" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{filteredMotoristas.length} motoristas</h3>
                <Link
                  href="/motoristas/cadastrar"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Novo motorista
                </Link>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Motorista</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Contato</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cidade</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cadastro</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">AÃ§Ãµes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredMotoristas.map((motorista) => (
                        <tr key={motorista.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Car className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{motorista.nome}</p>
                                <p className="text-sm text-muted-foreground">{motorista.cpf}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                {motorista.email || "-"}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {motorista.telefone || "-"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{motorista.cidade || "-"}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                motorista.bloqueado
                                  ? "bg-destructive/10 text-destructive"
                                  : motorista.ativo
                                  ? "bg-success/10 text-success"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {motorista.bloqueado ? "Bloqueado" : motorista.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDateTime(motorista.created_at)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/motoristas/${motorista.id}`}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/motoristas/${motorista.id}/editar`}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => toggleMotoristaStatus(motorista.id, motorista.bloqueado)}
                                className={`p-2 rounded-lg transition-colors ${
                                  motorista.bloqueado
                                    ? "hover:bg-success/10 text-success"
                                    : "hover:bg-destructive/10 text-destructive"
                                }`}
                              >
                                {motorista.bloqueado ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredMotoristas.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    Nenhum motorista encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clientes Tab */}
          {activeTab === "clientes" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{filteredClientes.length} clientes</h3>
                <Link
                  href="/cadastros/clientes"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Novo cliente
                </Link>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Contato</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cidade</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cadastro</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">AÃ§Ãµes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredClientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5 text-success" />
                              </div>
                              <div>
                                <p className="font-medium">{cliente.nome}</p>
                                <p className="text-sm text-muted-foreground">{cliente.documento}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 text-muted-foreground" />
                                {cliente.email || "-"}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                {cliente.telefone || "-"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{cliente.cidade || "-"}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                                cliente.ativo
                                  ? "bg-success/10 text-success"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {cliente.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {formatDateTime(cliente.created_at)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleClienteStatus(cliente.id, cliente.ativo)}
                                className={`p-2 rounded-lg transition-colors ${
                                  cliente.ativo
                                    ? "hover:bg-destructive/10 text-destructive"
                                    : "hover:bg-success/10 text-success"
                                }`}
                              >
                                {cliente.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredClientes.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ServiÃ§os Tab */}
          {activeTab === "servicos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{servicos.length} serviÃ§os</h3>
                <Link
                  href="/servicos/novo"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Novo serviÃ§o
                </Link>
              </div>

              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-4 font-medium text-muted-foreground">ServiÃ§o</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Motorista</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Valor</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        <th className="text-right p-4 font-medium text-muted-foreground">AÃ§Ãµes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {servicos.map((servico) => (
                        <tr key={servico.id} className="hover:bg-secondary/50 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{servico.contratante}</p>
                              <p className="text-sm text-muted-foreground">
                                {servico.data_servico ? formatDateTime(servico.data_servico) : "-"}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{servico.am_clients?.nome || "-"}</td>
                          <td className="p-4 text-sm">{servico.am_motoristas?.nome || "-"}</td>
                          <td className="p-4 font-medium">{formatCurrency(servico.valor_cliente || 0)}</td>
                          <td className="p-4">
                            <span
                              className="px-3 py-1 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: `${getStatusColor(servico.status)}20`,
                                color: getStatusColor(servico.status),
                              }}
                            >
                              {getStatusLabel(servico.status)}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/servicos/${servico.id}`}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {servicos.length === 0 && (
                  <div className="p-12 text-center text-muted-foreground">
                    Nenhum serviÃ§o encontrado
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Corridas Tab */}
          {activeTab === "corridas" && (
            <div className="text-center py-20 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Sistema de corridas em tempo real</p>
              <p className="text-sm">Acompanhe todas as corridas ativas</p>
            </div>
          )}

          {/* Financeiro Tab */}
          {activeTab === "financeiro" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Receita total</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.receitaTotal)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa (5%)</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.taxaPlataforma)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Este mÃªs</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.receitaMes)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Saques pendentes</p>
                      <p className="text-2xl font-bold">{formatCurrency(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">Resumo financeiro</h3>
                <p className="text-muted-foreground">
                  Dashboard financeiro completo com grÃ¡ficos e relatÃ³rios detalhados.
                </p>
              </div>
            </div>
          )}

          {/* ConfiguraÃ§Ãµes Tab */}
          {activeTab === "configuracoes" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">ConfiguraÃ§Ãµes do sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Taxa da plataforma</p>
                      <p className="text-sm text-muted-foreground">Percentual cobrado por corrida/serviÃ§o</p>
                    </div>
                    <span className="text-xl font-bold text-primary">5%</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Valor mÃ­nimo de saque</p>
                      <p className="text-sm text-muted-foreground">MÃ­nimo para motoristas sacarem</p>
                    </div>
                    <span className="text-xl font-bold">R$ 50,00</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Nota mÃ­nima motorista</p>
                      <p className="text-sm text-muted-foreground">Para continuar ativo</p>
                    </div>
                    <span className="text-xl font-bold">4.0</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                    <div>
                      <p className="font-medium">Tempo para aceitar corrida</p>
                      <p className="text-sm text-muted-foreground">Segundos</p>
                    </div>
                    <span className="text-xl font-bold">30s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  trend: number;
  color: "primary" | "success" | "warning" | "destructive";
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            trend >= 0 ? "text-success" : "text-destructive"
          }`}
        >
          {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </div>
  );
}

