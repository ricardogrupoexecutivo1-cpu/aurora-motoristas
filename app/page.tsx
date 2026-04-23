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
  PackageCheck,
  ArrowDownUp,
  MapPinned,
  ShoppingBag,
  RefreshCw,
  Banknote,
  AlertTriangle,
  Camera,
  Mic,
  PhoneOff,
} from "lucide-react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    const targets = { corridas: 2847523, entregas: 1523847, motoristas: 45780, clientes: 892341, avaliacao: 4.9 };
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
                { href: "#plataformas", label: "Servicos" },
                { href: "#motoristas", label: "Seja Parceiro" },
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
            <div className="flex items-center justify-between mb-8">
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
              {/* App de Transporte */}
              <div className="p-1 rounded-3xl bg-gradient-to-r from-ride-black to-gray-800">
                <Link
                  href="/solicitar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-[1.4rem] bg-ride-black"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-white">MOVO Ride</span>
                    <p className="text-sm text-gray-400">Transporte de passageiros</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-white" />
                </Link>
              </div>

              {/* App de Entregas */}
              <div className="p-1 rounded-3xl bg-gradient-to-r from-silicon-orange to-warning">
                <Link
                  href="/entregas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 p-5 rounded-[1.4rem] bg-gradient-to-r from-silicon-orange to-warning"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-lg text-white">MOVO Express</span>
                    <p className="text-sm text-white/80">Busca e Entrega Brasil</p>
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
                    <span className="font-bold text-lg text-foreground">MOVO Business</span>
                    <p className="text-sm text-muted-foreground">Gestao ERP completa</p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-muted-foreground" />
                </Link>
              </div>

              {/* Other Links */}
              {[
                { href: "/motorista", label: "Painel Parceiro", icon: Wallet, desc: "Ganhos e corridas" },
                { href: "/motoristas/cadastrar", label: "Seja Parceiro", icon: TrendingUp, desc: "Ganhe mais" },
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
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-success/10 border border-success/30 rounded-full mb-8">
              <Crown className="w-4 h-4 text-success" />
              <span className="text-sm font-bold text-success">Taxa de apenas 5% - A menor do Brasil</span>
              <Sparkles className="w-4 h-4 text-success" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 leading-[1.1] text-balance">
              <span className="text-foreground">Transporte.</span>
              <br />
              <span className="gradient-text">Entregas.</span>
              <br />
              <span className="text-foreground">Gestao.</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Tres plataformas em um so lugar. Peca uma corrida, envie encomendas para todo Brasil ou gerencie sua empresa com a tecnologia mais avancada do mercado.
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

          {/* Three Platform Cards */}
          <div id="plataformas" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            
            {/* MOVO RIDE - Transporte */}
            <Link href="/solicitar" className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-ride-black via-gray-900 to-gray-800 rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]" />
              </div>
              
              <div className="relative p-6 lg:p-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full mb-5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-white">MAIS POPULAR</span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <Car className="w-7 h-7 text-ride-black" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-white">MOVO Ride</h2>
                    <p className="text-gray-400 text-sm">Transporte de passageiros</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {[
                    "Moto, Carro, Conforto, Black, Van",
                    "GPS em tempo real",
                    "Preco ate 20% menor",
                    "Seguranca total",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur rounded-xl group-hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">Para onde?</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* MOVO EXPRESS - Busca e Entrega */}
            <Link href="/entregas" className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-silicon-orange via-orange-500 to-warning rounded-[2rem] transform group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[2rem]" />
              </div>
              
              <div className="relative p-6 lg:p-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full mb-5">
                  <Truck className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white">TODO BRASIL</span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <Package className="w-7 h-7 text-silicon-orange" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-white">MOVO Express</h2>
                    <p className="text-white/80 text-sm">Busca e Entrega</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {[
                    "Buscar + Entregar (ida e volta)",
                    "So buscar ou so entregar",
                    "Moto, Carro, Van, Caminhao",
                    "Rastreio em tempo real",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur rounded-xl group-hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <PackageCheck className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">O que enviar?</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>

            {/* MOVO BUSINESS - Gestao ERP */}
            <Link href="/plataforma" className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 gradient-premium rounded-[2rem] p-[2px]">
                <div className="absolute inset-[2px] bg-card rounded-[1.875rem]" />
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] neon-primary" />
              
              <div className="relative p-6 lg:p-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-5">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">ERP COMPLETO</span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-foreground">MOVO Business</h2>
                    <p className="text-muted-foreground text-sm">Gestao empresarial</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6">
                  {[
                    "Cotacoes automaticas",
                    "Controle de servicos",
                    "Dashboard completo",
                    "IA para otimizar",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl group-hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">Acessar</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {[
              { value: formatNumber(stats.corridas), label: "Corridas", icon: Car, color: "text-primary" },
              { value: formatNumber(stats.entregas), label: "Entregas", icon: Package, color: "text-silicon-orange" },
              { value: formatNumber(stats.motoristas), label: "Parceiros", icon: Users, color: "text-success" },
              { value: formatNumber(stats.clientes), label: "Usuarios", icon: Globe, color: "text-silicon-cyan" },
              { value: "5%", label: "Taxa", icon: Percent, color: "text-warning" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
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

      {/* Como Funciona - Entregas */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-silicon-orange/10 rounded-full mb-4">
              <Package className="w-4 h-4 text-silicon-orange" />
              <span className="text-sm font-semibold text-silicon-orange">MOVO Express</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Busca e Entrega em Todo Brasil</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Voce escolhe: buscar algo, entregar, ou as duas coisas. Flexibilidade total para suas necessidades.
            </p>
          </div>

          {/* Tipos de Servico */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: ArrowDownUp,
                title: "Buscar e Entregar",
                desc: "Buscamos no endereco A e entregamos no B. Ideal para compras, documentos e encomendas.",
                color: "bg-silicon-orange",
              },
              {
                icon: MapPinned,
                title: "Apenas Buscar",
                desc: "Buscamos no local indicado e levamos ate voce. Perfeito para retirar mercadorias.",
                color: "bg-success",
              },
              {
                icon: Send,
                title: "Apenas Entregar",
                desc: "Coletamos com voce e entregamos no destino. Ideal para enviar presentes e documentos.",
                color: "bg-primary",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors group">
                <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Veiculos Disponiveis */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Bike, name: "Moto", desc: "Ate 10kg", time: "Mais rapido" },
              { icon: Car, name: "Carro", desc: "Ate 50kg", time: "Econômico" },
              { icon: Truck, name: "Van", desc: "Ate 300kg", time: "Volumes grandes" },
              { icon: Package, name: "Caminhao", desc: "Ate 3 ton", time: "Mudancas e cargas" },
            ].map((vehicle, i) => (
              <div key={i} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                <vehicle.icon className="w-8 h-8 mx-auto mb-2 text-silicon-orange" />
                <p className="font-bold">{vehicle.name}</p>
                <p className="text-xs text-muted-foreground">{vehicle.desc}</p>
                <p className="text-xs text-success">{vehicle.time}</p>
              </div>
            ))}
          </div>

          {/* CTA Entregas */}
          <div className="text-center mt-10">
            <Link 
              href="/entregas" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-silicon-orange to-warning text-white font-bold rounded-xl hover:shadow-xl transition-shadow"
            >
              <Package className="w-5 h-5" />
              Enviar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Seguranca Section */}
      <section id="seguranca" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-4">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold text-success">SEGURANCA TOTAL</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Sua Seguranca e Nossa Prioridade</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para proteger voce, seus pacotes e seus dados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, title: "Verificacao Completa", desc: "Motoristas verificados com antecedentes criminais e documentos validados" },
              { icon: MapPin, title: "GPS em Tempo Real", desc: "Acompanhe sua corrida ou entrega em tempo real no mapa" },
              { icon: Lock, title: "Codigo de Seguranca", desc: "PIN de verificacao para garantir que e o motorista correto" },
              { icon: AlertTriangle, title: "Botao SOS", desc: "Emergencia? Acione a policia com um toque na tela" },
              { icon: Camera, title: "Foto do Pacote", desc: "Registro fotografico da entrega para sua garantia" },
              { icon: Star, title: "Avaliacao Dupla", desc: "Motoristas e clientes avaliam para manter a qualidade" },
              { icon: Share2, title: "Compartilhar Rota", desc: "Envie sua localizacao em tempo real para amigos e familiares" },
              { icon: Mic, title: "Gravacao de Audio", desc: "Opcao de gravar audio durante a viagem para sua seguranca" },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-background border border-border hover:border-success/30 transition-colors">
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

      {/* Seja Parceiro */}
      <section id="motoristas" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">SEJA PARCEIRO</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black mb-6">Ganhe Mais com a Menor Taxa do Mercado</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Enquanto outras plataformas cobram de 20% a 25%, no MOVO voce paga apenas 5% de taxa. Isso significa mais dinheiro no seu bolso a cada corrida ou entrega.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: Percent, text: "Taxa de apenas 5% - a menor do Brasil" },
                  { icon: Wallet, text: "Saque diario via PIX ou semanal" },
                  { icon: Clock, text: "Horarios flexiveis - voce decide" },
                  { icon: Gift, text: "Bonus e incentivos semanais" },
                  { icon: Shield, text: "Seguro contra acidentes incluso" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
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

            {/* Simulador de Ganhos */}
            <div className="p-8 rounded-2xl bg-card border border-border">
              <h3 className="text-xl font-bold mb-6 text-center">Simulador de Ganhos</h3>
              
              <div className="space-y-6">
                <div className="text-center p-6 rounded-xl bg-secondary">
                  <p className="text-sm text-muted-foreground mb-2">Se voce fizer 20 corridas/dia</p>
                  <p className="text-4xl font-black gradient-text">R$ 8.500</p>
                  <p className="text-sm text-muted-foreground">estimativa mensal</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-success/10 text-center">
                    <p className="text-2xl font-bold text-success">95%</p>
                    <p className="text-xs text-muted-foreground">Voce fica</p>
                  </div>
                  <div className="p-4 rounded-xl bg-destructive/10 text-center">
                    <p className="text-2xl font-bold text-destructive">5%</p>
                    <p className="text-xs text-muted-foreground">Taxa MOVO</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-warning" />
                    <div>
                      <p className="font-bold text-warning">Economia vs outras plataformas</p>
                      <p className="text-sm text-muted-foreground">Ate R$ 1.700/mes a mais no seu bolso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Empresas */}
      <section id="empresas" className="py-16 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">MOVO BUSINESS</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Solucoes para sua Empresa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gestao completa de servicos, cotacoes automaticas e controle total da sua operacao.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Cotacoes Automaticas", desc: "Sistema inteligente que gera orcamentos em segundos" },
              { icon: BarChart3, title: "Dashboard Completo", desc: "Visualize metricas, ganhos e performance em tempo real" },
              { icon: Bot, title: "IA Integrada", desc: "Assistente virtual para otimizar suas operacoes" },
              { icon: Users, title: "Gestao de Equipe", desc: "Controle motoristas, atribua servicos e monitore" },
              { icon: CreditCard, title: "Financeiro", desc: "Controle de pagamentos, comissoes e faturamento" },
              { icon: Bell, title: "Notificacoes", desc: "Alertas em tempo real sobre servicos e entregas" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
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
              href="/plataforma" 
              className="inline-flex items-center gap-3 px-8 py-4 gradient-premium text-white font-bold rounded-xl btn-premium shadow-xl"
            >
              <Briefcase className="w-5 h-5" />
              Acessar Plataforma
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Download App CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-premium" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                  Baixe o App MOVO
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Disponivel para Android e iOS. Peca corridas, envie entregas e gerencie tudo na palma da sua mao.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition-colors">
                    <Play className="w-6 h-6 text-white" />
                    <div className="text-left">
                      <p className="text-[10px] text-white/70">Disponivel na</p>
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
                      <p className="text-2xl font-black gradient-text">MOVO</p>
                      <p className="text-xs text-muted-foreground">Mobilidade do Futuro</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black gradient-text">MOVO</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A plataforma de mobilidade com a menor taxa do mercado. Transporte, entregas e gestao em um so lugar.
              </p>
              <p className="text-xs text-muted-foreground">www.appmotoristas.com.br</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Servicos</h4>
              <div className="space-y-2">
                {[
                  { label: "MOVO Ride", href: "/solicitar" },
                  { label: "MOVO Express", href: "/entregas" },
                  { label: "MOVO Business", href: "/plataforma" },
                  { label: "Seja Parceiro", href: "/motoristas/cadastrar" },
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
                {["Central de Ajuda", "Seguranca", "Termos de Uso", "Privacidade"].map((item) => (
                  <p key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contato</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">0800 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <Send className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">contato@movo.com.br</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2024 MOVO - Todos os direitos reservados
            </p>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Ambiente 100% seguro</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
