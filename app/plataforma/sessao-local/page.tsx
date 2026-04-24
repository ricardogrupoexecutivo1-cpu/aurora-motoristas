"use client";

import { useEffect, useMemo, useState } from "react";

type PerfilTipo = "motorista" | "operadora" | "admin";

type SessaoLocal = {
  perfil: PerfilTipo;
  empresa: string;
  atualizadoEm: string;
};

type FeedbackTipo = "idle" | "saving" | "success" | "error";

const STORAGE_KEY = "aurora_motoristas_plataforma_sessao_local";

const PERFIS: Array<{
  value: PerfilTipo;
  label: string;
  descricao: string;
}> = [
  {
    value: "motorista",
    label: "Motorista interno",
    descricao:
      "Acesso individual e restrito. O motorista vê apenas os próprios serviços autorizados.",
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
      botao: {
        idle: "bg-emerald-600 hover:bg-emerald-700",
        saving: "bg-emerald-500",
        success: "bg-emerald-700",
        error: "bg-red-600 hover:bg-red-700",
      },
    };
  }

  if (perfil === "operadora") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      destaque: "border-amber-100 bg-amber-50 text-amber-900",
      botao: {
        idle: "bg-amber-600 hover:bg-amber-700",
        saving: "bg-amber-500",
        success: "bg-amber-700",
        error: "bg-red-600 hover:bg-red-700",
      },
    };
  }

  return {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    destaque: "border-cyan-100 bg-cyan-50 text-cyan-900",
    botao: {
      idle: "bg-cyan-600 hover:bg-cyan-700",
      saving: "bg-cyan-500",
      success: "bg-cyan-700",
      error: "bg-red-600 hover:bg-red-700",
    },
  };
}

function formatarData(valor: string) {
  if (!valor) return "Ainda não salvo";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data inválida";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(data);
}

function perfilValido(valor: unknown): valor is PerfilTipo {
  return valor === "motorista" || valor === "operadora" || valor === "admin";
}

function lerSessaoLocal(): SessaoLocal | null {
  if (typeof window === "undefined") return null;

  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);

    if (!bruto) return null;

    const parsed = JSON.parse(bruto) as Partial<SessaoLocal>;

    if (!perfilValido(parsed?.perfil)) return null;

    return {
      perfil: parsed.perfil,
      empresa:
        typeof parsed.empresa === "string" && parsed.empresa.trim()
          ? parsed.empresa.trim()
          : "Empresa não informada",
      atualizadoEm:
        typeof parsed.atualizadoEm === "string" ? parsed.atualizadoEm : "",
    };
  } catch {
    return null;
  }
}

