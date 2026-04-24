'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type TipoPessoa = 'fisica' | 'juridica'

type TipoCotacaoCard = {
  id:
    | 'transfer'
    | 'mobilizacao'
    | 'desmobilizacao'
    | 'mobilizacao_desmobilizacao'
    | 'diaria'
    | 'semanal'
    | 'mensal'
    | 'pacote_personalizado'
  titulo: string
  descricao: string
  rotaPadrao: string
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function formatCpfCnpj(value: string, tipoPessoa: TipoPessoa) {
  const digits = digitsOnly(value)

  if (tipoPessoa === 'fisica') {
    return digits
      .slice(0, 11)
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2')
  }

  return digits
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

function isDocumentoValido(tipoPessoa: TipoPessoa, documento: string) {
  const digits = digitsOnly(documento)
  return tipoPessoa === 'juridica' ? digits.length === 14 : digits.length === 11
}

function buildHref(
  rotaBase: string,
  params: {
    tipoPessoa: TipoPessoa
    documento: string
    nome: string
    emailFinanceiro: string
    telefone: string
    responsavelFinanceiro: string
    endereco: string
    cidade: string
    estado: string
    cep: string
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
  })

  return `${rotaBase}?${query.toString()}`
}

const TIPOS_COTACAO: TipoCotacaoCard[] = [
  {
    id: 'transfer',
    titulo: 'Transfer',
    descricao: 'Cotação rápida para origem, destino, apresentação e deslocamento.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=transfer',
  },
  {
    id: 'mobilizacao',
    titulo: 'Mobilização',
    descricao: 'Leitura focada em levar equipe, veículo ou operação até o destino.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=mobilizacao',
  },
  {
    id: 'desmobilizacao',
    titulo: 'Desmobilização',
    descricao: 'Leitura focada em retorno, busca e encerramento operacional.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=desmobilizacao',
  },
  {
    id: 'mobilizacao_desmobilizacao',
    titulo: 'Mobilização + desmobilização',
    descricao: 'Ida e retorno na mesma cotação, com valores separados.',
    rotaPadrao: '/plataforma/cotacoes/tipos/mobilizacao-desmobilizacao',
  },
  {
    id: 'diaria',
    titulo: 'Diária',
    descricao: 'Para motorista por diária, com espera, extras e despesas.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=diaria',
  },
  {
    id: 'semanal',
    titulo: 'Semanal',
    descricao: 'Para contratação por semana, com base mais recorrente.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=semanal',
  },
  {
    id: 'mensal',
    titulo: 'Mensal',
    descricao: 'Para cliente mensalista e fechamento por competência.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=mensal',
  },
  {
    id: 'pacote_personalizado',
    titulo: 'Pacote personalizado',
    descricao: 'Formato livre para operação especial ou estrutura personalizada.',
    rotaPadrao: '/plataforma/cotacoes/nova?tipo=pacote_personalizado',
  },
]

export default function PlataformaCotacoesNovoPage() {
  const [tipoPessoa, setTipoPessoa] = useState<TipoPessoa>('juridica')
  const [documento, setDocumento] = useState('')
  const [nome, setNome] = useState('')
  const [emailFinanceiro, setEmailFinanceiro] = useState('')
  const [telefone, setTelefone] = useState('')
  const [responsavelFinanceiro, setResponsavelFinanceiro] = useState('')
  const [endereco, setEndereco] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')
  const [cep, setCep] = useState('')

  const documentoValido = useMemo(
    () => isDocumentoValido(tipoPessoa, documento),
    [tipoPessoa, documento]
  )

  const cards = useMemo(() => {
    return TIPOS_COTACAO.map((item) => {
      const href =
        item.id === 'mobilizacao_desmobilizacao'
          ? buildHref(item.rotaPadrao, {
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
            })
          : `${item.rotaPadrao}&${new URLSearchParams({
              tipoPessoa,
              documento: digitsOnly(documento),
              nome,
              emailFinanceiro,
              telefone,
              responsavelFinanceiro,
              endereco,
              cidade,
              estado,
              cep,
            }).toString()}`

      return {
        ...item,
        href,
      }
    })
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
  ])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Entrada rápida de cotação
              </span>

              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Nova cotação por tipo
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  Primeiro identificamos o cliente por documento. Depois você escolhe o tipo
                  de cotação por botão e entra direto no fluxo certo, sem depender de uma
                  página grande para todo mundo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                  Entrada mais rápida
                </span>
                <span className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
                  CNPJ/CPF primeiro
                </span>
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                  Sem cobrança nesta etapa
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/plataforma/cotacoes"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver cotações
              </Link>

              <Link
                href="/plataforma"
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Voltar Ã  plataforma
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sistema em constante atualização. Nesta etapa a cobrança ainda não é exigida.
            A cobrança e a nota de débito ficam para depois do serviço concluído.
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Identificação do cliente</h2>
          <p className="mt-1 text-sm text-slate-500">
            Digite o documento do cliente. No próximo passo o formulário já entra com base
            nessas informações.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Tipo de pessoa">
              <select
                value={tipoPessoa}
                onChange={(e) => {
                  const novoTipo = e.target.value as TipoPessoa
                  setTipoPessoa(novoTipo)
                  setDocumento(formatCpfCnpj(documento, novoTipo))
                }}
                className="input"
              >
                <option value="juridica">Jurídica</option>
                <option value="fisica">Física</option>
              </select>
            </Field>

            <Field
              label={tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF'}
              helper="Obrigatório. Pode ser com ou sem máscara."
            >
              <input
                value={documento}
                onChange={(e) => setDocumento(formatCpfCnpj(e.target.value, tipoPessoa))}
                className="input"
                placeholder={
                  tipoPessoa === 'juridica'
                    ? '00.000.000/0000-00'
                    : '000.000.000-00'
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

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">
              Documento validado agora: {documentoValido ? 'sim' : 'ainda não'}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              No próximo passo nós podemos trocar isso pela busca automática na base real das empresas.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Escolha o tipo da cotação</h2>
          <p className="mt-1 text-sm text-slate-500">
            Clique em um botão e vá direto para o tipo correto de cotação, sem precisar abrir
            uma página genérica para todo mundo.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">{card.titulo}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.descricao}</p>
                </div>

                <Link
                  href={card.href}
                  className="mt-5 inline-flex items-center justify-center rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Entrar nesta cotação
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
            Fluxo aprovado: primeiro documento do cliente, depois escolha rápida do tipo de cotação,
            e só mais tarde cobrança e nota de débito.
          </div>
        </section>
      </div>

      <style jsx global>{`
        .input {
          height: 48px;
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgb(203 213 225);
          background: white;
          padding: 0 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input:focus {
          border-color: rgb(6 182 212);
        }
      `}</style>
    </main>
  )
}

function Field({
  label,
  children,
  helper,
}: {
  label: string
  children: React.ReactNode
  helper?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {helper ? <span className="mt-2 block text-xs text-slate-500">{helper}</span> : null}
    </label>
  )
}

