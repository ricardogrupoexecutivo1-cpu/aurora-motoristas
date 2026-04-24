"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import InstallPWA from "@/components/install-pwa";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bike,
  Bot,
  Briefcase,
  Building2,
  Camera,
  Car,
  CheckCircle,
  ChevronRight,
  Crown,
  FileText,
  Globe,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Mic,
  Navigation,
  Package,
  PackageCheck,
  Percent,
  PhoneCall,
  Play,
  Rocket,
  Send,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
  UserCircle,
  Users,
  Wallet,
  X,
  AlertTriangle,
  Share2,
  ArrowDownUp,
  MapPinned,
  Clock,
  Gift,
  CreditCard,
  Bell,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");

  const [stats, setStats] = useState({
    corridas: 0,
    entregas: 0,
    motoristas: 0,
    clientes: 0,
    avaliacao: 0,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const targets = {
      corridas: 2847523,
      entregas: 1523847,
      motoristas: 45780,
      clientes: 892341,
      avaliacao: 4.9,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        corridas: Math.floor(targets.corridas * easeOut),
        entregas: Math.floor(targets.entregas * easeOut),
        motoristas: Math.floor(targets.motoristas * easeOut),
        clientes: Math.floor(targets.clientes * easeOut),
        avaliacao: Math.round(targets.avaliacao * easeOut * 10) / 10,
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const chatSugestoes = [
    "Como pedir uma corrida?",
    "Como enviar uma entrega?",
    "Como ser motorista parceiro?",
    "Como acessar minha empresa?",
  ];

  const plataformas = [
    {
      href: "/solicitar",
      titulo: "Aurora Ride",
      subtitulo: "Transporte de passageiros",
      badge: "MAIS POPULAR",
      icon: Car,
      cta: "Para onde?",
      destaque: "bg-gradient-to-br from-ride-black via-gray-900 to-gray-800",
      card: "text-white",
      features: [
        "Moto, carro, conforto, black e van",
        "GPS em tempo real",
        "Preço competitivo",
        "Segurança total",
      ],
    },
    {
      href: "/entregas",
      titulo: "Aurora Express",
      subtitulo: "Busca e entrega em todo Brasil",
      badge: "TODO BRASIL",
      icon: Package,
      cta: "O que enviar?",
      destaque: "bg-gradient-to-br from-silicon-orange via-orange-500 to-warning",
      card: "text-white",
      features: [
        "Buscar + entregar",
        "Só buscar ou só entregar",
        "Moto, carro, van e caminhão",
        "Rastreio em tempo real",
      ],
    },
    {
      href: "/login",
      titulo: "Aurora Business",
      subtitulo: "Gestão empresarial protegida",
      badge: "ACESSO Ambiente seguro",
      icon: Briefcase,
      cta: "Entrar com segurança",
      destaque: "gradient-premium",
      card: "text-white",
      features: [
        "Cotações automáticas",
        "Controle de serviços",
        "Dashboard completo",
        "IA para otimizar operação",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl gradient-premium flex items-center justify-center shadow-lg neon-primary group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
              </div>

              <div>
                <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight gradient-text">
                  Aurora Motoristas
                </span>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] -mt-1 hidden sm:block">
                  MOBILIDADE DO FUTURO
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "#plataformas", label: "Serviços" },
                { href: "#motoristas", label: "Seja parceiro" },
                { href: "#empresas", label: "Empresas" },
                { href: "#seguranca", label: "Segurança" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex px-5 py-2.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Entrar
              </Link>

              <Link
                href="/cadastro"
                className="px-5 lg:px-7 py-2.5 lg:py-3 text-sm font-bold text-white gradient-premium rounded-xl btn-premium shadow-xl"
              >
                Começar agora
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-background/98 backdrop-blur-2xl" />

          <div className="relative h-full flex flex-col p-6 safe-area-top">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl gradient-premium flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">Aurora Motoristas</span>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {[
                { href: "/solicitar", label: "Pedir corrida", icon: Car, desc: "Transporte de passageiros" },
                { href: "/entregas", label: "Enviar entrega", icon: Package, desc: "Busca e entrega Brasil" },
                { href: "/motoristas/cadastrar", label: "Ser parceiro", icon: TrendingUp, desc: "Cadastro de motorista" },
                { href: "/cadastro", label: "Criar conta", icon: UserCircle, desc: "Grátis e rápido" },
                { href: "/login", label: "Área segura", icon: Lock, desc: "Empresas, motoristas e admin" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold">{item.label}</span>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <Link href="/login" className="w-full py-4 bg-secondary rounded-xl font-semibold text-center block">
                Entrar na minha conta
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="relative min-h-screen flex items-center pt-20 lg:pt-0">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-silicon-pink/20 rounded-full blur-[120px] animate-float-slow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-success/10 border border-success/30 rounded-full mb-8">
              <Crown className="w-4 h-4 text-success" />
              <span className="text-sm font-bold text-success">
                Taxa de apenas 5% para parceiros
              </span>
              <Sparkles className="w-4 h-4 text-success" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-balance">
              <span className="text-foreground">Transporte.</span>
              <br />
              <span className="gradient-text">Entregas.</span>
              <br />
              <span className="text-foreground">Gestão.</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              A Aurora Motoristas une mobilidade, entregas e gestão empresarial em uma plataforma preparada para operar em todo o Brasil com segurança, tecnologia e atendimento inteligente.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Operação Brasil</span>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <span className="text-sm font-medium">{stats.avaliacao}</span>
              </div>

              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">Ambiente Ambiente seguro</span>
              </div>
            </div>
          </div>

          <div id="plataformas" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plataformas.map((item) => (
              <Link key={item.titulo} href={item.href} className="group relative">
                <div className={`absolute inset-0 ${item.destaque} rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] bg-white/10" />

                <div className={`relative p-6 lg:p-8 ${item.card}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur rounded-full mb-5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-white">{item.badge}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                      <item.icon className="w-7 h-7 text-black" />
                    </div>

                    <div>
                      <h2 className="text-xl lg:text-2xl font-black text-white">{item.titulo}</h2>
                      <p className="text-white/75 text-sm">{item.subtitulo}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-6">
                    {item.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/85 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl group-hover:bg-white/20 transition-colors">
                    <span className="text-white font-medium">{item.cta}</span>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {[
              { value: formatNumber(stats.corridas), label: "Corridas", icon: Car, color: "text-primary" },
              { value: formatNumber(stats.entregas), label: "Entregas", icon: Package, color: "text-silicon-orange" },
              { value: formatNumber(stats.motoristas), label: "Parceiros", icon: Users, color: "text-success" },
              { value: formatNumber(stats.clientes), label: "Usuários", icon: Globe, color: "text-silicon-cyan" },
              { value: "5%", label: "Taxa parceiro", icon: Percent, color: "text-warning" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <p className="text-2xl lg:text-3xl font-black text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-silicon-orange/10 rounded-full mb-4">
              <Package className="w-4 h-4 text-silicon-orange" />
              <span className="text-sm font-semibold text-silicon-orange">Aurora Express</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Busca e entrega em todo Brasil
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha buscar, entregar ou fazer ida e volta. Uma solução flexível para pessoas, empresas, documentos, compras e encomendas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: ArrowDownUp,
                title: "Buscar e entregar",
                desc: "Buscamos no endereço A e entregamos no B.",
                color: "bg-silicon-orange",
              },
              {
                icon: MapPinned,
                title: "Apenas buscar",
                desc: "Buscamos no local indicado e levamos até você.",
                color: "bg-success",
              },
              {
                icon: Send,
                title: "Apenas entregar",
                desc: "Coletamos com você e entregamos no destino.",
                color: "bg-primary",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group">
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Bike, name: "Moto", desc: "Até 10kg", time: "Mais rápido" },
              { icon: Car, name: "Carro", desc: "Até 50kg", time: "Econômico" },
              { icon: Truck, name: "Van", desc: "Até 300kg", time: "Volumes grandes" },
              { icon: Package, name: "Caminhão", desc: "Até 3 ton", time: "Mudanças e cargas" },
            ].map((vehicle) => (
              <div key={vehicle.name} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                <vehicle.icon className="w-8 h-8 mx-auto mb-2 text-silicon-orange" />
                <p className="font-bold">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">{vehicle.desc}</p>
                <p className="text-xs text-success">{vehicle.time}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/entregas"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl hover:shadow-xl transition-shadow"
            >
              <Package className="w-5 h-5" />
              Enviar agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="seguranca" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">SEGURANÇA TOTAL</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Segurança como prioridade
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A experiência pública apresenta os serviços. Áreas de operação, painel, motoristas e administração ficam protegidas por login.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, title: "Verificação completa", desc: "Motoristas e parceiros passam por validação." },
              { icon: MapPin, title: "GPS em tempo real", desc: "Acompanhe corrida ou entrega no mapa." },
              { icon: Lock, title: "Área protegida", desc: "Painéis internos só via login Ambiente seguro." },
              { icon: AlertTriangle, title: "Botão SOS", desc: "Camada de emergência e suporte." },
              { icon: Camera, title: "Foto do pacote", desc: "Registro visual para comprovação." },
              { icon: Star, title: "Avaliação dupla", desc: "Qualidade monitorada por cliente e parceiro." },
              { icon: Share2, title: "Compartilhar rota", desc: "Envio de localização para confiança." },
              { icon: Mic, title: "Áudio de segurança", desc: "Opção de registro durante viagem." },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl bg-background border border-border hover:border-success/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="motoristas" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">SEJA PARCEIRO</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black mb-6">
                Ganhe mais com uma taxa competitiva
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Na Aurora Motoristas, o parceiro tem uma proposta simples: taxa de apenas 5%, rotina flexível e oportunidade de atender corridas, entregas e serviços empresariais.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Percent, text: "Taxa de apenas 5%" },
                  { icon: Wallet, text: "Recebimento via PIX conforme regra operacional" },
                  { icon: Clock, text: "Horários flexíveis" },
                  { icon: Gift, text: "Campanhas e incentivos" },
                  { icon: Shield, text: "Camada de segurança para parceiros" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/motoristas/cadastrar"
                className="inline-flex items-center gap-3 px-8 py-4 gradient-premium text-white font-bold rounded-xl btn-premium shadow-xl"
              >
                Quero ser parceiro
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-bold mb-6 text-center">Simulador ilustrativo</h3>

              <div className="space-y-6">
                <div className="text-center p-6 rounded-xl bg-secondary">
                  <p className="text-sm text-muted-foreground mb-2">Exemplo com rotina ativa</p>
                  <p className="text-4xl font-black gradient-text">R$ 8.500</p>
                  <p className="text-sm text-muted-foreground">estimativa mensal bruta</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-success/10 text-center">
                    <p className="text-2xl font-bold text-success">95%</p>
                    <p className="text-xs text-muted-foreground">Parceiro</p>
                  </div>

                  <div className="p-4 rounded-xl bg-destructive/10 text-center">
                    <p className="text-2xl font-bold text-destructive">5%</p>
                    <p className="text-xs text-muted-foreground">Taxa Aurora</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-warning" />
                    <div>
                      <p className="font-bold text-warning">Mais margem para o parceiro</p>
                      <p className="text-sm text-muted-foreground">Proposta pensada para escalar com competitividade.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="empresas" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AURORA BUSINESS</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-4">
              Soluções para empresas
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestão completa de serviços, cotações, motoristas, financeiro e operação. Acesso protegido para empresas cadastradas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Cotações automáticas", desc: "Orçamentos em segundos." },
              { icon: BarChart3, title: "Dashboard completo", desc: "Métricas e performance em tempo real." },
              { icon: Bot, title: "IA integrada", desc: "Assistente virtual para operação." },
              { icon: Users, title: "Gestão de equipe", desc: "Controle de motoristas e serviços." },
              { icon: CreditCard, title: "Financeiro", desc: "Pagamentos, comissões e faturamento." },
              { icon: Bell, title: "Notificações", desc: "Alertas operacionais em tempo real." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
                <div className="w-12 h-12 rounded-xl gradient-premium flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 px-8 py-4 gradient-premium text-white font-bold rounded-xl btn-premium shadow-xl"
            >
              <Briefcase className="w-5 h-5" />
              Acessar área segura
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-premium" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                  Aurora Motoristas na palma da mão
                </h2>

                <p className="text-white/80 text-lg mb-8">
                  Peça corridas, envie entregas, acompanhe serviços e acesse a operação com uma experiência simples, rápida e segura.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-colors">
                    <Play className="w-6 h-6 text-white" />
                    <div className="text-left">
                      <p className="text-[10px] text-white/70">Disponível na</p>
                      <p className="font-bold text-white">Google Play</p>
                    </div>
                  </button>

                  <button className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-colors">
                    <Smartphone className="w-6 h-6 text-white" />
                    <div className="text-left">
                      <p className="text-[10px] text-white/70">Baixe na</p>
                      <p className="font-bold text-white">App Store</p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex justify-center">
                <div className="w-64 h-[500px] rounded-[3rem] gradient-premium p-3 shadow-2xl transform rotate-6">
                  <div className="w-full h-full rounded-[2.5rem] bg-card flex items-center justify-center">
                    <div className="text-center">
                      <Navigation className="w-16 h-16 mx-auto mb-4 text-primary" />
                      <p className="text-2xl font-black gradient-text">Aurora Motoristas</p>
                      <p className="text-xs text-muted-foreground">Mobilidade do futuro</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {chatOpen && (
        <div className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="p-4 gradient-premium text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Assistente Aurora</p>
                <p className="text-xs text-white/75">Ajuda rápida do sistema</p>
              </div>
            </div>

            <button type="button" onClick={() => setChatOpen(false)} className="p-2 rounded-xl bg-white/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="p-4 rounded-2xl bg-secondary">
              <p className="text-sm text-muted-foreground">
                Olá! Eu posso te orientar sobre corrida, entrega, cadastro de parceiro ou acesso empresarial.
              </p>
            </div>

            <div className="grid gap-2">
              {chatSugestoes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setChatText(item)}
                  className="text-left p-3 rounded-xl bg-background border border-border hover:border-primary/40 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Digite sua dúvida..."
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-sm outline-none focus:border-primary"
              />

              <a
                href={`https://wa.me/5531997490074?text=${encodeURIComponent(
                  chatText || "Olá, preciso de ajuda com a Aurora Motoristas."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl gradient-premium flex items-center justify-center text-white"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-4 z-40 flex items-center gap-3 px-5 py-4 rounded-2xl gradient-premium text-white shadow-2xl btn-premium"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-bold hidden sm:inline">Ajuda Aurora</span>
      </button>

      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">Aurora Motoristas</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Transporte, entregas e gestão em uma plataforma preparada para todo o Brasil.
              </p>

              <p className="text-xs text-muted-foreground">www.appmotoristas.com.br</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Serviços</h4>
              <div className="space-y-2">
                {[
                  { label: "Aurora Ride", href: "/solicitar" },
                  { label: "Aurora Express", href: "/entregas" },
                  { label: "Seja parceiro", href: "/motoristas/cadastrar" },
                  { label: "Área segura", href: "/login" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <div className="space-y-2">
                {["Central de ajuda", "Segurança", "Termos de uso", "Privacidade"].map((item) => (
                  <p key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <div className="space-y-3">
                <a href="https://wa.me/5531997490074" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-success transition-colors">
                  <MessageCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground hover:text-success">(31) 99749-0074</span>
                </a>

                <a href="https://wa.me/5531985614993" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-success transition-colors">
                  <PhoneCall className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground hover:text-primary">(31) 98561-4993</span>
                </a>

                <a href="mailto:ricardogrupoexecutivo1@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <Send className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground hover:text-primary">ricardogrupoexecutivo1@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">www.appmotoristas.com.br</p>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Ambiente 100% Ambiente seguro</span>
            </div>
          </div>
        </div>
      </footer>

      <InstallPWA />
    </main>
  );
}
