"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function ClientesListPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarClientes() {
      try {
        setLoading(true);
        setErro("");

        const response = await fetch("/api/clientes", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "NÃ£o foi possÃ­vel carregar os clientes.");
        }

        setClientes(Array.isArray(data?.clients) ? data.clients : []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado ao carregar clientes.";
        setErro(message);
        setClientes([]);
      } finally {
        setLoading(false);
      }
    }

    carregarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return clientes;

    return clientes.filter((cliente) => {
      const texto = [
        cliente.nome,
        cliente.empresa,
        cliente.cpf_cnpj,
        cliente.responsavel,
        cliente.telefone,
        cliente.email,
        cliente.cidade,
        cliente.estado,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return texto.includes(termo);
    });
  }, [clientes, busca]);

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
            Aurora Motoristas â€¢ Clientes
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
            Visualize a base real de clientes jÃ¡ cadastrados no Aurora
            Motoristas. Esta Ã¡rea prepara a operaÃ§Ã£o comercial para serviÃ§os,
            relacionamento e evoluÃ§Ã£o do sistema.
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
            <MiniInfo title="OperaÃ§Ã£o" text="Clientes prontos para uso em fluxo real." />
            <MiniInfo title="ExpansÃ£o" text="Estrutura pronta para filtros e vÃ­nculos futuros." />
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
              {String(clientesFiltrados.length).padStart(2, "0")} clientes
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, empresa, CPF/CNPJ, telefone, e-mail, cidade..."
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
              Carregando clientes...
            </div>
          ) : clientesFiltrados.length === 0 ? (
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
              {clientesFiltrados.map((cliente) => (
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
                  <InfoLine label="ResponsÃ¡vel" value={cliente.responsavel} />
                  <InfoLine label="Telefone" value={cliente.telefone} />
                  <InfoLine label="E-mail" value={cliente.email} />
                  <InfoLine
                    label="Cidade"
                    value={
                      cliente.cidade || cliente.estado
                        ? `${cliente.cidade || "â€”"}${cliente.estado ? ` â€¢ ${cliente.estado}` : ""}`
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
                        ObservaÃ§Ãµes
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
        {value || "â€”"}
      </div>
    </div>
  );
}
