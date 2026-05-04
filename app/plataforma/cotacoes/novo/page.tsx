"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TipoPessoa = "fisica" | "juridica";

type TipoCotacaoCard = {
  id:
    | "transfer"
    | "mobilizacao"
    | "desmobilizacao"
    | "mobilizacao_desmobilizacao"
    | "diaria"
    | "semanal"
    | "mensal"
    | "pacote_personalizado";
  titulo: string;
  descricao: string;
  rotaPadrao: string;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatCpfCnpj(value: string, tipoPessoa: TipoPessoa) {
  const digits = digitsOnly(value);

  if (tipoPessoa === "fisica") {
    return digits
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  return digits
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function isDocumentoValido(tipoPessoa: TipoPessoa, documento: string) {
  const digits = digitsOnly(documento);
  return tipoPessoa === "juridica" ? digits.length === 14 : digits.length === 11;
}

function buildHref(
  rotaBase: string,
  params: {
    tipoPessoa: TipoPessoa;
    documento: string;
    nome: string;
    emailFinanceiro: string;
    telefone: string;
    responsavelFinanceiro: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  }
) {
  const query = new URLSearchParams({
    tipoPessoa: params.tipoPessoa,
    documento: digitsOnly(params.documento),
    nome: params.nome,
    emailFinanceiro: params.emailFinanceiro,
    telefone: params.telefone,
    responsavelFinanceiro: params.responsavelFinanceiro,
    endereco: params.endereco,
    cidade: params.cidade,
    estado: params.estado,
    cep: params.cep,
  });

  return `${rotaBase}${rotaBase.includes("?") ? "&" : "?"}${query.toString()}`;
}

const TIPOS_COTACAO: TipoCotacaoCard[] = [
  {
    id: "transfer",
    titulo: "Transfer",
    descricao: "Origem, destino, apresentação, deslocamento e valor operacional.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=transfer",
  },
  {
    id: "mobilizacao",
    titulo: "Mobilização",
    descricao: "Levar equipe, veículo ou operação até o destino com controle financeiro.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=mobilizacao",
  },
  {
    id: "desmobilizacao",
    titulo: "Desmobilização",
    descricao: "Retorno, busca, encerramento operacional e fechamento de custos.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=desmobilizacao",
  },
  {
    id: "mobilizacao_desmobilizacao",
    titulo: "Mobilização + desmobilização",
    descricao: "Ida e retorno na mesma cotação, com valores separados.",
    rotaPadrao: "/plataforma/cotacoes/tipos/mobilizacao-desmobilizacao",
  },
  {
    id: "diaria",
    titulo: "Diária",
    descricao: "Motorista por diária, espera, extras, despesas e fechamento.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=diaria",
  },
  {
    id: "semanal",
    titulo: "Semanal",
    descricao: "Contratação por semana com base operacional recorrente.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=semanal",
  },
  {
    id: "mensal",
    titulo: "Mensal",
    descricao: "Cliente mensalista, competência, período e faturamento.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=mensal",
  },
  {
    id: "pacote_personalizado",
    titulo: "Pacote personalizado",
    descricao: "Operação especial com estrutura livre e controle completo.",
    rotaPadrao: "/plataforma/cotacoes/nova?tipo=pacote_personalizado",
  },
];

export default function PlataformaCotacoesNovoPage() {
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>("juridica");
  const [documento, setDocumento] = useState("");
  const [nome, setNome] = useState("");
  const [emailFinanceiro, setEmailFinanceiro] = useState("");
  const [telefone, setTelefone] = useState("");
  const [responsavelFinanceiro, setResponsavelFinanceiro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");

  const documentoValido = useMemo(
    () => isDocumentoValido(tipoPessoa, documento),
    [tipoPessoa, documento]
  );

  const cards = useMemo(() => {
    return TIPOS_COTACAO.map((item) => ({
      ...item,
      href: buildHref(item.rotaPadrao, {
        tipoPessoa,
        documento,
        nome,
        emailFinanceiro,
        telefone,
        responsavelFinanceiro,
        endereco,
        cidade,
        estado,
        cep,
      }),
    }));
  }, [
    tipoPessoa,
    documento,
    nome,
    emailFinanceiro,
    telefone,
    responsavelFinanceiro,
    endereco,
    cidade,
    estado,
    cep,
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#064e3b_0%,#020617_38%,#000_100%)] text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-emerald-400/40 bg-slate-950/90 p-6 shadow-[0_0_45px_rgba(34,197,94,0.18)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Aurora Motoristas • Entrada rápida de cotação
              </span>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-emerald-300 md:text-5xl">
                  Nova cotação Aurora
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                  Primeiro identificamos o cliente. Depois você escolhe o tipo
                  da operação e entra direto no fluxo correto, mantendo o padrão
                  premium, rápido e profissional da plataforma.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <Badge texto="CNPJ/CPF primeiro" />
                <Badge texto="Tipo de cotação em 1 clique" />
                <Badge texto="Cobrança só no fechamento" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/plataforma/cotacoes"
                className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-center text-sm font-black text-emerald-200 transition hover:bg-emerald-400/20"
              >
                Ver cotações
              </Link>

              <Link
                href="/plataforma"
                className="rounded-2xl border border-cyan-300 bg-cyan-400 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:opacity-90"
              >
                Voltar à plataforma
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100">
            Sistema em produção assistida: nesta etapa a cobrança ainda não é
            exigida. Pagamento, nota de débito e recibo entram depois do serviço
            confirmado/concluído.
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-400/30 bg-slate-950/80 p-6 shadow-[0_0_35px_rgba(34,197,94,0.12)]">
          <h2 className="text-xl font-black text-emerald-300">
            Identificação do cliente
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Preencha os dados principais para o próximo formulário já abrir
            pronto.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Tipo de pessoa">
              <select
                value={tipoPessoa}
                onChange={(e) => {
                  const novoTipo = e.target.value as TipoPessoa;
                  setTipoPessoa(novoTipo);
                  setDocumento(formatCpfCnpj(documento, novoTipo));
                }}
                className="input"
              >
                <option value="juridica">Jurídica</option>
                <option value="fisica">Física</option>
              </select>
            </Field>

            <Field
              label={tipoPessoa === "juridica" ? "CNPJ" : "CPF"}
              helper="Obrigatório. Pode ser com ou sem máscara."
            >
              <input
                value={documento}
                onChange={(e) =>
                  setDocumento(formatCpfCnpj(e.target.value, tipoPessoa))
                }
                className="input"
                placeholder={
                  tipoPessoa === "juridica"
                    ? "00.000.000/0000-00"
                    : "000.000.000-00"
                }
              />
            </Field>

            <Field label="Nome / razão social">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input"
                placeholder="Nome do cliente"
              />
            </Field>

            <Field label="E-mail financeiro">
              <input
                value={emailFinanceiro}
                onChange={(e) => setEmailFinanceiro(e.target.value)}
                className="input"
                placeholder="financeiro@cliente.com"
              />
            </Field>

            <Field label="Telefone">
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="input"
                placeholder="(00) 00000-0000"
              />
            </Field>

            <Field label="Responsável financeiro">
              <input
                value={responsavelFinanceiro}
                onChange={(e) => setResponsavelFinanceiro(e.target.value)}
                className="input"
                placeholder="Nome do responsável"
              />
            </Field>

            <Field label="Endereço">
              <input
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                className="input"
                placeholder="Rua, número, bairro"
              />
            </Field>

            <Field label="Cidade">
              <input
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="input"
                placeholder="Cidade"
              />
            </Field>

            <Field label="Estado">
              <input
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="input"
                placeholder="UF"
              />
            </Field>

            <Field label="CEP">
              <input
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="input"
                placeholder="00000-000"
              />
            </Field>
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-4">
            <p className="text-sm font-black text-cyan-200">
              Documento validado agora: {documentoValido ? "sim" : "ainda não"}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              No próximo passo, essa identificação pode ser ligada à base real
              de clientes e empresas.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-400/30 bg-slate-950/80 p-6 shadow-[0_0_35px_rgba(34,197,94,0.12)]">
          <h2 className="text-xl font-black text-emerald-300">
            Escolha o tipo da cotação
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Clique no botão da operação e siga direto para o formulário correto.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.id}
                className="flex h-full flex-col rounded-3xl border border-emerald-400/25 bg-slate-900/80 p-5 shadow-[0_0_22px_rgba(34,197,94,0.08)] transition hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.18)]"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-black text-white">
                    {card.titulo}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {card.descricao}
                  </p>
                </div>

                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center justify-center rounded-2xl border border-cyan-300 bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:opacity-90"
                >
                  Entrar nesta cotação
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm leading-6 text-emerald-100">
            Fluxo aprovado: primeiro documento do cliente, depois escolha
            rápida do tipo de cotação, e só mais tarde cobrança, nota de débito
            e recibo.
          </div>
        </section>
      </div>

      <style jsx global>{`
        .input {
          height: 48px;
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgba(34, 197, 94, 0.35);
          background: rgba(15, 23, 42, 0.92);
          color: white;
          padding: 0 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input::placeholder {
          color: rgb(148 163 184);
        }

        .input:focus {
          border-color: rgb(6 182 212);
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.16);
        }

        select.input {
          color: white;
        }

        select.input option {
          background: #020617;
          color: white;
        }
      `}</style>
    </main>
  );
}

function Badge({ texto }: { texto: string }) {
  return (
    <span className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 font-bold text-emerald-200">
      {texto}
    </span>
  );
}

function Field({
  label,
  children,
  helper,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-200">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="mt-2 block text-xs text-slate-400">{helper}</span>
      ) : null}
    </label>
  );
}