export default function PlataformaSessaoLocalPage() {
  const [mounted, setMounted] = useState(false);
  const [perfil, setPerfil] = useState<PerfilTipo>("motorista");
  const [empresa, setEmpresa] = useState("Base Interna");
  const [sessaoSalva, setSessaoSalva] = useState<SessaoLocal | null>(null);
  const [status, setStatus] = useState(
    "Sessão local ainda não salva nesta etapa."
  );
  const [feedback, setFeedback] = useState<FeedbackTipo>("idle");

  useEffect(() => {
    setMounted(true);

    const sessao = lerSessaoLocal();

    if (!sessao) {
      setStatus("Sessão local ainda não salva nesta etapa.");
      return;
    }

    setPerfil(sessao.perfil);
    setEmpresa(sessao.empresa);
    setSessaoSalva(sessao);
    setStatus("Sessão local carregada com sucesso.");
  }, []);

  useEffect(() => {
    if (feedback !== "success") return;

    const timer = window.setTimeout(() => {
      setFeedback("idle");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const perfilSelecionado = useMemo(
    () => PERFIS.find((item) => item.value === perfil) ?? PERFIS[0],
    [perfil]
  );

  const cores = corPorPerfil(perfil);

  const rotaPainel = `/plataforma/motoristas/painel`;

  function labelBotaoSalvar() {
    if (feedback === "saving") return "Salvando...";
    if (feedback === "success") return "Salvo âœ“";
    if (feedback === "error") return "Tentar salvar novamente";
    return "Salvar sessão local";
  }

  function classeBotaoSalvar() {
    if (feedback === "saving") return cores.botao.saving;
    if (feedback === "success") return cores.botao.success;
    if (feedback === "error") return cores.botao.error;
    return cores.botao.idle;
  }

  function salvarSessaoLocal() {
    if (typeof window === "undefined") {
      setFeedback("error");
      setStatus("Salvar não disponível fora do navegador.");
      return;
    }

    setFeedback("saving");
    setStatus("Salvando sessão local nesta camada isolada...");

    try {
      const payload: SessaoLocal = {
        perfil,
        empresa: empresa.trim() || "Empresa não informada",
        atualizadoEm: new Date().toISOString(),
      };

      const serializado = JSON.stringify(payload);

      window.localStorage.setItem(STORAGE_KEY, serializado);

      const confirmacao = lerSessaoLocal();

      if (!confirmacao) {
        setFeedback("error");
        setStatus(
          "A tentativa de salvar ocorreu, mas a leitura de confirmação falhou."
        );
        setSessaoSalva(null);
        return;
      }

      setSessaoSalva(confirmacao);
      setPerfil(confirmacao.perfil);
      setEmpresa(confirmacao.empresa);
      setFeedback("success");
      setStatus("Sessão local salva com sucesso nesta camada isolada.");
    } catch (error) {
      console.error("Erro ao salvar sessão local:", error);
      setFeedback("error");
      setStatus("Não foi possível salvar a sessão local neste navegador.");
    }
  }

  function limparSessaoLocal() {
    if (typeof window === "undefined") {
      setFeedback("error");
      setStatus("Limpeza não disponível fora do navegador.");
      return;
    }

    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setSessaoSalva(null);
      setFeedback("idle");
      setStatus("Sessão local removida com sucesso.");
    } catch (error) {
      console.error("Erro ao limpar sessão local:", error);
      setFeedback("error");
      setStatus("Não foi possível remover a sessão local.");
    }
  }

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
              href="/plataforma/entrar"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Entrada controlada
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Sessão local isolada
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Sessão local controlada por perfil
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Esta página salva localmente no navegador o perfil e a empresa
                usados na nova camada da plataforma. É um passo Ambiente seguro para
                preparar a futura ligação com sessão real, ainda sem tocar no
                login oficial, na API ou no banco.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Etapa atual
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Persistir o perfil sem encostar na produção
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-200">
                Primeiro persistimos o contexto localmente. Depois, em outra
                etapa controlada, trocamos essa leitura local por uma sessão
                real da plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Configuração da sessão
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Escolha o perfil e salve localmente
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

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={salvarSessaoLocal}
                  disabled={!mounted || feedback === "saving"}
                  className={`inline-flex min-w-[190px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${classeBotaoSalvar()}`}
                >
                  {labelBotaoSalvar()}
                </button>

                <button
                  type="button"
                  onClick={limparSessaoLocal}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Limpar sessão local
                </button>

                <a
                  href={rotaPainel}
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Abrir painel deste perfil
                </a>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <strong>Leitura do botão:</strong>{" "}
                ao clicar em salvar, ele muda para <strong>Salvando...</strong>,
                depois mostra <strong>Salvo âœ“</strong> quando a sessão for
                gravada corretamente.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span
                className={`inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cores.badge}`}
              >
                Contexto atual
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {perfilSelecionado.label}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {perfilSelecionado.descricao}
              </p>

              <div
                className={`mt-5 rounded-2xl border p-4 text-sm leading-7 ${cores.destaque}`}
              >
                Empresa atual:{" "}
                <strong>{empresa.trim() || "Empresa não informada"}</strong>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <strong>Status:</strong> {status}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Sessão salva no navegador
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Leitura local persistida
              </h2>

              {sessaoSalva ? (
                <div className="mt-5 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  <p>
                    <strong>Perfil salvo:</strong>{" "}
                    {sessaoSalva.perfil === "motorista"
                      ? "Motorista interno"
                      : sessaoSalva.perfil === "operadora"
                        ? "Operadora externa"
                        : "Admin master"}
                  </p>
                  <p>
                    <strong>Empresa salva:</strong> {sessaoSalva.empresa}
                  </p>
                  <p>
                    <strong>Atualizado em:</strong>{" "}
                    {formatarData(sessaoSalva.atualizadoEm)}
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  Nenhuma sessão local salva até agora nesta camada.
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                Limites desta etapa
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                O que esta sessão local faz e o que ainda não faz
              </h2>

              <ul className="mt-6 space-y-4">
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Salva perfil e empresa localmente no navegador atual.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Não altera autenticação oficial, banco, API ou sessão real.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Prepara a transição futura para uma leitura real de perfil com segurança.</span>
                </li>
                <li className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>Respeita a regra de não tocar na produção já publicada.</span>
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
            momentÃ¢neas durante melhorias. Esta página foi criada como camada
            nova e isolada para validar persistência local de perfil sem tocar
            na base já publicada.
          </p>
        </div>
      </section>
    </main>
  );
}

