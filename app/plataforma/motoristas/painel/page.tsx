"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MotoristaResumo = {
  titulo: string;
  descricao: string;
};

type StatusMotorista = "pendente" | "ativo" | "bloqueado";

type AcaoMotorista = "autorizar" | "bloquear" | "inativar";

type MotoristaApiRaw = Record<string, unknown>;

type MotoristaPainel = {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  status: StatusMotorista;
  origem: "api" | "mock";
};

const cardsResumo: MotoristaResumo[] = [
  {
    titulo: "Base protegida",
    descricao:
      "A base interna de motoristas permanece sob controle administrativo, com separaÃ§Ã£o clara entre operaÃ§Ã£o, triagem e uso da plataforma.",
  },
  {
    titulo: "Leitura rÃ¡pida",
    descricao:
      "Esta pÃ¡gina foi criada como camada segura de navegaÃ§Ã£o para evitar quebrar fluxos jÃ¡ em produÃ§Ã£o enquanto evoluÃ­mos o restante do sistema.",
  },
  {
    titulo: "ExpansÃ£o controlada",
    descricao:
      "A partir daqui podemos ligar novas funÃ§Ãµes, relatÃ³rios, filtros e aÃ§Ãµes administrativas sem mexer nas pÃ¡ginas antigas.",
  },
];

const motoristasMockBase: MotoristaPainel[] = [
  {
    id: "mock-1",
    nome: "JoÃ£o da Silva",
    telefone: "(31) 99999-1111",
    cidade: "Belo Horizonte â€¢ MG",
    status: "pendente",
    origem: "mock",
  },
  {
    id: "mock-2",
    nome: "Carlos Mendes",
    telefone: "(31) 98888-2222",
    cidade: "Parauapebas â€¢ PA",
    status: "ativo",
    origem: "mock",
  },
  {
    id: "mock-3",
    nome: "Marcos Pereira",
    telefone: "(31) 97777-3333",
    cidade: "Contagem â€¢ MG",
    status: "bloqueado",
    origem: "mock",
  },
];

function getStatusClasses(status: StatusMotorista) {
  if (status === "ativo") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "bloqueado") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function getStatusLabel(status: StatusMotorista) {
  if (status === "ativo") return "ativo";
  if (status === "bloqueado") return "bloqueado";
  return "pendente";
}

function safeParseJson(value: string | null) {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function hasAdminAccessInObject(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  const candidateStrings = [
    record.role,
    record.papel,
    record.perfil,
    record.tipo,
    record.nivel,
    record.accessLevel,
    record.userRole,
    record.email,
    record.login,
  ]
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.toLowerCase().trim());

  const adminTerms = [
    "admin",
    "admin_master",
    "administrador",
    "master",
    "gestor",
    "gestao",
  ];

  const hasAdminTerm = candidateStrings.some((valueItem) =>
    adminTerms.some((term) => valueItem.includes(term)),
  );

  const hasKnownAdminEmail = candidateStrings.some(
    (valueItem) => valueItem === "ricardogrupoexecutivo1@gmail.com",
  );

  return hasAdminTerm || hasKnownAdminEmail;
}

function hasAdminAccessFromStorage(): boolean {
  if (typeof window === "undefined") return false;

  const directBooleanKeys = [
    "aurora_motoristas_admin",
    "admin_master",
    "is_admin",
    "isAdmin",
    "user_is_admin",
  ];

  for (const key of directBooleanKeys) {
    const value = window.localStorage.getItem(key);

    if (!value) continue;

    const normalized = value.toLowerCase().trim();

    if (normalized === "true" || normalized === "1" || normalized === "yes") {
      return true;
    }
  }

  const jsonKeys = [
    "aurora_motoristas_session",
    "aurora_motoristas_user",
    "aurora_session",
    "sessao_local",
    "session",
    "user",
    "usuario",
    "perfil",
    "auth_user",
  ];

  for (const key of jsonKeys) {
    const parsed = safeParseJson(window.localStorage.getItem(key));

    if (hasAdminAccessInObject(parsed)) {
      return true;
    }
  }

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key) continue;

    const rawValue = window.localStorage.getItem(key);
    const parsed = safeParseJson(rawValue);

    if (hasAdminAccessInObject(parsed)) {
      return true;
    }

    const normalizedRaw = (rawValue || "").toLowerCase();

    if (
      normalizedRaw.includes("ricardogrupoexecutivo1@gmail.com") &&
      (normalizedRaw.includes("admin") ||
        normalizedRaw.includes("administrador") ||
        normalizedRaw.includes("admin_master"))
    ) {
      return true;
    }
  }

  return false;
}

