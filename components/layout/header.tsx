"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navigation,
  Menu,
  X,
  Home,
  Car,
  Package,
  Users,
  Building2,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Truck,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

interface HeaderProps {
  userType?: "admin" | "motorista" | "cliente" | "empresa";
  userName?: string;
  userAvatar?: string;
}

export default function Header({ userType = "admin", userName = "Usuario", userAvatar }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const navigation = {
    admin: [
      { name: "Dashboard", href: "/plataforma", icon: Home },
      { name: "Corridas", href: "/solicitar", icon: Car },
      { name: "Entregas", href: "/entregas", icon: Package },
      { name: "Motoristas", href: "/motoristas", icon: Users },
      { name: "Empresas", href: "/empresas", icon: Building2 },
      { name: "Servicos", href: "/servicos", icon: FileText },
      { name: "Financeiro", href: "/financeiro", icon: DollarSign },
      { name: "Relatorios", href: "/relatorios", icon: BarChart3 },
    ],
    motorista: [
      { name: "Painel", href: "/motorista", icon: Home },
      { name: "Corridas", href: "/motorista/corridas", icon: Car },
      { name: "Ganhos", href: "/motorista/ganhos", icon: DollarSign },
      { name: "Avaliacoes", href: "/motorista/avaliacoes", icon: BarChart3 },
      { name: "Ajuda", href: "/plataforma/ajuda", icon: HelpCircle },
    ],
    cliente: [
      { name: "Inicio", href: "/", icon: Home },
      { name: "Pedir Corrida", href: "/solicitar", icon: Car },
      { name: "Enviar Entrega", href: "/entregas", icon: Package },
      { name: "Historico", href: "/historico", icon: FileText },
      { name: "Ajuda", href: "/plataforma/ajuda", icon: HelpCircle },
    ],
    empresa: [
      { name: "Dashboard", href: "/plataforma", icon: Home },
      { name: "Servicos", href: "/servicos", icon: FileText },
      { name: "Cotacoes", href: "/plataforma/cotacoes", icon: DollarSign },
      { name: "Relatorios", href: "/relatorios", icon: BarChart3 },
      { name: "Ajuda", href: "/plataforma/ajuda", icon: HelpCircle },
    ],
  };

  const currentNav = navigation[userType];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center shadow-lg neon-primary">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl gradient-text">MOVO</span>
              <p className="text-[9px] text-muted-foreground tracking-widest -mt-1">
                {userType === "admin" ? "BUSINESS" : userType === "motorista" ? "DRIVER" : "APP"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {currentNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "gradient-premium text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 transition-all">
              <Search className="w-4 h-4" />
              <span className="text-sm">Buscar...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-all"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl border border-white/10 shadow-2xl p-4 animate-slide-up">
                  <h3 className="font-bold mb-3">Notificacoes</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Nova corrida disponivel", time: "Agora", icon: Car, color: "text-primary" },
                      { title: "Pagamento recebido", time: "5 min", icon: DollarSign, color: "text-success" },
                      { title: "Nova avaliacao", time: "1h", icon: BarChart3, color: "text-warning" },
                    ].map((notif, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                        <div className={`p-2 rounded-lg bg-white/5 ${notif.color}`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notif.title}</p>
                          <p className="text-xs text-muted-foreground">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 text-center text-sm text-primary hover:underline">
                    Ver todas
                  </button>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all"
              >
                <div className="w-8 h-8 rounded-lg gradient-premium flex items-center justify-center text-white font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-sm font-medium">{userName}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl border border-white/10 shadow-2xl p-2 animate-slide-up">
                  <div className="px-3 py-2 border-b border-white/10 mb-2">
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userType}</p>
                  </div>
                  <Link href="/perfil" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Configuracoes</span>
                  </Link>
                  <Link href="/plataforma/ajuda" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Ajuda</span>
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-white/10 animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {currentNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "gradient-premium text-white"
                      : "text-muted-foreground hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
