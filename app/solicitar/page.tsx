"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "lucide-react";
import { formatCurrency, calculateRidePrice, getGreeting } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Clock,
  Car,
  Star,
  CreditCard,
  Plus,
  Search,
  ChevronRight,
  ChevronDown,
  X,
  Phone,
  MessageSquare,
  Share2,
  Shield,
  AlertTriangle,
  User,
  History,
  Heart,
  Home,
  Briefcase,
  Target,
  ArrowLeft,
  Check,
  Loader2,
  Wallet,
  Banknote,
  Zap,
  CheckCircle,
  Flag,
  Info,
  Bell,
  Settings,
  HelpCircle,
} from "lucide-react";

type Step = "origem" | "destino" | "categoria" | "confirmacao" | "buscando" | "aceita" | "em_corrida" | "finalizada";

interface Location {
  endereco: string;
  lat: number;
  lng: number;
}

interface Category {
  id: string;
  nome: string;
  descricao: string;
  icon: typeof Car;
  multiplicador: number;
  tempoEstimado: number;
}

const CATEGORIAS: Category[] = [
  { id: "padrao", nome: "Padrão", descricao: "Econômico e rápido", icon: Car, multiplicador: 1, tempoEstimado: 5 },
  { id: "conforto", nome: "Conforto", descricao: "Carros espaçosos", icon: Car, multiplicador: 1.25, tempoEstimado: 4 },
  { id: "executivo", nome: "Executivo", descricao: "Premium e discreto", icon: Car, multiplicador: 1.75, tempoEstimado: 3 },
];

const LOCAIS_SALVOS = [
  { id: "1", nome: "Casa", endereco: "Rua das Flores, 123", icon: Home, tipo: "casa" },
  { id: "2", nome: "Trabalho", endereco: "Av. Paulista, 1000", icon: Briefcase, tipo: "trabalho" },
];

const LOCAIS_RECENTES = [
  { id: "1", endereco: "Shopping Ibirapuera", lat: -23.5876, lng: -46.6611 },
  { id: "2", endereco: "Aeroporto de Congonhas", lat: -23.6261, lng: -46.6558 },
  { id: "3", endereco: "Parque do Ibirapuera", lat: -23.5874, lng: -46.6576 },
];

