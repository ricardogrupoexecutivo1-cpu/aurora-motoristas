'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type StatusCotacao =
  | 'rascunho'
  | 'enviada'
  | 'visualizada'
  | 'aceita'
  | 'recusada'
  | 'expirada'

type BaseMotorista = 'bh' | 'parauapebas' | 'outra'

type FormaReembolso = 'nenhum' | 'ida' | 'volta' | 'ida_e_volta'

type FormaPagamento = 'a_combinar' | 'pix' | 'boleto' | 'transferencia' | 'cartao'

type PrioridadeAtendimento = 'normal' | 'urgente' | 'emergencial'

type ModalidadeServico =
  | 'transfer'
  | 'diaria'
  | 'semanal'
  | 'mensal'
  | 'pacote_personalizado'

type TipoPessoa = 'fisica' | 'juridica'

type TipoFaturamentoCliente = 'por_servico' | 'mensal'

type TipoDocumentoCobranca = 'nota_debito' | 'cobranca_interna' | 'proposta_comercial'

type CotacaoPayload = {
  id: string
  criadoEm: string
  atualizadoEm: string
  status: StatusCotacao
  clienteDecisaoFinalObrigatoria: boolean
  contratante: string
  clienteFinal: string
  empresaOperadora: string
  telefoneContratante: string
  emailContratante: string
  origem: string
  destino: string
  dataServico: string
  horarioServico: string
  horarioApresentacao: string
  localApresentacao: string
  observacaoApresentacao: string
  tipoServico: string
  modalidadeServico: ModalidadeServico
  quantidade: number
  unidadeQuantidade: string
  baseMotorista: BaseMotorista
  motoristaNome: string
  motoristaId: string
  motoristaCidadeAtual: string
  distanciaForaBaseKm: number
  aplicarReembolsoDeslocamento: boolean
  formaReembolsoDeslocamento: FormaReembolso
  valorKmReembolso: number
  horasPrevistasEspera: number
  cobraDiariaExtraApos6h: boolean
  valorDiariaExtra: number
  quantidadeDiariasExtras: number
  motivoDiariaExtra: string
  pedagios: number
  combustivel: number
  alimentacao: number
  hospedagem: number
  estacionamento: number
  outrosCustos: number
  descricaoOutrosCustos: string
  valorUnitarioMotorista: number
  valorUnitarioCliente: number
  valorTotalMotorista: number
  valorTotalClienteBase: number
  valorCobradoCliente: number
  acrescimoUrgentePercentual: number
  acrescimoEmergencialPercentual: number
  prioridadeAtendimento: PrioridadeAtendimento
  formaPagamento: FormaPagamento
  tipoPessoaCliente: TipoPessoa
  documentoCliente: string
  inscricaoEstadualCliente: string
  inscricaoMunicipalCliente: string
  enderecoCliente: string
  cidadeCliente: string
  estadoCliente: string
  cepCliente: string
  emailFinanceiroCliente: string
  responsavelFinanceiroCliente: string
  tipoFaturamentoCliente: TipoFaturamentoCliente
  competenciaFaturamento: string
  periodoReferencia: string
  agruparNoFechamentoMensal: boolean
  tipoDocumentoCobranca: TipoDocumentoCobranca
  prazoPagamentoDias: number
  dataEmissaoDocumento: string
  dataVencimentoDocumento: string
  emitenteNome: string
  emitenteDocumento: string
  emitenteInscricao: string
  emitenteEndereco: string
  emitenteCidadeEstado: string
  emitenteTelefone: string
  emitenteEmail: string
  emitenteDadosPagamento: string
  observacoesFinanceiras: string
  observacoesInternas: string
  observacoesCliente: string
  clienteAceitouTermos: boolean
  visivelParaMotorista: boolean
  prontoParaVincularServico: boolean
  resumoFinanceiro: {
    reembolsoDeslocamento: number
    diariasExtras: number
    subtotalCustos: number
    acrescimoUrgente: number
    acrescimoEmergencial: number
    totalCotacao: number
    margemBruta: number
  }
}

const STORAGE_KEY = 'aurora_motoristas_cotacoes_v1'

function toMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function toDateTime(value?: string) {
  if (!value) return 'â€”'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('pt-BR')
}

