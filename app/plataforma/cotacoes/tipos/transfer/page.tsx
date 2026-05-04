'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function toMoney(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function toNumber(value: string) {
  const v = value.replace(',', '.').replace(/[^\d.-]/g, '')
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function generateId() {
  return `COT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const STORAGE_KEY = 'aurora_motoristas_cotacoes_v1'

function PageContent() {
  const params = useSearchParams()
  const msgRef = useRef<HTMLDivElement | null>(null)

  const [cliente, setCliente] = useState('')
  const [documento, setDocumento] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [km, setKm] = useState(0)
  const [valorCliente, setValorCliente] = useState(0)
  const [valorMotorista, setValorMotorista] = useState(0)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    setCliente(params.get('nome') || '')
    setDocumento(params.get('documento') || '')
  }, [params])

  const total = useMemo(() => valorCliente, [valorCliente])
  const margem = useMemo(() => valorCliente - valorMotorista, [valorCliente, valorMotorista])

  function salvar() {
    if (!cliente) return alert('Informe o cliente')
    if (!data) return alert('Informe a data')
    if (!origem) return alert('Informe origem')
    if (!destino) return alert('Informe destino')

    const payload = {
      id: generateId(),
      tipo: 'transfer',
      cliente,
      documento: digitsOnly(documento),
      data,
      hora,
      origem,
      destino,
      km,
      valorCliente,
      valorMotorista,
      total,
      margem,
      criadoEm: new Date().toISOString(),
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    const lista = raw ? JSON.parse(raw) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([payload, ...lista]))

    setMensagem(`Cotação ${payload.id} salva com sucesso`)
    setTimeout(() => msgRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-white p-6 rounded-2xl border">
          <h1 className="text-2xl font-bold">Transfer (cotação enxuta)</h1>
          <p className="text-sm text-gray-600 mt-2">
            Fluxo rápido para origem â†’ destino com cálculo direto.
          </p>
        </div>

        {mensagem && (
          <div ref={msgRef} className="bg-green-50 border p-4 rounded">
            {mensagem}
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl border grid md:grid-cols-2 gap-4">

          <input value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Cliente" className="input"/>
          <input value={documento} onChange={e => setDocumento(e.target.value)} placeholder="Documento" className="input"/>

          <input type="date" value={data} onChange={e => setData(e.target.value)} className="input"/>
          <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="input"/>

          <input value={origem} onChange={e => setOrigem(e.target.value)} placeholder="Origem" className="input"/>
          <input value={destino} onChange={e => setDestino(e.target.value)} placeholder="Destino" className="input"/>

          <input type="number" value={km} onChange={e => setKm(toNumber(e.target.value))} placeholder="KM" className="input"/>

          <input type="number" value={valorCliente} onChange={e => setValorCliente(toNumber(e.target.value))} placeholder="Valor cliente" className="input"/>
          <input type="number" value={valorMotorista} onChange={e => setValorMotorista(toNumber(e.target.value))} placeholder="Valor motorista" className="input"/>

        </div>

        <div className="bg-white p-6 rounded-2xl border space-y-2">
          <div>Total: {toMoney(total)}</div>
          <div>Margem: {toMoney(margem)}</div>
        </div>

        <div className="flex gap-3">
          <button onClick={salvar} className="bg-black text-white px-4 py-2 rounded">
            Salvar
          </button>

          <Link href="/plataforma/cotacoes/novo" className="border px-4 py-2 rounded">
            Voltar
          </Link>
        </div>

      </div>

      <style jsx global>{`
        .input {
          height: 44px;
          border: 1px solid #ccc;
          padding: 0 12px;
          border-radius: 10px;
        }
      `}</style>
    </main>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PageContent />
    </Suspense>
  )
}

