export default function ComecarPage() {
  const cards = [
    {
      titulo: "Guia completo",
      descricao:
        "Entenda o fluxo do sistema, a ordem recomendada de uso e como cada perfil opera dentro do Aurora Motoristas.",
      link: "/guia",
      cta: "Abrir guia",
    },
    {
      titulo: "Cadastrar empresa",
      descricao:
        "Primeiro passo para locadoras, empresas e operações que vão usar a plataforma com organização profissional.",
      link: "/empresas/cadastrar",
      cta: "Cadastrar empresa",
    },
    {
      titulo: "Cadastrar motorista",
      descricao:
        "Monte sua base operacional com cadastro claro, pronto para evoluir com foto, documentação e regras internas.",
      link: "/motoristas/cadastrar",
      cta: "Cadastrar motorista",
    },
    {
      titulo: "Cadastrar cliente",
      descricao:
        "Organize clientes pessoa física e jurídica com contatos, histórico e base comercial pronta para crescer.",
      link: "/cadastros/clientes",
      cta: "Cadastrar cliente",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f4faff 0%, #edf6ff 40%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
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
          <a href="/" style={pillButton(false)}>
            Voltar
          </a>

          <a href="/" style={pillButton(true)}>
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
            Aurora Motoristas â€¢ Começar
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Entrada prática para começar do jeito certo
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
            Esta página foi criada para facilitar a entrada no Aurora Motoristas
            com clareza real. Aqui a empresa já entende por onde começar, como
            navegar e qual é a ordem ideal para formar a operação. Sistema em
            constante atualização e podem ocorrer instabilidades momentÃ¢neas
            durante melhorias.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
            marginBottom: 18,
          }}
        >
          <InfoMiniCard
            titulo="Passo 1"
            texto="Entenda o fluxo no guia completo."
          />
          <InfoMiniCard
            titulo="Passo 2"
            texto="Cadastre empresa, cliente e motorista."
          />
          <InfoMiniCard
            titulo="Passo 3"
            texto="Depois evoluímos para serviços, pagamentos e histórico."
          />
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
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
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#1d4ed8",
                }}
              >
                Acesso rápido
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

function InfoMiniCard({
  titulo,
  texto,
}: {
  titulo: string;
  texto: string;
}) {
  return (
    <div
      style={{
        borderRadius: 22,
        background: "#ffffff",
        border: "1px solid #dbeafe",
        boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
        padding: 16,
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
        {titulo}
      </div>

      <div
        style={{
          color: "#475569",
          lineHeight: 1.6,
          fontSize: 15,
        }}
      >
        {texto}
      </div>
    </div>
  );
}

