import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default async function MotoristaDetalhePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = String(resolvedParams?.id || "").trim();

  if (id.toLowerCase() === "novo") {
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
            maxWidth: 980,
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
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
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
              Aurora Motoristas • Redirecionamento seguro
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Cadastro de motorista
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              O sistema identificou que você tentou abrir a rota de cadastro
              dentro da página de detalhe. Para seguir corretamente, use o
              acesso próprio do cadastro de motorista.
            </p>

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
              Esta proteção evita que o sistema tente tratar <strong>novo</strong>{" "}
              como UUID de motorista.
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link href="/motoristas/novo" style={primaryLink}>
                Ir para cadastro de motorista
              </Link>

              <Link href="/motoristas" style={secondaryLink}>
                Voltar para lista
              </Link>

              <Link href="/" style={secondaryLink}>
                Início
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (!isUuid(id)) {
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
            maxWidth: 980,
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
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                width: "fit-content",
                background: "#fff7ed",
                color: "#9a3412",
                borderRadius: 999,
                padding: "7px 12px",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Aurora Motoristas • ID inválido
            </span>

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                lineHeight: 1.08,
                color: "#0f172a",
              }}
            >
              Motorista não encontrado
            </h1>

            <p
              style={{
                margin: 0,
                color: "#4b6478",
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              O identificador informado não está no formato esperado para um
              motorista salvo na base.
            </p>

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
              ID recebido: <strong>{id || "vazio"}</strong>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Link href="/motoristas" style={secondaryLink}>
                Voltar para lista
              </Link>

              <Link href="/motoristas/novo" style={primaryLink}>
                Novo motorista
              </Link>

              <Link href="/" style={secondaryLink}>
                Início
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

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
          maxWidth: 980,
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
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
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
            Aurora Motoristas • Detalhe premium
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: 34,
              lineHeight: 1.08,
              color: "#0f172a",
            }}
          >
            Detalhe do motorista
          </h1>

          <p
            style={{
              margin: 0,
              color: "#4b6478",
              fontSize: 15,
              lineHeight: 1.75,
            }}
          >
            Visualização completa do cadastro do motorista, com leitura premium,
            organizada e pronta para evolução futura com edição, vínculo com
            empresas e operação.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 14,
            }}
          >
            <MiniCard title="Cadastro completo" text="Leitura real" />
            <MiniCard title="Visual premium" text="Organização futura" />
            <MiniCard title="UUID válido" text={id} />
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
            Esta tela está pronta para receber a busca real do motorista salvo
            na base. Neste ajuste, a blindagem principal foi impedir o erro da
            rota <strong>/motoristas/novo</strong>.
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <Link href="/motoristas" style={secondaryLink}>
              Voltar para lista
            </Link>

            <Link href="/motoristas/novo" style={primaryLink}>
              Novo motorista
            </Link>

            <Link href="/" style={secondaryLink}>
              Início
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#fcfdff",
        border: "1px solid #e7eef6",
        borderRadius: 18,
        padding: 14,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: "#123047",
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#4b6478",
          fontSize: 13,
          lineHeight: 1.65,
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
}

const primaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#0ea5e9",
  color: "#ffffff",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
  boxShadow: "0 14px 28px rgba(14, 165, 233, 0.20)",
};

const secondaryLink: React.CSSProperties = {
  textDecoration: "none",
  background: "#ffffff",
  color: "#123047",
  border: "1px solid #dbe5ef",
  borderRadius: 12,
  padding: "12px 16px",
  fontWeight: 800,
};