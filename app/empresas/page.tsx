"use client";

import { useEffect, useMemo, useState } from "react";

type Empresa = {
  id: string;
  tipo_empresa: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  cnpj: string | null;
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
  ativo: boolean | null;
  created_at: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "â€”";

  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function EmpresasListPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEmpresas() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch("/api/empresas", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "NÃ£o foi possÃ­vel carregar as empresas.");
        }

        const lista = Array.isArray(data?.companies)
          ? data.companies
          : Array.isArray(data?.empresas)
            ? data.empresas
            : [];

        setEmpresas(lista);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado ao carregar empresas.";
        setErro(message);
        setEmpresas([]);
      } finally {
        setLoading(false);
      }
    }

    carregarEmpresas();
  }, []);

  const empresasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return empresas;

    return empresas.filter((empresa) => {
      const texto = [
        empresa.tipo_empresa,
        empresa.razao_social,
        empresa.nome_fantasia,
        empresa.cnpj,
        empresa.responsavel,
        empresa.telefone,
        empresa.email,
        empresa.cidade,
        empresa.estado,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(termo);
    });
  }, [empresas, busca]);

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
            InÃ­cio
          </a>

          <a href="/empresas/cadastrar" style={pillButton(false)}>
            Nova empresa
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
            Aurora Motoristas â€¢ Empresas
          </div>

          <h1
            style={{
              margin: "16px 0 10px",
              fontSize: "clamp(30px, 5vw, 48px)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            Base empresarial da operaÃ§Ã£o
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
            Visualize a base real de empresas, locadoras e operaÃ§Ãµes jÃ¡ cadastradas
            no Aurora Motoristas. Esta Ã¡rea ajuda a estruturar o lado comercial e
            operacional do sistema.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 18,
            }}
          >
            <MiniInfo title="Base real" text="Leitura direta das empresas salvas." />
            <MiniInfo title="OperaÃ§Ã£o" text="Empresas prontas para fluxo comercial real." />
            <MiniInfo title="ExpansÃ£o" text="Estrutura pronta para vÃ­nculos futuros." />
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
                Lista de empresas
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                Empresas cadastradas
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
              {String(empresasFiltradas.length).padStart(2, "0")} empresas
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por razÃ£o social, nome fantasia, CNPJ, contato, cidade..."
              style={{
                width: "100%",
                height: 50,
                borderRadius: 16,
                border: "1px solid #cbd5e1",
                background: "#f8fbff",
                padding: "0 16px",
                fontSize: 15,
                color: "#0f172a",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {erro ? (
            <div
              style={{
                borderRadius: 18,
                padding: "14px 16px",
                border: "1px solid #fecaca",
                background: "#fef2f2",
                color: "#991b1b",
                fontWeight: 700,
                lineHeight: 1.55,
                marginBottom: 16,
              }}
            >
              {erro}
            </div>
          ) : null}

          {loading ? (
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
              Carregando empresas...
            </div>
          ) : empresasFiltradas.length === 0 ? (
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
              Nenhuma empresa cadastrada ainda.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {empresasFiltradas.map((empresa) => (
                <article
                  key={empresa.id}
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
                        {empresa.tipo_empresa || "Empresa"}
                      </div>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 22,
                          lineHeight: 1.1,
                          color: "#0f172a",
                        }}
                      >
                        {empresa.nome_fantasia || empresa.razao_social || "Sem nome"}
                      </h3>
                    </div>

                    <div
                      style={{
                        borderRadius: 999,
                        background: empresa.ativo === false ? "#fee2e2" : "#dcfce7",
                        color: empresa.ativo === false ? "#991b1b" : "#166534",
                        fontWeight: 800,
                        fontSize: 12,
                        padding: "6px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {empresa.ativo === false ? "Inativa" : "Ativa"}
                    </div>
                  </div>

                  <InfoLine label="RazÃ£o social" value={empresa.razao_social} />
                  <InfoLine label="CNPJ" value={empresa.cnpj} />
                  <InfoLine label="ResponsÃ¡vel" value={empresa.responsavel} />
                  <InfoLine label="Telefone" value={empresa.telefone} />
                  <InfoLine label="E-mail" value={empresa.email} />
                  <InfoLine
                    label="Cidade"
                    value={
                      empresa.cidade || empresa.estado
                        ? `${empresa.cidade || "â€”"}${empresa.estado ? ` â€¢ ${empresa.estado}` : ""}`
                        : null
                    }
                  />
                  <InfoLine label="Criado em" value={formatDate(empresa.created_at)} />

                  {empresa.observacoes ? (
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
                        ObservaÃ§Ãµes
                      </div>
                      <div
                        style={{
                          color: "#475569",
                          fontSize: 14,
                          lineHeight: 1.6,
                        }}
                      >
                        {empresa.observacoes}
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
        {value || "â€”"}
      </div>
    </div>
  );
}