function firstString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function normalizeStatus(value: unknown): StatusMotorista {
  if (typeof value !== "string") {
    return "pendente";
  }

  const normalized = value.toLowerCase().trim();

  if (
    normalized.includes("ativo") ||
    normalized.includes("aprovado") ||
    normalized.includes("autorizado") ||
    normalized === "active"
  ) {
    return "ativo";
  }

  if (
    normalized.includes("bloqueado") ||
    normalized.includes("inativo") ||
    normalized.includes("suspenso") ||
    normalized === "blocked"
  ) {
    return "bloqueado";
  }

  return "pendente";
}

function mapMotoristaApiItem(
  item: MotoristaApiRaw,
  index: number,
): MotoristaPainel {
  const nome = firstString(
    item.nome,
    item.name,
    item.nome_completo,
    item.motorista_nome,
    item.full_name,
  );

  const telefone = firstString(
    item.telefone,
    item.phone,
    item.whatsapp,
    item.celular,
    item.fone,
  );

  const cidade = firstString(item.cidade, item.city);
  const estado = firstString(item.estado, item.uf, item.state);

  const cidadeFinal =
    cidade && estado
      ? `${cidade} â€¢ ${estado}`
      : cidade || estado || "Cidade nÃ£o informada";

  const status = normalizeStatus(
    item.status ?? item.situacao ?? item.aprovacao ?? item.state,
  );

  const idValue =
    typeof item.id === "string" || typeof item.id === "number"
      ? String(item.id)
      : `api-${index}`;

  return {
    id: idValue,
    nome: nome || `Motorista ${index + 1}`,
    telefone: telefone || "Telefone nÃ£o informado",
    cidade: cidadeFinal,
    status,
    origem: "api",
  };
}

function extractMotoristasFromPayload(payload: unknown): MotoristaPainel[] {
  if (Array.isArray(payload)) {
    return payload
      .filter(
        (item): item is MotoristaApiRaw =>
          Boolean(item) && typeof item === "object",
      )
      .map(mapMotoristaApiItem);
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    const candidateArrays = [
      record.data,
      record.items,
      record.motoristas,
      record.results,
      record.rows,
    ];

    for (const candidate of candidateArrays) {
      if (Array.isArray(candidate)) {
        return candidate
          .filter(
            (item): item is MotoristaApiRaw =>
              Boolean(item) && typeof item === "object",
          )
          .map(mapMotoristaApiItem);
      }
    }
  }

  return [];
}

function getActionButtonClass(action: AcaoMotorista) {
  if (action === "autorizar") {
    return "bg-emerald-600 hover:bg-emerald-700";
  }

  if (action === "bloquear") {
    return "bg-red-600 hover:bg-red-700";
  }

  return "bg-amber-500 hover:bg-amber-600";
}

function getStatusFromAction(action: AcaoMotorista): StatusMotorista {
  if (action === "autorizar") return "ativo";
  if (action === "bloquear") return "bloqueado";
  return "pendente";
}

function getActionLabel(action: AcaoMotorista) {
  if (action === "autorizar") return "Autorizar";
  if (action === "bloquear") return "Bloquear";
  return "Inativar";
}

