"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, calculateRidePrice } from "@/lib/utils";
import {
  MapPin,
  Navigation,
  Clock,
  Car,
  Star,
  CreditCard,
  Search,
  ChevronRight,
  X,
  Phone,
  MessageSquare,
  Share2,
  Shield,
  AlertTriangle,
  User,
  History,
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
  Bell,
  Fingerprint,
  Camera,
  MapPinned,
  Users,
  BadgeCheck,
  ShieldCheck,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  TrendingDown,
  Lock,
  Bike,
  Truck,
  Baby,
  Accessibility,
  Dog,
  Music,
  Wifi,
  BatteryCharging,
  ThermometerSnowflake,
  QrCode,
  ScanLine,
  Video,
  PhoneCall,
  Send,
  Heart,
  Info,
  Crown,
  Award,
  Verified,
} from "lucide-react";

type Step = "origem" | "destino" | "categoria" | "confirmacao" | "buscando" | "aceita" | "em_corrida" | "finalizada" | "avaliacao";

interface Location {
  endereco: string;
  lat: number;
  lng: number;
  referencia?: string;
}

interface Category {
  id: string;
  nome: string;
  descricao: string;
  icon: typeof Car;
  multiplicador: number;
  tempoEstimado: number;
  capacidade: number;
  recursos: string[];
}

interface Driver {
  id: string;
  nome: string;
  foto: string | null;
  nota: number;
  totalViagens: number;
  anosExperiencia: number;
  verificado: boolean;
  veiculo: {
    modelo: string;
    marca: string;
    ano: number;
    cor: string;
    placa: string;
    foto: string | null;
  };
  telefone: string;
  tempoChegada: number;
  distancia: number;
  cancelamentos: number;
  aceitacao: number;
  documentosVerificados: boolean;
  antecedentesOk: boolean;
}

const CATEGORIAS: Category[] = [
  { 
    id: "moto", 
    nome: "Moto", 
    descricao: "Rapido e economico", 
    icon: Bike, 
    multiplicador: 0.7, 
    tempoEstimado: 3,
    capacidade: 1,
    recursos: ["Rapido", "Economico"]
  },
  { 
    id: "padrao", 
    nome: "Aurora Motoristas", 
    descricao: "Economico e Ambiente seguro", 
    icon: Car, 
    multiplicador: 1, 
    tempoEstimado: 5,
    capacidade: 4,
    recursos: ["Ar condicionado", "4 lugares"]
  },
  { 
    id: "conforto", 
    nome: "Conforto", 
    descricao: "Carros espacosos e novos", 
    icon: Car, 
    multiplicador: 1.25, 
    tempoEstimado: 4,
    capacidade: 4,
    recursos: ["Ar condicionado", "Carregador", "Espacoso"]
  },
  { 
    id: "executivo", 
    nome: "Black", 
    descricao: "Premium e discreto", 
    icon: Crown, 
    multiplicador: 1.75, 
    tempoEstimado: 3,
    capacidade: 4,
    recursos: ["Luxo", "Agua", "WiFi", "Silencioso"]
  },
  { 
    id: "van", 
    nome: "Van", 
    descricao: "Para grupos", 
    icon: Truck, 
    multiplicador: 2.0, 
    tempoEstimado: 6,
    capacidade: 7,
    recursos: ["7 lugares", "Bagagem", "Ar condicionado"]
  },
];

const RECURSOS_ESPECIAIS = [
  { id: "pet", nome: "Pet Friendly", icon: Dog, extra: 5 },
  { id: "bebe", nome: "Cadeirinha", icon: Baby, extra: 0 },
  { id: "acessivel", nome: "Acessivel", icon: Accessibility, extra: 0 },
  { id: "silencio", nome: "Viagem Silenciosa", icon: Music, extra: 0 },
];

const LOCAIS_SALVOS = [
  { id: "1", nome: "Casa", endereco: "Endereço residencial em qualquer cidade do Brasil", icon: Home, tipo: "casa" },
  { id: "2", nome: "Trabalho", endereco: "Empresa, base operacional ou ponto comercial em todo o Brasil", icon: Briefcase, tipo: "trabalho" },
];

const LOCAIS_RECENTES = [
  { id: "1", endereco: "Aeroporto, rodoviária ou terminal em qualquer estado do Brasil", lat: -15.7939, lng: -47.8828 },
  { id: "2", endereco: "Base de locadora, garagem ou pátio de veículos em qualquer cidade", lat: -19.9167, lng: -43.9345 },
  { id: "3", endereco: "Cliente, empresa, hotel ou residência em território nacional", lat: -22.9068, lng: -43.1729 },
  { id: "4", endereco: "Mobilização ou desmobilização de veículos entre cidades e estados", lat: -3.7319, lng: -38.5267 },
];

// Precos de mercado (para comparacao)
const PRECOS_MERCADO = {
  concorrenciaA: 1.10, // 10% mais caro
  concorrenciaB: 1.08, // 8% mais caro
};

