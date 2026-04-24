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
            <li>2. Escolher tipo de cotação</li>
            <li>3. Preencher dados principais</li>
            <li>4. Salvar</li>
            <li>5. Conferir no painel</li>
          </ul>
        </div>

        {/* ENTRADA RAPIDA */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Entrada rápida</h2>

          <p className="text-sm">
            Sempre começar por aqui:
          </p>

          <Link
            href="/plataforma/cotacoes/novo"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Ir para entrada rápida
          </Link>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Digite o CNPJ ou CPF</li>
            <li>Informe o nome</li>
            <li>Clique no tipo correto</li>
          </ul>
        </div>

        {/* TIPOS */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Tipos de cotação</h2>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Transfer â†’ rota simples</li>
            <li>Mobilização â†’ ida</li>
            <li>Desmobilização â†’ retorno</li>
            <li>Mobilização + desmobilização â†’ ida + volta</li>
            <li>Diária / Semanal / Mensal</li>
          </ul>
        </div>

        {/* PAGINAS ENXUTAS */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Páginas rápidas (recomendado)</h2>

          <div className="flex flex-wrap gap-3">

            <Link href="/plataforma/cotacoes/tipos/transfer" className="border px-4 py-2 rounded">
              Transfer
            </Link>

            <Link href="/plataforma/cotacoes/tipos/mobilizacao-desmobilizacao" className="border px-4 py-2 rounded">
              Mobilização + Desmobilização
            </Link>

          </div>

          <p className="text-sm text-gray-600">
            Use essas páginas para ganhar velocidade e evitar erro.
          </p>
        </div>

        {/* PAINEL */}
        <div className="bg-white border rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold text-lg">Painel de cotações</h2>

          <Link
            href="/plataforma/cotacoes"
            className="inline-block bg-black text-white px-4 py-2 rounded"
          >
            Ver painel
          </Link>

          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Ver todas as cotações</li>
            <li>Controlar status</li>
            <li>Identificar pendentes</li>
            <li>Preparar para serviço</li>
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
            <li>Margem válida</li>
          </ul>
        </div>

        {/* ALERTAS */}
        <div className="bg-yellow-50 border rounded-2xl p-6 text-sm">
          âš  Sistema em constante atualização. Use sempre as páginas corretas para evitar erro.
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

