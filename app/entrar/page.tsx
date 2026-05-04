"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuroraSession } from "../lib/aurora-session";

export default function EntrarPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    setErro("");

    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      setErro("Informe e-mail e senha para entrar.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLimpo,
          senha: senhaLimpa,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok || !result.user) {
        setErro(result.error || "E-mail ou senha inválidos.");
        return;
      }

      const user = result.user;

      saveAuroraSession({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        driver_id: user.driver_id ?? null,
        client_id: user.client_id ?? null,
      });

      if (user.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }

      if (user.role === "motorista") {
        router.push("/motoristas/painel");
        return;
      }

      if (user.role === "cliente") {
        router.push("/clientes/painel");
        return;
      }

      router.push("/acesso-negado");
    } catch {
      setErro("Não foi possível entrar agora. Tente novamente.");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#064e3b_0%,#020617_38%,#000_100%)] px-4 py-10 text-white">
      <section className="mx-auto max-w-md rounded-[2rem] border border-emerald-400/40 bg-slate-950/90 p-6 shadow-[0_0_45px_rgba(34,197,94,0.18)]">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
          Aurora Motoristas
        </p>

        <h1 className="mt-4 text-3xl font-black text-emerald-300">
          Entrar na plataforma
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-300">
          Acesso oficial por perfil. Cada usuário entra somente na área permitida:
          admin, cliente ou motorista.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-200">E-mail</span>
            <input
              className="mt-2 h-12 w-full rounded-2xl border border-emerald-400/35 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.16)]"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seuemail@empresa.com"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-200">Senha</span>
            <input
              type="password"
              className="mt-2 h-12 w-full rounded-2xl border border-emerald-400/35 bg-slate-900 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.16)]"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
            />
          </label>

          {erro && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-3 text-sm font-bold text-red-200">
              {erro}
            </div>
          )}

          <button
            type="button"
            onClick={entrar}
            className="w-full rounded-2xl border border-cyan-300 bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:opacity-90"
          >
            Entrar
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-xs leading-5 text-emerald-100">
          <p className="font-black text-emerald-200">Acesso oficial Aurora</p>
          <p className="mt-2">
            Não existem mais acessos de teste públicos. O admin cria os usuários
            reais e cada cliente/motorista acessa com suas próprias credenciais.
          </p>
        </div>
      </section>
    </main>
  );
}