export default function SolicitarCorridaPage() {
  const [step, setStep] = useState<Step>("origem");
  const [origem, setOrigem] = useState<Location | null>(null);
  const [destino, setDestino] = useState<Location | null>(null);
  const [categoria, setCategoria] = useState<Category>(CATEGORIAS[1]); // Aurora Motoristas padrao
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "pix" | "cartao" | "saldo">("pix");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchType, setSearchType] = useState<"origem" | "destino">("origem");
  const [loading, setLoading] = useState(false);
  const [recursosEspeciais, setRecursosEspeciais] = useState<string[]>([]);
  const [showCodigoGrande, setShowCodigoGrande] = useState(false);
  const [contatosEmergencia, setContatosEmergencia] = useState<string[]>([]);
  const [rotaCompartilhada, setRotaCompartilhada] = useState(false);
  const [gravarViagem, setGravarViagem] = useState(false);

  // Dados da corrida
  const [distancia, setDistancia] = useState(0);
  const [duracao, setDuracao] = useState(0);
  const [preco, setPreco] = useState({ valorBase: 0, valorKm: 0, valorTempo: 0, valorTotal: 0, taxaPlataforma: 0, valorMotorista: 0 });
  const [precoMercado, setPrecoMercado] = useState(0);
  const [precoMercado2, setPrecoMercado2] = useState(0);

  // Motorista encontrado
  const [motorista, setMotorista] = useState<Driver | null>(null);
  const [codigoVerificacao, setCodigoVerificacao] = useState("");
  const [pinSeguranca, setPinSeguranca] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);
  const [avaliacaoMotorista, setAvaliacaoMotorista] = useState(0);
  const [comentarioAvaliacao, setComentarioAvaliacao] = useState("");
  const [gorjeta, setGorjeta] = useState(0);

  // Calcular preco quando origem e destino estao definidos
  useEffect(() => {
    if (origem && destino) {
      const dist = Math.random() * 15 + 3;
      const dur = Math.floor(dist * 2.5 + Math.random() * 10);
      setDistancia(Math.round(dist * 10) / 10);
      setDuracao(dur);

      const price = calculateRidePrice(dist, dur, categoria.id);
      const extraRecursos = recursosEspeciais.reduce((acc, r) => {
        const recurso = RECURSOS_ESPECIAIS.find(re => re.id === r);
        return acc + (recurso?.extra || 0);
      }, 0);
      
      const total = Math.round((price.valorTotal * categoria.multiplicador + extraRecursos) * 100) / 100;
      
      setPreco({
        ...price,
        valorTotal: total,
      });

      // Calcular precos de mercado (Aurora Motoristas e mais barato)
      setPrecoMercado(Math.round(total * PRECOS_MERCADO.concorrenciaA * 100) / 100);
      setPrecoMercado2(Math.round(total * PRECOS_MERCADO.concorrenciaB * 100) / 100);
    }
  }, [origem, destino, categoria, recursosEspeciais]);

  // Simulacao de busca por motorista
  useEffect(() => {
    if (step === "buscando") {
      const timer = setTimeout(() => {
        const placas = ["ABC-1D23", "XYZ-4E56", "MOV-0B78", "CAR-9F01"];
        const cores = ["Prata", "Preto", "Branco", "Cinza Grafite"];
        const modelos = ["Toyota Corolla", "Honda Civic", "Chevrolet Onix", "Volkswagen Virtus"];
        const marcas = ["Toyota", "Honda", "Chevrolet", "Volkswagen"];
        const anos = [2023, 2024, 2022, 2023];
        const nomes = ["Carlos Silva", "Maria Santos", "Joao Oliveira", "Ana Costa"];
        const idx = Math.floor(Math.random() * 4);

        setMotorista({
          id: `drv-${Math.random().toString(36).substr(2, 9)}`,
          nome: nomes[idx],
          foto: null,
          nota: 4.7 + Math.random() * 0.3,
          totalViagens: Math.floor(Math.random() * 5000) + 500,
          anosExperiencia: Math.floor(Math.random() * 5) + 1,
          verificado: true,
          veiculo: {
            modelo: modelos[idx],
            marca: marcas[idx],
            ano: anos[idx],
            cor: cores[idx],
            placa: placas[idx],
            foto: null,
          },
          telefone: "(11) 99999-" + Math.floor(1000 + Math.random() * 9000),
          tempoChegada: Math.floor(Math.random() * 5) + 2,
          distancia: Math.random() * 2 + 0.5,
          cancelamentos: Math.floor(Math.random() * 3),
          aceitacao: 95 + Math.floor(Math.random() * 5),
          documentosVerificados: true,
          antecedentesOk: true,
        });
        
        setCodigoVerificacao(Math.floor(1000 + Math.random() * 9000).toString());
        setPinSeguranca(Math.floor(100 + Math.random() * 900).toString());
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

  const handleIniciarCorrida = () => {
    setStep("em_corrida");
  };

  const handleFinalizarCorrida = () => {
    setStep("avaliacao");
  };

  const handleEnviarAvaliacao = () => {
    setStep("finalizada");
    setTimeout(() => {
      handleCancelar();
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoVerificacao);
  };

  const compartilharRota = () => {
    setRotaCompartilhada(true);
    setShowShareModal(false);
  };

  const economiaTotal = precoMercado - preco.valorTotal;
  const economiaPercentual = precoMercado > 0 ? Math.round((economiaTotal / precoMercado) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/50 px-4 py-3 safe-area-top">
        <div className="flex items-center justify-between">
          {step !== "origem" && step !== "buscando" && step !== "aceita" && step !== "em_corrida" && step !== "avaliacao" && step !== "finalizada" ? (
            <button
              onClick={() => {
                if (step === "destino") setStep("origem");
                else if (step === "categoria") setStep("origem");
                else if (step === "confirmacao") setStep("categoria");
              }}
              className="p-2 -ml-2 hover:bg-secondary rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          ) : (
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl gradient-premium flex items-center justify-center shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-black text-2xl gradient-text tracking-tight">Aurora Motoristas</span>
                <div className="flex items-center gap-1 -mt-0.5">
                  <span className="text-[9px] text-muted-foreground tracking-[0.2em] font-medium">RIDE</span>
                  <Sparkles className="w-2.5 h-2.5 text-primary" />
                </div>
              </div>
            </Link>
          )}

          <div className="flex items-center gap-2">
            {(step === "aceita" || step === "em_corrida") && (
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="p-2.5 bg-success/10 rounded-xl border border-success/20"
              >
                <ShieldCheck className="w-5 h-5 text-success" />
              </button>
            )}
            <button className="p-2.5 bg-secondary rounded-xl relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-white flex items-center justify-center">2</span>
            </button>
            <Link href="/perfil" className="p-2.5 bg-secondary rounded-xl">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Map Placeholder */}
      <div className="relative h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
        </div>
        
        {/* Animated route line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          {origem && destino && (
            <>
              <path
                d="M 80 150 Q 200 50 320 120"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 5"
                className="animate-pulse"
              />
              <circle cx="80" cy="150" r="8" fill="#8b5cf6" className="animate-pulse" />
              <circle cx="320" cy="120" r="8" fill="#06b6d4" className="animate-pulse" />
            </>
          )}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/50">
            <MapPinned className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Mapa em tempo real</p>
          </div>
        </div>

        {/* Current location button */}
        <button className="absolute bottom-4 right-4 w-12 h-12 glass-card rounded-2xl shadow-lg flex items-center justify-center border border-white/10">
          <Target className="w-6 h-6 text-primary" />
        </button>

        {/* Safety badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 glass-card rounded-full border border-success/20">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Viagem Protegida</span>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-card rounded-t-[2rem] -mt-6 relative z-10 min-h-[55vh] shadow-2xl border-t border-border/50">
        <div className="w-12 h-1.5 bg-border rounded-full mx-auto mt-3 mb-4" />

        {/* Initial State - Origem */}
        {(step === "origem" || step === "destino" || step === "categoria") && !showSearchModal && (
          <div className="px-4 pb-6 space-y-4">
            {/* Location Inputs */}
            <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 border border-border/50">
              <button
                onClick={() => {
                  setSearchType("origem");
                  setShowSearchModal(true);
                }}
                className="w-full flex items-center gap-3 text-left group"
              >
                <div className="w-11 h-11 gradient-premium rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">ORIGEM</p>
                  <p className={`font-semibold ${origem ? "text-foreground" : "text-muted-foreground"}`}>
                    {origem?.endereco || "Informe a origem em qualquer cidade do Brasil"}
                  </p>
                </div>
                {origem && <CheckCircle className="w-5 h-5 text-success" />}
              </button>

              <div className="h-px bg-border/50 ml-14" />

              <button
                onClick={() => {
                  setSearchType("destino");
                  setShowSearchModal(true);
                }}
                className="w-full flex items-center gap-3 text-left group"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">DESTINO</p>
                  <p className={`font-semibold ${destino ? "text-foreground" : "text-muted-foreground"}`}>
                    {destino?.endereco || "Informe o destino em qualquer região do Brasil"}
                  </p>
                </div>
                {destino && <CheckCircle className="w-5 h-5 text-success" />}
              </button>
            </div>

            {/* Saved Locations */}
            <div className="flex gap-3">
              {LOCAIS_SALVOS.map((local) => (
                <button
                  key={local.id}
                  onClick={() => handleSelectLocation(local.endereco, -23.55, -46.63)}
                  className="flex-1 flex items-center gap-2.5 p-3.5 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors border border-border/50"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                    <local.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm">{local.nome}</p>
                    <p className="text-xs text-muted-foreground truncate">{local.endereco}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Categories */}
            {origem && destino && step === "categoria" && (
              <>
                {/* Price Comparison Banner */}
                <div className="bg-gradient-to-r from-success/10 via-success/5 to-emerald-500/10 rounded-2xl p-4 border border-success/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-success">Economize ate {economiaPercentual}%!</p>
                      <p className="text-sm text-muted-foreground">
                        Aurora Motoristas: <span className="font-bold text-foreground">{formatCurrency(preco.valorTotal)}</span>
                        {" "}vs mercado: <span className="line-through text-muted-foreground">{formatCurrency(precoMercado)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Voce economiza</p>
                      <p className="font-bold text-success text-lg">{formatCurrency(economiaTotal)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Escolha seu Aurora Motoristas</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Taxa de apenas 5%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {CATEGORIAS.map((cat) => {
                    const catPrice = calculateRidePrice(distancia, duracao, cat.id);
                    const finalPrice = Math.round(catPrice.valorTotal * cat.multiplicador * 100) / 100;
                    const mercadoPrice = Math.round(finalPrice * PRECOS_MERCADO.concorrenciaA * 100) / 100;

                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoria(cat)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                          categoria.id === cat.id
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-border/50 bg-card hover:border-primary/30"
                        }`}
                      >
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                            categoria.id === cat.id 
                              ? "gradient-premium shadow-lg" 
                              : "bg-secondary"
                          }`}
                        >
                          <cat.icon
                            className={`w-7 h-7 ${
                              categoria.id === cat.id ? "text-white" : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{cat.nome}</p>
                            {cat.id === "executivo" && (
                              <Crown className="w-4 h-4 text-warning" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{cat.descricao}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cat.tempoEstimado} min
                            </span>
                            <span className="text-xs bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {cat.capacidade}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black gradient-text">{formatCurrency(finalPrice)}</p>
<p className="text-xs text-muted-foreground line-through">{formatCurrency(mercadoPrice)}</p>
                <p className="text-xs text-success font-medium">-{Math.round((1 - finalPrice/mercadoPrice) * 100)}%</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Recursos Especiais */}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-2">RECURSOS ESPECIAIS</h4>
                  <div className="flex flex-wrap gap-2">
                    {RECURSOS_ESPECIAIS.map((recurso) => {
                      const ativo = recursosEspeciais.includes(recurso.id);
                      return (
                        <button
                          key={recurso.id}
                          onClick={() => {
                            if (ativo) {
                              setRecursosEspeciais(recursosEspeciais.filter(r => r !== recurso.id));
                            } else {
                              setRecursosEspeciais([...recursosEspeciais, recurso.id]);
                            }
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                            ativo
                              ? "border-primary bg-primary/10"
                              : "border-border/50 hover:border-primary/30"
                          }`}
                        >
                          <recurso.icon className={`w-4 h-4 ${ativo ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-sm font-medium">{recurso.nome}</span>
                          {recurso.extra > 0 && (
                            <span className="text-xs text-muted-foreground">+{formatCurrency(recurso.extra)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method */}
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-border/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {formaPagamento === "dinheiro" && <Banknote className="w-6 h-6 text-success" />}
                    {formaPagamento === "pix" && <Zap className="w-6 h-6 text-primary" />}
                    {formaPagamento === "cartao" && <CreditCard className="w-6 h-6 text-warning" />}
                    {formaPagamento === "saldo" && <Wallet className="w-6 h-6 text-cyan-500" />}
                    <div>
                      <span className="font-semibold capitalize">{formaPagamento}</span>
                      {formaPagamento === "pix" && (
                        <p className="text-xs text-success">5% de cashback</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Confirm Button */}
                <button
                  onClick={() => setStep("confirmacao")}
                  className="w-full py-4 gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-2">
                    Continuar
                    <span className="px-2 py-0.5 bg-white/20 rounded-lg text-sm">{formatCurrency(preco.valorTotal)}</span>
                  </span>
                </button>
              </>
            )}

            {/* Recent Locations */}
            {!origem && !destino && (
              <div>
                <h3 className="font-bold text-foreground mb-3">Locais recentes</h3>
                <div className="space-y-2">
                  {LOCAIS_RECENTES.map((local) => (
                    <button
                      key={local.id}
                      onClick={() => {
                        setSearchType("destino");
                        handleSelectLocation(local.endereco, local.lat, local.lng);
                      }}
                      className="w-full flex items-center gap-3 p-3.5 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors border border-border/50"
                    >
                      <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                        <History className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="flex-1 text-left font-medium">{local.endereco}</span>
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
            <h2 className="text-xl font-black text-center gradient-text">Confirmar Viagem</h2>

            <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 gradient-premium rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">ORIGEM</p>
                  <p className="font-semibold">{origem?.endereco}</p>
                </div>
              </div>

              <div className="h-px bg-border/50 ml-12" />

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Flag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">DESTINO</p>
                  <p className="font-semibold">{destino?.endereco}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
                <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="font-bold">{duracao} min</p>
                <p className="text-xs text-muted-foreground">Duracao</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
                <MapPin className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
                <p className="font-bold">{distancia} km</p>
                <p className="text-xs text-muted-foreground">Distancia</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 text-center border border-primary/20">
                <categoria.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="font-bold">{categoria.nome}</p>
                <p className="text-xs text-muted-foreground">Categoria</p>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor base</span>
                  <span>{formatCurrency(preco.valorBase)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Distancia ({distancia} km)</span>
                  <span>{formatCurrency(preco.valorKm)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tempo ({duracao} min)</span>
                  <span>{formatCurrency(preco.valorTempo)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Taxa Aurora Motoristas 
                    <span className="text-xs text-success font-medium">(apenas 5%)</span>
                  </span>
                  <span>{formatCurrency(preco.taxaPlataforma)}</span>
                </div>
              </div>
              <div className="h-px bg-border my-3" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-black text-xl gradient-text">{formatCurrency(preco.valorTotal)}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-sm text-success">
                <TrendingDown className="w-4 h-4" />
                <span>Economizando {formatCurrency(economiaTotal)} vs mercado</span>
              </div>
            </div>

            {/* Security Features */}
            <div className="bg-gradient-to-br from-success/10 to-emerald-500/5 rounded-2xl p-4 border border-success/20">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-success" />
                <h3 className="font-bold text-success">Seguranca Aurora Motoristas</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: BadgeCheck, text: "Motorista verificado" },
                  { icon: Fingerprint, text: "Identidade confirmada" },
                  { icon: Video, text: "Viagem gravada" },
                  { icon: Share2, text: "Compartilhar rota" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <item.icon className="w-4 h-4 text-success" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirmarCorrida}
              disabled={loading}
              className="w-full py-4 gradient-premium text-white font-bold rounded-2xl shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Solicitando...
                </>
              ) : (
                <>
                  <Car className="w-5 h-5" />
                  Solicitar {categoria.nome}
                </>
              )}
            </button>
          </div>
        )}

        {/* Searching for Driver */}
        {step === "buscando" && (
          <div className="px-4 pb-6 text-center">
            <div className="py-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full gradient-premium animate-ping opacity-25" />
                <div className="absolute inset-2 rounded-full gradient-premium animate-pulse opacity-50" />
                <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center">
                  <Car className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-black mb-2">Buscando motorista</h2>
              <p className="text-muted-foreground">Encontrando o melhor motorista verificado para voce...</p>

              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full gradient-premium animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { icon: ShieldCheck, label: "Verificando" },
                  { icon: BadgeCheck, label: "Documentos" },
                  { icon: Star, label: "Avaliacao" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <item.icon className="w-5 h-5 text-primary animate-pulse" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCancelar}
              className="w-full py-4 bg-secondary text-foreground font-semibold rounded-2xl"
            >
              Cancelar busca
            </button>
          </div>
        )}

        {/* Driver Found */}
        {step === "aceita" && motorista && (
          <div className="px-4 pb-6 space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-4 border border-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="font-bold text-success">Motorista encontrado!</span>
              </div>
            </div>

            {/* Driver Card */}
            <div className="bg-card rounded-2xl border border-border p-4 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 gradient-premium rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  {motorista.verificado && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center border-2 border-card">
                      <Verified className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black">{motorista.nome}</h3>
                    {motorista.verificado && <BadgeCheck className="w-5 h-5 text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-bold">{motorista.nota.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{motorista.totalViagens.toLocaleString()} viagens</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black gradient-text">{formatTime(tempoRestante)}</p>
                  <p className="text-xs text-muted-foreground">chegada</p>
                </div>
              </div>

              {/* Vehicle Info - PLACA EM DESTAQUE */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-4 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">{motorista.veiculo.marca} {motorista.veiculo.modelo}</p>
                    <p className="text-sm text-muted-foreground">{motorista.veiculo.cor} - {motorista.veiculo.ano}</p>
                  </div>
                  <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                
                {/* PLACA GRANDE E VISIVEL */}
                <div className="bg-card rounded-xl p-3 border-2 border-warning/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-warning via-yellow-400 to-warning" />
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">PLACA DO VEICULO</p>
                    <p className="text-3xl font-black font-mono tracking-widest text-warning">{motorista.veiculo.placa}</p>
                    <p className="text-xs text-muted-foreground mt-1">Confira a placa antes de entrar</p>
                  </div>
                </div>
              </div>

              {/* Verification Code - CODIGO DE SEGURANCA */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-cyan-500/10 rounded-xl p-4 text-center mb-4 border border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                <div className="relative">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground font-medium">CODIGO DE VERIFICACAO</p>
                    <button onClick={copiarCodigo} className="p-1 hover:bg-primary/20 rounded">
                      <Copy className="w-3.5 h-3.5 text-primary" />
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowCodigoGrande(!showCodigoGrande)}
                    className="w-full"
                  >
                    <p className={`font-mono font-black tracking-[0.3em] gradient-text transition-all ${showCodigoGrande ? "text-5xl" : "text-4xl"}`}>
                      {codigoVerificacao}
                    </p>
                  </button>
                  <p className="text-xs text-muted-foreground mt-2">
                    O motorista deve informar este codigo para iniciar a viagem
                  </p>
                </div>
              </div>

              {/* PIN de Seguranca Adicional */}
              <div className="bg-success/10 rounded-xl p-3 flex items-center justify-between border border-success/20">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">PIN de Seguranca</p>
                    <p className="text-xs text-muted-foreground">Confirme com o motorista</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xl text-success">{pinSeguranca}</span>
                  <button onClick={() => setShowCodigoGrande(!showCodigoGrande)}>
                    {showCodigoGrande ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <a
                  href={`tel:${motorista.telefone}`}
                  className="flex flex-col items-center gap-1 py-3 gradient-premium text-white rounded-xl font-semibold"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-xs">Ligar</span>
                </a>
                <button className="flex flex-col items-center gap-1 py-3 bg-secondary text-foreground rounded-xl font-semibold">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">Chat</span>
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="flex flex-col items-center gap-1 py-3 bg-secondary text-foreground rounded-xl font-semibold"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-xs">Compartilhar</span>
                </button>
              </div>
            </div>

            {/* Driver Stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Award, value: `${motorista.anosExperiencia}+`, label: "Anos" },
                { icon: CheckCircle, value: `${motorista.aceitacao}%`, label: "Aceita" },
                { icon: ShieldCheck, value: "OK", label: "Docs", color: "text-success" },
                { icon: Fingerprint, value: "OK", label: "Antec.", color: "text-success" },
              ].map((stat, i) => (
                <div key={i} className="bg-secondary/50 rounded-xl p-2.5 text-center border border-border/50">
                  <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color || "text-primary"}`} />
                  <p className="font-bold text-sm">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Route Info */}
            <div className="bg-secondary/50 rounded-2xl p-4 space-y-3 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 gradient-premium rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ORIGEM</p>
                  <p className="font-medium text-sm">{origem?.endereco}</p>
                </div>
              </div>

              <div className="h-px bg-border/50 ml-11" />

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">DESTINO</p>
                  <p className="font-medium text-sm">{destino?.endereco}</p>
                </div>
              </div>
            </div>

            {/* Safety Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setRotaCompartilhada(true);
                  setShowShareModal(true);
                }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  rotaCompartilhada 
                    ? "bg-success/10 text-success border border-success/20" 
                    : "bg-secondary"
                }`}
              >
                <Share2 className="w-5 h-5" />
                {rotaCompartilhada ? "Rota Compartilhada" : "Compartilhar Rota"}
              </button>
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="flex items-center justify-center gap-2 py-3 bg-destructive/10 text-destructive rounded-xl font-semibold border border-destructive/20"
              >
                <AlertTriangle className="w-5 h-5" />
                Emergencia
              </button>
            </div>

            {/* Gravar viagem toggle */}
            <button
              onClick={() => setGravarViagem(!gravarViagem)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                gravarViagem 
                  ? "bg-primary/10 border-primary/20" 
                  : "bg-secondary/50 border-border/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className={`w-5 h-5 ${gravarViagem ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-left">
                  <p className="font-semibold">Gravar viagem</p>
                  <p className="text-xs text-muted-foreground">Audio gravado para sua seguranca</p>
                </div>
              </div>
              <div className={`w-12 h-7 rounded-full transition-all ${gravarViagem ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 bg-white rounded-full mt-1 transition-all ${gravarViagem ? "ml-6" : "ml-1"}`} />
              </div>
            </button>

            {/* Simular chegada do motorista */}
            <button
              onClick={handleIniciarCorrida}
              className="w-full py-4 gradient-premium text-white font-bold rounded-2xl shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Motorista chegou - Iniciar viagem
              </span>
            </button>

            <button
              onClick={handleCancelar}
              className="w-full py-3 text-destructive font-medium"
            >
              Cancelar corrida
            </button>
          </div>
        )}

        {/* Em Corrida */}
        {step === "em_corrida" && motorista && (
          <div className="px-4 pb-6 space-y-4">
            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-bold text-primary">Viagem em andamento</span>
              </div>
            </div>

            {/* Live Trip Card */}
            <div className="bg-gradient-to-br from-primary/5 to-cyan-500/5 rounded-2xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-premium rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold">{motorista.nome}</p>
                    <p className="text-sm text-muted-foreground">{motorista.veiculo.placa}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black gradient-text">{duracao} min</p>
                  <p className="text-xs text-muted-foreground">restantes</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-4">
                <div className="absolute inset-y-0 left-0 w-1/3 gradient-premium rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {distancia} km restantes
                </div>
                <div className="flex items-center gap-1 text-success">
                  <ShieldCheck className="w-4 h-4" />
                  Viagem protegida
                </div>
              </div>
            </div>

            {/* Route */}
            <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <Flag className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-xs text-muted-foreground">DESTINO</p>
                  <p className="font-semibold">{destino?.endereco}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg gradient-text">{formatCurrency(preco.valorTotal)}</span>
                <span className="text-sm text-muted-foreground capitalize">{formaPagamento}</span>
              </div>
            </div>

            {/* Safety Features Active */}
            <div className="grid grid-cols-2 gap-3">
              {gravarViagem && (
                <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Video className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium">Gravando</span>
                </div>
              )}
              {rotaCompartilhada && (
                <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-xl border border-success/20">
                  <Share2 className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium">Compartilhada</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${motorista.telefone}`} className="flex flex-col items-center gap-1 py-3 bg-secondary rounded-xl">
                <Phone className="w-5 h-5" />
                <span className="text-xs">Ligar</span>
              </a>
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex flex-col items-center gap-1 py-3 bg-secondary rounded-xl"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs">Compartilhar</span>
              </button>
              <button 
                onClick={() => setShowSecurityModal(true)}
                className="flex flex-col items-center gap-1 py-3 bg-destructive/10 text-destructive rounded-xl"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">SOS</span>
              </button>
            </div>

            {/* Simular fim da viagem */}
            <button
              onClick={handleFinalizarCorrida}
              className="w-full py-4 gradient-premium text-white font-bold rounded-2xl shadow-lg"
            >
              Chegamos ao destino
            </button>
          </div>
        )}

        {/* Avaliacao */}
        {step === "avaliacao" && motorista && (
          <div className="px-4 pb-6 space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 gradient-premium rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl font-black">Viagem concluida!</h2>
              <p className="text-muted-foreground">Avalie sua experiencia com {motorista.nome}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setAvaliacaoMotorista(star)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-10 h-10 ${
                      star <= avaliacaoMotorista 
                        ? "fill-warning text-warning" 
                        : "text-muted-foreground"
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              value={comentarioAvaliacao}
              onChange={(e) => setComentarioAvaliacao(e.target.value)}
              placeholder="Deixe um comentario (opcional)..."
              className="w-full p-4 bg-secondary rounded-2xl border border-border resize-none h-24 focus:border-primary outline-none"
            />

            {/* Tip */}
            <div>
              <p className="font-semibold mb-2">Dar gorjeta ao motorista?</p>
              <div className="flex gap-2">
                {[0, 2, 5, 10].map((valor) => (
                  <button
                    key={valor}
                    onClick={() => setGorjeta(valor)}
                    className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                      gorjeta === valor
                        ? "gradient-premium text-white"
                        : "bg-secondary"
                    }`}
                  >
                    {valor === 0 ? "Nao" : formatCurrency(valor)}
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Corrida</span>
                <span>{formatCurrency(preco.valorTotal)}</span>
              </div>
              {gorjeta > 0 && (
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Gorjeta</span>
                  <span className="text-success">{formatCurrency(gorjeta)}</span>
                </div>
              )}
              <div className="h-px bg-border my-2" />
              <div className="flex items-center justify-between">
                <span className="font-bold">Total pago</span>
                <span className="font-black text-lg gradient-text">{formatCurrency(preco.valorTotal + gorjeta)}</span>
              </div>
            </div>

            <button
              onClick={handleEnviarAvaliacao}
              disabled={avaliacaoMotorista === 0}
              className="w-full py-4 gradient-premium text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
            >
              Enviar avaliacao
            </button>
          </div>
        )}

        {/* Finalizada */}
        {step === "finalizada" && (
          <div className="px-4 pb-6 text-center py-12">
            <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-2xl font-black mb-2">Obrigado!</h2>
            <p className="text-muted-foreground mb-6">Sua avaliacao foi enviada com sucesso</p>
            <p className="text-sm text-muted-foreground">Redirecionando...</p>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSearchModal(false)} className="p-2 -ml-2 hover:bg-secondary rounded-xl">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === "origem" ? "Informe a origem em qualquer cidade do Brasil" : "Informe o destino em qualquer região do Brasil"}
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-border focus:border-primary outline-none font-medium"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {searchType === "origem" && (
                <button
                  onClick={() => handleSelectLocation("Minha localização atual em todo o Brasil", -23.55, -46.63)}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-cyan-500/10 rounded-xl mb-4 border border-primary/20"
                >
                  <div className="w-10 h-10 gradient-premium rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-primary">Usar localizacao atual</p>
                    <p className="text-sm text-muted-foreground">GPS ativado - Alta precisao</p>
                  </div>
                </button>
              )}

              <h3 className="text-sm font-bold text-muted-foreground mb-3">SALVOS</h3>
              <div className="space-y-2 mb-6">
                {LOCAIS_SALVOS.map((local) => (
                  <button
                    key={local.id}
                    onClick={() => handleSelectLocation(local.endereco, -23.55, -46.63)}
                    className="w-full flex items-center gap-3 p-3.5 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <local.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{local.nome}</p>
                      <p className="text-sm text-muted-foreground">{local.endereco}</p>
                    </div>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold text-muted-foreground mb-3">RECENTES</h3>
              <div className="space-y-2">
                {LOCAIS_RECENTES.map((local) => (
                  <button
                    key={local.id}
                    onClick={() => handleSelectLocation(local.endereco, local.lat, local.lng)}
                    className="w-full flex items-center gap-3 p-3.5 hover:bg-secondary rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                      <History className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-left font-medium">{local.endereco}</span>
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
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 safe-area-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Forma de pagamento</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 -mr-2 hover:bg-secondary rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { id: "pix", label: "PIX", desc: "5% de cashback", icon: Zap, color: "text-primary", badge: "Recomendado" },
                { id: "saldo", label: "Saldo Aurora Motoristas", desc: "R$ 150,00 disponivel", icon: Wallet, color: "text-cyan-500" },
                { id: "cartao", label: "Cartao", desc: "Credito ou debito", icon: CreditCard, color: "text-warning" },
                { id: "dinheiro", label: "Dinheiro", desc: "Pague ao motorista", icon: Banknote, color: "text-success" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setFormaPagamento(opt.id as typeof formaPagamento);
                    setShowPaymentModal(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    formaPagamento === opt.id
                      ? "border-primary bg-primary/5"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    formaPagamento === opt.id ? "gradient-premium" : "bg-secondary"
                  }`}>
                    <opt.icon className={`w-6 h-6 ${formaPagamento === opt.id ? "text-white" : opt.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-bold">{opt.label}</p>
                      {opt.badge && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">{opt.badge}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  {formaPagamento === opt.id && <CheckCircle className="w-6 h-6 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-xl font-black">Central de Seguranca</h3>
              </div>
              <button onClick={() => setShowSecurityModal(false)} className="p-2 -mr-2 hover:bg-secondary rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3">
              <a
                href="tel:190"
                className="flex items-center gap-4 p-4 bg-destructive/10 rounded-2xl border border-destructive/20"
              >
                <AlertTriangle className="w-6 h-6 text-destructive" />
                <div className="flex-1">
                  <p className="font-bold text-destructive">Ligar para Policia (190)</p>
                  <p className="text-sm text-muted-foreground">Emergencia policial</p>
                </div>
                <PhoneCall className="w-5 h-5 text-destructive" />
              </a>

              <a
                href="tel:192"
                className="flex items-center gap-4 p-4 bg-warning/10 rounded-2xl border border-warning/20"
              >
                <AlertCircle className="w-6 h-6 text-warning" />
                <div className="flex-1">
                  <p className="font-bold text-warning">SAMU (192)</p>
                  <p className="text-sm text-muted-foreground">Emergencia medica</p>
                </div>
                <PhoneCall className="w-5 h-5 text-warning" />
              </a>

              <button
                onClick={() => {
                  setRotaCompartilhada(true);
                  setShowSecurityModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 bg-secondary rounded-2xl"
              >
                <Share2 className="w-6 h-6 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-bold">Compartilhar rota</p>
                  <p className="text-sm text-muted-foreground">Envie sua localizacao em tempo real</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setGravarViagem(true);
                  setShowSecurityModal(false);
                }}
                className="w-full flex items-center gap-4 p-4 bg-secondary rounded-2xl"
              >
                <Video className="w-6 h-6 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-bold">Gravar viagem</p>
                  <p className="text-sm text-muted-foreground">Audio gravado para seguranca</p>
                </div>
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Sua seguranca e nossa prioridade. Todas as viagens sao monitoradas 24h.
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-6 safe-area-bottom">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">Compartilhar viagem</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 -mr-2 hover:bg-secondary rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-muted-foreground mb-4">
              Compartilhe sua rota em tempo real com amigos e familiares para maior seguranca.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { name: "WhatsApp", color: "bg-green-500" },
                { name: "SMS", color: "bg-blue-500" },
                { name: "Email", color: "bg-orange-500" },
                { name: "Copiar", color: "bg-gray-500" },
              ].map((app) => (
                <button
                  key={app.name}
                  onClick={compartilharRota}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`w-14 h-14 ${app.color} rounded-2xl flex items-center justify-center`}>
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium">{app.name}</span>
                </button>
              ))}
            </div>

            {rotaCompartilhada && (
              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-xl border border-success/20">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-success">Rota compartilhada com sucesso!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


