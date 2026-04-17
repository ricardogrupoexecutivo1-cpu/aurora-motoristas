"use client";

import Link from "next/link";

const accessCards = [
  {
    eyebrow: "Motoristas parceiros",
    title: "Quero ser motorista",
    description:
      "Cadastro público para motoristas parceiros entrarem na base com análise inicial, leitura clara e fluxo preparado para aprovação.",
    href: "/quero-ser-motorista",
    cta: "Entrar como motorista",
    highlight: "Cadastro com análise",
  },
  {
    eyebrow: "Clientes e empresas",
    title: "Sou cliente ou empresa",
    description:
      "Solicite atendimento, envie pedido de cotação, organize demandas de transporte e entre no fluxo comercial com leitura premium.",
    href: "/pedido-cotacao",
    cta: "Solicitar atendimento",
    highlight: "Entrada comercial",
  },
  {
    eyebrow: "Operação interna",
    title: "Área administrativa",
    description:
      "Acesso da operação para motoristas cadastrados, serviços, clientes, empresas e estrutura administrativa com base real conectada.",
    href: "/login",
    cta: "Entrar na operação",
    highlight: "Acesso restrito",
  },
];

const quickLinks = [
  { label: "Motoristas", href: "/motoristas" },
  { label: "Novo motorista interno", href: "/motoristas/cadastrar" },
  { label: "Serviços", href: "/servicos" },
  { label: "Clientes", href: "/clientes" },
  { label: "Empresas", href: "/empresas" },
  { label: "Guia", href: "/guia" },
];

const pillars = [
  {
    title: "Captação organizada",
    text: "Separação clara entre motorista parceiro, cliente/empresa e operação interna para evitar entrada na tela errada.",
  },
  {
    title: "Visual premium claro",
    text: "Leitura forte no celular e no computador com identidade comercial elegante e navegação objetiva.",
  },
  {
    title: "Crescimento com segurança",
    text: "Base pronta para evoluir com aprovação administrativa, serviços, WhatsApp operacional e histórico protegido.",
  },
];

export default function HomePage() {
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
          maxWidth: 1280,
          margin: "0 auto",
          padding: "22px 16px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link href="/guia" style={pillButton(false)}>
              Guia
            </Link>

            <Link href="/login" style={pillButton(false)}>
              Login
            </Link>

            <Link href="/motoristas" style={pillButton(false)}>
              Operação
            </Link>
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 999,
              background: "#ffffff",
              border: "1px solid #dbeafe",
              color: "#475569",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Sistema em constante atualização e podem ocorrer instabilidades
            momentâneas.
          </div>
        </header>

        <section
          style={{
            borderRadius: 34,
            border: "1px solid #dbeafe",
            background:
              "radial-gradient(circle at top right, rgba(14, 165, 233, 0.20), transparent 24%), linear-gradient(135deg, #ffffff 0%, #f1f8ff 46%, #eef7ff 100%)",
            boxShadow: "0 28px 70px rgba(15, 23, 42, 0.08)",
            padding: "30px 22px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.25fr) minmax(280px, 0.85fr)",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                width: "fit-content",
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
              Aurora Motoristas • Home premium
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(34px, 5vw, 58px)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
                maxWidth: 820,
              }}
            >
              Transporte, operação e captação de motoristas com entrada clara
              para cada perfil.
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 860,
                fontSize: 17,
                lineHeight: 1.8,
                color: "#334155",
              }}
            >
              Aqui o motorista parceiro encontra o cadastro certo, o cliente ou
              empresa entra no atendimento comercial e a equipe interna acessa a
              operação com leitura premium e navegação organizada.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link href="/quero-ser-motorista" style={primaryButton}>
                Quero ser motorista
              </Link>

              <Link href="/pedido-cotacao" style={secondaryButton}>
                Sou cliente ou empresa
              </Link>

              <Link href="/login" style={secondaryButton}>
                Área administrativa
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid #dbeafe",
              borderRadius: 28,
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.07)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#1d4ed8",
                letterSpacing: 0.4,
              }}
            >
              Leitura rápida
            </div>

            <QuickLine label="Motorista parceiro" value="Cadastro com análise" />
            <QuickLine label="Cliente / empresa" value="Entrada comercial" />
            <QuickLine label="Operação interna" value="Acesso restrito" />
            <QuickLine label="Base administrativa" value="Motoristas e serviços" />

            <div
              style={{
                borderRadius: 18,
                padding: 14,
                background: "#f8fbff",
                border: "1px solid #e2e8f0",
                color: "#475569",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              A home agora organiza o acesso correto para evitar confusão entre
              cadastro público, operação e atendimento comercial.
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {accessCards.map((card) => (
            <article
              key={card.title}
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: 28,
                boxShadow: "0 22px 58px rgba(15, 23, 42, 0.07)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  padding: "7px 11px",
                  borderRadius: 999,
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  color: "#1d4ed8",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                }}
              >
                {card.eyebrow}
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 26,
                    lineHeight: 1.08,
                  }}
                >
                  {card.title}
                </h2>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#475569",
                    fontSize: 15,
                    lineHeight: 1.75,
                  }}
                >
                  {card.description}
                </p>
              </div>

              <div
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  borderRadius: 999,
                  padding: "8px 12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {card.highlight}
              </div>

              <div style={{ marginTop: "auto" }}>
                <Link href={card.href} style={cardButton}>
                  {card.cta}
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #dbeafe",
            borderRadius: 30,
            boxShadow: "0 22px 58px rgba(15, 23, 42, 0.06)",
            padding: 22,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                textTransform: "uppercase",
                color: "#1d4ed8",
                letterSpacing: 0.4,
              }}
            >
              Acessos principais
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.1,
              }}
            >
              Entrada rápida para quem opera no dia a dia
            </h3>

            <p
              style={{
                margin: 0,
                color: "#475569",
                fontSize: 15,
                lineHeight: 1.75,
                maxWidth: 700,
              }}
            >
              Estes atalhos ajudam a entrar direto nas áreas mais usadas da base
              operacional sem perder a leitura premium do projeto.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignContent: "flex-start",
            }}
          >
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href} style={quickLinkStyle}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
          }}
        >
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              style={{
                background: "#ffffff",
                border: "1px solid #dbeafe",
                borderRadius: 24,
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                padding: 18,
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
                {pillar.title}
              </div>

              <div
                style={{
                  color: "#475569",
                  fontSize: 15,
                  lineHeight: 1.7,
                }}
              >
                {pillar.text}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function QuickLine({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: 10,
      }}
    >
      <span
        style={{
          color: "#64748b",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#123047",
          fontSize: 14,
          fontWeight: 800,
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
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

const primaryButton: React.CSSProperties = {
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  padding: "14px 20px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 15,
  boxShadow: "0 16px 35px rgba(37, 99, 235, 0.28)",
};

const secondaryButton: React.CSSProperties = {
  textDecoration: "none",
  border: "1px solid #cbd5e1",
  cursor: "pointer",
  padding: "14px 20px",
  borderRadius: 16,
  background: "#ffffff",
  color: "#0f172a",
  fontWeight: 800,
  fontSize: 15,
};

const cardButton: React.CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "13px 16px",
  borderRadius: 16,
  background: "#0f172a",
  color: "#ffffff",
  fontWeight: 800,
  fontSize: 14,
};

const quickLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 14px",
  borderRadius: 14,
  background: "#f8fbff",
  border: "1px solid #dbeafe",
  color: "#123047",
  fontWeight: 700,
  fontSize: 14,
};