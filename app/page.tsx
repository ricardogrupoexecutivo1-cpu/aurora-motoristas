"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Car,
  Users,
  Shield,
  Star,
  Zap,
  MapPin,
  Clock,
  CreditCard,
  TrendingUp,
  Headphones,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Building2,
  UserCircle,
  Bot,
  Smartphone,
  Lock,
  Globe,
  Award,
  Heart,
  Navigation,
  Wallet,
  Gift,
  Play,
  Sparkles,
  CircleDollarSign,
  Route,
  Timer,
  BadgeCheck,
  Fingerprint,
  Truck,
  Bike,
  Package,
  Briefcase,
  Menu,
  X,
  ArrowUpRight,
  Percent,
  Crown,
  Rocket,
  Target,
  BarChart3,
  FileText,
  Settings,
  Bell,
  Search,
  Send,
  MessageCircle,
  PhoneCall,
  Share2,
  Video,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    corridas: 0,
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
    const targets = { corridas: 2847523, motoristas: 45780, clientes: 892341, avaliacao: 4.9 };
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
        motoristas: Math.floor(targets.motoristas * easeOut),
        clientes: Math.floor(targets.clientes * easeOut),
        avaliacao: Math.round(targets.avaliacao * easeOut * 10) / 10,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      {/* Header Premium */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl gradient-premium flex items-center justify-center shadow-lg neon-primary group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
              </div>
              <div>
                <span className="text-2xl lg:text-3xl font-black tracking-tight gradient-text">MOVO</span>
                <p className="text-[10px] text-muted-foreground tracking-[0.2em] -mt-1 hidden sm:block">MOBILIDADE DO FUTURO</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "#plataformas", label: "Plataformas" },
                { href: "#motoristas", label: "Seja Motorista" },
                { href: "#empresas", label: "Empresas" },
                { href: "#seguranca", label: "Seguranca" },
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

            {/* CTA Buttons */}
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
                Comecar Agora
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-background/98 backdrop-blur-2xl" />
          <div className="relative h-full flex flex-col p-6 safe-area-top">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl gradient-premium flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black gradient-text">MOVO</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-xl bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {/* Plataforma Uber */}
              <div className="p-1 rounded-3xl bg-gradient-to-r from-uber-black to-gray-800">
                <Link
                  href="/solicitar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-[1.4rem] bg-uber-black"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-white">Pedir Corrida</span>
                    <p className="text-sm text-gray-400">Estilo Uber/99 - Taxa 5%</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </Link>
              </div>

              {/* Plataforma Gestao */}
              <div className="p-1 rounded-3xl gradient-premium">
                <Link
                  href="/plataforma"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-[1.4rem] bg-card"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-foreground">Gestao ERP</span>
                    <p className="text-sm text-muted-foreground">Servicos e cotacoes</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
                </Link>
              </div>

              {/* Other Links */}
              {[
                { href: "/motorista", label: "Painel Motorista", icon: Wallet, desc: "Ganhos e corridas" },
                { href: "/motoristas/cadastrar", label: "Seja Motorista", icon: TrendingUp, desc: "Ganhe mais" },
                { href: "/cadastro", label: "Criar Conta", icon: UserCircle, desc: "Gratis e rapido" },
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
              <Link
                href="/login"
                className="w-full py-4 bg-secondary rounded-xl font-semibold text-center block"
              >
                Entrar na minha conta
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Full Screen Impact */}
      <section className="relative min-h-screen flex items-center pt-20 lg:pt-0">
        {/* Background Mesh */}
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-silicon-pink/20 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-silicon-cyan/10 rounded-full blur-[150px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 w-full">
          <div className="text-center mb-16 lg:mb-20 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-success/10 border border-success/30 rounded-full mb-8">
              <Crown className="w-4 h-4 text-success" />
              <span className="text-sm font-bold text-success">Taxa de apenas 5% - A menor do Brasil</span>
              <Sparkles className="w-4 h-4 text-success" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black mb-6 leading-[1.1] text-balance">
              <span className="text-foreground">Duas plataformas.</span>
              <br />
              <span className="gradient-text">Um futuro.</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Escolha entre pedir uma corrida estilo Uber ou gerenciar seus servicos empresariais.
              Tudo em um so lugar, com a tecnologia mais avancada do mercado.
            </p>

            {/* Trust Stats Mini */}
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full gradient-premium border-2 border-background" />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">+{formatNumber(stats.clientes)} usuarios</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
                <span className="text-sm font-medium">{stats.avaliacao}</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-muted-foreground">100% Verificado</span>
              </div>
            </div>
          </div>

          {/* Two Platform Cards */}
          <div id="plataformas" className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* UBER STYLE CARD */}
            <Link href="/solicitar" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-uber-black via-gray-900 to-gray-800 rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]" />
              </div>
              
              <div className="relative p-8 lg:p-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">Estilo Uber / 99</span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <Car className="w-9 h-9 lg:w-10 lg:h-10 text-uber-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-white mb-2">MOVO Ride</h2>
                    <p className="text-gray-400">Peca sua corrida agora</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    "Taxa de apenas 5% para motoristas",
                    "Preco justo para passageiros",
                    "GPS em tempo real",
                    "Pagamento PIX, cartao ou dinheiro",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm lg:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 lg:p-5 bg-white/5 backdrop-blur rounded-2xl group-hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Para onde?</p>
                      <p className="text-gray-400 text-sm">Escolha seu destino</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* GESTAO ERP CARD */}
            <Link href="/plataforma" className="group relative">
              <div className="absolute inset-0 gradient-premium rounded-[2rem] p-[2px]">
                <div className="absolute inset-[2px] bg-card rounded-[1.875rem]" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] neon-primary" />
              
              <div className="relative p-8 lg:p-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">ERP Completo</span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl gradient-premium flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <Briefcase className="w-9 h-9 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-2">MOVO Business</h2>
                    <p className="text-muted-foreground">Gestao empresarial</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {[
                    "Cotacoes e orcamentos automaticos",
                    "Controle de servicos e entregas",
                    "Relatorios e dashboard completo",
                    "IA para otimizar operacoes",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground text-sm lg:text-base">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 lg:p-5 bg-secondary/50 rounded-2xl group-hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl gradient-premium flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-foreground font-semibold">Acessar Plataforma</p>
                      <p className="text-muted-foreground text-sm">Dashboard completo</p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: formatNumber(stats.corridas), label: "Corridas realizadas", icon: Car, color: "primary" },
              { value: formatNumber(stats.motoristas), label: "Motoristas parceiros", icon: Users, color: "success" },
              { value: formatNumber(stats.clientes), label: "Usuarios ativos", icon: Globe, color: "silicon-cyan" },
              { value: "5%", label: "Taxa mais baixa", icon: Percent, color: "warning" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-${stat.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <p className="text-3xl lg:text-4xl font-black text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Servicos Completos</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4 text-balance">
              Tudo que voce precisa em <span className="gradient-text">um so lugar</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do transporte de passageiros a gestao completa de servicos empresariais
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Car, title: "Corridas", desc: "Transporte de passageiros com seguranca", color: "uber-black", href: "/solicitar" },
              { icon: Truck, title: "Entregas", desc: "Envio rapido de pacotes e documentos", color: "silicon-orange", href: "/solicitar" },
              { icon: Briefcase, title: "Corporativo", desc: "Solucoes para empresas", color: "primary", href: "/empresas/cadastrar" },
              { icon: Package, title: "Fretes", desc: "Mudancas e cargas pesadas", color: "success", href: "/solicitar" },
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="group p-6 lg:p-8 bg-card rounded-2xl border border-border hover:border-primary/30 card-hover"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${service.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-7 h-7 text-${service.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.desc}</p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  Acessar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Section */}
      <section id="motoristas" className="py-16 lg:py-24 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Ganhe mais com a MOVO</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black mb-6 text-balance">
                Seja um motorista <span className="gradient-text">parceiro</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Com a menor taxa do mercado, voce leva mais dinheiro para casa. 
                Cadastre-se agora e comece a dirigir com liberdade e seguranca.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Percent, title: "Taxa de apenas 5%", desc: "A menor do Brasil" },
                  { icon: Wallet, title: "Saque imediato", desc: "Receba via PIX na hora" },
                  { icon: Shield, title: "Seguro incluso", desc: "Protecao total nas corridas" },
                  { icon: Gift, title: "Bonus e premios", desc: "Ganhe mais com indicacoes" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/motoristas/cadastrar"
                className="inline-flex items-center gap-3 px-8 py-4 bg-success text-white font-bold rounded-xl btn-premium shadow-xl shadow-success/30"
              >
                <Car className="w-5 h-5" />
                Quero ser motorista
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Earnings Preview Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent rounded-3xl blur-3xl" />
              <div className="relative bg-card rounded-3xl border border-border shadow-2xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Ganhos estimados</p>
                    <p className="text-4xl font-black text-success">R$ 8.500</p>
                    <p className="text-sm text-muted-foreground">por mes</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-success" />
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground">Corridas (150)</span>
                    <span className="font-bold">R$ 9.000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-xl">
                    <span className="text-muted-foreground">Taxa MOVO (5%)</span>
                    <span className="font-bold text-destructive">- R$ 450</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-xl">
                    <span className="font-semibold">Voce recebe</span>
                    <span className="font-black text-success text-xl">R$ 8.550</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 p-4 bg-warning/10 rounded-xl">
                  <Gift className="w-5 h-5 text-warning" />
                  <span className="text-sm font-semibold">+ R$ 500 bonus de indicacao disponivel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="seguranca" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Seguranca Total</span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-4">
              Sua seguranca e nossa <span className="gradient-text">prioridade</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Fingerprint, title: "Verificacao Completa", desc: "Todos os motoristas passam por verificacao de antecedentes e documentacao" },
              { icon: Lock, title: "Dados Protegidos", desc: "Criptografia de ponta a ponta em todas as suas informacoes" },
              { icon: MapPin, title: "Rastreamento GPS", desc: "Acompanhe sua viagem em tempo real e compartilhe com familiares" },
              { icon: PhoneCall, title: "Suporte 24h", desc: "Equipe sempre disponivel para ajudar voce" },
              { icon: Star, title: "Sistema de Avaliacao", desc: "Motoristas e passageiros se avaliam mutuamente" },
              { icon: Shield, title: "Seguro Viagem", desc: "Cobertura completa durante todas as corridas" },
            ].map((item, i) => (
              <div key={i} className="p-6 lg:p-8 bg-card rounded-2xl border border-border card-hover">
                <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 gradient-premium" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC45NDEgMCAxOC04LjA1OSAxOC0xOHMtNy4wNTktMTgtMTgtMTgiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
            
            <div className="relative p-8 lg:p-16 text-center">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 text-balance">
                Pronto para comecar?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                Junte-se a milhares de usuarios e motoristas que ja fazem parte da revolucao da mobilidade.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/solicitar"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors shadow-xl flex items-center justify-center gap-3"
                >
                  <Car className="w-5 h-5" />
                  Pedir uma corrida
                </Link>
                <Link
                  href="/motoristas/cadastrar"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-3"
                >
                  <Wallet className="w-5 h-5" />
                  Quero dirigir
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 lg:py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">MOVO</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                A plataforma de mobilidade mais completa do Brasil.
              </p>
              <p className="text-xs text-muted-foreground">
                www.appmotoristas.com.br
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Passageiros", links: ["Pedir corrida", "Precos", "Seguranca", "Ajuda"] },
              { title: "Motoristas", links: ["Seja motorista", "Ganhos", "Requisitos", "Suporte"] },
              { title: "Empresas", links: ["Solucoes", "API", "Parcerias", "Contato"] },
              { title: "MOVO", links: ["Sobre nos", "Carreiras", "Blog", "Privacidade"] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2024 MOVO. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Termos</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacidade</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
