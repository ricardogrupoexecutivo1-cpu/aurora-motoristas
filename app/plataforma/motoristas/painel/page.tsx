"use client";

import { useEffect, useMemo, useState } from "react";

type PerfilTipo = "motorista" | "operadora" | "admin";

type SessaoLocal = {
  perfil: PerfilTipo;
  empresa: string;
  atualizadoEm?: string;
};

const STORAGE_KEY = "aurora_motoristas_plataforma_sessao_local";

const LABELS: Record<PerfilTipo, string> = {
  motorista: "Motorista interno",
  operadora: "Operadora externa",
  admin: "Admin master",
};

const DESCRICOES: Record<PerfilTipo, string> = {
  motorista:
    "Leitura individual e restrita. O motorista vê apenas a própria operação autorizada e não acessa base completa, inteligência comercial ou relatórios estratégicos.",
  operadora:
    "Leitura segregada por empresa. A operadora externa atua apenas dentro da própria estrutura aprovada, sem qualquer acesso à base interna master.",
  admin:
    "Visão de governança protegida. A administração master controla segregação, liberação, auditoria e blindagem da rede interna de motoristas.",
};

const ALERTAS: Record<PerfilTipo, string> = {
  motorista:
    "Você não pode visualizar outros motoristas, base consolidada ou relatórios administrativos.",
  operadora:
    "Você não pode pesquisar, listar, exportar ou sugerir motoristas da base interna master.",
  admin:
    "Sua visão é administrativa e protegida. Mesmo com acesso amplo, a plataforma deve preservar segregação e trilha de governança.",
};

const CARDS: Record<
  PerfilTipo,
  Array<{
    titulo: string;
    valor: string;
    descricao: string;
  }>
> = {
  motorista: [
    {
      titulo: "Serviços visíveis",
      valor: "Somente os seus",
      descricao:
        "A visão do motorista é individual. Nada de base completa ou leitura de colegas.",
    },
    {
      titulo: "Base de motoristas",
      valor: "Bloqueada",
      descricao:
        "Lista completa, busca ampla e leitura consolidada permanecem protegidas.",
    },
    {
      titulo: "Histórico após pagamento",
      valor: "Oculto da sua visão",
      descricao:
        "Após baixa final, o serviço sai da visão do motorista e permanece apenas no histórico interno protegido.",
    },
  ],
  operadora: [
    {
      titulo: "Estrutura liberada",
      valor: "Somente a própria",
      descricao:
        "A operadora externa só trabalha com a base vinculada à própria empresa aprovada.",
    },
    {
      titulo: "Base interna master",
      valor: "Inacessível",
      descricao:
        "A rede principal de motoristas não pode ser listada, pesquisada, exportada ou sugerida.",
    },
    {
      titulo: "Relatórios estratégicos",
      valor: "Bloqueados",
      descricao:
        "Sem margens globais, inteligência comercial, contatos internos ou visão consolidada da operação principal.",
    },
  ],
  admin: [
    {
      titulo: "Governança",
      valor: "Ativa",
      descricao:
        "Controle total da política de acesso, segregação por empresa e proteção da rede interna.",
    },
    {
      titulo: "Auditoria",
      valor: "Protegida",
      descricao:
        "A administração acompanha regras, acessos, histórico e blindagem sem expor o ativo principal a terceiros.",
    },
    {
      titulo: "Segregação",
      valor: "Obrigatória",
      descricao:
        "Mesmo na visão master, cada camada deve respeitar empresa, papel, escopo e necessidade de leitura.",
    },
  ],
};

const REGRAS: Record<PerfilTipo, string[]> = {
  motorista: [
    "Ver apenas os próprios serviços autorizados.",
    "Não enxergar outros motoristas da rede.",
    "Não acessar relatórios estratégicos.",
    "Não acessar margens ou visão consolidada.",
    "Perder a visualização do serviço após pagamento ou baixa final.",
  ],
  operadora: [
    "Usar somente a própria base vinculada à própria empresa.",
    "Nunca acessar a base interna master.",
    "Não pesquisar, exportar, listar ou sugerir motoristas internos.",
    "Não acessar histórico interno da operação principal.",
    "Depender de autorização formal e plano ativo.",
  ],
  admin: [
    "Controlar segregação rígida por empresa.",
    "Liberar ou bloquear estruturas e perfis.",
    "Proteger a base interna de motoristas.",
    "Auditar leitura, histórico e regras de exposição.",
    "Impedir aproveitamento comercial da rede interna por terceiros.",
  ],
};

