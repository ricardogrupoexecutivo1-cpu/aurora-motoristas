'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

type StatusCotacao =
  | 'rascunho'
  | 'enviada'
  | 'visualizada'
  | 'aceita'
  | 'recusada'
  | 'expirada'

type BaseMotorista = 'bh' | 'parauapebas' | 'outra'

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

type TipoOperacao =
  | 'transfer'
  | 'mobilizacao'
  | 'desmobilizacao'
  | 'mobilizacao_desmobilizacao'
  | 'diaria'
  | 'semanal'
  | 'mensal'
  | 'pacote_personalizado'

type TipoDespesa =
  | 'combustivel'
  | 'pedagio'
  | 'alimentacao'
  | 'hospedagem'
  | 'estacionamento'
  | 'manutencao'
  | 'outros'

type DespesaItem = {
  id: string
  tipo: TipoDespesa
  descricao: string
  valor: number
}

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
  tipoOperacao: TipoOperacao
  quantidade: number
  unidadeQuantidade: string
  baseMotorista: BaseMotorista
  motoristaNome: string
  motoristaId: string
  motoristaCidadeAtual: string
  kmIda: number
  kmRetorno: number
  aplicarReembolsoIda: boolean
  aplicarReembolsoRetorno: boolean
  valorKmSemReembolso: number
  valorKmComReembolso: number
  totalOperacionalIda: number
  totalOperacionalRetorno: number
  totalOperacional: number
  horasPrevistasEspera: number
  cobraDiariaExtraApos6h: boolean
  valorDiariaExtra: number
  quantidadeDiariasExtras: number
  motivoDiariaExtra: string
  despesas: DespesaItem[]
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
    diariasExtras: number
    totalDespesas: number
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

