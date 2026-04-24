"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Navigation as NavIcon } from "lucide-react";
import { formatCurrency, formatDateTime, getGreeting, getStatusColor, getStatusLabel } from "@/lib/utils";
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Navigation,
  Power,
  PowerOff,
  Bell,
  User,
  Wallet,
  History,
  Settings,
  HelpCircle,
  ChevronRight,
  Phone,
  MessageSquare,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Zap,
  Target,
  Award,
  Home,
  RefreshCw,
  Share2,
  FileText,
  Camera,
  CreditCard,
  ArrowRight,
  Play,
  Square,
  Flag,
} from "lucide-react";

type RideStatus = "aguardando" | "aceita" | "buscando" | "em_corrida" | "finalizada";

interface Ride {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  origem: string;
  destino: string;
  distancia_km: number;
  valor_motorista: number;
  status: RideStatus;
  codigo_verificacao: string;
}

export default function MotoristaPainel() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState<"inicio" | "corridas" | "ganhos" | "perfil">("inicio");
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [pendingRides, setPendingRides] = useState<Ride[]>([]);
  const [showRideModal, setShowRideModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [acceptCountdown, setAcceptCountdown] = useState(30);
  const [loading, setLoading] = useState(true);

  // Dados do motorista
  const [motorista, setMotorista] = useState({
    nome: "Carlos Silva",
    foto: null,
    nota: 4.9,
    corridasHoje: 8,
    ganhosHoje: 285.50,
    ganhosSemana: 1250.00,
    ganhosMes: 4850.00,
    saldoDisponivel: 1520.00,
    corridasTotal: 1547,
    tempoOnline: "5h 32min",
    taxaAceitacao: 95,
    taxaCancelamento: 2,
  });

  // HistÃ³rico de corridas
  const [historicoGanhos, setHistoricoGanhos] = useState([
    { data: "Hoje", valor: 285.50, corridas: 8 },
    { data: "Ontem", valor: 320.00, corridas: 10 },
    { data: "Seg", valor: 195.00, corridas: 6 },
    { data: "Dom", valor: 450.00, corridas: 14 },
  ]);

  // SimulaÃ§Ã£o de corridas chegando
  useEffect(() => {
    if (isOnline && !currentRide) {
      const timer = setTimeout(() => {
        const novasCorridas: Ride[] = [
          {
            id: "1",
            cliente_nome: "Maria Santos",
            cliente_telefone: "(11) 99999-1234",
            origem: "Av. Paulista, 1000",
            destino: "Shopping Ibirapuera",
            distancia_km: 8.5,
            valor_motorista: 32.50,
            status: "aguardando",
            codigo_verificacao: "4521",
          },
        ];
        setPendingRides(novasCorridas);
        if (novasCorridas.length > 0) {
          setSelectedRide(novasCorridas[0]);
          setShowRideModal(true);
          setAcceptCountdown(30);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, currentRide]);

  // Countdown para aceitar corrida
  useEffect(() => {
    if (showRideModal && acceptCountdown > 0) {
      const timer = setTimeout(() => {
        setAcceptCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (acceptCountdown === 0 && showRideModal) {
      setShowRideModal(false);
      setPendingRides((prev) => prev.filter((r) => r.id !== selectedRide?.id));
    }
  }, [showRideModal, acceptCountdown, selectedRide]);

  const acceptRide = () => {
    if (selectedRide) {
      setCurrentRide({ ...selectedRide, status: "aceita" });
      setShowRideModal(false);
      setPendingRides([]);
    }
  };

  const rejectRide = () => {
    setShowRideModal(false);
    setPendingRides((prev) => prev.filter((r) => r.id !== selectedRide?.id));
  };

  const updateRideStatus = (newStatus: RideStatus) => {
    if (currentRide) {
      if (newStatus === "finalizada") {
        setMotorista((prev) => ({
          ...prev,
          corridasHoje: prev.corridasHoje + 1,
          ganhosHoje: prev.ganhosHoje + currentRide.valor_motorista,
        }));
        setCurrentRide(null);
      } else {
        setCurrentRide({ ...currentRide, status: newStatus });
      }
    }
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{getGreeting()}</p>
              <h1 className="font-bold text-foreground">{motorista.nome}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-warning/10 rounded-full">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-semibold text-warning">{motorista.nota}</span>
            </div>

            <button className="relative p-2 bg-secondary rounded-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Online/Offline Toggle */}
      <div className="px-4 py-4">
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
            isOnline
              ? "bg-success text-success-foreground shadow-lg shadow-success/25"
              : "bg-secondary text-muted-foreground"
          }`}
        >
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Power className="w-6 h-6" />
            ) : (
              <PowerOff className="w-6 h-6" />
            )}
            <div className="text-left">
              <p className="font-bold">{isOnline ? "VocÃª estÃ¡ online" : "VocÃª estÃ¡ offline"}</p>
              <p className="text-sm opacity-80">
                {isOnline ? "Recebendo solicitaÃ§Ãµes de corridas" : "Toque para ficar online"}
              </p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${isOnline ? "bg-white/30" : "bg-border"}`}>
            <div
              className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
                isOnline ? "right-1 bg-white" : "left-1 bg-muted-foreground"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Current Ride */}
      {currentRide && (
        <div className="px-4 mb-4">
          <div className="bg-card rounded-2xl border border-border p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor:
                    currentRide.status === "aceita"
                      ? "#3b82f620"
                      : currentRide.status === "buscando"
                      ? "#8b5cf620"
                      : "#22c55e20",
                  color:
                    currentRide.status === "aceita"
                      ? "#3b82f6"
                      : currentRide.status === "buscando"
                      ? "#8b5cf6"
                      : "#22c55e",
                }}
              >
                {currentRide.status === "aceita"
                  ? "Corrida aceita"
                  : currentRide.status === "buscando"
                  ? "Indo buscar passageiro"
                  : "Em corrida"}
              </span>
              <span className="text-lg font-bold text-success">
                {formatCurrency(currentRide.valor_motorista)}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium">{currentRide.origem}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flag className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium">{currentRide.destino}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary rounded-xl mb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{currentRide.cliente_nome}</p>
                  <p className="text-xs text-muted-foreground">CÃ³digo: {currentRide.codigo_verificacao}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${currentRide.cliente_telefone}`}
                  className="p-2 bg-primary/10 rounded-lg"
                >
                  <Phone className="w-5 h-5 text-primary" />
                </a>
                <button className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            {currentRide.status === "aceita" && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateRideStatus("buscando")}
                  className="py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Navegar
                </button>
                <button
                  onClick={() => {}}
                  className="py-3 bg-secondary text-foreground font-semibold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            )}

            {currentRide.status === "buscando" && (
              <button
                onClick={() => updateRideStatus("em_corrida")}
                className="w-full py-4 bg-success text-success-foreground font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Iniciar corrida
              </button>
            )}

            {currentRide.status === "em_corrida" && (
              <button
                onClick={() => updateRideStatus("finalizada")}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finalizar corrida
              </button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4">
        {activeTab === "inicio" && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm text-muted-foreground">Hoje</span>
                </div>
                <p className="text-2xl font-bold text-success">{formatCurrency(motorista.ganhosHoje)}</p>
                <p className="text-xs text-muted-foreground">{motorista.corridasHoje} corridas</p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">DisponÃ­vel</span>
                </div>
                <p className="text-2xl font-bold text-primary">{formatCurrency(motorista.saldoDisponivel)}</p>
                <p className="text-xs text-muted-foreground">Para saque</p>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Ãšltimos dias</h3>
                <span className="text-sm text-muted-foreground">Esta semana</span>
              </div>
              <div className="flex items-end justify-between gap-2 h-24">
                {historicoGanhos.map((dia, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                      style={{
                        height: `${(dia.valor / 500) * 100}%`,
                        minHeight: "20%",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{dia.data}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance */}
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold mb-4">Seu desempenho</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Target className="w-6 h-6 text-success" />
                  </div>
                  <p className="text-lg font-bold">{motorista.taxaAceitacao}%</p>
                  <p className="text-xs text-muted-foreground">AceitaÃ§Ã£o</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="text-lg font-bold">{motorista.taxaCancelamento}%</p>
                  <p className="text-xs text-muted-foreground">Cancelamento</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-warning" />
                  </div>
                  <p className="text-lg font-bold">{motorista.corridasTotal}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/motorista/ganhos"
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium">Ganhos</p>
                  <p className="text-xs text-muted-foreground">Ver detalhes</p>
                </div>
              </Link>

              <Link
                href="/motorista/historico"
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">HistÃ³rico</p>
                  <p className="text-xs text-muted-foreground">Suas corridas</p>
                </div>
              </Link>

              <Link
                href="/motorista/documentos"
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Documentos</p>
                  <p className="text-xs text-muted-foreground">VerificaÃ§Ã£o</p>
                </div>
              </Link>

              <Link
                href="/assistente"
                className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                  <p className="font-medium">Ajuda</p>
                  <p className="text-xs text-muted-foreground">IA Assistente</p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "ganhos" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-success to-emerald-600 rounded-2xl p-6 text-white">
              <p className="text-sm opacity-80">Saldo disponÃ­vel</p>
              <p className="text-4xl font-bold my-2">{formatCurrency(motorista.saldoDisponivel)}</p>
              <button className="mt-4 w-full py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                Sacar agora
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Hoje</p>
                <p className="text-lg font-bold">{formatCurrency(motorista.ganhosHoje)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">Semana</p>
                <p className="text-lg font-bold">{formatCurrency(motorista.ganhosSemana)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3 text-center">
                <p className="text-xs text-muted-foreground">MÃªs</p>
                <p className="text-lg font-bold">{formatCurrency(motorista.ganhosMes)}</p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold mb-4">HistÃ³rico de ganhos</h3>
              <div className="space-y-3">
                {historicoGanhos.map((dia, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{dia.data}</p>
                        <p className="text-xs text-muted-foreground">{dia.corridas} corridas</p>
                      </div>
                    </div>
                    <p className="font-bold text-success">{formatCurrency(dia.valor)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "corridas" && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-4">
              <h3 className="font-semibold mb-4">Corridas de hoje</h3>
              {motorista.corridasHoje > 0 ? (
                <div className="space-y-3">
                  {[...Array(Math.min(motorista.corridasHoje, 5))].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Corrida #{motorista.corridasHoje - i}</p>
                          <p className="text-xs text-muted-foreground">ConcluÃ­da</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                        Finalizada
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma corrida hoje</p>
                  <p className="text-sm">Fique online para receber solicitaÃ§Ãµes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "perfil" && (
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold">{motorista.nome}</h2>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-warning text-warning" />
                <span className="font-semibold">{motorista.nota}</span>
                <span className="text-muted-foreground">({motorista.corridasTotal} corridas)</span>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border divide-y divide-border">
              <Link href="/motorista/veiculo" className="flex items-center justify-between p-4 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-muted-foreground" />
                  <span>Meu veÃ­culo</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link href="/motorista/documentos" className="flex items-center justify-between p-4 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span>Documentos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link href="/motorista/conta" className="flex items-center justify-between p-4 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                  <span>Dados bancÃ¡rios</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link href="/motorista/configuracoes" className="flex items-center justify-between p-4 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span>ConfiguraÃ§Ãµes</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link href="/assistente" className="flex items-center justify-between p-4 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <span>Ajuda</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </div>

            <button className="w-full p-4 bg-destructive/10 text-destructive rounded-2xl font-medium">
              Sair da conta
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 safe-area-bottom">
        <div className="flex items-center justify-around">
          {[
            { id: "inicio", label: "InÃ­cio", icon: Home },
            { id: "corridas", label: "Corridas", icon: Car },
            { id: "ganhos", label: "Ganhos", icon: Wallet },
            { id: "perfil", label: "Perfil", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? "stroke-[2.5]" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Ride Request Modal */}
      {showRideModal && selectedRide && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 animate-slide-up">
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-6" />

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Nova corrida!</h2>
              <p className="text-muted-foreground">Aceite em {acceptCountdown}s</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium">{selectedRide.origem}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
                <Flag className="w-5 h-5 text-success mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium">{selectedRide.destino}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-xl text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="font-bold">{selectedRide.distancia_km} km</p>
                </div>
                <div className="p-4 bg-success/10 rounded-xl text-center">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-success" />
                  <p className="font-bold text-success">{formatCurrency(selectedRide.valor_motorista)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={rejectRide}
                className="py-4 bg-secondary text-foreground font-semibold rounded-xl"
              >
                Recusar
              </button>
              <button
                onClick={acceptRide}
                className="py-4 bg-success text-success-foreground font-bold rounded-xl"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

