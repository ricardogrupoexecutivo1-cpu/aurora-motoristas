import Link from "next/link";
import InstallAppButton from "./components/InstallAppButton";

const cards = [
  {
    tag: "Destaque",
    title: "Começar",
    description:
      "Entrada prática para empresas, locadoras e parceiros entenderem por onde iniciar.",
    href: "/comecar",
    cta: "Abrir →",
  },
  {
    tag: "Destaque",
    title: "Guia completo",
    description:
      "Passo a passo real do sistema para empresas, motoristas, clientes e administração.",
    href: "/guia",
    cta: "Abrir →",
  },
  {
    tag: "Módulo",
    title: "Entrar no sistema",
    description:
      "Acesso direto com e-mail e senha para usuários já criados pelo administrador.",
    href: "/login",
    cta: "Entrar →",
  },
  {
    tag: "Módulo",
    title: "Empresas",
    description:
      "Base empresarial com cadastro, leitura por CNPJ e listagem pronta para uso real.",
    href: "/empresas",
    cta: "Abrir →",
  },
  {
    tag: "Módulo",
    title: "Clientes",
    description:
      "Base comercial com cadastro, busca por CNPJ, salvamento real e listagem pronta para uso.",
    href: "/clientes",
    cta: "Abrir →",
  },
  {
    tag: "Módulo",
    title: "Operação",
    description:
      "Visão central da trilha operacional, acompanhamento e organização do fluxo.",
    href: "/servicos",
    cta: "Abrir →",
  },
  {
    tag: "Módulo",
    title: "Financeiro",
    description:
      "Camada de controle financeiro e evolução da base administrativa.",
    href: "/financeiro",
    cta: "Abrir →",
  },
  {
    tag: "Módulo",
    title: "Motoristas",
    description:
      "Base operacional dos motoristas cadastrados, com leitura rápida e visual premium.",
    href: "/motoristas",
    cta: "Abrir →",
  },
];

