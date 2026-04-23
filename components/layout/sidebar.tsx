"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Navigation,
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
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
  Calendar,
  Map,
  Truck,
  CreditCard,
  PieChart,
  Bell,
  UserCheck,
  Cog,
  Layers,
} from "lucide-react";

interface SidebarProps {
  userType?: "admin" | "motorista" | "cliente" | "empresa";
}

export default function Sidebar({ userType = "admin" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = {
    admin: [
      { name: "Dashboard", href: "/plataforma", icon: Home, badge: null },
      { name: "Corridas", href: "/solicitar", icon: Car, badge: "12" },
      { name: "Entregas", href: "/entregas", icon: Package, badge: "5" },
      { name: "Motoristas", href: "/motoristas", icon: Users, badge: null },
      { name: "Empresas", href: "/empresas", icon: Building2, badge: null },
      { name: "Clientes", href: "/clientes", icon: UserCheck, badge: null },
      { name: "Servicos", href: "/servicos", icon: FileText, badge: null },
      { name: "Operacao", href: "/operacao", icon: Layers, badge: null },
      { name: "Escala", href: "/escala", icon: Calendar, badge: null },
      { name: "Financeiro", href: "/financeiro", icon: DollarSign, badge: null },
      { name: "Pagamentos", href: "/pagamentos", icon: CreditCard, badge: null },
      { name: "Relatorios", href: "/relatorios", icon: BarChart3, badge: null },
    ],
    motorista: [
      { name: "Painel", href: "/motorista", icon: Home, badge: null },
      { name: "Corridas", href: "/motorista/corridas", icon: Car, badge: "3" },
      { name: "Mapa", href: "/motorista/mapa", icon: Map, badge: null },
      { name: "Ganhos", href: "/motorista/ganhos", icon: DollarSign, badge: null },
      { name: "Historico", href: "/historico", icon: FileText, badge: null },
      { name: "Avaliacoes", href: "/motorista/avaliacoes", icon: BarChart3, badge: null },
    ],
    cliente: [
      { name: "Inicio", href: "/", icon: Home, badge: null },
      { name: "Pedir Corrida", href: "/solicitar", icon: Car, badge: null },
      { name: "Enviar Entrega", href: "/entregas", icon: Package, badge: null },
      { name: "Historico", href: "/historico", icon: FileText, badge: null },
      { name: "Favoritos", href: "/favoritos", icon: BarChart3, badge: null },
    ],
    empresa: [
      { name: "Dashboard", href: "/plataforma", icon: Home, badge: null },
      { name: "Servicos", href: "/servicos", icon: FileText, badge: null },
      { name: "Cotacoes", href: "/plataforma/cotacoes", icon: DollarSign, badge: "2" },
      { name: "Motoristas", href: "/motoristas", icon: Users, badge: null },
      { name: "Relatorios", href: "/relatorios", icon: BarChart3, badge: null },
    ],
  };

  const bottomNav = [
    { name: "Configuracoes", href: "/configuracoes", icon: Cog },
    { name: "Ajuda", href: "/plataforma/ajuda", icon: HelpCircle },
  ];

  const currentNav = navigation[userType];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 z-40 glass-card border-r border-white/10 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full gradient-premium text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {currentNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? "gradient-premium text-white shadow-lg neon-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {item.badge && !collapsed && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.badge && collapsed && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-card border border-white/10 text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="px-3">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Bottom Navigation */}
        <nav className="px-3 py-4 space-y-1">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? "gradient-premium text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-card border border-white/10 text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Logout */}
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all group relative">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 rounded-lg bg-card border border-white/10 text-sm whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg z-50">
                Sair
              </div>
            )}
          </button>
        </nav>

        {/* Pro Badge */}
        {!collapsed && (
          <div className="px-3 pb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold text-sm">MOVO Pro</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Desbloqueie recursos exclusivos e aumente seus ganhos.
              </p>
              <button className="w-full py-2 rounded-xl gradient-premium text-white text-sm font-medium hover:shadow-lg hover:shadow-primary/25 transition-all">
                Conhecer
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
