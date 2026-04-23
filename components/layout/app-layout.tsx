"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  DollarSign,
  Settings,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Building2,
  Package,
  MapPin,
  BarChart3,
  HelpCircle,
  Navigation,
  Home,
  MessageCircle,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
};

const mainNav: NavItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Dashboard", href: "/plataforma", icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Servicos", href: "/servicos", icon: <FileText className="w-5 h-5" />, badge: 5 },
  { label: "Motoristas", href: "/motoristas", icon: <Car className="w-5 h-5" /> },
  { label: "Clientes", href: "/clientes", icon: <Users className="w-5 h-5" /> },
  { label: "Empresas", href: "/empresas", icon: <Building2 className="w-5 h-5" /> },
  { label: "Operacao", href: "/operacao", icon: <MapPin className="w-5 h-5" /> },
  { label: "Financeiro", href: "/financeiro", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Relatorios", href: "/relatorios", icon: <BarChart3 className="w-5 h-5" /> },
];

const secondaryNav: NavItem[] = [
  { label: "Configuracoes", href: "/configuracoes", icon: <Settings className="w-5 h-5" /> },
  { label: "Ajuda", href: "/plataforma/ajuda", icon: <HelpCircle className="w-5 h-5" /> },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border
        transform transition-transform duration-300 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center shadow-lg">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl gradient-text">MOVO</span>
              <p className="text-[9px] text-muted-foreground tracking-widest -mt-1">BUSINESS</p>
            </div>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Menu Principal</p>
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`
                    px-2 py-0.5 text-xs font-bold rounded-full
                    ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}
                  `}>
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}

          <div className="pt-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">Sistema</p>
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="w-8 h-8 rounded-full gradient-premium flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">MOVO Pro</p>
              <p className="text-xs text-muted-foreground">Plano Empresarial</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Mobile menu */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar servicos, motoristas, clientes..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-0 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/5531997490074" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 hover:bg-muted rounded-xl transition-colors text-success"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button className="relative p-2.5 hover:bg-muted rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button className="flex items-center gap-2 p-1.5 pr-3 hover:bg-muted rounded-xl transition-colors">
                <div className="w-8 h-8 rounded-full gradient-premium flex items-center justify-center">
                  <span className="text-sm font-bold text-white">R</span>
                </div>
                <span className="text-sm font-medium hidden md:block">Ricardo</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
