'use client'

import { useMemo, useState } from 'react'

type Perfil = 'admin' | 'empresa' | 'motorista'

type AdiantamentoItem = {
  id: string
  data: string
  descricao: string
  valor: number
}

type DespesaItem = {
  id: string
  data: string
  tipo:
    | 'combustivel'
    | 'pedagio'
    | 'alimentacao'
    | 'hospedagem'
    | 'estacionamento'
    | 'manutencao'
    | 'outros'
  descricao: string
  valor: number
}

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

function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function formatarData(data: string) {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  if (!ano || !mes || !dia) return data
  return `${dia}/${mes}/${ano}`
}

function getPerfilClasses(perfil: Perfil) {
  switch (perfil) {
    case 'admin':
      return 'border-cyan-200 bg-cyan-50 text-cyan-800'
    case 'empresa':
      return 'border-indigo-200 bg-indigo-50 text-indigo-800'
    case 'motorista':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
}

function getTipoDespesaLabel(tipo: DespesaItem['tipo']) {
  switch (tipo) {
    case 'combustivel':
      return 'CombustÃ­vel'
    case 'pedagio':
      return 'PedÃ¡gio'
    case 'alimentacao':
      return 'AlimentaÃ§Ã£o'
    case 'hospedagem':
      return 'Hospedagem'
    case 'estacionamento':
      return 'Estacionamento'
    case 'manutencao':
      return 'ManutenÃ§Ã£o'
    default:
      return 'Outros'
  }
}

export default function PlataformaLancamentosMotoristaPage() {
  const [perfil, setPerfil] = useState<Perfil>('admin')

  const [servicoId, setServicoId] = useState('SRV-001')
  const [cliente, setCliente] = useState('Vale')
  const [empresaNome, setEmpresaNome] = useState('Aurora OperaÃ§Ãµes BH')
  const [motoristaNome, setMotoristaNome] = useState('Ricardo Moreira')
  const [dataServico, setDataServico] = useState('2026-04-19')
  const [rota, setRota] = useState('Belo Horizonte â†’ Confins')

  const [valorBrutoMotorista, setValorBrutoMotorista] = useState(500)

  const [adiantamentos, setAdiantamentos] = useState<AdiantamentoItem[]>([])
  const [despesas, setDespesas] = useState<DespesaItem[]>([])

  const [mensagem, setMensagem] = useState('')
  const [mensagemTipo, setMensagemTipo] = useState<'sucesso' | 'erro'>('sucesso')

  function showMessage(texto: string, tipo: 'sucesso' | 'erro') {
    setMensagem(texto)
    setMensagemTipo(tipo)
  }

  function adicionarAdiantamento() {
    setAdiantamentos((prev) => [
      ...prev,
      {
        id: generateId('ADI'),
        data: '',
        descricao: '',
        valor: 0,
      },
    ])
  }

  function atualizarAdiantamento(
    id: string,
    campo: 'data' | 'descricao' | 'valor',
    valor: string | number
  ) {
    setAdiantamentos((prev) =>
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

  function removerAdiantamento(id: string) {
    setAdiantamentos((prev) => prev.filter((item) => item.id !== id))
  }

  function adicionarDespesa() {
    setDespesas((prev) => [
      ...prev,
      {
        id: generateId('DESP'),
        data: '',
        tipo: 'combustivel',
        descricao: '',
        valor: 0,
      },
    ])
  }

  function atualizarDespesa(
    id: string,
    campo: 'data' | 'tipo' | 'descricao' | 'valor',
    valor: string | number
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

  const totalAdiantamentos = useMemo(() => {
    return adiantamentos.reduce((acc, item) => acc + item.valor, 0)
  }, [adiantamentos])

  const totalDespesas = useMemo(() => {
    return despesas.reduce((acc, item) => acc + item.valor, 0)
  }, [despesas])

  const saldoMotorista = useMemo(() => {
    return valorBrutoMotorista - totalAdiantamentos - totalDespesas
  }, [valorBrutoMotorista, totalAdiantamentos, totalDespesas])

  function limparTudo() {
    setServicoId('SRV-001')
    setCliente('Vale')
    setEmpresaNome('Aurora OperaÃ§Ãµes BH')
    setMotoristaNome('Ricardo Moreira')
    setDataServico('2026-04-19')
    setRota('Belo Horizonte â†’ Confins')
    setValorBrutoMotorista(500)
    setAdiantamentos([])
    setDespesas([])
    setMensagem('')
    setMensagemTipo('sucesso')
  }

  function salvarLeituraLocal() {
    try {
      const payload = {
        servicoId,
        cliente,
        empresaNome,
        motoristaNome,
        dataServico,
        rota,
        valorBrutoMotorista,
        adiantamentos,
        despesas,
        totalAdiantamentos,
        totalDespesas,
        saldoMotorista,
        salvoEm: new Date().toISOString(),
      }

      localStorage.setItem(
        `aurora_motoristas_lancamentos_${servicoId}`,
        JSON.stringify(payload)
      )

      showMessage(
        'LanÃ§amentos salvos localmente com sucesso. Os totais jÃ¡ ficaram consolidados sem soma manual.',
        'sucesso'
      )
    } catch {
      showMessage('NÃ£o foi possÃ­vel salvar agora no navegador.', 'erro')
    }
  }

  const descricaoPerfil =
    perfil === 'admin'
      ? 'VisÃ£o total para conferÃªncia e fechamento administrativo.'
      : perfil === 'empresa'
      ? 'Leitura empresarial restrita aos prÃ³prios registros.'
      : 'Leitura do motorista restrita ao que pertence a ele.'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-cyan-50 via-white to-slate-50 p-6 md:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Aurora Motoristas â€¢ LanÃ§amentos isolados
                </span>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
                    Adiantamentos e despesas do motorista
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                    Camada nova criada para lanÃ§ar vÃ¡rios adiantamentos e vÃ¡rias despesas
                    de uma viagem sem depender de soma manual depois. Tudo fica separado,
                    organizado e consolidado automaticamente.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-medium text-cyan-800">
                    Admin vÃª tudo
                  </span>
                  <span className="rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-800">
                    Empresa vÃª sÃ³ o dela
                  </span>
                  <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-medium text-emerald-800">
                    Motorista vÃª sÃ³ o dele
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Perfil de visualizaÃ§Ã£o
                </label>

                <select
                  value={perfil}
                  onChange={(e) => setPerfil(e.target.value as Perfil)}
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-cyan-500"
                >
                  <option value="admin">Admin</option>
                  <option value="empresa">Empresa</option>
                  <option value="motorista">Motorista</option>
                </select>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${getPerfilClasses(
                      perfil
                    )}`}
                  >
                    {perfil}
                  </span>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {descricaoPerfil}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Sistema em constante atualizaÃ§Ã£o e podem ocorrer instabilidades momentÃ¢neas
              durante melhorias.
            </div>
          </div>
        </section>

        {mensagem ? (
          <section
            className={`rounded-3xl border px-5 py-4 shadow-sm ${
              mensagemTipo === 'erro'
                ? 'border-rose-200 bg-rose-50 text-rose-800'
                : 'border-cyan-200 bg-cyan-50 text-cyan-800'
            }`}
          >
            <p className="text-sm font-semibold">{mensagem}</p>
          </section>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Dados do atendimento</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="ServiÃ§o">
                  <input
                    value={servicoId}
                    onChange={(e) => setServicoId(e.target.value)}
                    className="input"
                    placeholder="SRV-001"
                  />
                </Field>

                <Field label="Cliente">
                  <input
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    className="input"
                    placeholder="Nome do cliente"
                  />
                </Field>

                <Field label="Empresa">
                  <input
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    className="input"
                    placeholder="Empresa responsÃ¡vel"
                  />
                </Field>

                <Field label="Motorista">
                  <input
                    value={motoristaNome}
                    onChange={(e) => setMotoristaNome(e.target.value)}
                    className="input"
                    placeholder="Nome do motorista"
                  />
                </Field>

                <Field label="Data do serviÃ§o">
                  <input
                    type="date"
                    value={dataServico}
                    onChange={(e) => setDataServico(e.target.value)}
                    className="input"
                  />
                </Field>

                <Field label="Rota">
                  <input
                    value={rota}
                    onChange={(e) => setRota(e.target.value)}
                    className="input"
                    placeholder="Origem â†’ Destino"
                  />
                </Field>

                <MoneyField
                  label="Valor bruto do motorista"
                  value={valorBrutoMotorista}
                  onChange={setValorBrutoMotorista}
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Adiantamentos do motorista</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lance quantos adiantamentos forem necessÃ¡rios, um por vez.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={adicionarAdiantamento}
                  className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Adicionar adiantamento
                </button>
              </div>

              {adiantamentos.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-600">
                  Nenhum adiantamento lanÃ§ado ainda.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {adiantamentos.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 text-sm font-semibold text-slate-700">
                        Adiantamento {index + 1}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <Field label="Data">
                          <input
                            type="date"
                            value={item.data}
                            onChange={(e) =>
                              atualizarAdiantamento(item.id, 'data', e.target.value)
                            }
                            className="input"
                          />
                        </Field>

                        <Field label="DescriÃ§Ã£o">
                          <input
                            value={item.descricao}
                            onChange={(e) =>
                              atualizarAdiantamento(item.id, 'descricao', e.target.value)
                            }
                            className="input"
                            placeholder="Ex.: adiantamento viagem"
                          />
                        </Field>

                        <Field label="Valor">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.valor}
                            onChange={(e) =>
                              atualizarAdiantamento(
                                item.id,
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
                            onClick={() => removerAdiantamento(item.id)}
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
                <SummaryCard
                  label="Total de adiantamentos"
                  value={toMoney(totalAdiantamentos)}
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Despesas da viagem</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lance combustÃ­vel, pedÃ¡gio, alimentaÃ§Ã£o, hospedagem e demais gastos.
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
                  Nenhuma despesa lanÃ§ada ainda.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {despesas.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-3 text-sm font-semibold text-slate-700">
                        Despesa {index + 1}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                        <Field label="Data">
                          <input
                            type="date"
                            value={item.data}
                            onChange={(e) =>
                              atualizarDespesa(item.id, 'data', e.target.value)
                            }
                            className="input"
                          />
                        </Field>

                        <Field label="Tipo">
                          <select
                            value={item.tipo}
                            onChange={(e) =>
                              atualizarDespesa(item.id, 'tipo', e.target.value)
                            }
                            className="input"
                          >
                            <option value="combustivel">CombustÃ­vel</option>
                            <option value="pedagio">PedÃ¡gio</option>
                            <option value="alimentacao">AlimentaÃ§Ã£o</option>
                            <option value="hospedagem">Hospedagem</option>
                            <option value="estacionamento">Estacionamento</option>
                            <option value="manutencao">ManutenÃ§Ã£o</option>
                            <option value="outros">Outros</option>
                          </select>
                        </Field>

                        <Field label="DescriÃ§Ã£o">
                          <input
                            value={item.descricao}
                            onChange={(e) =>
                              atualizarDespesa(item.id, 'descricao', e.target.value)
                            }
                            className="input"
                            placeholder="Ex.: abastecimento"
                          />
                        </Field>

                        <Field label="Valor">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.valor}
                            onChange={(e) =>
                              atualizarDespesa(item.id, 'valor', toNumber(e.target.value))
                            }
                            className="input"
                            placeholder="0,00"
                          />
                        </Field>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removerDespesa(item.id)}
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
                <SummaryCard label="Total de despesas" value={toMoney(totalDespesas)} />
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Resumo do fechamento</h2>

              <div className="mt-5 space-y-3">
                <SummaryRow label="ServiÃ§o" value={servicoId} />
                <SummaryRow label="Cliente" value={cliente} />
                <SummaryRow label="Empresa" value={empresaNome} />
                <SummaryRow label="Motorista" value={motoristaNome} />
                <SummaryRow label="Data" value={formatarData(dataServico)} />
                <SummaryRow label="Rota" value={rota} />
                <SummaryRow label="Valor bruto" value={toMoney(valorBrutoMotorista)} />
                <SummaryRow
                  label="Adiantamentos"
                  value={toMoney(totalAdiantamentos)}
                />
                <SummaryRow label="Despesas" value={toMoney(totalDespesas)} />
                <SummaryRow
                  label="Saldo final do motorista"
                  value={toMoney(saldoMotorista)}
                  strong
                />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Leitura segura</p>
                <p className="mt-2">
                  O saldo final jÃ¡ considera automaticamente o valor bruto do motorista
                  menos todos os adiantamentos menos todas as despesas lanÃ§adas.
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">AÃ§Ãµes</h2>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={salvarLeituraLocal}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Salvar lanÃ§amentos
                </button>

                <button
                  type="button"
                  onClick={limparTudo}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formulÃ¡rio
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Regras desta camada</h2>

              <div className="mt-5 grid gap-4">
                <RegraCard
                  titulo="Adiantamentos"
                  texto="Pode lanÃ§ar quantos forem necessÃ¡rios, um por vez, sem soma manual depois."
                  classes="border-cyan-200 bg-cyan-50 text-cyan-900"
                />
                <RegraCard
                  titulo="Despesas"
                  texto="Pode lanÃ§ar vÃ¡rias despesas de tipos diferentes na mesma viagem."
                  classes="border-indigo-200 bg-indigo-50 text-indigo-900"
                />
                <RegraCard
                  titulo="Fechamento"
                  texto="O saldo do motorista Ã© calculado automaticamente para reduzir erro operacional."
                  classes="border-emerald-200 bg-emerald-50 text-emerald-900"
                />
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
      `}</style>
    </main>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={strong ? 'text-sm font-bold text-slate-900' : 'text-sm font-semibold text-slate-900'}>
        {value}
      </span>
    </div>
  )
}

function RegraCard({
  titulo,
  texto,
  classes,
}: {
  titulo: string
  texto: string
  classes: string
}) {
  return (
    <div className={`rounded-[24px] border p-5 ${classes}`}>
      <h3 className="text-lg font-bold">{titulo}</h3>
      <p className="mt-2 text-sm leading-6">{texto}</p>
    </div>
  )
}