const ACOES: Record<
  PerfilTipo,
  Array<{
    titulo: string;
    texto: string;
  }>
> = {
  motorista: [
    {
      titulo: "Área operacional individual",
      texto:
        "Acesso apenas à própria jornada de trabalho, sem navegação pela base completa.",
    },
    {
      titulo: "Serviços dentro da janela permitida",
      texto:
        "Somente serviços autorizados e ainda visíveis operacionalmente permanecem na sua leitura.",
    },
    {
      titulo: "Histórico protegido",
      texto:
        "Após pagamento, o registro continua existindo internamente, mas fora da visão do motorista.",
    },
  ],
  operadora: [
    {
      titulo: "Operação por empresa",
      texto:
        "Sua empresa atua apenas dentro da própria estrutura aprovada e segregada.",
    },
    {
      titulo: "Sem aproveitamento da rede interna",
      texto:
        "A plataforma não entrega contatos, listas, histórico nem base estratégica da operação principal.",
    },
    {
      titulo: "Plano e autorização",
      texto:
        "A permanência da operadora externa depende de regras comerciais e governança válidas.",
    },
  ],
  admin: [
    {
      titulo: "Controle central",
      texto:
        "A administração master audita, corrige, libera e bloqueia com trilha de governança.",
    },
    {
      titulo: "Blindagem da base",
      texto:
        "A rede interna é ativo estratégico e deve permanecer protegida em caráter permanente.",
    },
    {
      titulo: "Escala com segurança",
      texto:
        "A plataforma pode crescer por camadas sem quebrar produção e sem expor a estrutura principal.",
    },
  ],
};

function perfilValido(valor: unknown): valor is PerfilTipo {
  return valor === "motorista" || valor === "operadora" || valor === "admin";
}

function corPerfil(perfil: PerfilTipo) {
  if (perfil === "motorista") {
    return {
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      caixa: "from-emerald-900 via-emerald-800 to-cyan-900",
      destaque: "border-emerald-100 bg-emerald-50 text-emerald-900",
      botao: "bg-emerald-600 hover:bg-emerald-700",
    };
  }

  if (perfil === "operadora") {
    return {
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      caixa: "from-amber-900 via-orange-800 to-slate-900",
      destaque: "border-amber-100 bg-amber-50 text-amber-900",
      botao: "bg-amber-600 hover:bg-amber-700",
    };
  }

  return {
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700",
    caixa: "from-slate-900 via-cyan-900 to-blue-900",
    destaque: "border-cyan-100 bg-cyan-50 text-cyan-900",
    botao: "bg-cyan-600 hover:bg-cyan-700",
  };
}

function formatarData(valor?: string) {
  if (!valor) return "Sem registro de atualização";

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) return "Sem registro de atualização";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(data);
}

