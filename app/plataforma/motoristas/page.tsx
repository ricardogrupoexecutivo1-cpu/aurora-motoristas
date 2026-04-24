export default function PlataformaMotoristasPage() {
  const pilares = [
    {
      titulo: "Motorista interno",
      descricao:
        "O motorista interno acessa apenas a prÃ³pria Ã¡rea operacional, vÃª somente o que Ã© dele e nunca enxerga a base completa da plataforma.",
      pontos: [
        "VÃª apenas os prÃ³prios serviÃ§os autorizados.",
        "NÃ£o enxerga lista completa de motoristas.",
        "NÃ£o acessa relatÃ³rios estratÃ©gicos.",
        "NÃ£o acessa margem, inteligÃªncia comercial ou visÃ£o consolidada.",
        "ApÃ³s pagamento ou baixa final, o serviÃ§o deixa de aparecer para o motorista.",
      ],
    },
    {
      titulo: "Operadora externa",
      descricao:
        "A operadora externa pode usar a plataforma apenas dentro da prÃ³pria estrutura aprovada, sem qualquer acesso Ã  base interna da operaÃ§Ã£o principal.",
      pontos: [
        "Usa somente a prÃ³pria base de motoristas.",
        "NÃ£o pode pesquisar motoristas internos da operaÃ§Ã£o master.",
        "NÃ£o pode exportar, listar ou sugerir base interna.",
        "NÃ£o pode visualizar histÃ³rico da rede interna.",
        "SÃ³ opera com autorizaÃ§Ã£o formal e plano ativo.",
      ],
    },
    {
      titulo: "Admin master",
      descricao:
        "A administraÃ§Ã£o master controla a governanÃ§a, a segregaÃ§Ã£o e a seguranÃ§a geral da plataforma, sem expor a rede interna para terceiros.",
      pontos: [
        "VÃª a base protegida completa conforme permissÃ£o mÃ¡xima.",
        "Controla liberaÃ§Ã£o de operadoras e acessos.",
        "Valida segregaÃ§Ã£o por empresa.",
        "Protege a rede interna de freelancers e motoristas.",
        "Audita serviÃ§os, histÃ³ricos e regras de exposiÃ§Ã£o.",
      ],
    },
  ];

  const regrasAbsolutas = [
    {
      numero: "1",
      titulo: "Motorista sÃ³ vÃª o que Ã© dele",
      texto:
        "Nenhum motorista deve ter acesso Ã  base completa. A leitura operacional do motorista deve ser individual, restrita e vinculada apenas aos prÃ³prios serviÃ§os autorizados.",
    },
    {
      numero: "2",
      titulo: "Operadora externa nunca acessa a base interna",
      texto:
        "Empresas externas do mesmo segmento nÃ£o podem visualizar, pesquisar, exportar, sugerir ou aproveitar a base interna de motoristas da operaÃ§Ã£o principal.",
    },
    {
      numero: "3",
      titulo: "Cada empresa enxerga apenas a prÃ³pria estrutura",
      texto:
        "A segregaÃ§Ã£o por empresa deve ser rÃ­gida em motoristas, serviÃ§os, relatÃ³rios, documentos, histÃ³rico e demais dados operacionais.",
    },
    {
      numero: "4",
      titulo: "HistÃ³rico interno continua protegido",
      texto:
        "ServiÃ§os pagos, baixados ou ocultos deixam de aparecer para o motorista e permanecem apenas em histÃ³rico interno protegido para administraÃ§Ã£o autorizada.",
    },
    {
      numero: "5",
      titulo: "Sem inteligÃªncia comercial para terceiros",
      texto:
        "Operadoras externas nÃ£o podem acessar margens globais, rede estratÃ©gica, contatos internos, avaliaÃ§Ãµes completas, lÃ³gica de distribuiÃ§Ã£o ou visÃ£o consolidada da operaÃ§Ã£o master.",
    },
    {
      numero: "6",
      titulo: "A plataforma protege a rede construÃ­da pela operaÃ§Ã£o principal",
      texto:
        "A plataforma nÃ£o pode servir como vitrine para captaÃ§Ã£o da rede interna por outras operadoras. A base principal deve permanecer blindada em carÃ¡ter permanente.",
    },
  ];

  const comparativo = [
    {
      perfil: "Motorista interno",
      acesso: "Somente ao que Ã© dele",
      base: "NÃ£o vÃª base completa",
      servicos: "Somente prÃ³prios e autorizados",
      relatorios: "NÃ£o acessa estratÃ©gicos",
      observacao: "ApÃ³s pagamento, serviÃ§o some da visÃ£o dele",
    },
    {
      perfil: "Operadora externa",
      acesso: "Somente Ã  prÃ³pria estrutura",
      base: "Nunca vÃª base interna master",
      servicos: "Somente os vinculados Ã  prÃ³pria empresa",
      relatorios: "Sem visÃ£o estratÃ©gica global",
      observacao: "Depende de autorizaÃ§Ã£o formal e plano ativo",
    },
    {
      perfil: "Admin master",
      acesso: "VisÃ£o mÃ¡xima protegida",
      base: "VÃª a base completa conforme papel master",
      servicos: "Administra e audita a operaÃ§Ã£o",
      relatorios: "Acesso administrativo completo autorizado",
      observacao: "ResponsÃ¡vel pela blindagem e governanÃ§a",
    },
  ];

  const fluxo = [
    {
      numero: "01",
      titulo: "Classificar o perfil de acesso",
      texto:
        "Separar corretamente motorista interno, operadora externa e administraÃ§Ã£o master antes de liberar qualquer leitura operacional.",
    },
    {
      numero: "02",
      titulo: "Aplicar a segregaÃ§Ã£o por empresa",
      texto:
        "Garantir que cada empresa trabalhe apenas com a prÃ³pria estrutura, sem mistura de bases, relatÃ³rios ou motoristas.",
    },
    {
      numero: "03",
      titulo: "Proteger a base interna master",
      texto:
        "Bloquear qualquer listagem, busca, exportaÃ§Ã£o, sugestÃ£o ou visualizaÃ§Ã£o da rede interna para terceiros.",
    },
    {
      numero: "04",
      titulo: "Controlar a visibilidade do serviÃ§o",
      texto:
        "ServiÃ§o visÃ­vel para motorista apenas enquanto estiver dentro da janela operacional permitida. ApÃ³s baixa final, fica somente no histÃ³rico interno protegido.",
    },
  ];

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
              href="/plataforma/operadoras"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Operadoras
            </a>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr,0.75fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                Aurora Motoristas â€¢ Blindagem da base
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Regras de proteÃ§Ã£o da base de motoristas
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Esta pÃ¡gina define a blindagem da base interna de motoristas na
                nova camada isolada da plataforma. O objetivo Ã© permitir
                crescimento com seguranÃ§a, sem expor a rede interna da operaÃ§Ã£o
                principal e sem criar brechas para aproveitamento por operadoras
                externas.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-6 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Regra central
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                A base interna nunca pode virar vitrine para terceiros
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-200">
                Motorista vÃª apenas o que Ã© dele. Operadora externa nunca vÃª a
                base interna. AdministraÃ§Ã£o master controla a governanÃ§a e a
                segregaÃ§Ã£o com visÃ£o protegida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {pilares.map((item) => (
            <article
              key={item.titulo}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold text-slate-900">{item.titulo}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {item.descricao}
              </p>

              <ul className="mt-5 space-y-3">
                {item.pontos.map((ponto) => (
                  <li key={ponto} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-cyan-500" />
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Comparativo de acesso
              </span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Quem pode ver o quÃª
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              A leitura abaixo resume a lÃ³gica que a plataforma deve respeitar
              para proteger a operaÃ§Ã£o principal e impedir exposiÃ§Ã£o indevida da
              rede interna.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Perfil
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Acesso
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Base de motoristas
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    ServiÃ§os
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    RelatÃ³rios
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    ObservaÃ§Ã£o
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparativo.map((linha) => (
                  <tr key={linha.perfil}>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm font-semibold text-slate-900">
                      {linha.perfil}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
                      {linha.acesso}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
                      {linha.base}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
                      {linha.servicos}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
                      {linha.relatorios}
                    </td>
                    <td className="border-b border-slate-100 bg-white px-4 py-4 text-sm text-slate-700">
                      {linha.observacao}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
              Regras absolutas
            </span>

            <h2 className="mt-3 text-2xl font-bold text-slate-900">
              Blindagem obrigatÃ³ria da rede interna
            </h2>

            <div className="mt-6 space-y-4">
              {regrasAbsolutas.map((regra) => (
                <article
                  key={regra.numero}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
                      {regra.numero}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {regra.titulo}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {regra.texto}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                ProteÃ§Ã£o contra aproveitamento
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                O uso da plataforma nÃ£o transfere a sua rede para terceiros
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Nenhuma operadora externa deve obter vantagem estrutural sobre a
                rede interna de freelancers, motoristas, contatos, histÃ³rico,
                avaliaÃ§Ãµes, documentos ou inteligÃªncia operacional construÃ­da
                pela operaÃ§Ã£o principal.
              </p>

              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm leading-7 text-cyan-900">
                A plataforma deve crescer sem abrir a porta para assÃ©dio
                comercial, aproveitamento da base interna ou captura da sua rede
                por terceiros.
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                PrÃ³ximo mÃ³dulo de governanÃ§a
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                PrÃ³ximo passo recomendado
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Depois desta camada institucional, o prÃ³ximo movimento Ambiente seguro Ã©
                ligar essa lÃ³gica a pÃ¡ginas reais por perfil, mantendo a mesma
                blindagem: motorista vÃª apenas o dele, operadora externa sÃ³ vÃª a
                prÃ³pria base e administraÃ§Ã£o master controla tudo.
              </p>

              <a
                href="/plataforma/operadoras"
                className="mt-5 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Voltar para Operadoras
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Fluxo recomendado
              </span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Ordem segura de proteÃ§Ã£o operacional
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              A governanÃ§a precisa vir antes da liberaÃ§Ã£o ampla. Esta ordem
              ajuda a crescer sem misturar empresas, sem expor dados e sem
              quebrar a base jÃ¡ publicada.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {fluxo.map((etapa) => (
              <article
                key={etapa.numero}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-600 text-sm font-bold text-white">
                  {etapa.numero}
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {etapa.titulo}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {etapa.texto}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
          <p className="text-sm leading-7 text-slate-500">
            Sistema em constante atualizaÃ§Ã£o e podem ocorrer instabilidades
            momentÃ¢neas durante melhorias. Esta pÃ¡gina foi criada como camada
            nova e isolada para evoluir a blindagem da plataforma sem tocar na
            base jÃ¡ publicada.
          </p>
        </div>
      </section>
    </main>
  );
}
