"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/app-layout";
import {
  Home,
  Users,
  Car,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Star,
  Shield,
  Zap,
  BarChart3,
  Activity,
  Award,
  Building2,
  UserCheck,
  RefreshCw,
  Download,
  Filter,
  MoreVertical,
  ChevronRight,
  Navigation,
} from "lucide-react";

export default function PlataformaPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { title: "Corridas Hoje", value: "127", change: "+12%", positive: true, icon: Car, color: "from-primary to-violet-500" },
    { title: "Entregas Hoje", value: "84", change: "+8%", positive: true, icon: Package, color: "from-orange-500 to-red-500" },
    { title: "Motoristas Online", value: "43", change: "-3", positive: false, icon: Users, color: "from-emerald-500 to-teal-500" },
    { title: "Faturamento", value: "R$ 12.450", change: "+15%", positive: true, icon: DollarSign, color: "from-blue-500 to-cyan-500" },
  ];

  const recentRides = [
    { id: "COR-001", client: "Maria Silva", driver: "Joao Santos", status: "Em andamento", value: "R$ 45,00", time: "10 min" },
    { id: "COR-002", client: "Pedro Lima", driver: "Ana Costa", status: "Concluida", value: "R$ 32,00", time: "25 min" },
    { id: "COR-003", client: "Lucas Oliveira", driver: "Carlos Souza", status: "Aguardando", value: "R$ 58,00", time: "2 min" },
    { id: "COR-004", client: "Fernanda Reis", driver: "Roberto Alves", status: "Concluida", value: "R$ 27,00", time: "40 min" },
    { id: "COR-005", client: "Bruno Martins", driver: "Patricia Dias", status: "Em andamento", value: "R$ 65,00", time: "15 min" },
  ];

  const quickActions = [
    { name: "Nova Corrida", href: "/solicitar", icon: Car, color: "from-primary to-violet-500" },
    { name: "Nova Entrega", href: "/entregas", icon: Package, color: "from-orange-500 to-red-500" },
    { name: "Motoristas", href: "/motoristas", icon: Users, color: "from-emerald-500 to-teal-500" },
    { name: "Financeiro", href: "/financeiro", icon: DollarSign, color: "from-blue-500 to-cyan-500" },
    { name: "Relatorios", href: "/relatorios", icon: BarChart3, color: "from-pink-500 to-rose-500" },
    { name: "Operacao", href: "/operacao", icon: Activity, color: "from-amber-500 to-orange-500" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Em andamento":
        return "bg-primary/20 text-primary";
      case "Concluida":
        return "bg-success/20 text-success";
      case "Aguardando":
        return "bg-warning/20 text-warning";
      default:
        return "bg-white/10 text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/20">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">Visao geral da operacao em tempo real</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/20 text-success text-sm font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-success" />
            Ao Vivo
          </span>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-primary/50 transition-all">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-premium text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card rounded-2xl border border-white/10 p-6 hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${stat.positive ? 'text-success' : 'text-red-400'}`}>
                {stat.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Atividade Recente</h3>
                <p className="text-sm text-muted-foreground">Ultimas corridas e entregas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-white/5">
            {recentRides.map((ride, index) => (
              <div key={index} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ride.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(ride.status)}`}>
                        {ride.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {ride.client} → {ride.driver}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">{ride.value}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    {ride.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-white/10">
            <Link href="/servicos" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
              Ver todos os servicos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-primary/20">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Acoes Rapidas</h3>
              <p className="text-sm text-muted-foreground">Acesse rapidamente</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium">{action.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold">Desempenho Semanal</h3>
                <p className="text-sm text-muted-foreground">Corridas e faturamento</p>
              </div>
            </div>
            <select className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm">
              <option>Esta semana</option>
              <option>Este mes</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-muted-foreground">Grafico de desempenho</p>
              <p className="text-sm text-muted-foreground">Dados em tempo real</p>
            </div>
          </div>
        </div>

        {/* Top Drivers */}
        <div className="glass-card rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-yellow-500/20">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold">Top Motoristas</h3>
              <p className="text-sm text-muted-foreground">Melhor desempenho</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { name: "Joao Santos", rides: 45, rating: 4.9, earnings: "R$ 2.450" },
              { name: "Ana Costa", rides: 42, rating: 4.8, earnings: "R$ 2.180" },
              { name: "Carlos Souza", rides: 38, rating: 4.9, earnings: "R$ 1.950" },
              { name: "Patricia Dias", rides: 35, rating: 4.7, earnings: "R$ 1.820" },
            ].map((driver, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-2.5 h-2.5 text-yellow-900" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {driver.rides} corridas • {driver.rating} estrelas
                  </p>
                </div>
                <p className="font-bold text-success text-sm">{driver.earnings}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Structure */}
      <div className="mt-8 glass-card rounded-2xl border border-white/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/20">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">Estrutura da Plataforma</h3>
            <p className="text-sm text-muted-foreground">Regras de acesso e seguranca</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Clientes", desc: "Contratam servicos sem acesso a plataforma interna", icon: UserCheck, color: "text-blue-400" },
            { title: "Operacao Interna", desc: "Acesso completo ao sistema e base de motoristas", icon: Building2, color: "text-emerald-400" },
            { title: "Operadoras Externas", desc: "Acesso limitado com plano ativo e regras proprias", icon: Users, color: "text-orange-400" },
            { title: "Base Blindada", desc: "Motoristas internos protegidos de acessos externos", icon: Shield, color: "text-red-400" },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
              <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
              <h4 className="font-bold mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
