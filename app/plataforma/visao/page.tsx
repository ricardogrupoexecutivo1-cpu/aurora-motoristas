'use client'

import { useEffect, useMemo, useState } from 'react'

type Perfil = 'admin' | 'empresa' | 'motorista'

type ServicoStatus =
  | 'pendente'
  | 'em_andamento'
  | 'aguardando_pagamento'
  | 'pago'

type Servico = {
  id: string
  cliente: string
  empresa_id: string
  empresa_nome: string
  motorista_id: string
  motorista_nome: string
  status: ServicoStatus
  valor: number
  origem: string
  destino: string
  data: string
}

function toMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(data: string) {
  if (!data) return '-'
  const [ano, mes, dia] = data.split('-')
  if (!ano || !mes || !dia) return data
  return `${dia}/${mes}/${ano}`
}

function labelStatus(status: ServicoStatus) {
  switch (status) {
    case 'pendente':
      return 'Pendente'
    case 'em_andamento':
      return 'Em andamento'
    case 'aguardando_pagamento':
      return 'Aguardando pagamento'
    case 'pago':
      return 'Pago'
    default:
      return status
  }
}

function getStatusClasses(status: ServicoStatus) {
  switch (status) {
    case 'pendente':
      return 'border-amber-200 bg-amber-50 text-amber-800'
    case 'em_andamento':
      return 'border-sky-200 bg-sky-50 text-sky-800'
    case 'aguardando_pagamento':
      return 'border-violet-200 bg-violet-50 text-violet-800'
    case 'pago':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-700'
  }
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

function getPerfilTitulo(perfil: Perfil) {
  switch (perfil) {
    case 'admin':
      return 'Admin'
    case 'empresa':
      return 'Empresa'
    case 'motorista':
      return 'Motorista'
    default:
      return perfil
  }
}

export default function PlataformaVisaoBlindadaPage() {
  const [perfil, setPerfil] = useState<Perfil>('admin')
  const [usuarioId] = useState('user-1')
  const [empresaId] = useState('empresa-1')
  const [dados, setDados] = useState<Servico[]>([])

  useEffect(() => {
    const base: Servico[] = [
      {
        id: 'SRV-001',
        cliente: 'Vale',
        empresa_id: 'empresa-1',
        empresa_nome: 'Aurora Operações BH',
        motorista_id: 'user-1',
        motorista_nome: 'Ricardo Moreira',
        status: 'pendente',
        valor: 500,
        origem: 'Belo Horizonte',
        destino: 'Confins',
        data: '2026-04-19',
      },
      {
        id: 'SRV-002',
        cliente: 'Petrobras',
        empresa_id: 'empresa-2',
        empresa_nome: 'Aurora Norte Operações',
        motorista_id: 'user-2',
        motorista_nome: 'Carlos Silva',
        status: 'pago',
        valor: 900,
        origem: 'Parauapebas',
        destino: 'Carajás',
        data: '2026-04-18',
      },
      {
        id: 'SRV-003',
        cliente: 'Samarco',
        empresa_id: 'empresa-1',
        empresa_nome: 'Aurora Operações BH',
        motorista_id: 'user-3',
        motorista_nome: 'Neida Moreira',
        status: 'aguardando_pagamento',
        valor: 780,
        origem: 'Belo Horizonte',
        destino: 'Mariana',
        data: '2026-04-20',
      },
      {
        id: 'SRV-004',
        cliente: 'Usiminas',
        empresa_id: 'empresa-1',
        empresa_nome: 'Aurora Operações BH',
        motorista_id: 'user-1',
        motorista_nome: 'Ricardo Moreira',
        status: 'em_andamento',
        valor: 650,
        origem: 'Ipatinga',
        destino: 'Belo Horizonte',
        data: '2026-04-21',
      },
    ]

    setDados(base)
  }, [])

  const filtrado = useMemo(() => {
    if (perfil === 'admin') return dados

    if (perfil === 'empresa') {
      return dados.filter((item) => item.empresa_id === empresaId)
    }

    return dados.filter(
      (item) => item.motorista_id === usuarioId && item.status !== 'pago'
    )
  }, [dados, perfil, empresaId, usuarioId])

  const resumo = useMemo(() => {
    return {
      total: filtrado.length,
      pendentes: filtrado.filter((item) => item.status === 'pendente').length,
      andamento: filtrado.filter((item) => item.status === 'em_andamento').length,
      aguardandoPagamento: filtrado.filter(
        (item) => item.status === 'aguardando_pagamento'
      ).length,
      pagos: filtrado.filter((item) => item.status === 'pago').length,
      valorTotal: filtrado.reduce((acc, item) => acc + item.valor, 0),
    }
  }, [filtrado])

  const descricaoPerfil =
    perfil === 'admin'
      ? 'Visão administrativa total da base, com leitura completa dos registros da plataforma.'
      : perfil === 'empresa'
      ? 'A empresa visualiza apenas os registros vinculados ao próprio company_id, sem enxergar bases externas.'
      : 'O motorista visualiza apenas o que é dele e deixa de ver os registros após o pagamento final.'

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-cyan-50 via-white to-slate-50 p-6 md:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700">
                  Aurora Motoristas • Camada isolada
                </span>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-4xl">
                    Visão blindada da plataforma
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                    Página nova criada para validar a regra de acesso sem mexer no restante
                    da operação. Aqui a leitura fica separada por perfil, com blindagem
                    clara entre administração, empresa e motorista.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="rounded-2xl border border-cyan-200 bg-cyan-50 px-3 py-2 font-medium text-cyan-800">
                    Admin vê tudo
                  </span>
                  <span className="rounded-2xl border border-indigo-200 bg-indigo-50 px-3 py-2 font-medium text-indigo-800">
                    Empresa vê só o dela
                  </span>
                  <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 font-medium text-emerald-800">
                    Motorista vê só o dele
                  </span>
                </div>
              </div>

              <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Perfil de visualização
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
                    {getPerfilTitulo(perfil)}
                  </span>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {descricaoPerfil}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Sistema em constante atualização e podem ocorrer instabilidades momentâneas
              durante melhorias.
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <ResumoCard label="Registros visíveis" value={String(resumo.total)} />
          <ResumoCard label="Pendentes" value={String(resumo.pendentes)} />
          <ResumoCard label="Em andamento" value={String(resumo.andamento)} />
          <ResumoCard
            label="Aguardando pagamento"
            value={String(resumo.aguardandoPagamento)}
          />
          <ResumoCard label="Pagos" value={String(resumo.pagos)} />
          <ResumoCard label="Valor total" value={toMoney(resumo.valorTotal)} />
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Leitura protegida por perfil</h2>
              <p className="mt-1 text-sm text-slate-500">
                Esta lista simula a regra final da plataforma com separação rígida de
                acesso.
              </p>
            </div>

            <div
              className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${getPerfilClasses(
                perfil
              )}`}
            >
              Perfil ativo: {getPerfilTitulo(perfil)}
            </div>
          </div>

          {filtrado.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
              Nenhum registro visível para este perfil no cenário atual.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {filtrado.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[26px] border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-white"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Serviço {item.id.replace('SRV-', '#')}
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        {item.cliente}
                      </h3>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        item.status
                      )}`}
                    >
                      {labelStatus(item.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <InfoItem label="Origem" value={item.origem} />
                    <InfoItem label="Destino" value={item.destino} />
                    <InfoItem label="Data" value={formatarData(item.data)} />
                    <InfoItem label="Valor" value={toMoney(item.valor)} />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <MiniTag label="Empresa" value={item.empresa_nome} />
                    <MiniTag label="Motorista" value={item.motorista_nome} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Regras aplicadas nesta camada</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <RegraCard
              titulo="Admin"
              texto="Visão total da base para conferência, correção e gestão ampla."
              classes="border-cyan-200 bg-cyan-50 text-cyan-900"
            />
            <RegraCard
              titulo="Empresa"
              texto="A empresa enxerga apenas registros com o company_id vinculado a ela."
              classes="border-indigo-200 bg-indigo-50 text-indigo-900"
            />
            <RegraCard
              titulo="Motorista"
              texto="O motorista enxerga apenas o que é dele e deixa de ver após pagamento."
              classes="border-emerald-200 bg-emerald-50 text-emerald-900"
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function ResumoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  )
}

function MiniTag({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
      <span className="font-semibold text-slate-700">{label}: </span>
      <span className="text-slate-600">{value}</span>
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