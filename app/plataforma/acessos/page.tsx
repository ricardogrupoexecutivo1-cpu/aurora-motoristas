const modulos = [
  {
    titulo: "Operadoras",
    rota: "/plataforma/operadoras",
    descricao:
      "Regras de acesso para operadoras internas e externas, com separação entre cliente, operadora parceira e operação principal.",
    destaque: "Governança comercial",
    bullets: [
      "Operadora externa só entra com autorização formal",
      "Plano ativo obrigatório para uso operacional",
      "Cada empresa enxerga apenas a própria estrutura",
    ],
  },
  {
    titulo: "Blindagem de motoristas",
    rota: "/plataforma/motoristas",
    descricao:
      "Camada institucional para proteger a base interna de motoristas e impedir exposição, listagem ou aproveitamento por terceiros.",
    destaque: "Ativo estratégico protegido",
    bullets: [
      "Motorista vê apenas o que é dele",
      "Operadora externa nunca vê base interna",
      "Histórico interno permanece protegido",
    ],
  },
  {
    titulo: "Painel por perfil",
    rota: "/plataforma/motoristas/painel",
    descricao:
      "Leitura visual por papel para validar o comportamento isolado de motorista, operadora externa e administração master.",
    destaque: "Simulação controlada",
    bullets: [
      "Motorista interno",
      "Operadora externa",
      "Admin master",
    ],
  },
];

const simulacoes = [
  {
    titulo: "Simular Motorista Interno",
    rota: "/plataforma/motoristas/painel?perfil=motorista&empresa=Base%20Interna",
    descricao:
      "Valida a leitura individual e restrita, sem visão da base completa.",
  },
  {
    titulo: "Simular Operadora Externa",
    rota: "/plataforma/motoristas/painel?perfil=operadora&empresa=Operadora%20Parceira",
    descricao:
      "Valida segregação por empresa e bloqueio da base interna master.",
  },
  {
    titulo: "Simular Admin Master",
    rota: "/plataforma/motoristas/painel?perfil=admin&empresa=Operacao%20Principal",
    descricao:
      "Valida a camada de governança protegida com segregação obrigatória.",
  },
];

const principios = [
  {
    numero: "01",
    titulo: "Camada nova e isolada",
    texto:
      "Tudo aqui existe para evoluir a governança sem mexer na base já publicada e sem criar risco operacional desnecessário.",
  },
  {
    numero: "02",
    titulo: "Segregação por empresa",
    texto:
      "Cada empresa deve enxergar apenas a própria estrutura, seus próprios serviços e sua própria base autorizada.",
  },
  {
    numero: "03",
    titulo: "Base interna blindada",
    texto:
      "A rede interna de motoristas é ativo estratégico e não pode ser listada, sugerida, exportada ou aproveitada por terceiros.",
  },
  {
    numero: "04",
    titulo: "Escala com segurança",
    texto:
      "A expansão da plataforma deve ocorrer por novas páginas e novas camadas, mantendo o que está no ar protegido.",
  },
];

export default function PlataformaAcessosPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <a
              href="/plataforma"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Voltar para Plataforma
            </a>

            <a
              href="/plataforma/motoristas"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Blindagem de motoristas
            </a>

            <a
              href="/plataforma/operadoras"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Operadoras
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr,0.85fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Camada isolada
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Central de acessos da nova camada da plataforma
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Esta central organiza os módulos institucionais e operacionais
                da nova camada isolada. O objetivo é deixar a expansão clara,
                segura e escalável, preservando a produção já publicada e
                mantendo blindada a base interna da operação principal.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-cyan-900 to-blue-900 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Diretriz principal
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                Evoluir por páginas novas, sem tocar no que já está no ar
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-200">
                Esta camada existe para validar governança, segregação, perfis,
                blindagem e futuras ligações com sessão real, tudo de forma
                controlada e sem risco de quebrar a operação publicada.
              </p>

              <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-7 text-white/90">
                Aqui a expansão acontece com regra, clareza e proteção do ativo
                principal: sua base interna.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
              Módulos disponíveis
            </span>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Navegação principal da camada nova
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-600">
            Estes módulos já foram criados para estruturar governança, proteção
            da base e leitura por perfil sem encostar no sistema que já está em
            produção.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {modulos.map((modulo) => (
            <article
              key={modulo.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700">
                {modulo.destaque}
              </span>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                {modulo.titulo}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {modulo.descricao}
              </p>

              <ul className="mt-5 space-y-3">
                {modulo.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-slate-700"
                  >
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href={modulo.rota}
                className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Abrir módulo
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Simulações rápidas
              </span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Testes visuais por perfil
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Estes atalhos ajudam a validar rapidamente a segregação que você
              definiu para motorista interno, operadora externa e administração
              master.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {simulacoes.map((item) => (
              <article
                key={item.titulo}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="text-base font-bold text-slate-900">
                  {item.titulo}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.descricao}
                </p>

                <a
                  href={item.rota}
                  className="mt-5 inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Abrir simulação
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
                Princípios da camada
              </span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Regras que sustentam a expansão segura
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              Estes princípios deixam claro por que a evolução está sendo feita
              em nova camada, com blindagem e governança antes da ligação com o
              sistema real.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {principios.map((item) => (
              <article
                key={item.numero}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                  {item.numero}
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {item.titulo}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <p className="text-sm leading-7 text-slate-500">
            Sistema em constante atualização e podem ocorrer instabilidades
            momentÃ¢neas durante melhorias. Esta central foi criada como camada
            nova e isolada para organizar a expansão da plataforma sem tocar na
            base já publicada.
          </p>
        </div>
      </section>
    </main>
  );
}