export default function SolicitarCorridaPage() {
  const [step, setStep] = useState<Step>("origem");
  const [origem, setOrigem] = useState<Location | null>(null);
  const [destino, setDestino] = useState<Location | null>(null);
  const [categoria, setCategoria] = useState<Category>(CATEGORIAS[0]);
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "pix" | "cartao" | "saldo">("pix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchType, setSearchType] = useState<"origem" | "destino">("origem");
  const [loading, setLoading] = useState(false);

  // Dados da corrida
  const [distancia, setDistancia] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [preco, setPreco] = useState({ valorBase: 0, valorKm: 0, valorTempo: 0, valorTotal: 0, taxaPlataforma: 0, valorMotorista: 0 });

  // Motorista encontrado
  const [motorista, setMotorista] = useState<{
    nome: string;
    foto: string | null;
    nota: number;
    veiculo: string;
    placa: string;
    cor: string;
    telefone: string;
    tempoChegada: number;
  } | null>(null);

  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);

  // Calcular preço quando origem e destino estão definidos
  useEffect(() => {
    if (origem && destino) {
      // Simulação de distância (em produção usaria API de mapas)
      const dist = Math.random() * 15 + 3;
      const dur = Math.floor(dist * 2.5 + Math.random() * 10);
      setDistancia(Math.round(dist * 10) / 10);
      setDuracao(dur);

      const price = calculateRidePrice(dist, dur, categoria.id);
      setPreco({
        ...price,
        valorTotal: Math.round(price.valorTotal * categoria.multiplicador * 100) / 100,
      });
    }
  }, [origem, destino, categoria]);

  // Simulação de busca por motorista
  useEffect(() => {
    if (step === "buscando") {
      const timer = setTimeout(() => {
        setMotorista({
          nome: "Carlos Silva",
          foto: null,
          nota: 4.9,
          veiculo: "Toyota Corolla",
          placa: "ABC-1234",
          cor: "Prata",
          telefone: "(11) 99999-1234",
          tempoChegada: 5,
        });
        setCodigoVerificacao(Math.floor(1000 + Math.random() * 9000).toString());
        setStep("aceita");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Countdown para chegada do motorista
  useEffect(() => {
    if (step === "aceita" && motorista) {
      setTempoRestante(motorista.tempoChegada * 60);
      const timer = setInterval(() => {
        setTempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, motorista]);

  const handleSelectLocation = (endereco: string, lat: number, lng: number) => {
    const location = { endereco, lat, lng };
    if (searchType === "origem") {
      setOrigem(location);
      if (!destino) {
        setSearchType("destino");
        setSearchQuery("");
      } else {
        setShowSearchModal(false);
        setStep("categoria");
      }
    } else {
      setDestino(location);
      setShowSearchModal(false);
      setStep("categoria");
    }
  };

  const handleConfirmarCorrida = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("buscando");
    }, 1000);
  };

  const handleCancelar = () => {
    setStep("origem");
    setOrigem(null);
    setDestino(null);
    setMotorista(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          {step !== "origem" && step !== "buscando" && step !== "aceita" && step !== "em_corrida" ? (
            <button
              onClick={() => {
                if (step === "destino") setStep("origem");
                else if (step === "categoria") setStep("origem");
                else if (step === "confirmacao") setStep("categoria");
              }}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-xl flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-foreground">MOVO</span>
              </div>
            </Link>
          )}

          <div className="flex items-center gap-2">
            <button className="p-2 bg-secondary rounded-xl">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/perfil" className="p-2 bg-secondary rounded-xl">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Mapa interativo</p>
          </div>
        </div>

        {/* Current location button */}
        <button className="absolute bottom-4 right-4 w-12 h-12 bg-card rounded-xl shadow-lg flex items-center justify-center">
          <Target className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-card rounded-t-3xl -mt-6 relative z-10 min-h-[50vh] shadow-2xl">
        <div className="w-12 h-1 bg-border rounded-full mx-auto mt-3 mb-4" />

        {/* Initial State - Origem */}
        {(step === "origem" || step === "destino" || step === "categoria") && !showSearchModal && (
          <div className="px-4 pb-6 space-y-4">
            {/* Location Inputs */}
            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <button
                onClick={() => {
                  setSearchType("origem");
                  setShowSearchModal(true);
                }}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">De onde?</p>
                  <p className={`font-medium ${origem ? "text-foreground" : "text-muted-foreground"}`}>
                    {origem?.endereco || "Escolher origem"}
                  </p>
                </div>
                {origem && <Check className="w-5 h-5 text-success" />}
              </button>

              <div className="h-px bg-border" />

              <button
                onClick={() => {
                  setSearchType("destino");
                  setShowSearchModal(true);
                }}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Flag className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Para onde?</p>
                  <p className={`font-medium ${destino ? "text-foreground" : "text-muted-foreground"}`}>
                    {destino?.endereco || "Escolher destino"}
                  </p>
                </div>
                {destino && <Check className="w-5 h-5 text-success" />}
              </button>
            </div>

            {/* Saved Locations */}
            <div className="flex gap-3">
              {LOCAIS_SALVOS.map((local) => (
                <button
                  key={local.id}
                  onClick={() => handleSelectLocation(local.endereco, -23.55, -46.63)}
                  className="flex-1 flex items-center gap-2 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  <local.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{local.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{local.endereco}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Categories */}
            {origem && destino && step === "categoria" && (
              <>
                <h3 className="font-semibold text-foreground">Escolha a categoria</h3>
                <div className="space-y-3">
                  {CATEGORIAS.map((cat) => {
                    const catPrice = calculateRidePrice(distancia, duracao, cat.id);
                    const finalPrice = Math.round(catPrice.valorTotal * cat.multiplicador * 100) / 100;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoria(cat)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          categoria.id === cat.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            categoria.id === cat.id ? "bg-primary" : "bg-secondary"
                          }`}
                        >
                          <cat.icon
                            className={`w-7 h-7 ${
                              categoria.id === cat.id ? "text-primary-foreground" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">{cat.nome}</p>
                          <p className="text-sm text-muted-foreground">{cat.descricao}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {cat.tempoEstimado} min
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(finalPrice)}</p>
                          {cat.id !== "padrao" && (
                            <p className="text-xs text-muted-foreground">
                              {Math.round((cat.multiplicador - 1) * 100)}% a mais
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Method */}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-secondary rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    {formaPagamento === "dinheiro" && <Banknote className="w-6 h-6 text-success" />}
                    {formaPagamento === "pix" && <Zap className="w-6 h-6 text-primary" />}
                    {formaPagamento === "cartao" && <CreditCard className="w-6 h-6 text-warning" />}
                    {formaPagamento === "saldo" && <Wallet className="w-6 h-6 text-cyan-500" />}
                    <span className="font-medium capitalize">{formaPagamento}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Confirm Button */}
                <button
                  onClick={() => setStep("confirmacao")}
                  className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/25"
                >
                  Continuar - {formatCurrency(preco.valorTotal)}
                </button>
              </>
            )}

            {/* Recent Locations */}
            {!origem && !destino && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Locais recentes</h3>
                <div className="space-y-2">
                  {LOCAIS_RECENTES.map((local) => (
                    <button
                      key={local.id}
                      onClick={() => {
                        setSearchType("destino");
                        handleSelectLocation(local.endereco, local.lat, local.lng);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
                    >
                      <History className="w-5 h-5 text-muted-foreground" />
                      <span className="flex-1 text-left">{local.endereco}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Confirmation Step */}
        {step === "confirmacao" && (
          <div className="px-4 pb-6 space-y-4">
            <h2 className="text-xl font-bold text-center">Confirmar corrida</h2>

            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium">{origem?.endereco}</p>
                </div>
              </div>

              <div className="h-px bg-border ml-11" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flag className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium">{destino?.endereco}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{duracao} min</p>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="font-semibold">{distancia} km</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <categoria.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="font-semibold">{categoria.nome}</p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(preco.valorBase + preco.valorKm + preco.valorTempo)}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Taxa (5%)</span>
                <span>{formatCurrency(preco.taxaPlataforma)}</span>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(preco.valorTotal)}</span>
              </div>
            </div>

            <div className="bg-success/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-success">Viagem segura</p>
                  <p className="text-sm text-muted-foreground">Compartilhe sua rota com amigos e família</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmarCorrida}
              disabled={loading}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Solicitando...
                </>
              ) : (
                <>
                  Solicitar {categoria.nome}
                  <Car className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Searching for Driver */}
        {step === "buscando" && (
          <div className="px-4 pb-6 text-center">
            <div className="py-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Car className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Buscando motorista</h2>
              <p className="text-muted-foreground">Encontrando o melhor motorista para você...</p>

              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleCancelar}
              className="w-full py-4 bg-secondary text-foreground font-semibold rounded-2xl"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Driver Found */}
        {step === "aceita" && motorista && (
          <div className="px-4 pb-6 space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-4">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-semibold text-success">Motorista a caminho!</span>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{motorista.nome}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{motorista.nota}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatTime(tempoRestante)}</p>
                  <p className="text-xs text-muted-foreground">chegada</p>
                </div>
              </div>

              <div className="bg-secondary rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{motorista.veiculo}</p>
                    <p className="text-sm text-muted-foreground">{motorista.cor}</p>
                  </div>
                  <div className="px-4 py-2 bg-card rounded-lg border border-border">
                    <p className="font-mono font-bold text-lg">{motorista.placa}</p>
                  </div>
                </div>
              </div>

              <div className="bg-warning/10 rounded-xl p-4 text-center mb-4">
                <p className="text-sm text-muted-foreground mb-1">Código de verificação</p>
                <p className="text-3xl font-mono font-bold text-warning tracking-widest">{codigoVerificacao}</p>
                <p className="text-xs text-muted-foreground mt-1">Confirme este código com o motorista</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${motorista.telefone}`}
                  className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                >
                  <Phone className="w-5 h-5" />
                  Ligar
                </a>
                <button className="flex items-center justify-center gap-2 py-3 bg-secondary text-foreground rounded-xl font-semibold">
                  <MessageSquare className="w-5 h-5" />
                  Mensagem
                </button>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Origem</p>
                  <p className="font-medium text-sm">{origem?.endereco}</p>
                </div>
              </div>

              <div className="h-px bg-border ml-11" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flag className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destino</p>
                  <p className="font-medium text-sm">{destino?.endereco}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl">
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-destructive/10 text-destructive rounded-xl">
                <AlertTriangle className="w-5 h-5" />
                Emergência
              </button>
            </div>

            <button
              onClick={handleCancelar}
              className="w-full py-3 text-destructive font-medium"
            >
              Cancelar corrida
            </button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSearchModal(false)} className="p-2 -ml-2">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === "origem" ? "De onde você vai?" : "Para onde você vai?"}
                    className="w-full pl-10 pr-4 py-3 bg-secondary rounded-xl border border-border focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {/* Use current location */}
              {searchType === "origem" && (
                <button
                  onClick={() => handleSelectLocation("Minha localização atual", -23.55, -46.63)}
                  className="w-full flex items-center gap-3 p-3 bg-primary/10 rounded-xl mb-4"
                >
                  <Target className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-primary">Usar localização atual</p>
                    <p className="text-sm text-muted-foreground">GPS ativado</p>
                  </div>
                </button>
              )}

              {/* Saved locations */}
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">SALVOS</h3>
              <div className="space-y-2 mb-6">
                {LOCAIS_SALVOS.map((local) => (
                  <button
                    key={local.id}
                    onClick={() => handleSelectLocation(local.endereco, -23.55, -46.63)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <local.icon className="w-5 h-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-medium">{local.nome}</p>
                      <p className="text-sm text-muted-foreground">{local.endereco}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Recent locations */}
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">RECENTES</h3>
              <div className="space-y-2">
                {LOCAIS_RECENTES.map((local) => (
                  <button
                    key={local.id}
                    onClick={() => handleSelectLocation(local.endereco, local.lat, local.lng)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <History className="w-5 h-5 text-muted-foreground" />
                    <span>{local.endereco}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Forma de pagamento</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 -mr-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: "pix", label: "PIX", desc: "Pagamento instantâneo", icon: Zap, color: "text-primary" },
                { id: "dinheiro", label: "Dinheiro", desc: "Pague ao motorista", icon: Banknote, color: "text-success" },
                { id: "cartao", label: "Cartão", desc: "Crédito ou débito", icon: CreditCard, color: "text-warning" },
                { id: "saldo", label: "Saldo", desc: "R$ 150,00 disponível", icon: Wallet, color: "text-cyan-500" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setFormaPagamento(opt.id as typeof formaPagamento);
                    setShowPaymentModal(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    formaPagamento === opt.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <opt.icon className={`w-6 h-6 ${opt.color}`} />
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  {formaPagamento === opt.id && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
