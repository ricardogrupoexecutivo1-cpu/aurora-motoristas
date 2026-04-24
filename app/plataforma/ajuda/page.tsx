'use client'

import Link from 'next/link'

export default function PlataformaAjudaPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Central de ajuda
              </span>

              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Ajuda, tutorial e materiais oficiais
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
                  Esta página foi criada em camada isolada para concentrar os materiais de apoio
                  do sistema sem mexer no que já está no ar. Aqui o usuário encontra o tutorial
                  interno e os arquivos para baixar, ler, imprimir ou compartilhar.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                  Tutorial interno
                </span>
                <span className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700">
                  PDFs para baixar
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
                href="/plataforma/tutorial"
                className="rounded-2xl border border-slate-900 bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Abrir tutorial interno
              </Link>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Sistema em constante atualização. Esta central foi criada para orientar o usuário com
            clareza e reduzir dúvidas sem depender do chat para cada passo.
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Tutorial dentro da plataforma</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Página de consulta rápida para entender o fluxo do sistema, o caminho correto para
              abrir cotações e o uso da camada nova.
            </p>

            <div className="mt-5 grid gap-3">
              <Link
                href="/plataforma/tutorial"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Abrir tutorial interno
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">PDF completo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Versão em PDF para leitura detalhada, envio, armazenamento no computador e impressão.
            </p>

            <div className="mt-5 grid gap-3">
              <a
                href="/tutorial_aurora_motoristas_plataforma_COMPLETO.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Abrir PDF completo
              </a>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">PDF com imagens</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Versão ilustrada para facilitar o entendimento visual do fluxo e apoiar treinamento.
            </p>

            <div className="mt-5 grid gap-3">
              <a
                href="/tutorial_aurora_motoristas_com_imagens.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Abrir PDF com imagens
              </a>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Caminho recomendado para novos usuários</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StepCard
              numero="1"
              titulo="Entender a plataforma"
              texto="Começar pela leitura da lógica geral e da segregação de perfis."
              href="/plataforma"
              botao="Abrir /plataforma"
            />

            <StepCard
              numero="2"
              titulo="Ler o tutorial"
              texto="Consultar o passo a passo oficial antes de operar de verdade."
              href="/plataforma/tutorial"
              botao="Abrir tutorial"
            />

            <StepCard
              numero="3"
              titulo="Entrar pela cotação"
              texto="Usar a entrada rápida para escolher o tipo certo de cotação."
              href="/plataforma/cotacoes/novo"
              botao="Abrir entrada rápida"
            />

            <StepCard
              numero="4"
              titulo="Conferir no painel"
              texto="Depois de salvar, revisar tudo no painel isolado de cotações."
              href="/plataforma/cotacoes"
              botao="Abrir painel"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Materiais ideais para cada situação</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard
              titulo="Consulta rápida"
              texto="Use a página do tutorial interno para revisar o fluxo sem sair do sistema."
            />

            <InfoCard
              titulo="Treinamento da equipe"
              texto="Use o PDF completo e o PDF com imagens para leitura orientada e apoio em grupo."
            />

            <InfoCard
              titulo="Impressão ou cópia local"
              texto="Use os PDFs para guardar no computador, imprimir ou compartilhar no WhatsApp."
            />
          </div>
        </section>
      </div>
    </main>
  )
}

function StepCard({
  numero,
  titulo,
  texto,
  href,
  botao,
}: {
  numero: string
  titulo: string
  texto: string
  href: string
  botao: string
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
        {numero}
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900">{titulo}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{texto}</p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        {botao}
      </Link>
    </article>
  )
}

function InfoCard({
  titulo,
  texto,
}: {
  titulo: string
  texto: string
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <h3 className="text-base font-semibold text-slate-900">{titulo}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{texto}</p>
    </article>
  )
}

