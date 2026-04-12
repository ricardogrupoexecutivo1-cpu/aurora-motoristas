export default function GuiaPage() {
  const cards = [
    {
      titulo: "Empresas e locadoras",
      descricao:
        "Cadastre a empresa, organize clientes, motoristas e acompanhe toda a operação em um fluxo simples e profissional.",
      passos: [
        "Cadastre a empresa na base principal.",
        "Cadastre os clientes que solicitarão serviços.",
        "Cadastre os motoristas com dados essenciais e foto quando aplicável.",
        "Lance serviços, acompanhe execução e registre pagamentos.",
      ],
      link: "/empresas/cadastrar",
      cta: "Cadastrar empresa",
    },
    {
      titulo: "Motoristas",
      descricao:
        "Recebem chamados, podem aceitar ou recusar serviços e acompanham apenas o que estiver liberado para sua operação.",
      passos: [
        "Faça o cadastro completo do motorista.",
        "Receba o chamado operacional.",
        "Aceite ou recuse sem punição automática.",
        "Após pagamento, o serviço sai da visão operacional do motorista e fica no histórico interno protegido.",
      ],
      link: "/motoristas/cadastrar",
      cta: "Cadastrar motorista",
    },
    {
      titulo: "Clientes e usuários",
      descricao:
        "A base de clientes organiza contatos, origem comercial, histórico e prepara o sistema para relacionamento real com empresas.",
      passos: [
        "Cadastre o cliente como pessoa física ou jurídica.",
        "Guarde telefone, e-mail e responsável principal.",
        "Use a base para relacionamento, serviços e histórico comercial.",
        "Evolua depois para filtros e integrações de CPF/CNPJ.",
      ],
      link: "/cadastros/clientes",
      cta: "Cadastrar cliente",
    },
    {
      titulo: "Administração",
      descricao:
        "A camada administrativa controla operação, pagamentos, histórico e áreas sensíveis com mais proteção.",
      passos: [
        "Valide cadastros principais.",
        "Acompanhe serviços, despesas e pagamentos.",
        "Proteja dados sensíveis e histórico interno.",
        "Mantenha acesso financeiro apenas para autorizados.",
      ],
      link: "/operacao",
      cta: "Ir para operação",
    },
  ];

  const modulos = [
    ["Home", "/", "Entrada principal do sistema e navegação geral."],
    ["Motoristas", "/motoristas", "Base operacional de motoristas já cadastrados."],
    ["Cadastrar motorista", "/motoristas/cadastrar", "Entrada rápida para formar a base operacional."],
    ["Clientes", "/cadastros/clientes", "Base comercial para relacionamento e novos serviços."],
    ["Empresas", "/empresas/cadastrar", "Cadastro principal de empresas e locadoras."],
    ["Serviços", "/servicos", "Gestão dos serviços lançados e acompanhamento da operação."],
    ["Pagamentos", "/pagamentos", "Controle de pagamento e baixa operacional."],
    ["Histórico", "/historico", "Retenção protegida de operações já concluídas."],
    ["Translados", "/translados", "Fluxo específico para aeroportos, escalas e despesas."],
  ] as const;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4faff 0%, #ecf6ff 40%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "20px 16px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 16,
          }}
        >
          <a
            href="/"
            style={pillButton(false)}
          >
            Voltar
          </a>

          <a
            href="/"
            style={pillButton(true)}
          >
            Início
          </a>
        </div>

        <section
          style={{
            borderRadius: 30,
            border: "1px solid #dbeafe",
            background:
              "radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 24%), linear-gradient(135deg, #ffffff 0%, #f1f8ff 45%, #eef7ff 100%)",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
            padding: "24px 18px",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 999,
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              color: "#0369a1",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            Aurora Motoristas • Guia completo
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Entendimento real do sistema, passo a passo
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 900,
              color: "#334155",
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Este guia foi criado para deixar o Aurora Motoristas autoexplicativo,
            simples de usar e eficiente para empresas, locadoras, motoristas,
            clientes e administração. Sistema em constante atualização e podem
            ocorrer instabilidades momentâneas durante melhorias.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            <HighlightCard
              title="Comece por aqui"
              text="Use esta página para entender a ordem certa de cadastro e operação."
            />
            <HighlightCard
              title="Fluxo guiado"
              text="Cadastre empresa, cliente, motorista, serviço, pagamento e histórico."
            />
            <HighlightCard
              title="Uso profissional"
              text="Cada perfil entende o que fazer sem depender de explicação externa."
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
            marginBottom: 18,
          }}
        >
          {cards.map((card) => (
            <article
              key={card.titulo}
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: 26,
                boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: "#1d4ed8",
                    marginBottom: 8,
                  }}
                >
                  Perfil
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    lineHeight: 1.1,
                  }}
                >
                  {card.titulo}
                </h2>
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  lineHeight: 1.65,
                  fontSize: 15,
                }}
              >
                {card.descricao}
              </p>

              <div
                style={{
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
                  background: "#f8fbff",
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: "#0f172a",
                    marginBottom: 10,
                    fontSize: 14,
                  }}
                >
                  Passo a passo
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {card.passos.map((passo, index) => (
                    <div
                      key={passo}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "30px 1fr",
                        gap: 10,
                        alignItems: "start",
                      }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 999,
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 13,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div
                        style={{
                          color: "#334155",
                          lineHeight: 1.6,
                          fontSize: 14,
                          paddingTop: 3,
                        }}
                      >
                        {passo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={card.link}
                style={{
                  marginTop: "auto",
                  textDecoration: "none",
                  textAlign: "center",
                  padding: "14px 18px",
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: "0 16px 34px rgba(37, 99, 235, 0.28)",
                }}
              >
                {card.cta}
              </a>
            </article>
          ))}
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 28,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
            padding: 18,
            marginBottom: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.1,
            }}
          >
            Ordem recomendada de uso
          </h2>

          <p
            style={{
              margin: "10px 0 18px",
              color: "#475569",
              lineHeight: 1.65,
              fontSize: 15,
              maxWidth: 900,
            }}
          >
            Para começar sem confusão, siga esta sequência operacional. Assim o
            sistema fica lógico para a empresa e claro para quem vai operar.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {[
              "1. Cadastrar empresa",
              "2. Cadastrar cliente",
              "3. Cadastrar motorista",
              "4. Lançar serviço",
              "5. Acompanhar operação",
              "6. Registrar pagamento",
              "7. Guardar histórico interno",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: 18,
                  border: "1px solid #e2e8f0",
                  background: "#f8fbff",
                  padding: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: 15,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 28,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
            padding: 18,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              lineHeight: 1.1,
            }}
          >
            Módulos do sistema
          </h2>

          <p
            style={{
              margin: "10px 0 18px",
              color: "#475569",
              lineHeight: 1.65,
              fontSize: 15,
              maxWidth: 920,
            }}
          >
            Aqui está um mapa rápido para deixar o sistema mais compreensível e
            fácil de apresentar para clientes, empresas e parceiros.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {modulos.map(([titulo, link, descricao]) => (
              <a
                key={titulo}
                href={link}
                style={{
                  textDecoration: "none",
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
                  background: "#f8fbff",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    color: "#1d4ed8",
                    fontSize: 13,
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {titulo}
                </div>
                <div
                  style={{
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {link}
                </div>
                <div
                  style={{
                    color: "#475569",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {descricao}
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function pillButton(primary: boolean) {
  return {
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: 999,
    background: primary ? "#eff6ff" : "#ffffff",
    border: primary ? "1px solid #bfdbfe" : "1px solid #dbeafe",
    color: primary ? "#1d4ed8" : "#0f172a",
    fontWeight: 700,
    fontSize: 14,
  } as const;
}

function HighlightCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid #dbeafe",
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: "#1d4ed8",
          marginBottom: 6,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.55,
        }}
      >
        {text}
      </div>
    </div>
  );
}