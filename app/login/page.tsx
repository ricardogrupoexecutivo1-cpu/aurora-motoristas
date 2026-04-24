"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Navigation,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Car,
  Building2,
  Shield,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Fingerprint,
  Briefcase,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SessionFallback = {
  role: string;
  empresa: string;
  status: string;
};

type LoginType = "passageiro" | "motorista" | "empresa";

const SESSION_FALLBACK_BY_EMAIL: Record<string, SessionFallback> = {
  "ricardogrupoexecutivo1@gmail.com": {
    role: "admin_master",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "grupoexecutivoservice1@gmail.com": {
    role: "operacional",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "grupoexecutivo1@gmail.com": {
    role: "operacional",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
  "finance@ges.com": {
    role: "financeiro",
    empresa: "GES TRANSPORTADORA LTDA",
    status: "ativo",
  },
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function getFallbackSession(email: string): SessionFallback {
  return (
    SESSION_FALLBACK_BY_EMAIL[email] || {
      role: "",
      empresa: "",
      status: "ativo",
    }
  );
}

export default function LoginPage() {
  const [loginType, setLoginType] = useState<LoginType>("passageiro");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const emailNormalizado = useMemo(() => normalizeEmail(email), [email]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const emailFinal = normalizeEmail(email);
    const senhaFinal = senha;

    if (!emailFinal) {
      setError("Informe seu e-mail.");
      return;
    }

    if (!senhaFinal) {
      setError("Informe sua senha.");
      return;
    }

    try {
      setSaving(true);
      setStatus("Entrando...");
      setError("");

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: emailFinal,
        password: senhaFinal,
      });

      if (authError) {
        setError("E-mail ou senha incorretos. Tente novamente.");
        setSaving(false);
        return;
      }

      try {
        if (typeof window !== "undefined") {
          const roleAuth =
            normalizeText(data?.user?.app_metadata?.role) ||
            normalizeText(data?.user?.user_metadata?.role);

          const empresaAuth =
            normalizeText(data?.user?.app_metadata?.empresa) ||
            normalizeText(data?.user?.user_metadata?.empresa);

          const statusAuth =
            normalizeText(data?.user?.app_metadata?.status) ||
            normalizeText(data?.user?.user_metadata?.status);

          const fallback = getFallbackSession(emailFinal);

          const roleFinal = normalizeText(roleAuth || fallback.role).toLowerCase();
          const empresaFinal = normalizeText(empresaAuth || fallback.empresa);
          const statusFinal = normalizeText(statusAuth || fallback.status).toLowerCase();

          window.localStorage.setItem("aurora_session_email", emailFinal);
          window.localStorage.setItem("Aurora Motoristas_login_type", loginType);

          if (roleFinal) {
            window.localStorage.setItem("aurora_session_role", roleFinal);
          }
          if (empresaFinal) {
            window.localStorage.setItem("aurora_session_empresa", empresaFinal);
          }
          if (statusFinal) {
            window.localStorage.setItem("aurora_session_status", statusFinal);
          }
        }
      } catch {
        // mantÃ©m o login funcionando mesmo se localStorage falhar
      }

      setStatus("Login realizado com sucesso!");

      // Redirecionar baseado no tipo de login
      if (loginType === "passageiro") {
        window.location.href = "/solicitar";
      } else if (loginType === "motorista") {
        window.location.href = "/motorista";
      } else if (loginType === "empresa") {
        window.location.href = "/plataforma";
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao entrar.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  const loginTypes = [
    { id: "passageiro", label: "Passageiro", icon: User, color: "primary" },
    { id: "motorista", label: "Motorista", icon: Car, color: "success" },
    { id: "empresa", label: "Empresa", icon: Building2, color: "warning" },
  ];

  return (
    <main className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 lg:p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black">Aurora Motoristas</span>
          </Link>
        </header>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-black text-foreground mb-2">
                Bem-vindo de volta
              </h1>
              <p className="text-muted-foreground">
                Entre na sua conta Aurora Motoristas para continuar
              </p>
            </div>

            {/* Login Type Selector */}
            <div className="flex p-1.5 bg-secondary rounded-2xl mb-6">
              {loginTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setLoginType(type.id as LoginType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                    loginType === type.id
                      ? type.color === "primary"
                        ? "bg-primary text-white shadow-lg"
                        : type.color === "success"
                        ? "bg-success text-white shadow-lg"
                        : "bg-warning text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{type.label}</span>
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {status && !error && (
              <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-xl mb-6">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <p className="text-sm text-success">{status}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={entrar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-secondary rounded-xl border border-transparent focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">Lembrar de mim</span>
                </label>
                <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                  Esqueci a senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={saving}
                className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                  loginType === "passageiro"
                    ? "bg-primary text-white hover:bg-primary/90 shadow-primary/25"
                    : loginType === "motorista"
                    ? "bg-success text-white hover:bg-success/90 shadow-success/25"
                    : "bg-warning text-white hover:bg-warning/90 shadow-warning/25"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">ou continue com</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl font-medium hover:bg-secondary/80 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 bg-secondary rounded-xl font-medium hover:bg-secondary/80 transition-colors"
              >
                <Smartphone className="w-5 h-5" />
                SMS
              </button>
            </div>

            {/* Biometric */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 mt-3 bg-card border border-border rounded-xl font-medium hover:border-primary/50 transition-colors"
            >
              <Fingerprint className="w-5 h-5 text-primary" />
              Entrar com biometria
            </button>

            {/* Quick Access Links */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Link
                href="/servicos/novo"
                className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
              >
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Novo serviÃ§o</span>
              </Link>
              <Link
                href="/motoristas/cadastrar"
                className="flex items-center gap-2 p-3 bg-card border border-border rounded-xl hover:border-success/50 transition-colors"
              >
                <Car className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Ser motorista</span>
              </Link>
            </div>

            {/* Create Account */}
            <p className="text-center mt-8 text-muted-foreground">
              Ainda nÃ£o tem conta?{" "}
              <Link href="/cadastro" className="text-primary font-semibold hover:underline">
                Criar conta grÃ¡tis
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Info (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary to-cyan-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute bottom-40 left-20 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 right-40 w-20 h-20 border-4 border-white rounded-full" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-4">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-semibold">Taxa de apenas 5%</span>
          </div>
        </div>

        <div className="relative text-white">
          <h2 className="text-4xl xl:text-5xl font-black mb-6 leading-tight">
            A mobilidade inteligente que vocÃª merece
          </h2>
          <p className="text-lg xl:text-xl text-white/80 mb-10 leading-relaxed">
            Com o Aurora Motoristas, vocÃª viaja com seguranÃ§a, economia e praticidade.
            A menor taxa do mercado e tecnologia de ponta para vocÃª.
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: "100% dos motoristas verificados" },
              { icon: CheckCircle, text: "Taxa de apenas 5% - a menor do Brasil" },
              { icon: Smartphone, text: "Pagamento via PIX, cartÃ£o ou dinheiro" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-bold"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <div>
            <p className="font-bold text-lg">+800K usuÃ¡rios</p>
            <p className="text-sm text-white/70">confiam no Aurora Motoristas</p>
          </div>
        </div>
      </div>
    </main>
  );
}