function toNumber(value: string) {
  const normalized = value.replace(',', '.').replace(/[^\d.-]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function isValidDocumento(tipoPessoa: TipoPessoa, value: string) {
  const digits = digitsOnly(value)
  if (tipoPessoa === 'juridica') return digits.length === 14
  return digits.length === 11
}

function getDocumentoLabel(tipoPessoa: TipoPessoa) {
  return tipoPessoa === 'juridica' ? 'CNPJ' : 'CPF'
}

function generateId(prefix = 'COT') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function addDaysToDate(dateStr: string, days: number) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  date.setDate(date.getDate() + Math.max(0, days))
  return date.toISOString().slice(0, 10)
}

function totalDespesasFromList(despesas: DespesaItem[]) {
  return despesas.reduce((acc, item) => acc + item.valor, 0)
}

function tipoDespesaLabel(tipo: TipoDespesa) {
  switch (tipo) {
    case 'combustivel':
      return 'Combustível'
    case 'pedagio':
      return 'Pedágio'
    case 'alimentacao':
      return 'Alimentação'
    case 'hospedagem':
      return 'Hospedagem'
    case 'estacionamento':
      return 'Estacionamento'
    case 'manutencao':
      return 'Manutenção'
    default:
      return 'Outros'
  }
}

function PlataformaCotacaoMobilizacaoDesmobilizacaoContent() {
  const searchParams = useSearchParams()
  const mensagemRef = useRef<HTMLDivElement | null>(null)
  const paramsAppliedRef = useRef(false)

  const [status, setStatus] = useState<StatusCotacao>('enviada')
  const [tipoPessoaCliente, setTipoPessoaCliente] = useState<TipoPessoa>('juridica')
  const [documentoCliente, setDocumentoCliente] = useState('')
  const [contratante, setContratante] = useState('')
  const [telefoneContratante, setTelefoneContratante] = useState('')
  const [emailContratante, setEmailContratante] = useState('')
  const [emailFinanceiroCliente, setEmailFinanceiroCliente] = useState('')
  const [responsavelFinanceiroCliente, setResponsavelFinanceiroCliente] = useState('')
  const [enderecoCliente, setEnderecoCliente] = useState('')
  const [cidadeCliente, setCidadeCliente] = useState('')
  const [estadoCliente, setEstadoCliente] = useState('')
  const [cepCliente, setCepCliente] = useState('')

  const [dataServico, setDataServico] = useState('')
  const [horarioApresentacao, setHorarioApresentacao] = useState('')
  const [horarioServico, setHorarioServico] = useState('')
  const [localApresentacao, setLocalApresentacao] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [observacaoApresentacao, setObservacaoApresentacao] = useState('')

  const [motoristaNome, setMotoristaNome] = useState('')
  const [motoristaId, setMotoristaId] = useState('')
  const [motoristaCidadeAtual, setMotoristaCidadeAtual] = useState('')
  const [baseMotorista, setBaseMotorista] = useState<BaseMotorista>('bh')

  const [kmIda, setKmIda] = useState(0)
  const [kmRetorno, setKmRetorno] = useState(0)
  const [aplicarReembolsoIda, setAplicarReembolsoIda] = useState(false)
  const [aplicarReembolsoRetorno, setAplicarReembolsoRetorno] = useState(false)
  const [valorKmSemReembolso, setValorKmSemReembolso] = useState(2.9)
  const [valorKmComReembolso, setValorKmComReembolso] = useState(2.1)

  const [valorUnitarioCliente, setValorUnitarioCliente] = useState(0)
  const [valorUnitarioMotorista, setValorUnitarioMotorista] = useState(0)
  const [quantidade, setQuantidade] = useState(1)

  const [prioridadeAtendimento, setPrioridadeAtendimento] =
    useState<PrioridadeAtendimento>('normal')
  const [acrescimoUrgentePercentual, setAcrescimoUrgentePercentual] = useState(15)
  const [acrescimoEmergencialPercentual, setAcrescimoEmergencialPercentual] =
    useState(30)

  const [despesas, setDespesas] = useState<DespesaItem[]>([])
  const [novaDespesaTipo, setNovaDespesaTipo] = useState<TipoDespesa>('combustivel')
  const [novaDespesaDescricao, setNovaDespesaDescricao] = useState('')
  const [novaDespesaValor, setNovaDespesaValor] = useState(0)

  const [tipoFaturamentoCliente, setTipoFaturamentoCliente] =
    useState<TipoFaturamentoCliente>('por_servico')
  const [competenciaFaturamento, setCompetenciaFaturamento] = useState('')
  const [periodoReferencia, setPeriodoReferencia] = useState('')

  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>('a_combinar')

  const [clienteAceitouTermos, setClienteAceitouTermos] = useState(false)
  const [visivelParaMotorista, setVisivelParaMotorista] = useState(false)
  const [prontoParaVincularServico, setProntoParaVincularServico] =
    useState(false)

  const [observacoesCliente, setObservacoesCliente] = useState('')
  const [observacoesInternas, setObservacoesInternas] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [mensagemTipo, setMensagemTipo] = useState<'erro' | 'sucesso'>('sucesso')

  useEffect(() => {
    if (paramsAppliedRef.current) return

    const tipoPessoa = searchParams.get('tipoPessoa')
    if (tipoPessoa === 'fisica' || tipoPessoa === 'juridica') {
      setTipoPessoaCliente(tipoPessoa)
    }

    const documento = searchParams.get('documento')
    const nome = searchParams.get('nome')
    const emailFinanceiro = searchParams.get('emailFinanceiro')
    const telefone = searchParams.get('telefone')
    const endereco = searchParams.get('endereco')
    const cidade = searchParams.get('cidade')
    const estado = searchParams.get('estado')
    const cep = searchParams.get('cep')
    const responsavelFinanceiro = searchParams.get('responsavelFinanceiro')

    if (documento) setDocumentoCliente(documento)
    if (nome) setContratante(nome)
    if (emailFinanceiro) {
      setEmailFinanceiroCliente(emailFinanceiro)
      setEmailContratante(emailFinanceiro)
    }
    if (telefone) setTelefoneContratante(telefone)
    if (endereco) setEnderecoCliente(endereco)
    if (cidade) setCidadeCliente(cidade)
    if (estado) setEstadoCliente(estado)
    if (cep) setCepCliente(cep)
    if (responsavelFinanceiro) setResponsavelFinanceiroCliente(responsavelFinanceiro)

    paramsAppliedRef.current = true
  }, [searchParams])

  const quantidadeFinal = useMemo(() => Math.max(1, quantidade || 1), [quantidade])

  const valorKmIda = useMemo(
    () => (aplicarReembolsoIda ? valorKmComReembolso : valorKmSemReembolso),
    [aplicarReembolsoIda, valorKmComReembolso, valorKmSemReembolso]
  )

  const valorKmRetorno = useMemo(
    () => (aplicarReembolsoRetorno ? valorKmComReembolso : valorKmSemReembolso),
    [aplicarReembolsoRetorno, valorKmComReembolso, valorKmSemReembolso]
  )

  const totalOperacionalIda = useMemo(() => kmIda * valorKmIda, [kmIda, valorKmIda])
  const totalOperacionalRetorno = useMemo(
    () => kmRetorno * valorKmRetorno,
    [kmRetorno, valorKmRetorno]
  )

  const totalOperacional = useMemo(
    () => totalOperacionalIda + totalOperacionalRetorno,
    [totalOperacionalIda, totalOperacionalRetorno]
  )

  const valorTotalClienteBase = useMemo(
    () => valorUnitarioCliente * quantidadeFinal,
    [valorUnitarioCliente, quantidadeFinal]
  )

  const valorTotalMotorista = useMemo(
    () => valorUnitarioMotorista * quantidadeFinal,
    [valorUnitarioMotorista, quantidadeFinal]
  )

  const totalDespesas = useMemo(() => totalDespesasFromList(despesas), [despesas])

  const subtotalCustos = useMemo(
    () => valorTotalMotorista + totalDespesas,
    [valorTotalMotorista, totalDespesas]
  )

  const acrescimoUrgente = useMemo(() => {
    return prioridadeAtendimento === 'urgente'
      ? (valorTotalClienteBase * acrescimoUrgentePercentual) / 100
      : 0
  }, [prioridadeAtendimento, valorTotalClienteBase, acrescimoUrgentePercentual])

  const acrescimoEmergencial = useMemo(() => {
    return prioridadeAtendimento === 'emergencial'
      ? (valorTotalClienteBase * acrescimoEmergencialPercentual) / 100
      : 0
  }, [
    prioridadeAtendimento,
    valorTotalClienteBase,
    acrescimoEmergencialPercentual,
  ])

  const valorCobradoCliente = useMemo(() => {
    return (
      valorTotalClienteBase +
      totalOperacional +
      totalDespesas +
      acrescimoUrgente +
      acrescimoEmergencial
    )
  }, [
    valorTotalClienteBase,
    totalOperacional,
    totalDespesas,
    acrescimoUrgente,
    acrescimoEmergencial,
  ])

  const margemBruta = useMemo(() => {
    return valorCobradoCliente - subtotalCustos
  }, [valorCobradoCliente, subtotalCustos])

  const podeVincularServico =
    prontoParaVincularServico &&
    status === 'aceita' &&
    motoristaNome.trim().length > 0

  function showMessage(texto: string, tipo: 'erro' | 'sucesso') {
    setMensagem(texto)
    setMensagemTipo(tipo)
    setTimeout(() => {
      mensagemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  function adicionarDespesa() {
    if (!novaDespesaDescricao.trim()) {
      showMessage('Informe a descrição da despesa antes de adicionar.', 'erro')
      return
    }

    if (novaDespesaValor <= 0) {
      showMessage('Informe um valor de despesa maior que zero.', 'erro')
      return
    }

    setDespesas((prev) => [
      ...prev,
      {
        id: generateId('DESP'),
        tipo: novaDespesaTipo,
        descricao: novaDespesaDescricao.trim(),
        valor: novaDespesaValor,
      },
    ])

    setNovaDespesaTipo('combustivel')
    setNovaDespesaDescricao('')
    setNovaDespesaValor(0)
  }

  function removerDespesa(id: string) {
    setDespesas((prev) => prev.filter((item) => item.id !== id))
  }

  function salvarCotacao() {
    const documentoLimpo = digitsOnly(documentoCliente)

    if (!contratante.trim()) {
      showMessage('Informe o contratante antes de salvar.', 'erro')
      return
    }

    if (!documentoLimpo) {
      showMessage(`Informe o ${getDocumentoLabel(tipoPessoaCliente)} do cliente.`, 'erro')
      return
    }

    if (!isValidDocumento(tipoPessoaCliente, documentoCliente)) {
      showMessage(
        `${getDocumentoLabel(tipoPessoaCliente)} do cliente inválido. Preencha com números suficientes.`,
        'erro'
      )
      return
    }

    if (!dataServico) {
      showMessage('Informe a data do serviço.', 'erro')
      return
    }

    if (!horarioApresentacao) {
      showMessage('Informe o horário de apresentação.', 'erro')
      return
    }

    if (!origem.trim()) {
      showMessage('Informe a origem da operação.', 'erro')
      return
    }

    if (!destino.trim()) {
      showMessage('Informe o destino da operação.', 'erro')
      return
    }

    if (tipoFaturamentoCliente === 'mensal' && !competenciaFaturamento.trim()) {
      showMessage('Informe a competência do faturamento mensal.', 'erro')
      return
    }

    const payload: CotacaoPayload = {
      id: generateId(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      status,
      clienteDecisaoFinalObrigatoria: true,
      contratante: contratante.trim(),
      clienteFinal: '',
      empresaOperadora: '',
      telefoneContratante: telefoneContratante.trim(),
      emailContratante: emailContratante.trim(),
      origem: origem.trim(),
      destino: destino.trim(),
      dataServico,
      horarioServico,
      horarioApresentacao,
      localApresentacao: localApresentacao.trim(),
      observacaoApresentacao: observacaoApresentacao.trim(),
      tipoServico: 'Mobilização + desmobilização',
      modalidadeServico: 'pacote_personalizado',
      tipoOperacao: 'mobilizacao_desmobilizacao',
      quantidade: quantidadeFinal,
      unidadeQuantidade: 'serviço',
      baseMotorista,
      motoristaNome: motoristaNome.trim(),
      motoristaId: motoristaId.trim(),
      motoristaCidadeAtual: motoristaCidadeAtual.trim(),
      kmIda,
      kmRetorno,
      aplicarReembolsoIda,
      aplicarReembolsoRetorno,
      valorKmSemReembolso,
      valorKmComReembolso,
      totalOperacionalIda,
      totalOperacionalRetorno,
      totalOperacional,
      horasPrevistasEspera: 0,
      cobraDiariaExtraApos6h: false,
      valorDiariaExtra: 0,
      quantidadeDiariasExtras: 0,
      motivoDiariaExtra: '',
      despesas,
      valorUnitarioMotorista,
      valorUnitarioCliente,
      valorTotalMotorista,
      valorTotalClienteBase,
      valorCobradoCliente,
      acrescimoUrgentePercentual,
      acrescimoEmergencialPercentual,
      prioridadeAtendimento,
      formaPagamento,
      tipoPessoaCliente,
      documentoCliente: documentoLimpo,
      inscricaoEstadualCliente: '',
      inscricaoMunicipalCliente: '',
      enderecoCliente: enderecoCliente.trim(),
      cidadeCliente: cidadeCliente.trim(),
      estadoCliente: estadoCliente.trim(),
      cepCliente: cepCliente.trim(),
      emailFinanceiroCliente: emailFinanceiroCliente.trim(),
      responsavelFinanceiroCliente: responsavelFinanceiroCliente.trim(),
      tipoFaturamentoCliente,
      competenciaFaturamento: competenciaFaturamento.trim(),
      periodoReferencia: periodoReferencia.trim(),
      agruparNoFechamentoMensal: tipoFaturamentoCliente === 'mensal',
      tipoDocumentoCobranca: 'nota_debito',
      prazoPagamentoDias: 7,
      dataEmissaoDocumento: '',
      dataVencimentoDocumento: '',
      emitenteNome: '',
      emitenteDocumento: '',
      emitenteInscricao: '',
      emitenteEndereco: '',
      emitenteCidadeEstado: '',
      emitenteTelefone: '',
      emitenteEmail: '',
      emitenteDadosPagamento: '',
      observacoesFinanceiras: '',
      observacoesInternas: observacoesInternas.trim(),
      observacoesCliente: observacoesCliente.trim(),
      clienteAceitouTermos,
      visivelParaMotorista,
      prontoParaVincularServico,
      resumoFinanceiro: {
        diariasExtras: 0,
        totalDespesas,
        subtotalCustos,
        acrescimoUrgente,
        acrescimoEmergencial,
        totalCotacao: valorCobradoCliente,
        margemBruta,
      },
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const atual = raw ? (JSON.parse(raw) as CotacaoPayload[]) : []
      const atualizado = [payload, ...atual]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado))

      showMessage(
        `Cotação ${payload.id} salva com sucesso na página enxuta de mobilização + desmobilização.`,
        'sucesso'
      )
    } catch {
      showMessage('Não foi possível salvar agora no navegador.', 'erro')
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas • Cotação enxuta
              </span>

              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Mobilização + desmobilização
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  Página nova e isolada, criada para operação rápida. Aqui entram só os
                  campos principais para este tipo de cotação, sem abrir a página grande
                  para todo mundo.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                  Tipo já travado
                </span>
                <span className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
                  Cliente já puxado
                </span>
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                  Sem mexer na página completa
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
                href="/plataforma/cotacoes/novo"
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Voltar à entrada rápida
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sistema em constante atualização. Esta página foi criada em camada separada para
            agilizar a operação sem risco de quebrar a base já publicada.
          </div>
        </section>

        {mensagem ? (
          <section
            ref={mensagemRef}
            className={`rounded-3xl border px-5 py-4 shadow-sm ${
              mensagemTipo === 'erro'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-cyan-200 bg-cyan-50 text-cyan-800'
            }`}
          >
            <p className="text-sm font-semibold">{mensagem}</p>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Cliente e identificação</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Tipo de pessoa">
                  <select
                    value={tipoPessoaCliente}
                    onChange={(e) => setTipoPessoaCliente(e.target.value as TipoPessoa)}
                    className="input"
                  >
                    <option value="juridica">Jurídica</option>
                    <option value="fisica">Física</option>
                  </select>
                </Field>

                <Field
                  label={getDocumentoLabel(tipoPessoaCliente)}
                  helper="Obrigatório. Pode ser com ou sem máscara."
                >
                  <input
                    value={documentoCliente}
                    onChange={(e) => setDocumentoCliente(e.target.value)}
                    className="input"
                    placeholder={
                      tipoPessoaCliente === 'juridica'
                        ? '00.000.000/0000-00'
                        : '000.000.000-00'
                    }
                  />
                </Field>

                <Field label="Contratante" helper="Obrigatório.">
                  <input
                    value={contratante}
                    onChange={(e) => setContratante(e.target.value)}
                    className="input"
                    placeholder="Nome do contratante"
                  />
                </Field>

                <Field label="Telefone">
                  <input
                    value={telefoneContratante}
                    onChange={(e) => setTelefoneContratante(e.target.value)}
                    className="input"
                    placeholder="(00) 00000-0000"
                  />
                </Field>

                <Field label="E-mail do contratante">
                  <input
                    value={emailContratante}
                    onChange={(e) => setEmailContratante(e.target.value)}
                    className="input"
                    placeholder="contato@empresa.com"
                  />
                </Field>

                <Field label="E-mail financeiro">
                  <input
                    value={emailFinanceiroCliente}
                    onChange={(e) => setEmailFinanceiroCliente(e.target.value)}
                    className="input"
                    placeholder="financeiro@cliente.com"
                  />
                </Field>

                <Field label="Responsável financeiro">
                  <input
                    value={responsavelFinanceiroCliente}
                    onChange={(e) => setResponsavelFinanceiroCliente(e.target.value)}
                    className="input"
                    placeholder="Nome do responsável"
                  />
                </Field>

                <Field label="Endereço">
                  <input
                    value={enderecoCliente}
                    onChange={(e) => setEnderecoCliente(e.target.value)}
                    className="input"
                    placeholder="Rua, número, bairro"
                  />
                </Field>

                <Field label="Cidade">
                  <input
                    value={cidadeCliente}
                    onChange={(e) => setCidadeCliente(e.target.value)}
                    className="input"
                    placeholder="Cidade"
                  />
                </Field>

                <Field label="Estado">
                  <input
                    value={estadoCliente}
                    onChange={(e) => setEstadoCliente(e.target.value)}
                    className="input"
                    placeholder="UF"
                  />
                </Field>

                <Field label="CEP">
                  <input
                    value={cepCliente}
                    onChange={(e) => setCepCliente(e.target.value)}
                    className="input"
                    placeholder="00000-000"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Dados operacionais principais</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Status da cotação">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as StatusCotacao)}
                    className="input"
                  >
                    <option value="rascunho">rascunho</option>
                    <option value="enviada">enviada</option>
                    <option value="visualizada">visualizada</option>
                    <option value="aceita">aceita</option>
                    <option value="recusada">recusada</option>
                    <option value="expirada">expirada</option>
                  </select>
                </Field>

                <Field label="Data do serviço" helper="Obrigatório.">
                  <input
                    type="date"
                    value={dataServico}
                    onChange={(e) => setDataServico(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Horário de apresentação" helper="Obrigatório.">
                  <input
                    type="time"
                    value={horarioApresentacao}
                    onChange={(e) => setHorarioApresentacao(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Horário do serviço">
                  <input
                    type="time"
                    value={horarioServico}
                    onChange={(e) => setHorarioServico(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Local de apresentação">
                  <input
                    value={localApresentacao}
                    onChange={(e) => setLocalApresentacao(e.target.value)}
                    className="input"
                    placeholder="Ex.: garagem, hotel, aeroporto"
                  />
                </Field>

                <Field label="Origem" helper="Obrigatório.">
                  <input
                    value={origem}
                    onChange={(e) => setOrigem(e.target.value)}
                    className="input"
                    placeholder="Origem"
                  />
                </Field>

                <Field label="Destino" helper="Obrigatório.">
                  <input
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="input"
                    placeholder="Destino"
                  />
                </Field>

                <Field label="Quantidade">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(toNumber(e.target.value))}
                    className="input"
                    placeholder="1"
                  />
                </Field>

                <Field label="Prioridade">
                  <select
                    value={prioridadeAtendimento}
                    onChange={(e) =>
                      setPrioridadeAtendimento(e.target.value as PrioridadeAtendimento)
                    }
                    className="input"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgente">Urgente</option>
                    <option value="emergencial">Emergencial</option>
                  </select>
                </Field>

                <Field label="Forma de pagamento">
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                    className="input"
                  >
                    <option value="a_combinar">A combinar</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transferência</option>
                    <option value="cartao">Cartão</option>
                  </select>
                </Field>

                <Field label="Observação da apresentação">
                  <input
                    value={observacaoApresentacao}
                    onChange={(e) => setObservacaoApresentacao(e.target.value)}
                    className="input"
                    placeholder="Ponto, contato, instrução rápida"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Motorista e deslocamento</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Motorista">
                  <input
                    value={motoristaNome}
                    onChange={(e) => setMotoristaNome(e.target.value)}
                    className="input"
                    placeholder="Nome do motorista"
                  />
                </Field>

                <Field label="ID do motorista">
                  <input
                    value={motoristaId}
                    onChange={(e) => setMotoristaId(e.target.value)}
                    className="input"
                    placeholder="ID interno se houver"
                  />
                </Field>

                <Field label="Cidade atual do motorista">
                  <input
                    value={motoristaCidadeAtual}
                    onChange={(e) => setMotoristaCidadeAtual(e.target.value)}
                    className="input"
                    placeholder="Cidade atual"
                  />
                </Field>

                <Field label="Base do motorista">
                  <select
                    value={baseMotorista}
                    onChange={(e) => setBaseMotorista(e.target.value as BaseMotorista)}
                    className="input"
                  >
                    <option value="bh">BH</option>
                    <option value="parauapebas">Parauapebas</option>
                    <option value="outra">Outra</option>
                  </select>
                </Field>

                <Field label="KM da ida">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={kmIda}
                    onChange={(e) => setKmIda(toNumber(e.target.value))}
                    className="input"
                    placeholder="0"
                  />
                </Field>

                <Field label="KM do retorno">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={kmRetorno}
                    onChange={(e) => setKmRetorno(toNumber(e.target.value))}
                    className="input"
                    placeholder="0"
                  />
                </Field>

                <MoneyField
                  label="Valor KM sem reembolso"
                  value={valorKmSemReembolso}
                  onChange={setValorKmSemReembolso}
                />

                <MoneyField
                  label="Valor KM com reembolso"
                  value={valorKmComReembolso}
                  onChange={setValorKmComReembolso}
                />

                <Field label="Aplicar reembolso na ida?">
                  <select
                    value={aplicarReembolsoIda ? 'sim' : 'nao'}
                    onChange={(e) => setAplicarReembolsoIda(e.target.value === 'sim')}
                    className="input"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </Field>

                <Field label="Aplicar reembolso no retorno?">
                  <select
                    value={aplicarReembolsoRetorno ? 'sim' : 'nao'}
                    onChange={(e) => setAplicarReembolsoRetorno(e.target.value === 'sim')}
                    className="input"
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Valores e despesas</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <MoneyField
                  label="Valor unitário do cliente"
                  value={valorUnitarioCliente}
                  onChange={setValorUnitarioCliente}
                />

                <MoneyField
                  label="Valor unitário do motorista"
                  value={valorUnitarioMotorista}
                  onChange={setValorUnitarioMotorista}
                />

                <Field label="Tipo de faturamento">
                  <select
                    value={tipoFaturamentoCliente}
                    onChange={(e) =>
                      setTipoFaturamentoCliente(
                        e.target.value as TipoFaturamentoCliente
                      )
                    }
                    className="input"
                  >
                    <option value="por_servico">Por serviço</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </Field>

                <Field label="Competência">
                  <input
                    value={competenciaFaturamento}
                    onChange={(e) => setCompetenciaFaturamento(e.target.value)}
                    className="input"
                    placeholder="Ex.: 04/2026"
                  />
                </Field>

                <Field label="Período de referência">
                  <input
                    value={periodoReferencia}
                    onChange={(e) => setPeriodoReferencia(e.target.value)}
                    className="input"
                    placeholder="Ex.: 01/04 a 30/04"
                  />
                </Field>

                <MoneyField
                  label="Acréscimo urgente (%)"
                  value={acrescimoUrgentePercentual}
                  onChange={setAcrescimoUrgentePercentual}
                />

                <MoneyField
                  label="Acréscimo emergencial (%)"
                  value={acrescimoEmergencialPercentual}
                  onChange={setAcrescimoEmergencialPercentual}
                />
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Lançar despesa rápida
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Tipo">
                    <select
                      value={novaDespesaTipo}
                      onChange={(e) => setNovaDespesaTipo(e.target.value as TipoDespesa)}
                      className="input"
                    >
                      <option value="combustivel">Combustível</option>
                      <option value="pedagio">Pedágio</option>
                      <option value="alimentacao">Alimentação</option>
                      <option value="hospedagem">Hospedagem</option>
                      <option value="estacionamento">Estacionamento</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="outros">Outros</option>
                    </select>
                  </Field>

                  <Field label="Descrição">
                    <input
                      value={novaDespesaDescricao}
                      onChange={(e) => setNovaDespesaDescricao(e.target.value)}
                      className="input"
                      placeholder="Ex.: abastecimento"
                    />
                  </Field>

                  <MoneyField
                    label="Valor"
                    value={novaDespesaValor}
                    onChange={setNovaDespesaValor}
                  />

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={adicionarDespesa}
                      className="h-12 w-full rounded-2xl border border-slate-900 bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      Adicionar despesa
                    </button>
                  </div>
                </div>

                {despesas.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-600">
                    Nenhuma despesa lançada ainda.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {despesas.map((despesa) => (
                      <div
                        key={despesa.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {tipoDespesaLabel(despesa.tipo)}
                          </p>
                          <p className="text-sm text-slate-600">{despesa.descricao}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-slate-900">
                            {toMoney(despesa.valor)}
                          </span>
                          <button
                            type="button"
                            onClick={() => removerDespesa(despesa.id)}
                            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Controle estratégico</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={clienteAceitouTermos}
                    onChange={(e) => setClienteAceitouTermos(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Confirmar que a cotação precisa retornar como <strong>aceita</strong> ou <strong>recusada</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={visivelParaMotorista}
                    onChange={(e) => setVisivelParaMotorista(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Marcar como visível para motorista quando a operação já puder avançar.
                  </span>
                </label>

                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 md:col-span-2">
                  <input
                    type="checkbox"
                    checked={prontoParaVincularServico}
                    onChange={(e) => setProntoParaVincularServico(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Marcar como pronto para virar serviço assim que o cliente aceitar.
                  </span>
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <Field label="Observações para o cliente">
                  <textarea
                    value={observacoesCliente}
                    onChange={(e) => setObservacoesCliente(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Mensagem curta para o cliente."
                  />
                </Field>

                <Field label="Observações internas">
                  <textarea
                    value={observacoesInternas}
                    onChange={(e) => setObservacoesInternas(e.target.value)}
                    rows={4}
                    className="textarea"
                    placeholder="Anotações internas, estratégia, pontos de atenção."
                  />
                </Field>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Resumo enxuto</h2>

              <div className="mt-5 space-y-3">
                <SummaryRow label="Operação" value="Mobilização + desmobilização" />
                <SummaryRow label="Quantidade" value={`${quantidadeFinal} serviço`} />
                <SummaryRow label="KM ida" value={`${kmIda} km`} />
                <SummaryRow label="KM retorno" value={`${kmRetorno} km`} />
                <SummaryRow label="Total ida" value={toMoney(totalOperacionalIda)} />
                <SummaryRow label="Total retorno" value={toMoney(totalOperacionalRetorno)} />
                <SummaryRow label="Total operacional" value={toMoney(totalOperacional)} />
                <SummaryRow label="Despesas" value={toMoney(totalDespesas)} />
                <SummaryRow label="Total base cliente" value={toMoney(valorTotalClienteBase)} />
                <SummaryRow label="Total base motorista" value={toMoney(valorTotalMotorista)} />
                <SummaryRow label="Subtotal custos" value={toMoney(subtotalCustos)} />
                <SummaryRow label="Acréscimo urgente" value={toMoney(acrescimoUrgente)} />
                <SummaryRow label="Acréscimo emergencial" value={toMoney(acrescimoEmergencial)} />
                <SummaryRow label="Total da cotação" value={toMoney(valorCobradoCliente)} strong />
                <SummaryRow label="Margem bruta" value={toMoney(margemBruta)} strong />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Leitura operacional</p>
                <p className="mt-2">
                  {podeVincularServico
                    ? 'Esta cotação já está pronta para virar serviço com vínculo obrigatório ao motorista.'
                    : 'Para virar serviço: status aceita, motorista preenchido e opção pronta para vincular marcada.'}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Ações</h2>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={salvarCotacao}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Salvar cotação enxuta
                </button>

                <Link
                  href="/plataforma/cotacoes/nova"
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Ir para modo completo
                </Link>
              </div>
            </section>
          </aside>
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

        .textarea {
          width: 100%;
          border-radius: 16px;
          border: 1px solid rgb(203 213 225);
          background: white;
          padding: 12px 16px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .textarea:focus {
          border-color: rgb(6 182 212);
        }
      `}</style>
    </main>
  )
}

export default function PlataformaCotacaoMobilizacaoDesmobilizacaoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 text-slate-900">
          <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 md:px-6 lg:px-8">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas • Cotação enxuta
              </span>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Carregando mobilização + desmobilização
              </h1>

              <p className="mt-3 text-sm text-slate-600 md:text-base">
                Estamos preparando a página rápida sem interferir na plataforma principal.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Sistema em constante atualização. Esta camada nova foi criada para agregar valor sem mexer na plataforma já em produção.
              </div>
            </div>
          </div>
        </main>
      }
    >
      <PlataformaCotacaoMobilizacaoDesmobilizacaoContent />
    </Suspense>
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

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <Field label={label}>
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => onChange(toNumber(e.target.value))}
        className="input"
        placeholder="0,00"
      />
    </Field>
  )
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
      <span className={strong ? 'text-sm font-semibold text-slate-900' : 'text-sm text-slate-600'}>
        {label}
      </span>
      <span className={strong ? 'text-sm font-bold text-slate-900' : 'text-sm font-semibold text-slate-700'}>
        {value}
      </span>
    </div>
  )
}