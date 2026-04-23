"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  Video,
  PhoneCall,
  Truck,
  Bike,
  Package,
  Briefcase,
  Plane,
  Home,
  Menu,
  X,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<"ride" | "delivery" | "corporate">("ride");
  const [stats, setStats] = useState({
    corridas: 0,
    motoristas: 0,
    clientes: 0,
    avaliacao: 0,
    economia: 0,
  });

  useEffect(() => {
    const targets = { corridas: 2847523, motoristas: 45780, clientes: 892341, avaliacao: 4.9, economia: 15 };
    const duration = 2500;
    const steps = 80;
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
        economia: Math.floor(targets.economia * easeOut),
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
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-primary via-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
                  <Navigation className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-black tracking-tight text-foreground">MOVO</span>
                <p className="text-[10px] text-muted-foreground -mt-1 tracking-widest">MOBILIDADE INTELIGENTE</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "#servicos", label: "Serviços" },
                { href: "#motoristas", label: "Seja Motorista" },
                { href: "#empresas", label: "Empresas" },
                { href: "#seguranca", label: "Segurança" },
                { href: "#ajuda", label: "Ajuda" },
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
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 lg:px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-cyan-500 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Começar
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-secondary"
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
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" />
          <div className="relative h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black">MOVO</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-secondary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {[
                { href: "/solicitar", label: "Solicitar Corrida", icon: Car, color: "primary" },
                { href: "/motorista", label: "Painel Motorista", icon: Wallet, color: "success" },
                { href: "/plataforma", label: "Gestão de Serviços", icon: Briefcase, color: "warning" },
                { href: "/empresas/cadastrar", label: "Para Empresas", icon: Building2, color: "cyan-500" },
                { href: "/motoristas/cadastrar", label: "Seja Motorista", icon: TrendingUp, color: "success" },
                { href: "/cadastro", label: "Criar Conta", icon: UserCircle, color: "primary" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${item.color}/10 flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 text-${item.color}`} />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                  <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground" />
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-border">
              <Link
                href="/login"
                className="w-full py-4 bg-secondary rounded-xl font-semibold text-center block mb-3"
              >
                Entrar na minha conta
              </Link>
              <p className="text-center text-sm text-muted-foreground">
                www.appmotoristas.com.br
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/20 via-cyan-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-success/10 via-emerald-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                <Sparkles className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Taxa de apenas 5% - A menor do Brasil</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-foreground leading-[1.1]">
                O futuro da{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent">
                    mobilidade
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                    <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>{" "}
                chegou
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Plataforma completa de transporte e gestão de serviços com a{" "}
                <strong className="text-foreground">menor taxa do mercado</strong>, IA integrada e máxima segurança para motoristas e passageiros.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/solicitar"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                >
                  <Car className="w-5 h-5" />
                  Solicitar corrida
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/motoristas/cadastrar"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-card border-2 border-border text-foreground font-bold rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  <Wallet className="w-5 h-5 text-success" />
                  Quero dirigir
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-cyan-500/80 border-2 border-background flex items-center justify-center text-xs font-bold text-white"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-muted-foreground">{formatNumber(stats.clientes)}+ usuários</p>
                  </div>
                </div>

                <div className="h-10 w-px bg-border hidden sm:block" />

                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-8 h-8 text-success" />
                  <div className="text-sm">
                    <p className="font-semibold">100% verificado</p>
                    <p className="text-muted-foreground">Motoristas checados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - App Preview */}
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-card rounded-[2rem] border border-border shadow-2xl p-6 lg:p-8">
                {/* Status Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-success text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Motorista a caminho
                </div>

                {/* Map Placeholder */}
                <div className="relative h-48 lg:h-56 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl mb-6 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/20 rounded-full animate-ping" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Route Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-primary via-cyan-500 to-success rounded-full" />
                  
                  {/* Origin */}
                  <div className="absolute top-1/2 left-6 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg" />
                  
                  {/* Destination */}
                  <div className="absolute top-1/2 right-6 -translate-y-1/2 w-4 h-4 bg-success rounded-full border-4 border-white shadow-lg" />
                </div>

                {/* Ride Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">De</p>
                      <p className="font-semibold">Av. Paulista, 1000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Navigation className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Para</p>
                      <p className="font-semibold">Aeroporto de Congonhas</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-secondary/50 rounded-xl">
                      <Timer className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-bold">3 min</p>
                      <p className="text-xs text-muted-foreground">Chegada</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 rounded-xl">
                      <Route className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-bold">12 km</p>
                      <p className="text-xs text-muted-foreground">Distância</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-xl">
                      <CircleDollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold text-primary">R$ 32</p>
                      <p className="text-xs text-muted-foreground">Valor</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-4 lg:-left-8 top-1/4 p-4 bg-card rounded-2xl border border-border shadow-xl animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                  </div>
                  <div>
                    <p className="font-bold">{stats.avaliacao}</p>
                    <p className="text-xs text-muted-foreground">Avaliação</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 lg:-right-8 bottom-1/4 p-4 bg-card rounded-2xl border border-border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-bold text-success">Seguro</p>
                    <p className="text-xs text-muted-foreground">Viagem protegida</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-8 -top-4 p-3 bg-gradient-to-r from-primary to-cyan-500 rounded-2xl shadow-xl text-white">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span className="text-sm font-semibold">IA 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {[
              { value: formatNumber(stats.corridas), label: "Corridas realizadas", icon: Car },
              { value: formatNumber(stats.motoristas), label: "Motoristas ativos", icon: Users },
              { value: formatNumber(stats.clientes), label: "Usuários cadastrados", icon: UserCircle },
              { value: `${stats.economia}%`, label: "Economia vs concorrentes", icon: TrendingUp },
              { value: "5%", label: "Menor taxa do mercado", icon: CircleDollarSign, highlight: true },
            ].map((stat, i) => (
              <div key={i} className={`text-center ${stat.highlight ? "col-span-2 lg:col-span-1" : ""}`}>
                <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center ${stat.highlight ? "bg-success/10" : "bg-primary/10"}`}>
                  <stat.icon className={`w-7 h-7 ${stat.highlight ? "text-success" : "text-primary"}`} />
                </div>
                <p className={`text-3xl lg:text-4xl font-black mb-1 ${stat.highlight ? "text-success" : "text-foreground"}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Cards - Main Feature */}
      <section id="servicos" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4">
              Tudo em uma só plataforma
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Duas soluções poderosas integradas: mobilidade urbana e gestão completa de serviços
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* App de Mobilidade */}
            <div className="group relative bg-gradient-to-br from-primary/5 via-card to-cyan-500/5 rounded-3xl border-2 border-primary/20 p-6 lg:p-8 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl group-hover:from-primary/20 transition-colors" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">MOBILIDADE</span>
                    <h3 className="text-2xl lg:text-3xl font-black text-foreground mt-2">MOVO Ride</h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 text-lg">
                  App de transporte estilo Uber/99 com a <strong className="text-success">menor taxa do mercado (5%)</strong>. 
                  Solicite corridas, seja motorista parceiro ou gerencie frotas corporativas.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: MapPin, label: "GPS em tempo real" },
                    { icon: Shield, label: "100% verificado" },
                    { icon: Wallet, label: "Pagamento flexível" },
                    { icon: Bot, label: "IA Assistente 24h" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/solicitar"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-cyan-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <MapPin className="w-5 h-5" />
                    Solicitar corrida
                  </Link>
                  <Link
                    href="/motorista"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <Wallet className="w-5 h-5" />
                    Painel motorista
                  </Link>
                </div>
              </div>
            </div>

            {/* Sistema de Gestão */}
            <div className="group relative bg-gradient-to-br from-success/5 via-card to-emerald-500/5 rounded-3xl border-2 border-success/20 p-6 lg:p-8 hover:border-success/50 hover:shadow-2xl hover:shadow-success/10 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-success/10 to-transparent rounded-full blur-3xl group-hover:from-success/20 transition-colors" />
              
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-success to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-success/30">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">ERP COMPLETO</span>
                    <h3 className="text-2xl lg:text-3xl font-black text-foreground mt-2">MOVO Business</h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 text-lg">
                  Sistema completo de gestão para empresas de transporte. Controle de motoristas, serviços, 
                  cotações, financeiro e muito mais com <strong className="text-success">segurança total</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: Users, label: "Gestão de equipe" },
                    { icon: TrendingUp, label: "Relatórios completos" },
                    { icon: CreditCard, label: "Controle financeiro" },
                    { icon: Lock, label: "Acesso seguro" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <item.icon className="w-4 h-4 text-success" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/plataforma"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-success to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <Building2 className="w-5 h-5" />
                    Acessar plataforma
                  </Link>
                  <Link
                    href="/servicos"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <Briefcase className="w-5 h-5" />
                    Ver serviços
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Types */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-4">
              Serviços para todas as necessidades
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do transporte executivo ao delivery, temos a solução perfeita para você
            </p>
          </div>

          {/* Service Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-secondary rounded-2xl">
              {[
                { id: "ride", label: "Transporte", icon: Car },
                { id: "delivery", label: "Entregas", icon: Package },
                { id: "corporate", label: "Corporativo", icon: Building2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveService(tab.id as typeof activeService)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeService === tab.id
                      ? "bg-primary text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Content */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {activeService === "ride" && [
              { icon: Car, title: "MOVO Padrão", desc: "Econômico e rápido", price: "A partir de R$ 8" },
              { icon: Sparkles, title: "MOVO Conforto", desc: "Carros espaçosos e ar", price: "A partir de R$ 12" },
              { icon: Award, title: "MOVO Black", desc: "Premium e exclusivo", price: "A partir de R$ 25" },
              { icon: Users, title: "MOVO XL", desc: "Até 6 passageiros", price: "A partir de R$ 18" },
            ].map((item, i) => (
              <Link
                key={i}
                href="/solicitar"
                className="group p-6 bg-background rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <p className="text-sm font-semibold text-primary">{item.price}</p>
              </Link>
            ))}

            {activeService === "delivery" && [
              { icon: Bike, title: "MOVO Moto", desc: "Entregas rápidas", price: "A partir de R$ 6" },
              { icon: Package, title: "MOVO Flash", desc: "Até 30min na cidade", price: "A partir de R$ 12" },
              { icon: Truck, title: "MOVO Cargo", desc: "Volumes grandes", price: "A partir de R$ 35" },
              { icon: Plane, title: "MOVO Express", desc: "Intercidades", price: "Sob consulta" },
            ].map((item, i) => (
              <Link
                key={i}
                href="/solicitar"
                className="group p-6 bg-background rounded-2xl border border-border hover:border-success/50 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-success/20 group-hover:scale-110 transition-all">
                  <item.icon className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <p className="text-sm font-semibold text-success">{item.price}</p>
              </Link>
            ))}

            {activeService === "corporate" && [
              { icon: Building2, title: "Frota Dedicada", desc: "Veículos exclusivos", price: "Plano mensal" },
              { icon: Users, title: "Transporte Executivo", desc: "Para diretoria", price: "Sob demanda" },
              { icon: CreditCard, title: "Conta Corporativa", desc: "Faturamento mensal", price: "Taxa especial" },
              { icon: TrendingUp, title: "Dashboard Completo", desc: "Relatórios e métricas", price: "Incluso" },
            ].map((item, i) => (
              <Link
                key={i}
                href="/empresas/cadastrar"
                className="group p-6 bg-background rounded-2xl border border-border hover:border-warning/50 hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-warning/20 group-hover:scale-110 transition-all">
                  <item.icon className="w-7 h-7 text-warning" />
                </div>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.desc}</p>
                <p className="text-sm font-semibold text-warning">{item.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Section */}
      <section id="motoristas" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="bg-gradient-to-br from-success/20 to-emerald-500/20 rounded-3xl p-8 lg:p-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-2xl p-4 shadow-lg">
                      <Wallet className="w-8 h-8 text-success mb-2" />
                      <p className="text-2xl font-black">R$ 4.850</p>
                      <p className="text-sm text-muted-foreground">Ganho médio/mês</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 shadow-lg">
                      <CircleDollarSign className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-black text-success">5%</p>
                      <p className="text-sm text-muted-foreground">Taxa da plataforma</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 shadow-lg">
                      <Zap className="w-8 h-8 text-warning mb-2" />
                      <p className="text-2xl font-black">24h</p>
                      <p className="text-sm text-muted-foreground">Recebimento PIX</p>
                    </div>
                    <div className="bg-card rounded-2xl p-4 shadow-lg">
                      <Clock className="w-8 h-8 text-cyan-500 mb-2" />
                      <p className="text-2xl font-black">Livre</p>
                      <p className="text-sm text-muted-foreground">Seus horários</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 p-4 bg-card rounded-2xl shadow-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <p className="font-bold">+47%</p>
                      <p className="text-xs text-muted-foreground">vs concorrentes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Ganhe mais com o MOVO</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-foreground">
                Dirija com a menor taxa do mercado
              </h2>

              <p className="text-lg text-muted-foreground">
                Com apenas 5% de taxa, você ganha mais a cada corrida. Pagamento em até 24h via PIX, 
                sem metas obrigatórias e com suporte 24 horas.
              </p>

              <div className="space-y-4">
                {[
                  { icon: CircleDollarSign, text: "Taxa de apenas 5% - a menor do Brasil" },
                  { icon: Zap, text: "Receba seus ganhos em até 24h via PIX" },
                  { icon: Clock, text: "Trabalhe quando e onde quiser" },
                  { icon: Shield, text: "Seguro contra acidentes incluso" },
                  { icon: Headphones, text: "Suporte exclusivo para motoristas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-success" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/motoristas/cadastrar"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-success text-white font-bold rounded-xl shadow-lg shadow-success/30 hover:bg-success/90 transition-colors"
                >
                  <Car className="w-5 h-5" />
                  Quero ser motorista
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/motorista"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border font-semibold rounded-xl hover:border-success/50 transition-colors"
                >
                  Já sou motorista
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="seguranca" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Segurança máxima</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-foreground">
                Sua segurança é nossa prioridade absoluta
              </h2>

              <p className="text-lg text-muted-foreground">
                Investimos nas mais avançadas tecnologias de segurança para garantir 
                tranquilidade em todas as suas viagens.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Fingerprint, title: "Verificação facial", desc: "Antes de cada corrida" },
                  { icon: BadgeCheck, title: "Antecedentes", desc: "Checagem completa" },
                  { icon: Video, title: "Gravação opcional", desc: "Áudio durante viagem" },
                  { icon: PhoneCall, title: "Botão SOS", desc: "Emergência em 1 toque" },
                  { icon: Share2, title: "Compartilhar rota", desc: "Com amigos e família" },
                  { icon: Shield, title: "Seguro incluso", desc: "Todas as corridas" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-3xl p-8 lg:p-12">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 lg:w-64 lg:h-64 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-36 h-36 lg:w-48 lg:h-48 bg-primary/30 rounded-full flex items-center justify-center">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/50">
                          <Shield className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-0 right-0 p-3 bg-card rounded-xl shadow-lg border border-border">
                      <Lock className="w-6 h-6 text-success" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-3 bg-card rounded-xl shadow-lg border border-border">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-black text-foreground mb-8 text-center">
            Acesso rápido
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { href: "/solicitar", icon: MapPin, title: "Solicitar corrida", desc: "Peça agora", color: "primary" },
              { href: "/motorista", icon: Wallet, title: "Painel motorista", desc: "Seus ganhos", color: "success" },
              { href: "/plataforma", icon: Briefcase, title: "Gestão de serviços", desc: "ERP completo", color: "warning" },
              { href: "/login", icon: UserCircle, title: "Entrar", desc: "Sua conta", color: "primary" },
              { href: "/motoristas/cadastrar", icon: Car, title: "Seja motorista", desc: "Cadastre-se", color: "success" },
              { href: "/empresas/cadastrar", icon: Building2, title: "Para empresas", desc: "Conta corporativa", color: "warning" },
              { href: "/assistente", icon: Bot, title: "IA Assistente", desc: "Ajuda 24h", color: "cyan-500" },
              { href: "/servicos", icon: Zap, title: "Serviços", desc: "Todos os serviços", color: "primary" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="group p-4 lg:p-5 bg-card rounded-2xl border border-border hover:border-primary/50 hover:shadow-xl transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 bg-${item.color}/10`}
                >
                  <item.icon className={`w-6 h-6 text-${item.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-0.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já confiam no MOVO para suas viagens e negócios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solicitar"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary font-black rounded-2xl hover:bg-white/90 transition-colors shadow-xl"
            >
              <Car className="w-6 h-6" />
              Solicitar corrida
            </Link>
            <Link
              href="/motoristas/cadastrar"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 text-white font-black rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-colors"
            >
              <Users className="w-6 h-6" />
              Seja motorista parceiro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 lg:py-16 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black text-foreground">MOVO</span>
                  <p className="text-xs text-muted-foreground">MOBILIDADE INTELIGENTE</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 max-w-xs">
                A plataforma de mobilidade com a menor taxa do mercado. Tecnologia, segurança e economia para você.
              </p>
              <p className="text-sm font-semibold text-primary">www.appmotoristas.com.br</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-foreground mb-4">Passageiros</h4>
              <ul className="space-y-2">
                {["Solicitar corrida", "Criar conta", "Promoções", "Segurança"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Motoristas</h4>
              <ul className="space-y-2">
                {["Seja parceiro", "Acessar painel", "Ganhos", "Documentos"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2">
                {["Sobre nós", "Contato", "Termos de uso", "Privacidade"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2024 MOVO - App Motoristas. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-destructive" />
              Feito com amor no Brasil
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