function toDate(value?: string) {
  if (!value) return 'â€”'
  const [year, month, day] = value.split('-')
  if (!year || !month || !day) return value
  return `${day}/${month}/${year}`
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function statusBadgeClass(status: StatusCotacao) {
  switch (status) {
    case 'aceita':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'recusada':
      return 'border-rose-200 bg-rose-50 text-rose-700'
    case 'visualizada':
      return 'border-sky-200 bg-sky-50 text-sky-700'
    case 'expirada':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    case 'rascunho':
      return 'border-slate-200 bg-slate-100 text-slate-700'
    default:
      return 'border-violet-200 bg-violet-50 text-violet-700'
  }
}

function modalidadeLabel(value: ModalidadeServico) {
  return value.replaceAll('_', ' ')
}

function faturamentoLabel(value: TipoFaturamentoCliente) {
  return value.replaceAll('_', ' ')
}

function documentoLabel(value: TipoDocumentoCobranca) {
  return value.replaceAll('_', ' ')
}

export default function PlataformaCotacoesPage() {
  const [cotacoes, setCotacoes] = useState<CotacaoPayload[]>([])
  const [mensagem, setMensagem] = useState('')
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<'todas' | StatusCotacao>('todas')
  const [filtroFaturamento, setFiltroFaturamento] = useState<
    'todos' | TipoFaturamentoCliente
  >('todos')
  const [filtroModalidade, setFiltroModalidade] = useState<
    'todas' | ModalidadeServico
  >('todas')
  const [somentePendentesDecisao, setSomentePendentesDecisao] = useState(false)
  const [somenteProntasParaServico, setSomenteProntasParaServico] = useState(false)
  const [cotacaoExpandidaId, setCotacaoExpandidaId] = useState<string | null>(null)

  useEffect(() => {
    carregarCotacoes()
  }, [])

  function carregarCotacoes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const data = raw ? (JSON.parse(raw) as CotacaoPayload[]) : []
      setCotacoes(Array.isArray(data) ? data : [])
    } catch {
      setCotacoes([])
      setMensagem('Não foi possível ler as cotações salvas no navegador.')
    }
  }

  function persistirCotacoes(lista: CotacaoPayload[], textoSucesso?: string) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
      setCotacoes(lista)
      if (textoSucesso) {
        setMensagem(textoSucesso)
      }
    } catch {
      setMensagem('Não foi possível salvar a atualização agora no navegador.')
    }
  }

  function atualizarCotacao(
    id: string,
    updater: (item: CotacaoPayload) => CotacaoPayload,
    textoSucesso: string
  ) {
    const atualizadas = cotacoes.map((item) => {
      if (item.id !== id) return item
      return {
        ...updater(item),
        atualizadoEm: new Date().toISOString(),
      }
    })
    persistirCotacoes(atualizadas, textoSucesso)
  }

  function alterarStatus(id: string, status: StatusCotacao) {
    atualizarCotacao(
      id,
      (item) => ({
        ...item,
        status,
      }),
      `Cotação ${id} atualizada para ${status}.`
    )
  }

  function alternarProntaParaServico(id: string) {
    const item = cotacoes.find((cotacao) => cotacao.id === id)
    if (!item) return

    const novoValor = !item.prontoParaVincularServico

    atualizarCotacao(
      id,
      (cotacao) => ({
        ...cotacao,
        prontoParaVincularServico: novoValor,
      }),
      novoValor
        ? `Cotação ${id} marcada como pronta para virar serviço.`
        : `Cotação ${id} desmarcada da fila de virada para serviço.`
    )
  }

  function alternarVisibilidadeMotorista(id: string) {
    const item = cotacoes.find((cotacao) => cotacao.id === id)
    if (!item) return

    const novoValor = !item.visivelParaMotorista

    atualizarCotacao(
      id,
      (cotacao) => ({
        ...cotacao,
        visivelParaMotorista: novoValor,
      }),
      novoValor
        ? `Cotação ${id} marcada como visível para motorista.`
        : `Cotação ${id} retirada da visibilidade do motorista.`
    )
  }

  function prepararViradaParaServico(id: string) {
    const item = cotacoes.find((cotacao) => cotacao.id === id)
    if (!item) return

    if (item.status !== 'aceita') {
      setMensagem(`A cotação ${id} ainda não pode virar serviço porque não está aceita.`)
      return
    }

    if (!item.motoristaNome.trim()) {
      setMensagem(`A cotação ${id} ainda não pode virar serviço porque não tem motorista vinculado.`)
      return
    }

    atualizarCotacao(
      id,
      (cotacao) => ({
        ...cotacao,
        prontoParaVincularServico: true,
        visivelParaMotorista: true,
      }),
      `Cotação ${id} preparada para virar serviço com motorista vinculado.`
    )
  }

  function removerCotacao(id: string) {
    const restantes = cotacoes.filter((item) => item.id !== id)
    persistirCotacoes(restantes, `Cotação ${id} removida da camada isolada.`)

    if (cotacaoExpandidaId === id) {
      setCotacaoExpandidaId(null)
    }
  }

  const cotacoesFiltradas = useMemo(() => {
    const termo = normalize(busca)

    return cotacoes.filter((item) => {
      const bateStatus = filtroStatus === 'todas' ? true : item.status === filtroStatus
      const bateFaturamento =
        filtroFaturamento === 'todos'
          ? true
          : item.tipoFaturamentoCliente === filtroFaturamento
      const bateModalidade =
        filtroModalidade === 'todas'
          ? true
          : item.modalidadeServico === filtroModalidade

      const pendenteDecisao =
        item.clienteDecisaoFinalObrigatoria &&
        item.status !== 'aceita' &&
        item.status !== 'recusada' &&
        item.status !== 'expirada'

      const prontaParaServico =
        item.status === 'aceita' &&
        item.prontoParaVincularServico &&
        item.motoristaNome.trim().length > 0

      const batePendencia = somentePendentesDecisao ? pendenteDecisao : true
      const batePronta = somenteProntasParaServico ? prontaParaServico : true

      const alvoBusca = normalize(
        [
          item.id,
          item.contratante,
          item.clienteFinal,
          item.empresaOperadora,
          item.origem,
          item.destino,
          item.motoristaNome,
          item.motoristaCidadeAtual,
          item.telefoneContratante,
          item.emailContratante,
          item.tipoServico,
          item.modalidadeServico,
          item.tipoFaturamentoCliente,
          item.documentoCliente,
          item.emailFinanceiroCliente,
          item.competenciaFaturamento,
        ]
          .filter(Boolean)
          .join(' ')
      )

      const bateBusca = termo ? alvoBusca.includes(termo) : true

      return (
        bateStatus &&
        bateFaturamento &&
        bateModalidade &&
        batePendencia &&
        batePronta &&
        bateBusca
      )
    })
  }, [
    busca,
    cotacoes,
    filtroStatus,
    filtroFaturamento,
    filtroModalidade,
    somentePendentesDecisao,
    somenteProntasParaServico,
  ])

  const resumo = useMemo(() => {
    const total = cotacoes.length
    const enviadas = cotacoes.filter((item) => item.status === 'enviada').length
    const visualizadas = cotacoes.filter((item) => item.status === 'visualizada').length
    const aceitas = cotacoes.filter((item) => item.status === 'aceita').length
    const recusadas = cotacoes.filter((item) => item.status === 'recusada').length
    const expiradas = cotacoes.filter((item) => item.status === 'expirada').length
    const pendentesDecisao = cotacoes.filter(
      (item) =>
        item.clienteDecisaoFinalObrigatoria &&
        item.status !== 'aceita' &&
        item.status !== 'recusada' &&
        item.status !== 'expirada'
    ).length
    const prontasParaServico = cotacoes.filter(
      (item) =>
        item.status === 'aceita' &&
        item.prontoParaVincularServico &&
        item.motoristaNome.trim().length > 0
    ).length

    const faturamentoMensal = cotacoes.filter(
      (item) => item.tipoFaturamentoCliente === 'mensal'
    ).length

    const faturamentoPorServico = cotacoes.filter(
      (item) => item.tipoFaturamentoCliente === 'por_servico'
    ).length

    const totalCotado = cotacoes.reduce(
      (acc, item) => acc + (item.resumoFinanceiro?.totalCotacao || 0),
      0
    )

    const margemTotal = cotacoes.reduce(
      (acc, item) => acc + (item.resumoFinanceiro?.margemBruta || 0),
      0
    )

    const totalDiariasExtras = cotacoes.reduce(
      (acc, item) => acc + (item.resumoFinanceiro?.diariasExtras || 0),
      0
    )

    return {
      total,
      enviadas,
      visualizadas,
      aceitas,
      recusadas,
      expiradas,
      pendentesDecisao,
      prontasParaServico,
      faturamentoMensal,
      faturamentoPorServico,
      totalCotado,
      margemTotal,
      totalDiariasExtras,
    }
  }, [cotacoes])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Cotações
              </span>

              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Painel isolado de cotações
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  Leitura administrativa da nova camada, agora com modalidade, quantidade,
                  hora de apresentação, diária extra, faturamento por serviço ou mensal
                  e base para nota de débito.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                  Cobrança por cliente protegida
                </span>
                <span className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
                  Mensal ou por serviço
                </span>
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                  Camada isolada e segura
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/plataforma"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Voltar Ã  plataforma
              </Link>
              <Link
                href="/plataforma/cotacoes/novo"
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Nova cotação
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sistema em constante atualização. Esta leitura foi separada da operação atual
            para evoluir sem risco de quebrar o que já está pronto.
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ResumoCard
            titulo="Base total"
            valor={String(resumo.total)}
            detalhe="Todas as cotações salvas na nova camada."
          />
          <ResumoCard
            titulo="Pendentes de decisão"
            valor={String(resumo.pendentesDecisao)}
            detalhe="Ainda não voltaram como aceita ou recusada."
          />
          <ResumoCard
            titulo="Prontas para serviço"
            valor={String(resumo.prontasParaServico)}
            detalhe="Aceitas, com motorista e prontas para avançar."
          />
          <ResumoCard
            titulo="Total cotado"
            valor={toMoney(resumo.totalCotado)}
            detalhe="Soma financeira da base registrada."
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <MiniCard label="Enviadas" value={resumo.enviadas} />
          <MiniCard label="Visualizadas" value={resumo.visualizadas} />
          <MiniCard label="Aceitas" value={resumo.aceitas} />
          <MiniCard label="Recusadas" value={resumo.recusadas} />
          <MiniCard label="Mensal" value={resumo.faturamentoMensal} />
          <MiniCard label="Por serviço" value={resumo.faturamentoPorServico} />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <MiniCard label="Expiradas" value={resumo.expiradas} />
          <MiniCard label="Diárias extras" value={resumo.totalDiariasExtras} money />
          <MiniCard label="Margem total" value={resumo.margemTotal} money />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold">Filtros e leitura estratégica</h2>
              <p className="mt-1 text-sm text-slate-500">
                Use esta área para enxergar pendências, mensalistas, faturamento por serviço
                e possíveis especulações.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Buscar</span>
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-cyan-500"
                  placeholder="ID, contratante, cliente, documento, motorista..."
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
                <select
                  value={filtroStatus}
                  onChange={(e) =>
                    setFiltroStatus(e.target.value as 'todas' | StatusCotacao)
                  }
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-cyan-500"
                >
                  <option value="todas">Todas</option>
                  <option value="rascunho">rascunho</option>
                  <option value="enviada">enviada</option>
                  <option value="visualizada">visualizada</option>
                  <option value="aceita">aceita</option>
                  <option value="recusada">recusada</option>
                  <option value="expirada">expirada</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Faturamento
                </span>
                <select
                  value={filtroFaturamento}
                  onChange={(e) =>
                    setFiltroFaturamento(
                      e.target.value as 'todos' | TipoFaturamentoCliente
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-cyan-500"
                >
                  <option value="todos">Todos</option>
                  <option value="por_servico">Por serviço</option>
                  <option value="mensal">Mensal</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Modalidade
                </span>
                <select
                  value={filtroModalidade}
                  onChange={(e) =>
                    setFiltroModalidade(
                      e.target.value as 'todas' | ModalidadeServico
                    )
                  }
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-cyan-500"
                >
                  <option value="todas">Todas</option>
                  <option value="transfer">Transfer</option>
                  <option value="diaria">Diária</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                  <option value="pacote_personalizado">Pacote personalizado</option>
                </select>
              </label>

              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={somentePendentesDecisao}
                    onChange={(e) => setSomentePendentesDecisao(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Só pendentes de decisão
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={somenteProntasParaServico}
                    onChange={(e) => setSomenteProntasParaServico(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Só prontas para serviço
                  </span>
                </label>
              </div>
            </div>

            {mensagem ? (
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
                {mensagem}
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-4">
          {cotacoesFiltradas.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Nenhuma cotação encontrada
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Ajuste os filtros ou crie uma nova cotação na camada isolada.
              </p>
              <div className="mt-5">
                <Link
                  href="/plataforma/cotacoes/novo"
                  className="inline-flex rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Criar nova cotação
                </Link>
              </div>
            </div>
          ) : (
            cotacoesFiltradas.map((item) => {
              const expandida = cotacaoExpandidaId === item.id
              const prontaParaServico =
                item.status === 'aceita' &&
                item.prontoParaVincularServico &&
                item.motoristaNome.trim().length > 0

              const pendenteDecisao =
                item.clienteDecisaoFinalObrigatoria &&
                item.status !== 'aceita' &&
                item.status !== 'recusada' &&
                item.status !== 'expirada'

              return (
                <article
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {item.id}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusBadgeClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">
                          {modalidadeLabel(item.modalidadeServico)}
                        </span>

                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {faturamentoLabel(item.tipoFaturamentoCliente)}
                        </span>

                        {pendenteDecisao ? (
                          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                            decisão pendente
                          </span>
                        ) : null}

                        {prontaParaServico ? (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                            pronta para serviço
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                          {item.contratante || 'Contratante não informado'}
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.tipoServico || 'Tipo não informado'} â€¢ {item.quantidade}{' '}
                          {item.unidadeQuantidade || 'unidade'}
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <InfoChip label="Cliente final" value={item.clienteFinal || 'â€”'} />
                        <InfoChip
                          label="Motorista"
                          value={item.motoristaNome || 'Não vinculado'}
                        />
                        <InfoChip
                          label="Apresentação"
                          value={item.horarioApresentacao || 'â€”'}
                        />
                        <InfoChip
                          label="Total cotação"
                          value={toMoney(item.resumoFinanceiro?.totalCotacao || 0)}
                        />
                        <InfoChip
                          label="Vencimento"
                          value={toDate(item.dataVencimentoDocumento)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:w-[340px]">
                      <button
                        type="button"
                        onClick={() =>
                          setCotacaoExpandidaId(expandida ? null : item.id)
                        }
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {expandida ? 'Ocultar detalhes' : 'Ver detalhes'}
                      </button>

                      <button
                        type="button"
                        onClick={() => prepararViradaParaServico(item.id)}
                        className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                      >
                        Preparar para serviço
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                    <button
                      type="button"
                      onClick={() => alterarStatus(item.id, 'visualizada')}
                      className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
                    >
                      Marcar visualizada
                    </button>

                    <button
                      type="button"
                      onClick={() => alterarStatus(item.id, 'aceita')}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >
                      Marcar aceita
                    </button>

                    <button
                      type="button"
                      onClick={() => alterarStatus(item.id, 'recusada')}
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                    >
                      Marcar recusada
                    </button>

                    <button
                      type="button"
                      onClick={() => alterarStatus(item.id, 'expirada')}
                      className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                    >
                      Marcar expirada
                    </button>

                    <button
                      type="button"
                      onClick={() => alternarProntaParaServico(item.id)}
                      className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
                    >
                      {item.prontoParaVincularServico
                        ? 'Retirar da fila de serviço'
                        : 'Marcar pronta para serviço'}
                    </button>

                    <button
                      type="button"
                      onClick={() => alternarVisibilidadeMotorista(item.id)}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      {item.visivelParaMotorista
                        ? 'Ocultar do motorista'
                        : 'Mostrar ao motorista'}
                    </button>
                  </div>

                  {expandida ? (
                    <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
                      <section className="space-y-4">
                        <Bloco titulo="Leitura operacional">
                          <div className="grid gap-3 md:grid-cols-2">
                            <InfoLinha label="Criada em" value={toDateTime(item.criadoEm)} />
                            <InfoLinha
                              label="Atualizada em"
                              value={toDateTime(item.atualizadoEm)}
                            />
                            <InfoLinha
                              label="Tipo de serviço"
                              value={item.tipoServico || 'â€”'}
                            />
                            <InfoLinha
                              label="Forma de pagamento"
                              value={item.formaPagamento || 'â€”'}
                            />
                            <InfoLinha
                              label="Empresa operadora"
                              value={item.empresaOperadora || 'â€”'}
                            />
                            <InfoLinha
                              label="Telefone"
                              value={item.telefoneContratante || 'â€”'}
                            />
                            <InfoLinha
                              label="E-mail"
                              value={item.emailContratante || 'â€”'}
                            />
                            <InfoLinha
                              label="Horário do serviço"
                              value={item.horarioServico || 'â€”'}
                            />
                            <InfoLinha
                              label="Horário apresentação"
                              value={item.horarioApresentacao || 'â€”'}
                            />
                            <InfoLinha
                              label="Local apresentação"
                              value={item.localApresentacao || 'â€”'}
                            />
                            <InfoLinha
                              label="Origem"
                              value={item.origem || 'â€”'}
                            />
                            <InfoLinha
                              label="Destino"
                              value={item.destino || 'â€”'}
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Quantidade, cobrança e espera">
                          <div className="grid gap-3 md:grid-cols-2">
                            <InfoLinha
                              label="Modalidade"
                              value={modalidadeLabel(item.modalidadeServico)}
                            />
                            <InfoLinha
                              label="Quantidade"
                              value={`${item.quantidade} ${item.unidadeQuantidade || 'unidade'}`}
                            />
                            <InfoLinha
                              label="Valor unitário cliente"
                              value={toMoney(item.valorUnitarioCliente || 0)}
                            />
                            <InfoLinha
                              label="Valor unitário motorista"
                              value={toMoney(item.valorUnitarioMotorista || 0)}
                            />
                            <InfoLinha
                              label="Total base cliente"
                              value={toMoney(item.valorTotalClienteBase || 0)}
                            />
                            <InfoLinha
                              label="Total base motorista"
                              value={toMoney(item.valorTotalMotorista || 0)}
                            />
                            <InfoLinha
                              label="Horas previstas de espera"
                              value={`${item.horasPrevistasEspera || 0}h`}
                            />
                            <InfoLinha
                              label="Diárias extras"
                              value={toMoney(item.resumoFinanceiro?.diariasExtras || 0)}
                            />
                            <InfoLinha
                              label="Qtd. diárias extras"
                              value={String(item.quantidadeDiariasExtras || 0)}
                            />
                            <InfoLinha
                              label="Motivo diária extra"
                              value={item.motivoDiariaExtra || 'â€”'}
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Cliente, faturamento e documento">
                          <div className="grid gap-3 md:grid-cols-2">
                            <InfoLinha
                              label="Tipo de pessoa"
                              value={item.tipoPessoaCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="Documento cliente"
                              value={item.documentoCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="Inscrição estadual"
                              value={item.inscricaoEstadualCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="Inscrição municipal"
                              value={item.inscricaoMunicipalCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="E-mail financeiro"
                              value={item.emailFinanceiroCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="Responsável financeiro"
                              value={item.responsavelFinanceiroCliente || 'â€”'}
                            />
                            <InfoLinha
                              label="Tipo faturamento"
                              value={faturamentoLabel(item.tipoFaturamentoCliente)}
                            />
                            <InfoLinha
                              label="Competência"
                              value={item.competenciaFaturamento || 'â€”'}
                            />
                            <InfoLinha
                              label="Período referência"
                              value={item.periodoReferencia || 'â€”'}
                            />
                            <InfoLinha
                              label="Documento cobrança"
                              value={documentoLabel(item.tipoDocumentoCobranca)}
                            />
                            <InfoLinha
                              label="Emissão"
                              value={toDate(item.dataEmissaoDocumento)}
                            />
                            <InfoLinha
                              label="Vencimento"
                              value={toDate(item.dataVencimentoDocumento)}
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Observações">
                          <div className="grid gap-4">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Apresentação
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                {item.observacaoApresentacao || 'Sem observações de apresentação.'}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Cliente
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                {item.observacoesCliente || 'Sem observações para o cliente.'}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Internas
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                {item.observacoesInternas || 'Sem observações internas.'}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Financeiras
                              </p>
                              <p className="mt-2 text-sm text-slate-700">
                                {item.observacoesFinanceiras || 'Sem observações financeiras.'}
                              </p>
                            </div>
                          </div>
                        </Bloco>
                      </section>

                      <aside className="space-y-4">
                        <Bloco titulo="Resumo financeiro">
                          <div className="space-y-3">
                            <InfoLinha
                              label="Reembolso deslocamento"
                              value={toMoney(item.resumoFinanceiro?.reembolsoDeslocamento || 0)}
                            />
                            <InfoLinha
                              label="Diárias extras"
                              value={toMoney(item.resumoFinanceiro?.diariasExtras || 0)}
                            />
                            <InfoLinha
                              label="Subtotal de custos"
                              value={toMoney(item.resumoFinanceiro?.subtotalCustos || 0)}
                            />
                            <InfoLinha
                              label="Acréscimo urgente"
                              value={toMoney(item.resumoFinanceiro?.acrescimoUrgente || 0)}
                            />
                            <InfoLinha
                              label="Acréscimo emergencial"
                              value={toMoney(item.resumoFinanceiro?.acrescimoEmergencial || 0)}
                            />
                            <InfoLinha
                              label="Total cotação"
                              value={toMoney(item.resumoFinanceiro?.totalCotacao || 0)}
                              destaque
                            />
                            <InfoLinha
                              label="Margem bruta"
                              value={toMoney(item.resumoFinanceiro?.margemBruta || 0)}
                              destaque
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Motorista e base">
                          <div className="space-y-3">
                            <InfoLinha
                              label="Motorista"
                              value={item.motoristaNome || 'Não vinculado'}
                            />
                            <InfoLinha
                              label="ID motorista"
                              value={item.motoristaId || 'â€”'}
                            />
                            <InfoLinha
                              label="Base"
                              value={item.baseMotorista || 'â€”'}
                            />
                            <InfoLinha
                              label="Cidade atual"
                              value={item.motoristaCidadeAtual || 'â€”'}
                            />
                            <InfoLinha
                              label="DistÃ¢ncia fora da base"
                              value={`${item.distanciaForaBaseKm || 0} km`}
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Emitente e cobrança">
                          <div className="space-y-3">
                            <InfoLinha
                              label="Emitente"
                              value={item.emitenteNome || 'â€”'}
                            />
                            <InfoLinha
                              label="Documento emitente"
                              value={item.emitenteDocumento || 'â€”'}
                            />
                            <InfoLinha
                              label="Inscrição emitente"
                              value={item.emitenteInscricao || 'â€”'}
                            />
                            <InfoLinha
                              label="Prazo pagamento"
                              value={`${item.prazoPagamentoDias || 0} dia(s)`}
                            />
                          </div>
                        </Bloco>

                        <Bloco titulo="Leitura estratégica">
                          <div className="space-y-3 text-sm text-slate-700">
                            <p>
                              <strong>Decisão final obrigatória:</strong>{' '}
                              {item.clienteDecisaoFinalObrigatoria ? 'sim' : 'não'}
                            </p>
                            <p>
                              <strong>Cliente aceitou termos:</strong>{' '}
                              {item.clienteAceitouTermos ? 'sim' : 'não'}
                            </p>
                            <p>
                              <strong>Visível para motorista:</strong>{' '}
                              {item.visivelParaMotorista ? 'sim' : 'não'}
                            </p>
                            <p>
                              <strong>Pronta para virar serviço:</strong>{' '}
                              {item.prontoParaVincularServico ? 'sim' : 'não'}
                            </p>
                            <p>
                              <strong>Agrupar no fechamento mensal:</strong>{' '}
                              {item.agruparNoFechamentoMensal ? 'sim' : 'não'}
                            </p>
                          </div>
                        </Bloco>

                        <Bloco titulo="Ação irreversível com cuidado">
                          <button
                            type="button"
                            onClick={() => removerCotacao(item.id)}
                            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            Remover cotação isolada
                          </button>
                        </Bloco>
                      </aside>
                    </div>
                  ) : null}
                </article>
              )
            })
          )}
        </section>
      </div>
    </main>
  )
}

function ResumoCard({
  titulo,
  valor,
  detalhe,
}: {
  titulo: string
  valor: string
  detalhe: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{titulo}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{valor}</p>
      <p className="mt-2 text-sm text-slate-600">{detalhe}</p>
    </div>
  )
}

function MiniCard({
  label,
  value,
  money = false,
}: {
  label: string
  value: number
  money?: boolean
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-slate-900">
        {money ? toMoney(value) : value}
      </p>
    </div>
  )
}

function InfoChip({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function Bloco({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">{titulo}</h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function InfoLinha({
  label,
  value,
  destaque = false,
}: {
  label: string
  value: string
  destaque?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
      <span
        className={
          destaque
            ? 'text-sm font-semibold text-slate-900'
            : 'text-sm text-slate-600'
        }
      >
        {label}
      </span>
      <span
        className={
          destaque
            ? 'text-sm font-bold text-slate-900'
            : 'text-sm font-semibold text-slate-700'
        }
      >
        {value}
      </span>
    </div>
  )
}

