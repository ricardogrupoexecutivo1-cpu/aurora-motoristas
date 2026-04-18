"use client";

import { useMemo, useState } from "react";

type PerfilTipo = "motorista" | "operadora" | "admin";

const PERFIS: Array<{
  value: PerfilTipo;
  label: string;
  descricao: string;
}> = [
  {
    value: "motorista",
    label: "Motorista interno",
    descricao:
      "Acesso individual e restrito. Vê apenas os próprios serviços autorizados.",
  },
  {
    value: "operadora",
    label: "Operadora externa",
    descricao:
      "Acesso segregado por empresa, sem qualquer visão da base interna master.",
  },
  {
    value: "admin",
    label: "Admin master",
    descricao:
      "Visão protegida de governança, liberação, auditoria e blindagem da operação.",
  },
];

function corPorPerfil(perfil: PerfilTipo) {
  if (perfil === "motorista") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      destaque: "border-emerald-100 bg-emerald-50 text-emerald-900",
      botao: "bg-emerald-600 hover:bg-emerald-700",
    };
  }

  if (perfil === "operadora") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      destaque: "border-amber-100 bg-amber-50 text-amber-900",
      botao: "bg-amber-600 hover:bg-amber-700",
    };
  }

  return {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    destaque: "border-cyan-100 bg-cyan-50 text-cyan-900",
    botao: "bg-cyan-600 hover:bg-cyan-700",
  };
}

export default function PlataformaEntrarPage() {
  const [perfil, setPerfil] = useState<PerfilTipo>("motorista");
  const [empresa, setEmpresa] = useState("Base Interna");

  const perfilSelecionado = useMemo(
    () => PERFIS.find((item) => item.value === perfil) ?? PERFIS[0],
    [perfil]
  );

  const cores = corPorPerfil(perfil);

  const rotaPainel = `/plataforma/motoristas/painel?perfil=${perfil}&empresa=${encodeURIComponent(
    empresa.trim() || "Empresa não informada"
  )}`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href="/plataforma"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Voltar para Plataforma
            </a>

            <a
              href="/plataforma/acessos"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Central de acessos
            </a>

            <a
              href="/plataforma/motoristas"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Blindagem de motoristas
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas • Ponte isolada
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Entrada controlada por perfil
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Esta página funciona como uma ponte segura entre a camada nova
                da plataforma e o painel por perfil. Aqui você escolhe o tipo de
                acesso e a empresa de contexto sem tocar no login real nem na
                base já publicada.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Objetivo desta etapa
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Preparar a ligação futura com sessão real
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-200">
                Primeiro validamos a experiência e a segregação por perfil.
                Depois, em passo separado e seguro, conectamos isso à sessão
                verdadeira do sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Seleção controlada
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Escolha o perfil e a empresa
            </h2>

            <div className="mt-6 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Perfil de acesso
                </label>

                <div className="grid gap-3">
                  {PERFIS.map((item) => {
                    const ativo = perfil === item.value;

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setPerfil(item.value)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          ativo
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="text-sm font-bold">{item.label}</div>
                        <div
                          className={`mt-2 text-sm leading-7 ${
                            ativo ? "text-slate-200" : "text-slate-600"
                          }`}
                        >
                          {item.descricao}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="empresa"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Empresa / contexto
                </label>

                <input
                  id="empresa"
                  value={empresa}
                  onChange={(event) => setEmpresa(event.target.value)}
                  placeholder="Ex.: Base Interna, Operadora Parceira, Operação Principal"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                />
              </div>

              <a
                href={rotaPainel}
                className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition ${cores.botao}`}
              >
                Entrar no painel deste perfil
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span
                className={`inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cores.badge}`}
              >
                Perfil selecionado
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {perfilSelecionado.label}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {perfilSelecionado.descricao}
              </p>

              <div className={`mt-5 rounded-2xl border p-4 text-sm leading-7 ${cores.destaque}`}>
                Empresa atual: <strong>{empresa.trim() || "Empresa não informada"}</strong>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                Regras desta ponte
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                O que esta página faz e o que ela ainda não faz
              </h2>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Simula a entrada por perfil de forma isolada e segura.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Não altera login, sessão real, API ou banco de dados.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Prepara o caminho para a próxima etapa de ligação controlada com sessão real.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Respeita a regra de crescer por novas páginas sem tocar na produção publicada.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <p className="text-sm leading-7 text-slate-500">
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas durante melhorias. Esta página foi criada como ponte
            nova e isolada para validar a entrada por perfil sem tocar na base
            já publicada.
          </p>
        </div>
      </section>
    </main>
  );
}