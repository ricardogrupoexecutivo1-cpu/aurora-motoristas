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
  Play,
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
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"cliente" | "motorista" | "empresa">("cliente");
  const [stats, setStats] = useState({
    corridas: 0,
    motoristas: 0,
    clientes: 0,
    avaliacao: 0,
  });

  useEffect(() => {
    // Animação dos números
    const targets = { corridas: 15847, motoristas: 1250, clientes: 8432, avaliacao: 4.9 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        corridas: Math.floor(targets.corridas * progress),
        motoristas: Math.floor(targets.motoristas * progress),
        clientes: Math.floor(targets.clientes * progress),
        avaliacao: Math.round(targets.avaliacao * progress * 10) / 10,
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">App</span>
                <span className="font-bold text-lg text-primary">Motoristas</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Como funciona
              </Link>
              <Link href="#motoristas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Seja motorista
              </Link>
              <Link href="#empresas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Para empresas
              </Link>
              <Link href="#seguranca" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Segurança
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:flex px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                Começar agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-primary">Taxa de apenas 5% - A menor do mercado</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Sua corrida com{" "}
                <span className="gradient-text">segurança</span>,{" "}
                <span className="gradient-text">transparência</span> e{" "}
                <span className="gradient-text">economia</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl">
                A plataforma que conecta passageiros e motoristas profissionais com a menor taxa do mercado.
                Tecnologia de ponta, IA integrada e o melhor atendimento do Brasil.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/solicitar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  Solicitar corrida
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/motoristas/cadastrar"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-card text-foreground font-semibold rounded-xl border border-border hover:border-primary/50 transition-all hover:-translate-y-0.5"
                >
                  Quero ser motorista
                  <Car className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 border-2 border-background flex items-center justify-center"
                    >
                      <span className="text-xs font-bold text-white">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                    <span className="ml-1 font-semibold">{stats.avaliacao}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+{stats.clientes.toLocaleString()} clientes satisfeitos</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-card rounded-3xl border border-border p-6 shadow-2xl">
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-success" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Origem</p>
                      <p className="font-medium text-foreground">Av. Paulista, 1000</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Destino</p>
                      <p className="font-medium text-foreground">Aeroporto de Congonhas</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 bg-secondary rounded-xl">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-semibold">25 min</p>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-xl">
                      <Car className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-sm font-semibold">12 km</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded-xl">
                      <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                      <p className="text-sm font-bold text-primary">R$ 32,50</p>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                    Confirmar corrida
                  </button>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 p-4 bg-card rounded-2xl border border-border shadow-xl animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">IA Assistente</p>
                    <p className="text-xs text-muted-foreground">Suporte 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.corridas.toLocaleString()}+
              </div>
              <p className="text-muted-foreground">Corridas realizadas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.motoristas.toLocaleString()}+
              </div>
              <p className="text-muted-foreground">Motoristas ativos</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                {stats.clientes.toLocaleString()}+
              </div>
              <p className="text-muted-foreground">Clientes cadastrados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-success mb-1">5%</div>
              <p className="text-muted-foreground">Menor taxa do mercado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Uma plataforma para todos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seja você passageiro, motorista ou empresa, temos a solução perfeita para suas necessidades.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-secondary rounded-xl">
              {[
                { id: "cliente", label: "Passageiro", icon: UserCircle },
                { id: "motorista", label: "Motorista", icon: Car },
                { id: "empresa", label: "Empresa", icon: Building2 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {activeTab === "cliente" && (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    Viaje com segurança e praticidade
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: MapPin, title: "GPS em tempo real", desc: "Acompanhe sua corrida em tempo real e compartilhe com quem você ama" },
                      { icon: Shield, title: "Motoristas verificados", desc: "Todos os motoristas passam por verificação completa de documentos e antecedentes" },
                      { icon: CreditCard, title: "Pagamento flexível", desc: "Pague com dinheiro, PIX, cartão de crédito ou débito" },
                      { icon: Star, title: "Avalie sua experiência", desc: "Sistema de avaliação mútua para garantir qualidade" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/cadastro/cliente"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Criar minha conta
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-3xl flex items-center justify-center">
                    <Smartphone className="w-32 h-32 text-primary/50" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "motorista" && (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    Ganhe mais com a menor taxa do mercado
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: TrendingUp, title: "Taxa de apenas 5%", desc: "A menor taxa do mercado. Você ganha mais a cada corrida realizada" },
                      { icon: Zap, title: "Pagamento rápido", desc: "Receba seus ganhos diretamente na sua conta em até 24h" },
                      { icon: Clock, title: "Flexibilidade total", desc: "Trabalhe nos horários que preferir, sem metas obrigatórias" },
                      { icon: Headphones, title: "Suporte dedicado", desc: "Time de suporte exclusivo para motoristas parceiros" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/motoristas/cadastrar"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-success text-success-foreground font-semibold rounded-xl hover:bg-success/90 transition-colors"
                  >
                    Cadastrar como motorista
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-success/20 to-emerald-500/20 rounded-3xl flex items-center justify-center">
                    <Car className="w-32 h-32 text-success/50" />
                  </div>
                </div>
              </>
            )}

            {activeTab === "empresa" && (
              <>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-foreground">
                    Gestão completa de transporte corporativo
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Building2, title: "Conta empresarial", desc: "Gerencie corridas de toda sua equipe em um único painel" },
                      { icon: TrendingUp, title: "Relatórios detalhados", desc: "Dashboards completos com métricas e análises de uso" },
                      { icon: CreditCard, title: "Faturamento mensal", desc: "Pague todas as corridas em uma única fatura mensal" },
                      { icon: Users, title: "Múltiplos usuários", desc: "Cadastre colaboradores com diferentes níveis de acesso" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/50 transition-colors">
                        <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/empresas/cadastrar"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-warning text-warning-foreground font-semibold rounded-xl hover:bg-warning/90 transition-colors"
                  >
                    Falar com comercial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-warning/20 to-orange-500/20 rounded-3xl flex items-center justify-center">
                    <Building2 className="w-32 h-32 text-warning/50" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Tecnologia de ponta para sua segurança
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Investimos em tecnologia para oferecer a melhor experiência possível
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: "IA Assistente 24h", desc: "Chatbot inteligente para tirar dúvidas e resolver problemas instantaneamente", color: "primary" },
              { icon: Shield, title: "Verificação completa", desc: "Checagem de documentos, antecedentes e reconhecimento facial", color: "success" },
              { icon: Lock, title: "Dados criptografados", desc: "Suas informações protegidas com criptografia de ponta a ponta", color: "warning" },
              { icon: MapPin, title: "Rastreamento GPS", desc: "Localização em tempo real para você e seus contatos de confiança", color: "primary" },
              { icon: Star, title: "Sistema de avaliação", desc: "Avaliação mútua entre motoristas e passageiros", color: "success" },
              { icon: Zap, title: "Pagamento instantâneo", desc: "Motoristas recebem em até 24h via PIX", color: "warning" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-background rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    feature.color === "primary"
                      ? "bg-primary/10"
                      : feature.color === "success"
                      ? "bg-success/10"
                      : "bg-warning/10"
                  }`}
                >
                  <feature.icon
                    className={`w-7 h-7 ${
                      feature.color === "primary"
                        ? "text-primary"
                        : feature.color === "success"
                        ? "text-success"
                        : "text-warning"
                    }`}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="seguranca" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full mb-6">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">Segurança em primeiro lugar</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Sua segurança é nossa prioridade absoluta
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Implementamos as mais rigorosas medidas de segurança para proteger você, seus dados e suas viagens.
              </p>
              <div className="space-y-4">
                {[
                  "Verificação de antecedentes criminais de todos os motoristas",
                  "Reconhecimento facial antes de cada corrida",
                  "Botão de emergência com acionamento rápido",
                  "Compartilhamento de rota em tempo real",
                  "Gravação de áudio opcional durante a viagem",
                  "Seguro contra acidentes incluso em todas as corridas",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-success/20 to-emerald-500/20 rounded-3xl flex items-center justify-center">
                <Shield className="w-40 h-40 text-success/30" />
              </div>
              <div className="absolute top-8 -left-4 p-4 bg-card rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 text-success" />
                  <div>
                    <p className="font-semibold text-sm">Dados protegidos</p>
                    <p className="text-xs text-muted-foreground">Criptografia AES-256</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 -right-4 p-4 bg-card rounded-xl border border-border shadow-lg">
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">Monitoramento 24/7</p>
                    <p className="text-xs text-muted-foreground">Equipe sempre ativa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já confiam no App Motoristas para suas viagens diárias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/solicitar"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
            >
              <Car className="w-5 h-5" />
              Solicitar corrida
            </Link>
            <Link
              href="/motoristas/cadastrar"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-colors"
            >
              <Users className="w-5 h-5" />
              Seja motorista parceiro
            </Link>
          </div>
        </div>
      </section>

      {/* Access Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Acesso rápido</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: "/login", icon: UserCircle, title: "Entrar", desc: "Acesse sua conta", color: "primary" },
              { href: "/solicitar", icon: MapPin, title: "Solicitar corrida", desc: "Peça um carro agora", color: "success" },
              { href: "/motoristas/cadastrar", icon: Car, title: "Seja motorista", desc: "Cadastre-se como parceiro", color: "warning" },
              { href: "/plataforma/ajuda", icon: Headphones, title: "Suporte", desc: "Central de ajuda", color: "primary" },
              { href: "/empresas/cadastrar", icon: Building2, title: "Empresas", desc: "Conta corporativa", color: "success" },
              { href: "/servicos/novo", icon: Zap, title: "Novo serviço", desc: "Cadastrar serviço", color: "warning" },
              { href: "/admin-master-7x9k2", icon: Shield, title: "Administração", desc: "Painel administrativo", color: "destructive" },
              { href: "/assistente", icon: Bot, title: "IA Assistente", desc: "Ajuda inteligente", color: "primary" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="p-5 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                    item.color === "primary"
                      ? "bg-primary/10"
                      : item.color === "success"
                      ? "bg-success/10"
                      : item.color === "warning"
                      ? "bg-warning/10"
                      : "bg-destructive/10"
                  }`}
                >
                  <item.icon
                    className={`w-6 h-6 ${
                      item.color === "primary"
                        ? "text-primary"
                        : item.color === "success"
                        ? "text-success"
                        : item.color === "warning"
                        ? "text-warning"
                        : "text-destructive"
                    }`}
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-bold text-foreground">App</span>
                  <span className="font-bold text-primary">Motoristas</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A plataforma de mobilidade com a menor taxa do mercado. Tecnologia, segurança e economia para você.
              </p>
              <p className="text-sm text-muted-foreground">
                www.appmotoristas.com.br
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Passageiros</h4>
              <ul className="space-y-2">
                <li><Link href="/solicitar" className="text-sm text-muted-foreground hover:text-primary">Solicitar corrida</Link></li>
                <li><Link href="/cadastro/cliente" className="text-sm text-muted-foreground hover:text-primary">Criar conta</Link></li>
                <li><Link href="/promocoes" className="text-sm text-muted-foreground hover:text-primary">Promoções</Link></li>
                <li><Link href="/seguranca" className="text-sm text-muted-foreground hover:text-primary">Segurança</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Motoristas</h4>
              <ul className="space-y-2">
                <li><Link href="/motoristas/cadastrar" className="text-sm text-muted-foreground hover:text-primary">Seja parceiro</Link></li>
                <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary">Acessar app</Link></li>
                <li><Link href="/ganhos" className="text-sm text-muted-foreground hover:text-primary">Ganhos</Link></li>
                <li><Link href="/documentos" className="text-sm text-muted-foreground hover:text-primary">Documentos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary">Sobre nós</Link></li>
                <li><Link href="/contato" className="text-sm text-muted-foreground hover:text-primary">Contato</Link></li>
                <li><Link href="/termos" className="text-sm text-muted-foreground hover:text-primary">Termos de uso</Link></li>
                <li><Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2024 App Motoristas. Todos os direitos reservados.
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