const onboarding = [
  {
    tag: "Cadastro",
    title: "Cadastrar empresa",
    description:
      "Primeiro passo para estruturar a operação de locadoras e empresas na plataforma.",
    href: "/empresas/nova",
  },
  {
    tag: "Cadastro",
    title: "Cadastrar cliente",
    description:
      "Base comercial para relacionamento, histórico e organização do atendimento.",
    href: "/clientes/novo",
  },
  {
    tag: "Cadastro",
    title: "Cadastrar motorista",
    description:
      "Entrada rápida para formar a base operacional com padrão claro premium.",
    href: "/motoristas/novo",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f6f9fc 0%, #eef5fb 45%, #f8fbff 100%)",
        padding: "24px 16px 60px",
        fontFamily: "Arial, sans-serif",
        color: "#123047",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: 28,
            padding: 24,
            border: "1px solid #e7eef6",
            boxShadow: "0 24px 55px rgba(15, 23, 42, 0.07)",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                background: "#e0f2fe",
                color: "#075985",
                borderRadius: 999,
                padding: "7px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Aurora Motoristas • Sistema em constante atualização
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 38,
                lineHeight: 1.05,
                color: "#0f172a",
              }}
            >
              Motoristas para empresas e locadoras com operação clara, visual
              forte e fluxo real
            </h1>

            <p
              style={{
                margin: 0,
                color: "#496276",
                fontSize: 16,
                lineHeight: 1.75,
                maxWidth: 760,
              }}
            >
              Plataforma profissional para gestão de motoristas, cadastros,
              ofertas, operação, pagamentos e evolução administrativa com
              leitura clara no desktop e no celular. Sistema em constante
              atualização e podem ocorrer instabilidades momentâneas durante
              melhorias.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link href="/login" style={primaryLink}>
                Entrar no sistema
              </Link>

              <Link href="/guia" style={secondaryLink}>
                Ver guia completo
              </Link>

              <Link href="/comecar" style={secondaryLink}>
                Começar agora
              </Link>

              <Link href="/empresas" style={secondaryLink}>
                Ver empresas
              </Link>

              <Link href="/clientes" style={secondaryLink}>
                Ver clientes
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 4,
              }}
            >
              <span style={miniChip}>Entrada prática</span>
              <span style={miniChip}>Fluxo guiado</span>
              <span style={miniChip}>Padrão Aurora</span>
            </div>
          </div>

          <div
            style={{
              background: "#f8fbff",
              border: "1px solid #dbeafe",
              borderRadius: 24,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Leve o app para o celular ou PC
            </div>

            <div
              style={{
                color: "#4b6478",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Instale o Aurora Motoristas no dispositivo para abrir mais rápido,
              ter o app salvo e reduzir risco de perda de acesso quando a
              internet oscilar.
            </div>

            <InstallAppButton />

            <div
              style={{
                borderRadius: 16,
                background: "#ffffff",
                border: "1px solid #e5edf5",
                padding: 14,
                color: "#4b6478",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              Até colocarmos na Google Play, este botão já permite salvar o app
              no celular ou no PC quando o navegador suportar instalação.
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <FeatureCard
            title="Entrada prática"
            description="Acesse rápido o que importa para operação real."
          />
          <FeatureCard
            title="Fluxo guiado"
            description="Empresa, cliente, motorista, serviço, pagamento e histórico."
          />
          <FeatureCard
            title="Padrão Aurora"
            description="Visual claro premium e entendimento simples."
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "#0ea5e9",
                fontWeight: 800,
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
                color: "#0f172a",
              }}
            >
              Navegação central do sistema
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fcfdff",
                  border: "1px solid #e7eef6",
                  borderRadius: 20,
                  padding: 18,
                  boxShadow: "0 14px 28px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span style={smallTag}>{card.tag}</span>

                <strong
                  style={{
                    fontSize: 20,
                    lineHeight: 1.2,
                    color: "#0f172a",
                  }}
                >
                  {card.title}
                </strong>

                <p
                  style={{
                    margin: 0,
                    color: "#4b6478",
                    fontSize: 14,
                    lineHeight: 1.65,
                    flex: 1,
                  }}
                >
                  {card.description}
                </p>

                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  {card.cta}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: 22,
            border: "1px solid #e7eef6",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "#0ea5e9",
                fontWeight: 800,
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
                color: "#0f172a",
              }}
            >
              Monte a base do jeito certo
            </h2>
          </div>

          <p
            style={{
              margin: 0,
              color: "#4b6478",
              fontSize: 15,
              lineHeight: 1.75,
            }}
          >
            Para começar sem confusão, a ordem recomendada é: empresa, cliente,
            motorista, serviço, pagamento e histórico interno.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
            }}
          >
            {onboarding.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fcfdff",
                  border: "1px solid #e7eef6",
                  borderRadius: 20,
                  padding: 18,
                  boxShadow: "0 14px 28px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <span style={smallTag}>{item.tag}</span>

                <strong
                  style={{
                    fontSize: 20,
                    lineHeight: 1.2,
                    color: "#0f172a",
                  }}
                >
                  {item.title}
                </strong>

                <p
                  style={{
                    margin: 0,
                    color: "#4b6478",
                    fontSize: 14,
                    lineHeight: 1.65,
                    flex: 1,
                  }}
                >
                  {item.description}
                </p>

                <span
                  style={{
                    color: "#0ea5e9",
                    fontWeight: 800,
                    fontSize: 14,
                  }}
                >
                  Acessar →
                </span>
              </Link>
            ))}
          </div>

          <div
            style={{
              borderRadius: 18,
              background: "#f8fbff",
              border: "1px solid #e5edf5",
              padding: 16,
              color: "#435b6e",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#123047" }}>Fluxo recomendado:</strong>{" "}
            Cadastre empresa, cliente e motorista antes de escalar o restante da
            operação. Isso deixa o uso mais eficiente e reduz confusão.
          </div>

          <div
            style={{
              borderRadius: 18,
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              padding: 16,
              color: "#7c2d12",
              fontSize: 14,
              lineHeight: 1.7,
            }}
          >
            <strong>Melhor ponto para divulgar:</strong> Use a página{" "}
            <strong>/comecar</strong> para apresentar o sistema e a página{" "}
            <strong>/guia</strong> para explicar o funcionamento completo.
          </div>
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: 13,
            fontWeight: 700,
            paddingTop: 4,
          }}
        >
          Sistema Aurora • Motoristas para empresas e locadoras • operação em
          evolução contínua.
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 20,
        padding: 18,
        border: "1px solid #e7eef6",
        boxShadow: "0 14px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#0f172a",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#4b6478",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {description}
      </div>
    </div>
  );
}

const primaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
};

const secondaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 800,
};

const miniChip: React.CSSProperties = {
  background: "#eff6ff",
  color: "#1d4ed8",
  borderRadius: 999,
  padding: "8px 12px",
  fontWeight: 700,
  fontSize: 13,
};

const smallTag: React.CSSProperties = {
  display: "inline-flex",
  width: "fit-content",
  background: "#f1f5f9",
  color: "#334155",
  borderRadius: 999,
  padding: "6px 10px",
  fontWeight: 800,
  fontSize: 12,
};