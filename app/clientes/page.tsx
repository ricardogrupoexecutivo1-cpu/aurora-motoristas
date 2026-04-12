type Cliente = {
  id: string;
  tipo_pessoa: string | null;
  nome: string | null;
  empresa: string | null;
  cpf_cnpj: string | null;
  responsavel: string | null;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  observacoes: string | null;
  created_at: string | null;
};

async function getClientes(): Promise<Cliente[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/clientes`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data?.clients) ? data.clients : [];
  } catch {
    return [];
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default async function ClientesListPage() {
  const clientes = await getClientes();

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

          <a href="/cadastros/clientes" style={pillButton(false)}>
            Novo cliente
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
            Aurora Motoristas • Clientes
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Base comercial de clientes
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
            Visualize a base real de clientes já cadastrados no Aurora
            Motoristas. Esta área prepara a operação comercial para serviços,
            relacionamento e evolução do sistema.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            <MiniInfo title="Base real" text="Leitura direta da base de clientes salva." />
            <MiniInfo title="Operação" text="Clientes prontos para uso em fluxo real." />
            <MiniInfo title="Expansão" text="Estrutura pronta para filtros e vínculos futuros." />
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 18,
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
                Lista de clientes
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                Clientes cadastrados
              </h2>
            </div>

            <div
              style={{
                borderRadius: 999,
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1d4ed8",
                fontWeight: 800,
                padding: "10px 14px",
                fontSize: 14,
              }}
            >
              {String(clientes.length).padStart(2, "0")} clientes
            </div>
          </div>

          {clientes.length === 0 ? (
            <div
              style={{
                borderRadius: 22,
                border: "1px solid #e2e8f0",
                background: "#f8fbff",
                padding: 20,
                color: "#475569",
                lineHeight: 1.65,
                fontSize: 15,
              }}
            >
              Nenhum cliente cadastrado ainda.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {clientes.map((cliente) => (
                <article
                  key={cliente.id}
                  style={{
                    borderRadius: 24,
                    border: "1px solid #e2e8f0",
                    background: "#f8fbff",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 10,
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: "#1d4ed8",
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {cliente.tipo_pessoa || "Cliente"}
                      </div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 22,
                          lineHeight: 1.1,
                          color: "#0f172a",
                        }}
                      >
                        {cliente.nome || "Sem nome"}
                      </h3>
                    </div>

                    <div
                      style={{
                        borderRadius: 999,
                        background: "#dcfce7",
                        color: "#166534",
                        fontWeight: 800,
                        fontSize: 12,
                        padding: "6px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Ativo
                    </div>
                  </div>

                  <InfoLine label="Empresa" value={cliente.empresa} />
                  <InfoLine label="CPF/CNPJ" value={cliente.cpf_cnpj} />
                  <InfoLine label="Responsável" value={cliente.responsavel} />
                  <InfoLine label="Telefone" value={cliente.telefone} />
                  <InfoLine label="E-mail" value={cliente.email} />
                  <InfoLine
                    label="Cidade"
                    value={
                      cliente.cidade || cliente.estado
                        ? `${cliente.cidade || "—"}${cliente.estado ? ` • ${cliente.estado}` : ""}`
                        : null
                    }
                  />
                  <InfoLine label="Criado em" value={formatDate(cliente.created_at)} />

                  {cliente.observacoes ? (
                    <div
                      style={{
                        marginTop: 4,
                        borderRadius: 16,
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        padding: 12,
                      }}
                    >
                      <div
                        style={{
                          color: "#1d4ed8",
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Observações
                      </div>
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {cliente.observacoes}
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
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

function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "88px 1fr",
        gap: 10,
        alignItems: "start",
      }}
    >
      <div
        style={{
          color: "#1d4ed8",
          fontSize: 12,
          fontWeight: 800,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          color: "#334155",
          fontSize: 14,
          lineHeight: 1.55,
          wordBreak: "break-word",
        }}
      >
        {value || "—"}
      </div>
    </div>
  );
}