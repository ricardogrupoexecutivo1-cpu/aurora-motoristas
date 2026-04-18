export default function PlataformaMotoristasPage() {
  const pilares = [
    {
      titulo: "Motorista interno",
      descricao:
        "O motorista interno acessa apenas a própria área operacional, vê somente o que é dele e nunca enxerga a base completa da plataforma.",
      pontos: [
        "Vê apenas os próprios serviços autorizados.",
        "Não enxerga lista completa de motoristas.",
        "Não acessa relatórios estratégicos.",
        "Não acessa margem, inteligência comercial ou visão consolidada.",
        "Após pagamento ou baixa final, o serviço deixa de aparecer para o motorista.",
      ],
    },
    {
      titulo: "Operadora externa",
      descricao:
        "A operadora externa pode usar a plataforma apenas dentro da própria estrutura aprovada, sem qualquer acesso à base interna da operação principal.",
      pontos: [
        "Usa somente a própria base de motoristas.",
        "Não pode pesquisar motoristas internos da operação master.",
        "Não pode exportar, listar ou sugerir base interna.",
        "Não pode visualizar histórico da rede interna.",
        "Só opera com autorização formal e plano ativo.",
      ],
    },
    {
      titulo: "Admin master",
      descricao:
        "A administração master controla a governança, a segregação e a segurança geral da plataforma, sem expor a rede interna para terceiros.",
      pontos: [
        "Vê a base protegida completa conforme permissão máxima.",
        "Controla liberação de operadoras e acessos.",
        "Valida segregação por empresa.",
        "Protege a rede interna de freelancers e motoristas.",
        "Audita serviços, históricos e regras de exposição.",
      ],
    },
  ];

  const regrasAbsolutas = [
    {
      numero: "1",
      titulo: "Motorista só vê o que é dele",
      texto:
        "Nenhum motorista deve ter acesso à base completa. A leitura operacional do motorista deve ser individual, restrita e vinculada apenas aos próprios serviços autorizados.",
    },
    {
      numero: "2",
      titulo: "Operadora externa nunca acessa a base interna",
      texto:
        "Empresas externas do mesmo segmento não podem visualizar, pesquisar, exportar, sugerir ou aproveitar a base interna de motoristas da operação principal.",
    },
    {
      numero: "3",
      titulo: "Cada empresa enxerga apenas a própria estrutura",
      texto:
        "A segregação por empresa deve ser rígida em motoristas, serviços, relatórios, documentos, histórico e demais dados operacionais.",
    },
    {
      numero: "4",
      titulo: "Histórico interno continua protegido",
      texto:
        "Serviços pagos, baixados ou ocultos deixam de aparecer para o motorista e permanecem apenas em histórico interno protegido para administração autorizada.",
    },
    {
      numero: "5",
      titulo: "Sem inteligência comercial para terceiros",
      texto:
        "Operadoras externas não podem acessar margens globais, rede estratégica, contatos internos, avaliações completas, lógica de distribuição ou visão consolidada da operação master.",
    },
    {
      numero: "6",
      titulo: "A plataforma protege a rede construída pela operação principal",
      texto:
        "A plataforma não pode servir como vitrine para captação da rede interna por outras operadoras. A base principal deve permanecer blindada em caráter permanente.",
    },
  ];

  const comparativo = [
    {
      perfil: "Motorista interno",
      acesso: "Somente ao que é dele",
      base: "Não vê base completa",
      servicos: "Somente próprios e autorizados",
      relatorios: "Não acessa estratégicos",
      observacao: "Após pagamento, serviço some da visão dele",
    },
    {
      perfil: "Operadora externa",
      acesso: "Somente à própria estrutura",
      base: "Nunca vê base interna master",
      servicos: "Somente os vinculados à própria empresa",
      relatorios: "Sem visão estratégica global",
      observacao: "Depende de autorização formal e plano ativo",
    },
    {
      perfil: "Admin master",
      acesso: "Visão máxima protegida",
      base: "Vê a base completa conforme papel master",
      servicos: "Administra e audita a operação",
      relatorios: "Acesso administrativo completo autorizado",
      observacao: "Responsável pela blindagem e governança",
    },
  ];

  const fluxo = [
    {
      numero: "01",
      titulo: "Classificar o perfil de acesso",
      texto:
        "Separar corretamente motorista interno, operadora externa e administração master antes de liberar qualquer leitura operacional.",
    },
    {
      numero: "02",
      titulo: "Aplicar a segregação por empresa",
      texto:
        "Garantir que cada empresa trabalhe apenas com a própria estrutura, sem mistura de bases, relatórios ou motoristas.",
    },
    {
      numero: "03",
      titulo: "Proteger a base interna master",
      texto:
        "Bloquear qualquer listagem, busca, exportação, sugestão ou visualização da rede interna para terceiros.",
    },
    {
      numero: "04",
      titulo: "Controlar a visibilidade do serviço",
      texto:
        "Serviço visível para motorista apenas enquanto estiver dentro da janela operacional permitida. Após baixa final, fica somente no histórico interno protegido.",
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
                Aurora Motoristas • Blindagem da base
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Regras de proteção da base de motoristas
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                Esta página define a blindagem da base interna de motoristas na
                nova camada isolada da plataforma. O objetivo é permitir
                crescimento com segurança, sem expor a rede interna da operação
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
                Motorista vê apenas o que é dele. Operadora externa nunca vê a
                base interna. Administração master controla a governança e a
                segregação com visão protegida.
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
                Quem pode ver o quê
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              A leitura abaixo resume a lógica que a plataforma deve respeitar
              para proteger a operação principal e impedir exposição indevida da
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
                    Serviços
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Relatórios
                  </th>
                  <th className="border-b border-slate-200 bg-slate-100 px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Observação
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
              Blindagem obrigatória da rede interna
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
                Proteção contra aproveitamento
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                O uso da plataforma não transfere a sua rede para terceiros
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Nenhuma operadora externa deve obter vantagem estrutural sobre a
                rede interna de freelancers, motoristas, contatos, histórico,
                avaliações, documentos ou inteligência operacional construída
                pela operação principal.
              </p>

              <div className="mt-5 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm leading-7 text-cyan-900">
                A plataforma deve crescer sem abrir a porta para assédio
                comercial, aproveitamento da base interna ou captura da sua rede
                por terceiros.
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                Próximo módulo de governança
              </span>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Próximo passo recomendado
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                Depois desta camada institucional, o próximo movimento seguro é
                ligar essa lógica a páginas reais por perfil, mantendo a mesma
                blindagem: motorista vê apenas o dele, operadora externa só vê a
                própria base e administração master controla tudo.
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
                Ordem segura de proteção operacional
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-slate-600">
              A governança precisa vir antes da liberação ampla. Esta ordem
              ajuda a crescer sem misturar empresas, sem expor dados e sem
              quebrar a base já publicada.
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
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas durante melhorias. Esta página foi criada como camada
            nova e isolada para evoluir a blindagem da plataforma sem tocar na
            base já publicada.
          </p>
        </div>
      </section>
    </main>
  );
}