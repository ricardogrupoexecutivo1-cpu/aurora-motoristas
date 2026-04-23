"use client";

import Link from "next/link";
import {
  Navigation,
  MessageCircle,
  PhoneCall,
  Send,
  Shield,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo e Descricao */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-premium flex items-center justify-center shadow-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">MOVO</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A plataforma mais completa de mobilidade e entregas do Brasil. Taxa de apenas 5%.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-primary transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Rapidos */}
          <div>
            <h4 className="font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solicitar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pedir Corrida
                </Link>
              </li>
              <li>
                <Link href="/entregas" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Enviar Entrega
                </Link>
              </li>
              <li>
                <Link href="/quero-ser-motorista" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seja Motorista
                </Link>
              </li>
              <li>
                <Link href="/empresas/cadastrar" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link href="/plataforma/ajuda" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Politica de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/seguranca" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Seguranca
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5531997490074"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-success transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-success" />
                (31) 99749-0074
              </a>
              <a
                href="https://wa.me/5531985614993"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-primary" />
                (31) 98561-4993
              </a>
              <a
                href="mailto:ricardogrupoexecutivo1@gmail.com"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Send className="w-4 h-4 text-primary" />
                ricardogrupoexecutivo1@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 mt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            www.appmotoristas.com.br
          </p>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Ambiente 100% seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