export default function PlataformaMotoristasPainelPage() {
  const router = useRouter();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [motoristas, setMotoristas] =
    useState<MotoristaPainel[]>(motoristasMockBase);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(true);
  const [origemLista, setOrigemLista] = useState<"api" | "mock">("mock");
  const [mensagemBase, setMensagemBase] = useState(
    "Preparando leitura da base administrativa...",
  );
  const [mensagemAcao, setMensagemAcao] = useState("");
  const [salvandoId, setSalvandoId] = useState<string | null>(null);

  useEffect(() => {
    const allowed = hasAdminAccessFromStorage();

    if (!allowed) {
      router.replace("/acesso-negado");
      return;
    }

    setAuthorized(true);
    setCheckingAccess(false);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;

    let cancelled = false;

    async function carregarMotoristas() {
      setCarregandoMotoristas(true);

      try {
        const response = await fetch("/api/motoristas", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Falha ao ler /api/motoristas (${response.status})`);
        }

        const payload = (await response.json()) as unknown;
        const motoristasApi = extractMotoristasFromPayload(payload);

        if (!cancelled) {
          if (motoristasApi.length > 0) {
            setMotoristas(motoristasApi);
            setOrigemLista("api");
            setMensagemBase("Base real carregada com sucesso pela API.");
          } else {
            setMotoristas(motoristasMockBase);
            setOrigemLista("mock");
            setMensagemBase(
              "A API respondeu, mas sem motoristas utilizÃ¡veis. Mantido fallback mock com seguranÃ§a.",
            );
          }
        }
      } catch {
        if (!cancelled) {
          setMotoristas(motoristasMockBase);
          setOrigemLista("mock");
          setMensagemBase(
            "NÃ£o foi possÃ­vel ler a base real agora. Mantido fallback mock sem quebrar a operaÃ§Ã£o.",
          );
        }
      } finally {
        if (!cancelled) {
          setCarregandoMotoristas(false);
        }
      }
    }

    carregarMotoristas();

    return () => {
      cancelled = true;
    };
  }, [authorized]);

  const resumoAcesso = useMemo(() => {
    if (checkingAccess) {
      return "Validando acesso administrativo...";
    }

    if (authorized) {
      return "Acesso administrativo validado.";
    }

    return "Acesso nÃ£o autorizado.";
  }, [authorized, checkingAccess]);

  const totais = useMemo(() => {
    const pendentes = motoristas.filter(
      (item) => item.status === "pendente",
    ).length;
    const ativos = motoristas.filter((item) => item.status === "ativo").length;
    const bloqueados = motoristas.filter(
      (item) => item.status === "bloqueado",
    ).length;

    return {
      total: motoristas.length,
      pendentes,
      ativos,
      bloqueados,
    };
  }, [motoristas]);

  async function handleSalvarStatus(
    motorista: MotoristaPainel,
    action: AcaoMotorista,
  ) {
    if (motorista.origem !== "api") {
      setMensagemAcao(
        `O motorista "${motorista.nome}" estÃ¡ em fallback mock. A gravaÃ§Ã£o real sÃ³ acontece com itens vindos da API.`,
      );
      return;
    }

    const novoStatus = getStatusFromAction(action);
    const statusAnterior = motorista.status;

    setSalvandoId(motorista.id);
    setMensagemAcao(
      `Salvando "${getActionLabel(action)}" para ${motorista.nome}...`,
    );

    setMotoristas((current) =>
      current.map((item) =>
        item.id === motorista.id ? { ...item, status: novoStatus } : item,
      ),
    );

    try {
      const response = await fetch(`/api/motoristas/${motorista.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: novoStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Falha ao salvar (${response.status})`);
      }

      setMensagemAcao(
        `Status de ${motorista.nome} atualizado com sucesso para "${getStatusLabel(
          novoStatus,
        )}".`,
      );
    } catch {
      setMotoristas((current) =>
        current.map((item) =>
          item.id === motorista.id ? { ...item, status: statusAnterior } : item,
        ),
      );

      setMensagemAcao(
        `NÃ£o foi possÃ­vel salvar o status de ${motorista.nome} na API ainda. A interface voltou ao estado anterior com seguranÃ§a.`,
      );
    } finally {
      setSalvandoId(null);
    }
  }

  if (checkingAccess || !authorized) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Aurora Motoristas â€¢ Ãrea administrativa
            </div>

            <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              Verificando permissÃ£o
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Esta Ã¡rea Ã© restrita ao administrador. Estamos validando a sessÃ£o
              local antes de liberar o painel.
            </p>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {resumoAcesso}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/plataforma"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Voltar Ã  plataforma
              </Link>

              <Link
                href="/acesso-negado"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ir para acesso negado
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                href="/plataforma"
                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Voltar Ã  plataforma
              </Link>

              <Link
                href="/plataforma/motoristas"
                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ver motoristas
              </Link>

              <Link
                href="/quero-ser-motorista"
                className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cadastro pÃºblico
              </Link>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Aurora Motoristas â€¢ Painel isolado
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Painel de motoristas
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                  Camada nova, isolada e segura para organizar a evoluÃ§Ã£o da Ã¡rea
                  de motoristas sem mexer no que jÃ¡ estÃ¡ em produÃ§Ã£o. Aqui fica
                  uma base estÃ¡vel para ligar prÃ³ximas funÃ§Ãµes com cautela.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Acesso administrativo validado. Motoristas, clientes e perfis
                sem administraÃ§Ã£o nÃ£o devem visualizar esta Ã¡rea.
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {cardsResumo.map((card) => (
            <article
              key={card.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-900">
                {card.titulo}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {card.descricao}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              NavegaÃ§Ã£o segura
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Esta pÃ¡gina pode servir como ponto de apoio para a gestÃ£o da base
              de motoristas, sem depender de alterar estruturas antigas.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/plataforma/motoristas"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Abrir Ã¡rea de motoristas
              </Link>

              <Link
                href="/admin/servicos"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ir para Admin â€¢ ServiÃ§os
              </Link>

              <Link
                href="/relatorios"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Ver relatÃ³rios
              </Link>

              <Link
                href="/plataforma/tutorial"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Tutorial / ajuda
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              PrÃ³xima expansÃ£o controlada
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
              <li>â€¢ filtros de motoristas por status, cidade e empresa</li>
              <li>â€¢ leitura da base interna protegida</li>
              <li>â€¢ vÃ­nculo do motorista ao serviÃ§o fechado</li>
              <li>â€¢ histÃ³rico administrativo protegido</li>
              <li>
                â€¢ separaÃ§Ã£o rÃ­gida entre operaÃ§Ã£o interna e operadoras externas
              </li>
            </ul>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Regra mantida: motorista sem admin, cliente sem admin, empresa vÃª
              apenas o que for dela e a base interna permanece blindada.
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Base lida</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totais.total}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Total de motoristas visÃ­veis neste painel.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {totais.pendentes}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Aguardando autorizaÃ§Ã£o administrativa.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Ativos</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {totais.ativos}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Liberados para operar.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Bloqueados</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {totais.bloqueados}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Fora da operaÃ§Ã£o atÃ© nova decisÃ£o administrativa.
            </p>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                GestÃ£o de motoristas
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900 sm:text-2xl">
                Autorizar motoristas cadastrados
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Esta Ã¡rea agora tenta carregar a base real pela API. Se a leitura
                falhar, o painel mantÃ©m fallback mock para nÃ£o quebrar a camada
                administrativa.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {carregandoMotoristas
                ? "Carregando base..."
                : origemLista === "api"
                  ? "Origem: API real"
                  : "Origem: fallback mock"}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {mensagemBase}
          </div>

          {mensagemAcao ? (
            <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-800">
              {mensagemAcao}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {motoristas.map((motorista) => {
              const estaSalvando = salvandoId === motorista.id;

              return (
                <article
                  key={motorista.id}
                  className="rounded-3xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {motorista.nome}
                        </h3>

                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {motorista.origem === "api" ? "api" : "mock"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {motorista.telefone} â€¢ {motorista.cidade}
                      </p>

                      <div
                        className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getStatusClasses(
                          motorista.status,
                        )}`}
                      >
                        Status: {getStatusLabel(motorista.status)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={estaSalvando}
                        onClick={() =>
                          handleSalvarStatus(motorista, "autorizar")
                        }
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${getActionButtonClass(
                          "autorizar",
                        )}`}
                      >
                        {estaSalvando ? "Salvando..." : "Autorizar"}
                      </button>

                      <button
                        type="button"
                        disabled={estaSalvando}
                        onClick={() => handleSalvarStatus(motorista, "bloquear")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${getActionButtonClass(
                          "bloquear",
                        )}`}
                      >
                        {estaSalvando ? "Salvando..." : "Bloquear"}
                      </button>

                      <button
                        type="button"
                        disabled={estaSalvando}
                        onClick={() => handleSalvarStatus(motorista, "inativar")}
                        className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${getActionButtonClass(
                          "inativar",
                        )}`}
                      >
                        {estaSalvando ? "Salvando..." : "Inativar"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            PrÃ³ximo nÃ­vel Ambiente seguro: refletir a decisÃ£o administrativa na operaÃ§Ã£o e
            impedir vÃ­nculo de serviÃ§o com motorista fora da base autorizada.
          </div>
        </section>
      </section>
    </main>
  );
}