export default function PlataformaMotoristasPainelPage() {
  const [perfil, setPerfil] = useState<PerfilTipo>("motorista");
  const [empresa, setEmpresa] = useState("Base Interna");
  const [atualizadoEm, setAtualizadoEm] = useState<string>("");
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const bruto = window.localStorage.getItem(STORAGE_KEY);

      if (bruto) {
        const parsed = JSON.parse(bruto) as Partial<SessaoLocal>;

        if (perfilValido(parsed?.perfil)) {
          setPerfil(parsed.perfil);
        }

        if (typeof parsed?.empresa === "string" && parsed.empresa.trim()) {
          setEmpresa(parsed.empresa.trim());
        }

        if (
          typeof parsed?.atualizadoEm === "string" &&
          parsed.atualizadoEm.trim()
        ) {
          setAtualizadoEm(parsed.atualizadoEm);
        }
      }
    } catch (error) {
      console.error("Erro ao ler sessão local do painel:", error);
    } finally {
      setCarregado(true);
    }
  }, []);

  const cores = corPerfil(perfil);

  const infoSessao = useMemo(
    () => ({
      perfil: LABELS[perfil],
      empresa,
      atualizadoEm: formatarData(atualizadoEm),
    }),
    [perfil, empresa, atualizadoEm]
  );

  if (!carregado) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12 md:px-8">
          <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Aurora Motoristas • Sessão automática
            </span>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Carregando painel por perfil
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Estamos lendo a sessão local salva nesta camada isolada para abrir
              o painel correto sem tocar na produção publicada.
            </p>
          </div>
        </section>
      </main>
    );
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
              href="/plataforma/sessao-local"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Alterar sessão
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div>
              <span
                className={`inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cores.badge}`}
              >
                Painel por perfil • Sessão automática
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                {LABELS[perfil]}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                {DESCRICOES[perfil]}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/plataforma/sessao-local"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Alterar sessão salva
                </a>

                <a
                  href="/plataforma/motoristas"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Ver blindagem
                </a>
              </div>
            </div>

            <div
              className={`rounded-3xl bg-gradient-to-br p-6 text-white shadow-sm ${cores.caixa}`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Sessão carregada automaticamente
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Leitura segura por papel
              </h2>

              <div className="mt-5 space-y-3 text-sm text-white/90">
                <p>
                  <span className="font-semibold">Perfil:</span>{" "}
                  {infoSessao.perfil}
                </p>
                <p>
                  <span className="font-semibold">Empresa:</span>{" "}
                  {infoSessao.empresa}
                </p>
                <p>
                  <span className="font-semibold">Atualizado em:</span>{" "}
                  {infoSessao.atualizadoEm}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-7 text-white/90">
                {ALERTAS[perfil]}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {CARDS[perfil].map((card) => (
            <article
              key={card.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                {card.titulo}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {card.valor}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {card.descricao}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Regras ativas deste perfil
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              O que esta visão pode e não pode fazer
            </h2>

            <ul className="mt-6 space-y-4">
              {REGRAS[perfil].map((regra) => (
                <li
                  key={regra}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700"
                >
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                  <span>{regra}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <span
              className={`inline-flex rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${cores.badge}`}
            >
              Leitura operacional
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Estrutura de uso por camada
            </h2>

            <div className="mt-6 space-y-4">
              {ACOES[perfil].map((acao, index) => (
                <article
                  key={acao.titulo}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {acao.titulo}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {acao.texto}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-8">
        <div
          className={`rounded-[2rem] border p-6 shadow-sm md:p-8 ${cores.destaque}`}
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div>
              <span className="inline-flex rounded-full border border-current/10 bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                Trava de segurança
              </span>

              <h2 className="mt-3 text-2xl font-bold">
                Bloqueio imediato em tentativa de acesso indevido
              </h2>

              <p className="mt-4 text-sm leading-7">
                Qualquer tentativa de acessar base interna sem permissão,
                pesquisar motoristas fora do escopo autorizado, exportar dados
                protegidos ou romper a segregação da plataforma deve permitir
                bloqueio imediato do acesso e revisão administrativa.
              </p>
            </div>

            <div className="rounded-3xl border border-current/10 bg-white/70 p-5">
              <h3 className="text-base font-bold">
                Próxima ligação segura com o sistema real
              </h3>
              <p className="mt-3 text-sm leading-7">
                O próximo passo será manter esta leitura visual premium e ligar
                o perfil ao usuário real da sessão, sem mexer na base já
                publicada e sem quebrar produção.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/plataforma/sessao-local"
                  className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Alterar sessão
                </a>

                <a
                  href="/plataforma/acessos"
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white transition ${cores.botao}`}
                >
                  Voltar para acessos
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <p className="text-sm leading-7 text-slate-500">
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas durante melhorias. Esta página foi criada como camada
            nova e isolada para validar leitura automática da sessão sem tocar
            na base já publicada.
          </p>
        </div>
      </section>
    </main>
  );
}