'use client'

import Link from 'next/link'

export default function TutorialPlataformaPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white border rounded-2xl p-6">
          <h1 className="text-2xl font-bold">
            ðŸ“˜ Como usar a plataforma Aurora Motoristas
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Guia completo para operar sem erro e sem depender de suporte.
          </p>
        </div>

        {/* FLUXO */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Fluxo principal</h2>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>1. Identificar cliente</li>
            <li>2. Escolher tipo de cotaÃ§Ã£o</li>
            <li>3. Preencher dados principais</li>
            <li>4. Salvar</li>
            <li>5. Conferir no painel</li>
          </ul>
        </div>

        {/* ENTRADA RAPIDA */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Entrada rÃ¡pida</h2>

          <p className="text-sm">
            Sempre comeÃ§ar por aqui:
          </p>

          <Link
            href="/plataforma/cotacoes/novo"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Ir para entrada rÃ¡pida
          </Link>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Digite o CNPJ ou CPF</li>
            <li>Informe o nome</li>
            <li>Clique no tipo correto</li>
          </ul>
        </div>

        {/* TIPOS */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Tipos de cotaÃ§Ã£o</h2>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Transfer â†’ rota simples</li>
            <li>MobilizaÃ§Ã£o â†’ ida</li>
            <li>DesmobilizaÃ§Ã£o â†’ retorno</li>
            <li>MobilizaÃ§Ã£o + desmobilizaÃ§Ã£o â†’ ida + volta</li>
            <li>DiÃ¡ria / Semanal / Mensal</li>
          </ul>
        </div>

        {/* PAGINAS ENXUTAS */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">PÃ¡ginas rÃ¡pidas (recomendado)</h2>

          <div className="flex flex-wrap gap-3">

            <Link href="/plataforma/cotacoes/tipos/transfer" className="border px-4 py-2 rounded">
              Transfer
            </Link>

            <Link href="/plataforma/cotacoes/tipos/mobilizacao-desmobilizacao" className="border px-4 py-2 rounded">
              MobilizaÃ§Ã£o + DesmobilizaÃ§Ã£o
            </Link>

          </div>

          <p className="text-sm text-gray-600">
            Use essas pÃ¡ginas para ganhar velocidade e evitar erro.
          </p>
        </div>

        {/* PAINEL */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Painel de cotaÃ§Ãµes</h2>

          <Link
            href="/plataforma/cotacoes"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Ver painel
          </Link>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Ver todas as cotaÃ§Ãµes</li>
            <li>Controlar status</li>
            <li>Identificar pendentes</li>
            <li>Preparar para serviÃ§o</li>
          </ul>
        </div>

        {/* CHECKLIST */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Checklist antes de salvar</h2>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Cliente correto</li>
            <li>Documento correto</li>
            <li>Origem e destino corretos</li>
            <li>Valores conferidos</li>
            <li>Margem vÃ¡lida</li>
          </ul>
        </div>

        {/* ALERTAS */}
        <div className="bg-yellow-50 border rounded-2xl p-6 text-sm">
          âš  Sistema em constante atualizaÃ§Ã£o. Use sempre as pÃ¡ginas corretas para evitar erro.
        </div>

        {/* VOLTAR */}
        <div className="flex gap-3">
          <Link href="/plataforma" className="border px-4 py-2 rounded">
            Voltar Ã  plataforma
          </Link>
        </div>

      </div>
    </main>
  )
}
