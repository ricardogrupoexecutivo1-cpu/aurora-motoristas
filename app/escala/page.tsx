"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Car,
  MapPin,
  Phone,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Home,
  Filter,
  Search,
  RefreshCw,
  Plus,
  ChevronRight,
  Shield,
  Zap,
} from "lucide-react";

type ScaleRisk = "Baixo" | "Medio" | "Alto";
type ScaleStatus = "Agendado" | "Em deslocamento" | "Aguardando passageiro" | "Reagendado";
type ScaleOrigin = "Base padrao" | "Base local";

type ScaleItem = {
  id: string;
  motorista: string;
  cliente: string;
  empresa: string;
  locadora: string;
  dataHora: string;
  status: ScaleStatus;
  risco: ScaleRisk;
  rota: string;
  origemBase: ScaleOrigin;
  motoristaReserva: string;
  veiculoReserva: string;
  observacao: string;
  telefoneMotorista: string;
  telefoneCliente: string;
};

function formatPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function openWhatsApp(phone: string, message: string) {
  if (typeof window === "undefined") return;
  const clean = formatPhone(phone);
  if (!clean) return;
  const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function buildScaleMessage(item: ScaleItem) {
  return `MOVO - Acompanhamento de Servico

Atendimento: ${item.id}
Motorista: ${item.motorista}
Cliente: ${item.cliente}
Rota: ${item.rota}
Data/Hora: ${item.dataHora}
Status: ${item.status}

Mensagem operacional enviada pelo MOVO para acompanhamento seguro do atendimento.`;
}

function buildLocationRequest(item: ScaleItem) {
  return `MOVO - Solicitacao de Localizacao

Atendimento: ${item.id}
Rota: ${item.rota}
Data/Hora: ${item.dataHora}

Se voce concordar e estiver em atendimento, compartilhe sua localizacao atual para acompanhamento operacional desta corrida.`;
}

const MOCK_DATA: ScaleItem[] = [
  { id: "ESC-001", motorista: "Carlos Silva", cliente: "Maria Santos", empresa: "Empresa ABC", locadora: "Locadora X", dataHora: "2024-01-15 08:00", status: "Agendado", risco: "Baixo", rota: "Aeroporto > Centro", origemBase: "Base padrao", motoristaReserva: "Joao Lima", veiculoReserva: "ABC-1234", observacao: "Cliente VIP", telefoneMotorista: "5531999999999", telefoneCliente: "5531988888888" },
  { id: "ESC-002", motorista: "Ana Costa", cliente: "Pedro Oliveira", empresa: "Empresa XYZ", locadora: "Locadora Y", dataHora: "2024-01-15 10:30", status: "Em deslocamento", risco: "Medio", rota: "Hotel > Reuniao", origemBase: "Base local", motoristaReserva: "Maria Lima", veiculoReserva: "DEF-5678", observacao: "", telefoneMotorista: "5531977777777", telefoneCliente: "5531966666666" },
  { id: "ESC-003", motorista: "Jose Santos", cliente: "Ana Paula", empresa: "Empresa 123", locadora: "Locadora Z", dataHora: "2024-01-15 14:00", status: "Aguardando passageiro", risco: "Alto", rota: "Escritorio > Aeroporto", origemBase: "Base padrao", motoristaReserva: "Pedro Costa", veiculoReserva: "GHI-9012", observacao: "Urgente", telefoneMotorista: "5531955555555", telefoneCliente: "5531944444444" },
];

export default function EscalaPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [riscoFilter, setRiscoFilter] = useState("todos");
  const [data] = useState<ScaleItem[]>(MOCK_DATA);

  const filtrados = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = !search || 
        item.motorista.toLowerCase().includes(search.toLowerCase()) ||
        item.cliente.toLowerCase().includes(search.toLowerCase()) ||
        item.rota.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "todos" || item.status === statusFilter;
      const matchRisco = riscoFilter === "todos" || item.risco === riscoFilter;
      return matchSearch && matchStatus && matchRisco;
    });
  }, [data, search, statusFilter, riscoFilter]);

  const stats = [
    { label: "Total Agendados", valor: data.filter(i => i.status === "Agendado").length, icon: Calendar, cor: "from-blue-500 to-cyan-500" },
    { label: "Em Deslocamento", valor: data.filter(i => i.status === "Em deslocamento").length, icon: Car, cor: "from-emerald-500 to-green-500" },
    { label: "Aguardando", valor: data.filter(i => i.status === "Aguardando passageiro").length, icon: Clock, cor: "from-amber-500 to-orange-500" },
    { label: "Alto Risco", valor: data.filter(i => i.risco === "Alto").length, icon: AlertTriangle, cor: "from-rose-500 to-red-500" },
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Escala de Motoristas</h1>
            <p className="text-muted-foreground">Gerenciamento de escalas e acompanhamento em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border hover:border-primary transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Atualizar</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-premium text-white font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              <span>Nova Escala</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card-premium p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.cor} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold">{stat.valor}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                placeholder="Buscar motorista, cliente, rota..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none transition-colors"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none min-w-[180px]">
              <option value="todos">Todos os Status</option>
              <option value="Agendado">Agendado</option>
              <option value="Em deslocamento">Em Deslocamento</option>
              <option value="Aguardando passageiro">Aguardando</option>
              <option value="Reagendado">Reagendado</option>
            </select>
            <select value={riscoFilter} onChange={(e) => setRiscoFilter(e.target.value)} className="px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none min-w-[150px]">
              <option value="todos">Todos os Riscos</option>
              <option value="Baixo">Baixo</option>
              <option value="Medio">Medio</option>
              <option value="Alto">Alto</option>
            </select>
          </div>
        </div>

        {/* Scale Cards */}
        <div className="grid gap-4">
          {filtrados.length === 0 ? (
            <div className="card-premium p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhuma escala encontrada</p>
            </div>
          ) : (
            filtrados.map((item) => (
              <div key={item.id} className="card-premium p-5 hover:border-primary/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Info Principal */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ID / Data</p>
                      <p className="font-mono font-medium">{item.id}</p>
                      <p className="text-sm text-muted-foreground">{item.dataHora}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Motorista</p>
                      <p className="font-medium">{item.motorista}</p>
                      <p className="text-sm text-muted-foreground">{item.empresa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cliente</p>
                      <p className="font-medium">{item.cliente}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Rota</p>
                      <p className="font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {item.rota}
                      </p>
                    </div>
                  </div>

                  {/* Status e Risco */}
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                      item.status === "Em deslocamento" ? "bg-blue-500/10 text-blue-600" :
                      item.status === "Aguardando passageiro" ? "bg-amber-500/10 text-amber-600" :
                      item.status === "Reagendado" ? "bg-purple-500/10 text-purple-600" :
                      "bg-cyan-500/10 text-cyan-600"
                    }`}>
                      {item.status}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1 ${
                      item.risco === "Alto" ? "bg-destructive/10 text-destructive" :
                      item.risco === "Medio" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    }`}>
                      <Shield className="w-3 h-3" />
                      {item.risco}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openWhatsApp(item.telefoneMotorista, buildScaleMessage(item))}
                      className="p-2.5 rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors"
                      title="WhatsApp Motorista"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openWhatsApp(item.telefoneMotorista, buildLocationRequest(item))}
                      className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      title="Solicitar Localizacao"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-card border border-border hover:border-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.observacao && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-warning" />
                      {item.observacao}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
