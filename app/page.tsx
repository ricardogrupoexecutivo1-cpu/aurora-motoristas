export default function Home() {
  const acessosPrincipais = [
    {
      titulo: "Começar",
      descricao:
        "Entrada prática para empresas, locadoras e parceiros entenderem por onde iniciar.",
      href: "/comecar",
      destaque: true,
    },
    {
      titulo: "Guia completo",
      descricao:
        "Passo a passo real do sistema para empresas, motoristas, clientes e administração.",
      href: "/guia",
      destaque: true,
    },
    {
      titulo: "Empresas",
      descricao:
        "Base empresarial com cadastro, leitura por CNPJ e listagem pronta para uso real.",
      href: "/empresas",
    },
    {
      titulo: "Clientes",
      descricao:
        "Base comercial com cadastro, busca por CNPJ, salvamento real e listagem pronta para uso.",
      href: "/clientes",
    },
    {
      titulo: "Operação",
      descricao:
        "Visão central da trilha operacional, acompanhamento e organização do fluxo.",
      href: "/operacao",
    },
    {
      titulo: "Financeiro",
      descricao:
        "Camada de controle financeiro e evolução da base administrativa.",
      href: "/financeiro",
    },
    {
      titulo: "Motoristas",
      descricao:
        "Base operacional dos motoristas cadastrados, com leitura rápida e visual premium.",
      href: "/motoristas",
    },
  ];

  const cadastros = [
    {
      titulo: "Cadastrar empresa",
      descricao:
        "Primeiro passo para estruturar a operação de locadoras e empresas na plataforma.",
      href: "/empresas/cadastrar",
    },
    {
      titulo: "Cadastrar cliente",
      descricao:
        "Base comercial para relacionamento, histórico e organização do atendimento.",
      href: "/cadastros/clientes",
    },
    {
      titulo: "Cadastrar motorista",
      descricao:
        "Entrada rápida para formar a base operacional com padrão claro premium.",
      href: "/motoristas/cadastrar",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4faff 0%, #edf6ff 42%, #ffffff 100%)",
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
        <section
          style={{
            position: "relative",
            overflow: "hidden",
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
            Aurora Motoristas • Sistema em constante atualização
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(32px, 6vw, 54px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 920,
            }}
          >
            Motoristas para empresas e locadoras com operação clara, visual forte e fluxo real
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
            Plataforma profissional para gestão de motoristas, cadastros,
            ofertas, operação, pagamentos e evolução administrativa com leitura
            clara no desktop e no celular. Sistema em constante atualização e
            podem ocorrer instabilidades momentâneas durante melhorias.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 18,
            }}
          >
            <a href="/comecar" style={primaryButton}>
              Começar agora
            </a>

            <a href="/guia" style={secondaryButton}>
              Ver guia completo
            </a>

            <a href="/empresas" style={ghostButton}>
              Ver empresas
            </a>

            <a href="/clientes" style={ghostButton}>
              Ver clientes
            </a>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            <MiniInfo
              title="Entrada prática"
              text="Acesse rápido o que importa para operação real."
            />
            <MiniInfo
              title="Fluxo guiado"
              text="Empresa, cliente, motorista, serviço, pagamento e histórico."
            />
            <MiniInfo
              title="Padrão Aurora"
              text="Visual claro premium e entendimento simples."
            />
          </div>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#1d4ed8",
                  marginBottom: 6,
                }}
              >
                Acessos principais
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                Navegação central do sistema
              </h2>
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Entrada mais simples e comercial
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {acessosPrincipais.map((item) => (
              <a
                key={item.titulo}
                href={item.href}
                style={{
                  textDecoration: "none",
                  borderRadius: 24,
                  border: item.destaque
                    ? "1px solid #93c5fd"
                    : "1px solid #e2e8f0",
                  background: item.destaque
                    ? "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)"
                    : "#f8fbff",
                  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  minHeight: 160,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    color: item.destaque ? "#2563eb" : "#1d4ed8",
                  }}
                >
                  {item.destaque ? "Destaque" : "Módulo"}
                </div>

                <div
                  style={{
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: 22,
                    lineHeight: 1.1,
                  }}
                >
                  {item.titulo}
                </div>

                <div
                  style={{
                    color: "#475569",
                    fontSize: 15,
                    lineHeight: 1.65,
                  }}
                >
                  {item.descricao}
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    color: "#2563eb",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  Abrir →
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.9fr)",
            gap: 18,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #dbeafe",
              borderRadius: 28,
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
              padding: 18,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#1d4ed8",
                marginBottom: 6,
              }}
            >
              Cadastros principais
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.1,
              }}
            >
              Monte a base do jeito certo
            </h2>

            <p
              style={{
                margin: "10px 0 18px",
                color: "#475569",
                lineHeight: 1.65,
                fontSize: 15,
                maxWidth: 850,
              }}
            >
              Para começar sem confusão, a ordem recomendada é: empresa,
              cliente, motorista, serviço, pagamento e histórico interno.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {cadastros.map((item) => (
                <a
                  key={item.titulo}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    borderRadius: 22,
                    border: "1px solid #e2e8f0",
                    background: "#f8fbff",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    minHeight: 150,
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
                    Cadastro
                  </div>

                  <div
                    style={{
                      color: "#0f172a",
                      fontWeight: 800,
                      fontSize: 22,
                      lineHeight: 1.1,
                    }}
                  >
                    {item.titulo}
                  </div>

                  <div
                    style={{
                      color: "#475569",
                      fontSize: 15,
                      lineHeight: 1.65,
                    }}
                  >
                    {item.descricao}
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      color: "#2563eb",
                      fontWeight: 800,
                      fontSize: 14,
                    }}
                  >
                    Acessar →
                  </div>
                </a>
              ))}
            </div>
          </div>

          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <SideCard
              title="Fluxo recomendado"
              text="Cadastre empresa, cliente e motorista antes de escalar o restante da operação. Isso deixa o uso mais eficiente e reduz confusão."
            />
            <SideCard
              title="Melhor ponto para divulgar"
              text="Use a página /comecar para apresentar o sistema e a página /guia para explicar o funcionamento completo."
            />
            <SideCard
              title="Mensagem institucional"
              text="Sistema Aurora • Motoristas para empresas e locadoras • operação em evolução contínua."
            />
          </aside>
        </section>
      </div>
    </main>
  );
}

const primaryButton = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 15,
  boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)",
} as const;

const secondaryButton = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: 16,
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  color: "#1d4ed8",
  fontWeight: 800,
  fontSize: 15,
} as const;

const ghostButton = {
  textDecoration: "none",
  padding: "14px 18px",
  borderRadius: 16,
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 15,
} as const;

function MiniInfo({ title, text }: { title: string; text: string }) {
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

function SideCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #dbeafe",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
        padding: 18,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          color: "#1d4ed8",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#475569",
          lineHeight: 1.65,
          fontSize: 15,
        }}
      >
        {text}
      </div>
    </div>
  );
}