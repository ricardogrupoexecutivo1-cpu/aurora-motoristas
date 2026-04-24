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

function unidadePadraoPorModalidade(modalidade: ModalidadeServico) {
  switch (modalidade) {
    case 'transfer':
      return 'servi├ºo'
    case 'diaria':
      return 'di├íria'
    case 'semanal':
      return 'semana'
    case 'mensal':
      return 'm├¬s'
    default:
      return 'unidade'
  }
}

function addDaysToDate(dateStr: string, days: number) {
  if (!dateStr) return ''
  const date = new Date(`${dateStr}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  date.setDate(date.getDate() + Math.max(0, days))
  return date.toISOString().slice(0, 10)
}

function tipoOperacaoLabel(value: TipoOperacao) {
  switch (value) {
    case 'mobilizacao':
      return 'Mobiliza├º├úo'
    case 'desmobilizacao':
      return 'Desmobiliza├º├úo'
    case 'mobilizacao_desmobilizacao':
      return 'Mobiliza├º├úo + desmobiliza├º├úo'
    case 'diaria':
      return 'Di├íria'
    case 'semanal':
      return 'Semanal'
    case 'mensal':
      return 'Mensal'
    case 'pacote_personalizado':
      return 'Pacote personalizado'
    default:
      return 'Transfer'
  }
}

function mapTipoToConfig(tipo: string | null): {
  modalidade: ModalidadeServico
  operacao: TipoOperacao
  tipoServico: string
  unidade: string
} {
  switch (tipo) {
    case 'mobilizacao':
      return {
        modalidade: 'pacote_personalizado',
        operacao: 'mobilizacao',
        tipoServico: 'Mobiliza├º├úo',
        unidade: 'servi├ºo',
      }
    case 'desmobilizacao':
      return {
        modalidade: 'pacote_personalizado',
        operacao: 'desmobilizacao',
        tipoServico: 'Desmobiliza├º├úo',
        unidade: 'servi├ºo',
      }
    case 'mobilizacao_desmobilizacao':
      return {
        modalidade: 'pacote_personalizado',
        operacao: 'mobilizacao_desmobilizacao',
        tipoServico: 'Mobiliza├º├úo + desmobiliza├º├úo',
        unidade: 'servi├ºo',
      }
    case 'diaria':
      return {
        modalidade: 'diaria',
        operacao: 'diaria',
        tipoServico: 'Di├íria de motorista',
        unidade: 'di├íria',
      }
    case 'semanal':
      return {
        modalidade: 'semanal',
        operacao: 'semanal',
        tipoServico: 'Contrato semanal',
        unidade: 'semana',
      }
    case 'mensal':
      return {
        modalidade: 'mensal',
        operacao: 'mensal',
        tipoServico: 'Contrato mensal',
        unidade: 'm├¬s',
      }
    case 'pacote_personalizado':
      return {
        modalidade: 'pacote_personalizado',
        operacao: 'pacote_personalizado',
        tipoServico: 'Pacote personalizado',
        unidade: 'unidade',
      }
    default:
      return {
        modalidade: 'transfer',
        operacao: 'transfer',
        tipoServico: 'Transfer',
        unidade: 'servi├ºo',
      }
  }
}

function PlataformaCotacoesNovaPageContent() {
  const searchParams = useSearchParams()
  const mensagemRef = useRef<HTMLDivElement | null>(null)
  const paramsAppliedRef = useRef(false)

  const [status, setStatus] = useState<StatusCotacao>('enviada')
  const [contratante, setContratante] = useState('')
  const [clienteFinal, setClienteFinal] = useState('')
  const [empresaOperadora, setEmpresaOperadora] = useState('')
  const [telefoneContratante, setTelefoneContratante] = useState('')
  const [emailContratante, setEmailContratante] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [dataServico, setDataServico] = useState('')
  const [horarioServico, setHorarioServico] = useState('')
  const [horarioApresentacao, setHorarioApresentacao] = useState('')
  const [localApresentacao, setLocalApresentacao] = useState('')
  const [observacaoApresentacao, setObservacaoApresentacao] = useState('')
  const [tipoServico, setTipoServico] = useState('Transfer')
  const [modalidadeServico, setModalidadeServico] =
    useState<ModalidadeServico>('transfer')
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao>('transfer')
  const [quantidade, setQuantidade] = useState(1)
  const [unidadeQuantidade, setUnidadeQuantidade] = useState('servi├ºo')
  const [baseMotorista, setBaseMotorista] = useState<BaseMotorista>('bh')
  const [motoristaNome, setMotoristaNome] = useState('')
  const [motoristaId, setMotoristaId] = useState('')
  const [motoristaCidadeAtual, setMotoristaCidadeAtual] = useState('')
  const [kmIda, setKmIda] = useState(0)
  const [kmRetorno, setKmRetorno] = useState(0)
  const [aplicarReembolsoIda, setAplicarReembolsoIda] = useState(false)
  const [aplicarReembolsoRetorno, setAplicarReembolsoRetorno] = useState(false)
  const [valorKmSemReembolso, setValorKmSemReembolso] = useState(2.9)
  const [valorKmComReembolso, setValorKmComReembolso] = useState(2.1)
  const [horasPrevistasEspera, setHorasPrevistasEspera] = useState(0)
  const [cobraDiariaExtraApos6h, setCobraDiariaExtraApos6h] = useState(true)
  const [valorDiariaExtra, setValorDiariaExtra] = useState(0)
  const [quantidadeDiariasExtras, setQuantidadeDiariasExtras] = useState(0)
  const [motivoDiariaExtra, setMotivoDiariaExtra] = useState(
    'Espera superior a 6 horas para libera├º├úo do ve├¡culo.'
  )
  const [despesas, setDespesas] = useState<DespesaItem[]>([])
  const [valorUnitarioMotorista, setValorUnitarioMotorista] = useState(0)
  const [valorUnitarioCliente, setValorUnitarioCliente] = useState(0)
  const [acrescimoUrgentePercentual, setAcrescimoUrgentePercentual] = useState(15)
  const [acrescimoEmergencialPercentual, setAcrescimoEmergencialPercentual] =
    useState(30)
  const [prioridadeAtendimento, setPrioridadeAtendimento] =
    useState<PrioridadeAtendimento>('normal')
  const [formaPagamento, setFormaPagamento] =
    useState<FormaPagamento>('a_combinar')
  const [tipoPessoaCliente, setTipoPessoaCliente] = useState<TipoPessoa>('juridica')
  const [documentoCliente, setDocumentoCliente] = useState('')
  const [inscricaoEstadualCliente, setInscricaoEstadualCliente] = useState('')
  const [inscricaoMunicipalCliente, setInscricaoMunicipalCliente] = useState('')
  const [enderecoCliente, setEnderecoCliente] = useState('')
  const [cidadeCliente, setCidadeCliente] = useState('')
  const [estadoCliente, setEstadoCliente] = useState('')
  const [cepCliente, setCepCliente] = useState('')
  const [emailFinanceiroCliente, setEmailFinanceiroCliente] = useState('')
  const [responsavelFinanceiroCliente, setResponsavelFinanceiroCliente] = useState('')
  const [tipoFaturamentoCliente, setTipoFaturamentoCliente] =
    useState<TipoFaturamentoCliente>('por_servico')
  const [competenciaFaturamento, setCompetenciaFaturamento] = useState('')
  const [periodoReferencia, setPeriodoReferencia] = useState('')
  const [agruparNoFechamentoMensal, setAgruparNoFechamentoMensal] = useState(false)
  const [tipoDocumentoCobranca, setTipoDocumentoCobranca] =
    useState<TipoDocumentoCobranca>('nota_debito')
  const [prazoPagamentoDias, setPrazoPagamentoDias] = useState(7)
  const [dataEmissaoDocumento, setDataEmissaoDocumento] = useState('')
  const [dataVencimentoDocumento, setDataVencimentoDocumento] = useState('')
  const [emitenteNome, setEmitenteNome] = useState('')
  const [emitenteDocumento, setEmitenteDocumento] = useState('')
  const [emitenteInscricao, setEmitenteInscricao] = useState('')
  const [emitenteEndereco, setEmitenteEndereco] = useState('')
  const [emitenteCidadeEstado, setEmitenteCidadeEstado] = useState('')
  const [emitenteTelefone, setEmitenteTelefone] = useState('')
  const [emitenteEmail, setEmitenteEmail] = useState('')
  const [emitenteDadosPagamento, setEmitenteDadosPagamento] = useState('')
  const [observacoesFinanceiras, setObservacoesFinanceiras] = useState('')
  const [observacoesInternas, setObservacoesInternas] = useState('')
  const [observacoesCliente, setObservacoesCliente] = useState('')
  const [clienteAceitouTermos, setClienteAceitouTermos] = useState(false)
  const [visivelParaMotorista, setVisivelParaMotorista] = useState(false)
  const [prontoParaVincularServico, setProntoParaVincularServico] =
    useState(false)
  const [mensagem, setMensagem] = useState('')
  const [mensagemTipo, setMensagemTipo] = useState<'erro' | 'sucesso'>('sucesso')

  useEffect(() => {
    if (paramsAppliedRef.current) return

    const tipo = searchParams.get('tipo')
    const config = mapTipoToConfig(tipo)

    setModalidadeServico(config.modalidade)
    setTipoOperacao(config.operacao)
    setTipoServico(config.tipoServico)
    setUnidadeQuantidade(config.unidade)

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

  const diariasExtrasCalculadas = useMemo(() => {
    if (!cobraDiariaExtraApos6h) return 0
    if (horasPrevistasEspera <= 6) return 0
    return Math.max(1, quantidadeDiariasExtras || 1) * valorDiariaExtra
  }, [
    cobraDiariaExtraApos6h,
    horasPrevistasEspera,
    quantidadeDiariasExtras,
    valorDiariaExtra,
  ])

  const quantidadeDiariasExtrasFinal = useMemo(() => {
    if (!cobraDiariaExtraApos6h) return 0
    if (horasPrevistasEspera <= 6) return 0
    return Math.max(1, quantidadeDiariasExtras || 1)
  }, [cobraDiariaExtraApos6h, horasPrevistasEspera, quantidadeDiariasExtras])

  const valorTotalMotorista = useMemo(() => {
    return valorUnitarioMotorista * quantidadeFinal
  }, [valorUnitarioMotorista, quantidadeFinal])

  const valorTotalClienteBase = useMemo(() => {
    return valorUnitarioCliente * quantidadeFinal
  }, [valorUnitarioCliente, quantidadeFinal])

  const totalDespesas = useMemo(() => {
    return despesas.reduce((acc, item) => acc + item.valor, 0)
  }, [despesas])

  const subtotalCustos = useMemo(() => {
    return valorTotalMotorista + totalDespesas
  }, [valorTotalMotorista, totalDespesas])

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
      diariasExtrasCalculadas +
      totalDespesas +
      acrescimoUrgente +
      acrescimoEmergencial
    )
  }, [
    valorTotalClienteBase,
    totalOperacional,
    diariasExtrasCalculadas,
    totalDespesas,
    acrescimoUrgente,
    acrescimoEmergencial,
  ])

  const margemBruta = useMemo(() => {
    return valorCobradoCliente - subtotalCustos
  }, [valorCobradoCliente, subtotalCustos])

  function showMessage(texto: string, tipo: 'erro' | 'sucesso') {
    setMensagem(texto)
    setMensagemTipo(tipo)
    setTimeout(() => {
      mensagemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  function aoTrocarModalidade(modalidade: ModalidadeServico) {
    setModalidadeServico(modalidade)
    setUnidadeQuantidade(unidadePadraoPorModalidade(modalidade))

    if (modalidade === 'transfer') {
      setTipoServico('Transfer')
      setTipoOperacao('transfer')
    }
    if (modalidade === 'diaria') {
      setTipoServico('Di├íria de motorista')
      setTipoOperacao('diaria')
    }
    if (modalidade === 'semanal') {
      setTipoServico('Contrato semanal')
      setTipoOperacao('semanal')
    }
    if (modalidade === 'mensal') {
      setTipoServico('Contrato mensal')
      setTipoOperacao('mensal')
    }
    if (modalidade === 'pacote_personalizado') {
      setTipoServico('Pacote personalizado')
      setTipoOperacao('pacote_personalizado')
    }
  }

  function atualizarPrazo(dataBase: string, dias: number) {
    setDataEmissaoDocumento(dataBase)
    setDataVencimentoDocumento(addDaysToDate(dataBase, dias))
  }

  function adicionarDespesa() {
    setDespesas((prev) => [
      ...prev,
      {
        id: generateId('DESP'),
        tipo: 'combustivel',
        descricao: '',
        valor: 0,
      },
    ])
  }

  function atualizarDespesa(
    id: string,
    campo: 'tipo' | 'descricao' | 'valor',
    valor: string | TipoDespesa | number
  ) {
    setDespesas((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    )
  }

  function removerDespesa(id: string) {
    setDespesas((prev) => prev.filter((item) => item.id !== id))
  }

  function limparFormulario() {
    setStatus('enviada')
    setContratante('')
    setClienteFinal('')
    setEmpresaOperadora('')
    setTelefoneContratante('')
    setEmailContratante('')
    setOrigem('')
    setDestino('')
    setDataServico('')
    setHorarioServico('')
    setHorarioApresentacao('')
    setLocalApresentacao('')
    setObservacaoApresentacao('')
    setTipoServico('Transfer')
    setModalidadeServico('transfer')
    setTipoOperacao('transfer')
    setQuantidade(1)
    setUnidadeQuantidade('servi├ºo')
    setBaseMotorista('bh')
    setMotoristaNome('')
    setMotoristaId('')
    setMotoristaCidadeAtual('')
    setKmIda(0)
    setKmRetorno(0)
    setAplicarReembolsoIda(false)
    setAplicarReembolsoRetorno(false)
    setValorKmSemReembolso(2.9)
    setValorKmComReembolso(2.1)
    setHorasPrevistasEspera(0)
    setCobraDiariaExtraApos6h(true)
    setValorDiariaExtra(0)
    setQuantidadeDiariasExtras(0)
    setMotivoDiariaExtra('Espera superior a 6 horas para libera├º├úo do ve├¡culo.')
    setDespesas([])
    setValorUnitarioMotorista(0)
    setValorUnitarioCliente(0)
    setAcrescimoUrgentePercentual(15)
    setAcrescimoEmergencialPercentual(30)
    setPrioridadeAtendimento('normal')
    setFormaPagamento('a_combinar')
    setTipoPessoaCliente('juridica')
    setDocumentoCliente('')
    setInscricaoEstadualCliente('')
    setInscricaoMunicipalCliente('')
    setEnderecoCliente('')
    setCidadeCliente('')
    setEstadoCliente('')
    setCepCliente('')
    setEmailFinanceiroCliente('')
    setResponsavelFinanceiroCliente('')
    setTipoFaturamentoCliente('por_servico')
    setCompetenciaFaturamento('')
    setPeriodoReferencia('')
    setAgruparNoFechamentoMensal(false)
    setTipoDocumentoCobranca('nota_debito')
    setPrazoPagamentoDias(7)
    setDataEmissaoDocumento('')
    setDataVencimentoDocumento('')
    setEmitenteNome('')
    setEmitenteDocumento('')
    setEmitenteInscricao('')
    setEmitenteEndereco('')
    setEmitenteCidadeEstado('')
    setEmitenteTelefone('')
    setEmitenteEmail('')
    setEmitenteDadosPagamento('')
    setObservacoesFinanceiras('')
    setObservacoesInternas('')
    setObservacoesCliente('')
    setClienteAceitouTermos(false)
    setVisivelParaMotorista(false)
    setProntoParaVincularServico(false)
    setMensagem('')
    setMensagemTipo('sucesso')
    paramsAppliedRef.current = false
  }

  function salvarCotacao() {
    const documentoLimpo = digitsOnly(documentoCliente)
    const documentoEmitenteLimpo = digitsOnly(emitenteDocumento)

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
        `${getDocumentoLabel(tipoPessoaCliente)} do cliente inv├ílido. Preencha com n├║meros suficientes.`,
        'erro'
      )
      return
    }

    if (!dataServico) {
      showMessage('Informe a data do servi├ºo.', 'erro')
      return
    }

    if (!origem.trim() && modalidadeServico === 'transfer') {
      showMessage('Informe a origem da cota├º├úo.', 'erro')
      return
    }

    if (!destino.trim() && modalidadeServico === 'transfer') {
      showMessage('Informe o destino da cota├º├úo.', 'erro')
      return
    }

    if (tipoFaturamentoCliente === 'mensal' && !competenciaFaturamento.trim()) {
      showMessage('Informe a compet├¬ncia do faturamento mensal.', 'erro')
      return
    }

    const payload: CotacaoPayload = {
      id: generateId(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      status,
      clienteDecisaoFinalObrigatoria: true,
      contratante: contratante.trim(),
      clienteFinal: clienteFinal.trim(),
      empresaOperadora: empresaOperadora.trim(),
      telefoneContratante: telefoneContratante.trim(),
      emailContratante: emailContratante.trim(),
      origem: origem.trim(),
      destino: destino.trim(),
      dataServico,
      horarioServico,
      horarioApresentacao,
      localApresentacao: localApresentacao.trim(),
      observacaoApresentacao: observacaoApresentacao.trim(),
      tipoServico: tipoServico.trim(),
      modalidadeServico,
      tipoOperacao,
      quantidade: quantidadeFinal,
      unidadeQuantidade:
        unidadeQuantidade.trim() || unidadePadraoPorModalidade(modalidadeServico),
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
      horasPrevistasEspera,
      cobraDiariaExtraApos6h,
      valorDiariaExtra,
      quantidadeDiariasExtras: quantidadeDiariasExtrasFinal,
      motivoDiariaExtra: motivoDiariaExtra.trim(),
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
      inscricaoEstadualCliente: inscricaoEstadualCliente.trim(),
      inscricaoMunicipalCliente: inscricaoMunicipalCliente.trim(),
      enderecoCliente: enderecoCliente.trim(),
      cidadeCliente: cidadeCliente.trim(),
      estadoCliente: estadoCliente.trim(),
      cepCliente: cepCliente.trim(),
      emailFinanceiroCliente: emailFinanceiroCliente.trim(),
      responsavelFinanceiroCliente: responsavelFinanceiroCliente.trim(),
      tipoFaturamentoCliente,
      competenciaFaturamento: competenciaFaturamento.trim(),
      periodoReferencia: periodoReferencia.trim(),
      agruparNoFechamentoMensal,
      tipoDocumentoCobranca,
      prazoPagamentoDias,
      dataEmissaoDocumento,
      dataVencimentoDocumento,
      emitenteNome: emitenteNome.trim(),
      emitenteDocumento: documentoEmitenteLimpo || emitenteDocumento.trim(),
      emitenteInscricao: emitenteInscricao.trim(),
      emitenteEndereco: emitenteEndereco.trim(),
      emitenteCidadeEstado: emitenteCidadeEstado.trim(),
      emitenteTelefone: emitenteTelefone.trim(),
      emitenteEmail: emitenteEmail.trim(),
      emitenteDadosPagamento: emitenteDadosPagamento.trim(),
      observacoesFinanceiras: observacoesFinanceiras.trim(),
      observacoesInternas: observacoesInternas.trim(),
      observacoesCliente: observacoesCliente.trim(),
      clienteAceitouTermos,
      visivelParaMotorista,
      prontoParaVincularServico,
      resumoFinanceiro: {
        diariasExtras: diariasExtrasCalculadas,
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
        `Cota├º├úo ${payload.id} salva com sucesso. Opera├º├úo: ${tipoOperacaoLabel(
          payload.tipoOperacao
        )}. Despesas lan├ºadas: ${payload.despesas.length}.`,
        'sucesso'
      )
    } catch {
      showMessage('N├úo foi poss├¡vel salvar agora no navegador.', 'erro')
    }
  }

  const podeVincularServico =
    prontoParaVincularServico &&
    status === 'aceita' &&
    motoristaNome.trim().length > 0

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas ÔÇó Cota├º├úo isolada
              </span>

              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Nova cota├º├úo estrat├®gica
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  Camada nova criada sem mexer no fluxo em produ├º├úo. Agora a cota├º├úo
                  recebe os dados da entrada r├ípida e abre j├í no tipo certo, mantendo
                  padr├úo s├®rio e profissional.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                  Cliente j├í preenchido
                </span>
                <span className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
                  Tipo de cota├º├úo j├í definido
                </span>
                <span className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                  Sem quebrar o que j├í existe
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/plataforma/cotacoes"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver cota├º├Áes
              </Link>
              <Link
                href="/plataforma/cotacoes/novo"
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Voltar ├á entrada r├ípida
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sistema em constante atualiza├º├úo. Esta camada nova foi criada para agregar
            valor sem mexer na plataforma j├í em produ├º├úo.
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

        <section className="grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Dados principais da cota├º├úo</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field label="Status da cota├º├úo" helper="Toda cota├º├úo deve terminar em aceita ou recusada.">
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

                <Field label="Modalidade do servi├ºo">
                  <select
                    value={modalidadeServico}
                    onChange={(e) =>
                      aoTrocarModalidade(e.target.value as ModalidadeServico)
                    }
                    className="input"
                  >
                    <option value="transfer">Transfer</option>
                    <option value="diaria">Di├íria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="pacote_personalizado">Pacote personalizado</option>
                  </select>
                </Field>

                <Field label="Tipo operacional da cota├º├úo">
                  <select
                    value={tipoOperacao}
                    onChange={(e) => setTipoOperacao(e.target.value as TipoOperacao)}
                    className="input"
                  >
                    <option value="transfer">Transfer</option>
                    <option value="mobilizacao">Mobiliza├º├úo</option>
                    <option value="desmobilizacao">Desmobiliza├º├úo</option>
                    <option value="mobilizacao_desmobilizacao">
                      Mobiliza├º├úo + desmobiliza├º├úo
                    </option>
                    <option value="diaria">Di├íria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensal">Mensal</option>
                    <option value="pacote_personalizado">Pacote personalizado</option>
                  </select>
                </Field>

                <Field label="Tipo de servi├ºo">
                  <input
                    value={tipoServico}
                    onChange={(e) => setTipoServico(e.target.value)}
                    className="input"
                    placeholder="Ex.: mobiliza├º├úo sonda / desmobiliza├º├úo / di├íria motorista"
                  />
                </Field>

                <Field label="Contratante" helper="Obrigat├│rio.">
                  <input
                    value={contratante}
                    onChange={(e) => setContratante(e.target.value)}
                    className="input"
                    placeholder="Nome do contratante"
                  />
                </Field>

                <Field label="Cliente final">
                  <input
                    value={clienteFinal}
                    onChange={(e) => setClienteFinal(e.target.value)}
                    className="input"
                    placeholder="Nome do cliente final"
                  />
                </Field>

                <Field label="Empresa operadora">
                  <input
                    value={empresaOperadora}
                    onChange={(e) => setEmpresaOperadora(e.target.value)}
                    className="input"
                    placeholder="Empresa parceira ou operadora"
                  />
                </Field>

                <Field label="Telefone do contratante">
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

                <Field label="Forma de pagamento">
                  <select
                    value={formaPagamento}
                    onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                    className="input"
                  >
                    <option value="a_combinar">A combinar</option>
                    <option value="pix">PIX</option>
                    <option value="boleto">Boleto</option>
                    <option value="transferencia">Transfer├¬ncia</option>
                    <option value="cartao">Cart├úo</option>
                  </select>
                </Field>

                <Field label="Data do servi├ºo" helper="Obrigat├│rio.">
                  <input
                    type="date"
                    value={dataServico}
                    onChange={(e) => setDataServico(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Hor├írio do servi├ºo">
                  <input
                    type="time"
                    value={horarioServico}
                    onChange={(e) => setHorarioServico(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Hor├írio de apresenta├º├úo do motorista">
                  <input
                    type="time"
                    value={horarioApresentacao}
                    onChange={(e) => setHorarioApresentacao(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Local de apresenta├º├úo">
                  <input
                    value={localApresentacao}
                    onChange={(e) => setLocalApresentacao(e.target.value)}
                    className="input"
                    placeholder="Ex.: garagem, hotel, aeroporto, sede do cliente"
                  />
                </Field>

                <Field label="Origem" helper={modalidadeServico === 'transfer' ? 'Obrigat├│rio para transfer.' : undefined}>
                  <input
                    value={origem}
                    onChange={(e) => setOrigem(e.target.value)}
                    className="input"
                    placeholder="Origem"
                  />
                </Field>

                <Field label="Destino" helper={modalidadeServico === 'transfer' ? 'Obrigat├│rio para transfer.' : undefined}>
                  <input
                    value={destino}
                    onChange={(e) => setDestino(e.target.value)}
                    className="input"
                    placeholder="Destino"
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Observa├º├úo da apresenta├º├úo">
                  <textarea
                    value={observacaoApresentacao}
                    onChange={(e) => setObservacaoApresentacao(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Instru├º├Áes de apresenta├º├úo do motorista."
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Quantidade e pre├ºo por cliente</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Quantidade aprovada" helper="Pode ser 1, 10, 100 ou qualquer outra quantidade.">
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

                <Field label="Unidade da quantidade">
                  <input
                    value={unidadeQuantidade}
                    onChange={(e) => setUnidadeQuantidade(e.target.value)}
                    className="input"
                    placeholder="Ex.: di├íria, semana, m├¬s, unidade"
                  />
                </Field>

                <MoneyField
                  label="Valor unit├írio do cliente"
                  value={valorUnitarioCliente}
                  onChange={setValorUnitarioCliente}
                />

                <MoneyField
                  label="Valor unit├írio do motorista"
                  value={valorUnitarioMotorista}
                  onChange={setValorUnitarioMotorista}
                />

                <SummaryCard label="Total base do cliente" value={toMoney(valorTotalClienteBase)} />
                <SummaryCard label="Total base do motorista" value={toMoney(valorTotalMotorista)} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Opera├º├úo de ida e retorno</h2>
              <p className="mt-1 text-sm text-slate-500">
                Aqui voc├¬ controla mobiliza├º├úo, desmobiliza├º├úo, ida e retorno com km diferente
                e valor com ou sem reembolso.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                    <option value="nao">N├úo</option>
                    <option value="sim">Sim</option>
                  </select>
                </Field>

                <Field label="Aplicar reembolso no retorno?">
                  <select
                    value={aplicarReembolsoRetorno ? 'sim' : 'nao'}
                    onChange={(e) => setAplicarReembolsoRetorno(e.target.value === 'sim')}
                    className="input"
                  >
                    <option value="nao">N├úo</option>
                    <option value="sim">Sim</option>
                  </select>
                </Field>

                <SummaryCard label="Total operacional ida" value={toMoney(totalOperacionalIda)} />
                <SummaryCard label="Total operacional retorno" value={toMoney(totalOperacionalRetorno)} />
              </div>

              <div className="mt-4">
                <SummaryCard label="Total operacional consolidado" value={toMoney(totalOperacional)} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Espera e di├íria extra</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Horas previstas de espera">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={horasPrevistasEspera}
                    onChange={(e) => setHorasPrevistasEspera(toNumber(e.target.value))}
                    className="input"
                    placeholder="0"
                  />
                </Field>

                <Field label="Cobrar di├íria extra ap├│s 6h?">
                  <select
                    value={cobraDiariaExtraApos6h ? 'sim' : 'nao'}
                    onChange={(e) => setCobraDiariaExtraApos6h(e.target.value === 'sim')}
                    className="input"
                  >
                    <option value="sim">Sim</option>
                    <option value="nao">N├úo</option>
                  </select>
                </Field>

                <MoneyField
                  label="Valor da di├íria extra"
                  value={valorDiariaExtra}
                  onChange={setValorDiariaExtra}
                />

                <Field label="Quantidade de di├írias extras">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={quantidadeDiariasExtras}
                    onChange={(e) => setQuantidadeDiariasExtras(toNumber(e.target.value))}
                    className="input"
                    placeholder="0"
                  />
                </Field>

                <SummaryCard
                  label="Total das di├írias extras"
                  value={toMoney(diariasExtrasCalculadas)}
                />
              </div>

              <div className="mt-4">
                <Field label="Motivo da di├íria extra">
                  <textarea
                    value={motivoDiariaExtra}
                    onChange={(e) => setMotivoDiariaExtra(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Motivo da di├íria extra."
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Despesas lan├º├íveis</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lance v├írias despesas do mesmo tipo quantas vezes precisar para fechar motorista e cliente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={adicionarDespesa}
                  className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Adicionar despesa
                </button>
              </div>

              {despesas.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  Nenhuma despesa lan├ºada ainda.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {despesas.map((despesa, index) => (
                    <div
                      key={despesa.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 text-sm font-semibold text-slate-700">
                        Despesa {index + 1}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="Tipo">
                          <select
                            value={despesa.tipo}
                            onChange={(e) =>
                              atualizarDespesa(
                                despesa.id,
                                'tipo',
                                e.target.value as TipoDespesa
                              )
                            }
                            className="input"
                          >
                            <option value="combustivel">Combust├¡vel</option>
                            <option value="pedagio">Ped├ígio</option>
                            <option value="alimentacao">Alimenta├º├úo</option>
                            <option value="hospedagem">Hospedagem</option>
                            <option value="estacionamento">Estacionamento</option>
                            <option value="manutencao">Manuten├º├úo</option>
                            <option value="outros">Outros</option>
                          </select>
                        </Field>

                        <Field label="Descri├º├úo">
                          <input
                            value={despesa.descricao}
                            onChange={(e) =>
                              atualizarDespesa(despesa.id, 'descricao', e.target.value)
                            }
                            className="input"
                            placeholder="Ex.: abastecimento posto X"
                          />
                        </Field>

                        <Field label="Valor">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={despesa.valor}
                            onChange={(e) =>
                              atualizarDespesa(
                                despesa.id,
                                'valor',
                                toNumber(e.target.value)
                              )
                            }
                            className="input"
                            placeholder="0,00"
                          />
                        </Field>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removerDespesa(despesa.id)}
                            className="w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <SummaryCard label="Total das despesas lan├ºadas" value={toMoney(totalDespesas)} />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Dados fiscais e financeiros do cliente</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Tipo de pessoa do cliente">
                  <select
                    value={tipoPessoaCliente}
                    onChange={(e) => setTipoPessoaCliente(e.target.value as TipoPessoa)}
                    className="input"
                  >
                    <option value="juridica">Jur├¡dica</option>
                    <option value="fisica">F├¡sica</option>
                  </select>
                </Field>

                <Field
                  label={`${getDocumentoLabel(tipoPessoaCliente)} do cliente`}
                  helper="Obrigat├│rio. Pode ser com ou sem m├íscara."
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

                <Field label="Inscri├º├úo Estadual (se houver)">
                  <input
                    value={inscricaoEstadualCliente}
                    onChange={(e) => setInscricaoEstadualCliente(e.target.value)}
                    className="input"
                    placeholder="Opcional"
                  />
                </Field>

                <Field label="Inscri├º├úo Municipal (se houver)">
                  <input
                    value={inscricaoMunicipalCliente}
                    onChange={(e) => setInscricaoMunicipalCliente(e.target.value)}
                    className="input"
                    placeholder="Opcional"
                  />
                </Field>

                <Field label="Endere├ºo do cliente">
                  <input
                    value={enderecoCliente}
                    onChange={(e) => setEnderecoCliente(e.target.value)}
                    className="input"
                    placeholder="Rua, n├║mero, complemento, bairro"
                  />
                </Field>

                <Field label="Cidade do cliente">
                  <input
                    value={cidadeCliente}
                    onChange={(e) => setCidadeCliente(e.target.value)}
                    className="input"
                    placeholder="Cidade"
                  />
                </Field>

                <Field label="Estado do cliente">
                  <input
                    value={estadoCliente}
                    onChange={(e) => setEstadoCliente(e.target.value)}
                    className="input"
                    placeholder="UF"
                  />
                </Field>

                <Field label="CEP do cliente">
                  <input
                    value={cepCliente}
                    onChange={(e) => setCepCliente(e.target.value)}
                    className="input"
                    placeholder="00000-000"
                  />
                </Field>

                <Field label="E-mail financeiro do cliente">
                  <input
                    value={emailFinanceiroCliente}
                    onChange={(e) => setEmailFinanceiroCliente(e.target.value)}
                    className="input"
                    placeholder="financeiro@cliente.com"
                  />
                </Field>

                <Field label="Respons├ível financeiro">
                  <input
                    value={responsavelFinanceiroCliente}
                    onChange={(e) => setResponsavelFinanceiroCliente(e.target.value)}
                    className="input"
                    placeholder="Nome do respons├ível financeiro"
                  />
                </Field>

                <Field label="Tipo de faturamento do cliente">
                  <select
                    value={tipoFaturamentoCliente}
                    onChange={(e) =>
                      setTipoFaturamentoCliente(
                        e.target.value as TipoFaturamentoCliente
                      )
                    }
                    className="input"
                  >
                    <option value="por_servico">Por servi├ºo</option>
                    <option value="mensal">Mensal</option>
                  </select>
                </Field>

                <Field label="Compet├¬ncia do faturamento">
                  <input
                    value={competenciaFaturamento}
                    onChange={(e) => setCompetenciaFaturamento(e.target.value)}
                    className="input"
                    placeholder="Ex.: 04/2026"
                  />
                </Field>

                <Field label="Per├¡odo de refer├¬ncia">
                  <input
                    value={periodoReferencia}
                    onChange={(e) => setPeriodoReferencia(e.target.value)}
                    className="input"
                    placeholder="Ex.: 01/04/2026 a 30/04/2026"
                  />
                </Field>

                <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={agruparNoFechamentoMensal}
                    onChange={(e) => setAgruparNoFechamentoMensal(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Agrupar esta cobran├ºa no fechamento mensal
                  </span>
                </label>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Cobran├ºa futura e dados do emitente</h2>
              <p className="mt-1 text-sm text-slate-500">
                Estes campos ficam preservados para a etapa posterior de cobran├ºa, sem serem exigidos agora.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Tipo do documento de cobran├ºa futura">
                  <select
                    value={tipoDocumentoCobranca}
                    onChange={(e) =>
                      setTipoDocumentoCobranca(
                        e.target.value as TipoDocumentoCobranca
                      )
                    }
                    className="input"
                  >
                    <option value="nota_debito">Nota de d├®bito</option>
                    <option value="cobranca_interna">Cobran├ºa interna</option>
                    <option value="proposta_comercial">Proposta comercial</option>
                  </select>
                </Field>

                <Field label="Prazo de pagamento futuro (dias)">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={prazoPagamentoDias}
                    onChange={(e) => {
                      const dias = toNumber(e.target.value)
                      setPrazoPagamentoDias(dias)
                      if (dataEmissaoDocumento) {
                        setDataVencimentoDocumento(addDaysToDate(dataEmissaoDocumento, dias))
                      }
                    }}
                    className="input"
                    placeholder="7"
                  />
                </Field>

                <Field label="Data futura de emiss├úo">
                  <input
                    type="date"
                    value={dataEmissaoDocumento}
                    onChange={(e) => atualizarPrazo(e.target.value, prazoPagamentoDias)}
                    className="input"
                  />
                </Field>

                <Field label="Data futura de vencimento">
                  <input
                    type="date"
                    value={dataVencimentoDocumento}
                    onChange={(e) => setDataVencimentoDocumento(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Nome / raz├úo social do emitente">
                  <input
                    value={emitenteNome}
                    onChange={(e) => setEmitenteNome(e.target.value)}
                    className="input"
                    placeholder="Sua empresa / emitente"
                  />
                </Field>

                <Field label="Documento do emitente">
                  <input
                    value={emitenteDocumento}
                    onChange={(e) => setEmitenteDocumento(e.target.value)}
                    className="input"
                    placeholder="CNPJ / CPF"
                  />
                </Field>

                <Field label="Inscri├º├úo do emitente">
                  <input
                    value={emitenteInscricao}
                    onChange={(e) => setEmitenteInscricao(e.target.value)}
                    className="input"
                    placeholder="IE / IM / outro se houver"
                  />
                </Field>

                <Field label="Endere├ºo do emitente">
                  <input
                    value={emitenteEndereco}
                    onChange={(e) => setEmitenteEndereco(e.target.value)}
                    className="input"
                    placeholder="Rua, n├║mero, bairro, complemento"
                  />
                </Field>

                <Field label="Cidade / Estado do emitente">
                  <input
                    value={emitenteCidadeEstado}
                    onChange={(e) => setEmitenteCidadeEstado(e.target.value)}
                    className="input"
                    placeholder="Cidade - UF"
                  />
                </Field>

                <Field label="Telefone do emitente">
                  <input
                    value={emitenteTelefone}
                    onChange={(e) => setEmitenteTelefone(e.target.value)}
                    className="input"
                    placeholder="(00) 00000-0000"
                  />
                </Field>

                <Field label="E-mail do emitente">
                  <input
                    value={emitenteEmail}
                    onChange={(e) => setEmitenteEmail(e.target.value)}
                    className="input"
                    placeholder="financeiro@suaempresa.com"
                  />
                </Field>
              </div>

              <div className="mt-4 grid gap-4">
                <Field label="Dados de pagamento do emitente">
                  <textarea
                    value={emitenteDadosPagamento}
                    onChange={(e) => setEmitenteDadosPagamento(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="PIX, banco, ag├¬ncia, conta, instru├º├Áes de pagamento."
                  />
                </Field>

                <Field label="Observa├º├Áes financeiras da cobran├ºa futura">
                  <textarea
                    value={observacoesFinanceiras}
                    onChange={(e) => setObservacoesFinanceiras(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Condi├º├Áes de pagamento, juros, multa, observa├º├Áes."
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Controle estrat├®gico da decis├úo</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={clienteAceitouTermos}
                    onChange={(e) => setClienteAceitouTermos(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">
                    Confirmar que esta cota├º├úo entrou no fluxo formal e precisa retornar como
                    <strong> aceita </strong>ou<strong> recusada</strong>.
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
                    Marcar como vis├¡vel para motorista quando a opera├º├úo j├í puder avan├ºar.
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
                    Marcar como pronto para virar servi├ºo assim que o cliente aceitar.
                    O v├¡nculo obrigat├│rio com motorista s├│ ficar├í completo quando a cota├º├úo
                    estiver <strong>aceita</strong> e com <strong>motorista preenchido</strong>.
                  </span>
                </label>
              </div>

              <div className="mt-4 grid gap-4">
                <Field label="Observa├º├Áes para o cliente">
                  <textarea
                    value={observacoesCliente}
                    onChange={(e) => setObservacoesCliente(e.target.value)}
                    rows={3}
                    className="textarea"
                    placeholder="Texto comercial, condi├º├Áes, aviso de prazo, validade da proposta."
                  />
                </Field>

                <Field label="Observa├º├Áes internas">
                  <textarea
                    value={observacoesInternas}
                    onChange={(e) => setObservacoesInternas(e.target.value)}
                    rows={4}
                    className="textarea"
                    placeholder="Anota├º├Áes internas, multas, hist├│rico, estrat├®gia."
                  />
                </Field>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Resumo premium</h2>

              <div className="mt-5 space-y-3">
                <SummaryRow label="Opera├º├úo" value={tipoOperacaoLabel(tipoOperacao)} />
                <SummaryRow
                  label="Quantidade"
                  value={`${quantidadeFinal} ${unidadeQuantidade || 'unidade'}`}
                />
                <SummaryRow label="KM ida" value={`${kmIda} km`} />
                <SummaryRow label="KM retorno" value={`${kmRetorno} km`} />
                <SummaryRow label="Total ida" value={toMoney(totalOperacionalIda)} />
                <SummaryRow label="Total retorno" value={toMoney(totalOperacionalRetorno)} />
                <SummaryRow label="Total operacional" value={toMoney(totalOperacional)} />
                <SummaryRow label="Despesas lan├ºadas" value={toMoney(totalDespesas)} />
                <SummaryRow label="Di├írias extras" value={toMoney(diariasExtrasCalculadas)} />
                <SummaryRow label="Total base cliente" value={toMoney(valorTotalClienteBase)} />
                <SummaryRow label="Total base motorista" value={toMoney(valorTotalMotorista)} />
                <SummaryRow label="Subtotal custos" value={toMoney(subtotalCustos)} />
                <SummaryRow label="Acr├®scimo urgente" value={toMoney(acrescimoUrgente)} />
                <SummaryRow label="Acr├®scimo emergencial" value={toMoney(acrescimoEmergencial)} />
                <SummaryRow label="Total da cota├º├úo" value={toMoney(valorCobradoCliente)} strong />
                <SummaryRow label="Margem bruta" value={toMoney(margemBruta)} strong />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Leitura operacional</p>
                <p className="mt-2">
                  {podeVincularServico
                    ? 'Esta cota├º├úo j├í est├í pronta para virar servi├ºo com v├¡nculo obrigat├│rio ao motorista.'
                    : 'Para virar servi├ºo com seguran├ºa: status deve ser aceita, motorista preenchido e op├º├úo pronta para vincular marcada.'}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">A├º├Áes</h2>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={salvarCotacao}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Salvar cota├º├úo isolada
                </button>

                <button
                  type="button"
                  onClick={limparFormulario}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formul├írio
                </button>
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

export default function PlataformaCotacoesNovaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 text-slate-900">
          <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-10 md:px-6 lg:px-8">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas ÔÇó Cota├º├úo isolada
              </span>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Carregando cota├º├úo estrat├®gica
              </h1>

              <p className="mt-3 text-sm text-slate-600 md:text-base">
                Estamos preparando a p├ígina isolada da cota├º├úo sem interferir na plataforma principal.
              </p>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Sistema em constante atualiza├º├úo. Esta camada nova foi criada para agregar valor sem mexer na plataforma j├í em produ├º├úo.
              </div>
            </div>
          </div>
        </main>
      }
    >
      <PlataformaCotacoesNovaPageContent />
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

function SummaryCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
    </div>
  )
}

