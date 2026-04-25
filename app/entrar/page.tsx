"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuroraSession, AuroraUserRole } from "../lib/aurora-session";

type LoginOption = {
  email: string;
  senha: string;
  role: AuroraUserRole;
  nome: string;
  driver_id?: string | null;
  client_id?: string | null;
};

const usuarios: LoginOption[] = [
  {
    email: "admin@aurora.com",
    senha: "admin123",
    role: "admin",
    nome: "Admin Aurora",
  },
  {
    email: "motorista@aurora.com",
    senha: "motorista123",
    role: "motorista",
    nome: "Motorista Teste Aurora",
    driver_id: "40afbdc5-58a2-41a4-950d-fadad10e2c58",
  },
  {
    email: "cliente@aurora.com",
    senha: "cliente123",
    role: "cliente",
    nome: "Cliente Teste Aurora",
    client_id: "cliente-teste-001",
  },
];

export default function EntrarPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@aurora.com");
  const [senha, setSenha] = useState("admin123");
  const [erro, setErro] = useState("");

  function entrar() {
    setErro("");

    const usuario = usuarios.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase().trim() &&
        item.senha === senha.trim()
    );

    if (!usuario) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    saveAuroraSession({
      id: crypto.randomUUID(),
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
      driver_id: usuario.driver_id ?? null,
      client_id: usuario.client_id ?? null,
    });

    if (usuario.role === "admin") {
      router.push("/central");
      return;
    }

    if (usuario.role === "motorista") {
      router.push("/motoristas/painel");
      return;
    }

    if (usuario.role === "cliente") {
      router.push("/clientes/painel");
      return;
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <section className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">
          Aurora Motoristas
        </p>

        <h1 className="mt-3 text-3xl font-black">Entrar na plataforma</h1>

        <p className="mt-2 text-sm text-slate-600">
          Cada perfil acessa diretamente somente sua área permitida.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-bold">E-mail</span>
            <input
              className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold">Senha</span>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
            />
          </label>

          {erro && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              {erro}
            </div>
          )}

          <button
            onClick={entrar}
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800"
          >
            Entrar
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
          <p className="font-black text-slate-900">Acessos de teste:</p>
          <p>Admin: admin@aurora.com / admin123</p>
          <p>Motorista: motorista@aurora.com / motorista123</p>
          <p>Cliente: cliente@aurora.com / cliente123</p>
        </div>
      </section>
    </main>
  );
}